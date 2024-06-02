import Fastify, { FastifyRequest } from "fastify";
import fastifyStatic from "@fastify/static";
import buildBackendStore, {
  type BackendState,
  type BackendStore,
} from "../store/buildBackendStore";
import { BUILD_FRONT_DIR } from "iso/src/utils/dirs.ts";
import { rootSaga } from "../store/rootSaga";
import type { Logger } from "pino";
import { httpLogger } from "../logger";

import * as http from "node:http";
import passportGauthPlugin from "./auth/passport-gauth-plugin.ts";
import { envConf } from "../../../iso/src/envConfig.ts";

declare module "fastify" {
  interface PassportUser {
    id: string;
    email: string;
    password: string;
  }
  interface FastifyInstance {
    store: BackendStore;
  }
  interface PassportUser {
    id: string;
    displayName: string;
    email: string;
    photos: string[];
  }
  interface FastifyRequest {
    store: BackendStore;
    state: BackendState;
    logout: () => Promise<void>;
    user?: PassportUser;
  }
}


export default async (logger:Logger) => {
    const store = await  buildBackendStore(envConf)
    //@ts-ignore
    global['store'] = store

    const {orm, mongo} = store.context
    //@ts-ignore
    global.slices = store.orm.reducersMap

  // const keys = await createCert('localhost')


    const task = store.run(rootSaga)
    const serverFactory = (handler, opts) => {
  /*      const server = https.createServer(keys, (req, res) => {
            httpLogger(req,res)
            handler(req, res)
        }).listen(443)*/
        const server = http.createServer((req, res) => {
            httpLogger(req,res)
            handler(req, res)
        })

        return server

    }
    let fastify = Fastify({
        serverFactory,
        disableRequestLogging: true,
        ignoreTrailingSlash: true,
        bodyLimit: 1000048576 * 4,
        trustProxy: true,
    });

    

    fastify.addHook('preHandler', (req, res, done) => {
        if(req.url.startsWith('/api')) {
            res.header ('X-Responser', 'fastify-nodejs')
            res.header ("Access-Control-Allow-Origin", "*");
            res.header ("Access-Control-Allow-Methods", "*");
            res.header ("Access-Control-Allow-Headers", "*")
            const isPreflight = /options/i.test (req.method);
            if ( isPreflight ) {
                return res.send ();
            }
        }
        done();
    })


    fastify.decorate('store')
    fastify.store = store
    fastify.register(require('@fastify/cors'),{origin: false, allowedHeaders: '*',credentials:true,strictPreflight:false})
    await fastify.register(passportGauthPlugin);
    ['/auth', '/','/admin','/app','/app/*'].forEach( path => fastify.get(path,
        async (req:FastifyRequest, reply) => {

            return reply.sendFile('index.html')
        }
    ))





    fastify.register(fastifyStatic, {root: BUILD_FRONT_DIR, preCompressed: true})
  

    const listen = async () => {
        try {
            const host = '0.0.0.0'
            console.log(envConf)
            const port = envConf.SERVER_PORT
            console.log(`SERVICE listen to http://${host}:${port}`)
            await fastify.listen({host,port})
            fastify.printRoutes({commonPrefix: false})
            console.info(`server listening on `, envConf.SERVER_PORT)
        } catch (err) {
            console.error('Could not instantiate Fastify server', err)
        }
    }
    await listen()
    return async () => {
        await fastify.close()
        task.cancel()
    }
}
