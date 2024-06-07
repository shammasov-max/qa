import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyRequest,
  type RouteShorthandOptions,
} from "fastify";
import zlib from "zlib";
import {
  AttrFactory,
  bootstrapAction,
  composeEntitiesOrm,
  type ConfigureBaseStoreOptions,
  connectionSlice,
  createEntitySlice,
  dispatcherSlice,
  SSE_REDUX_EVENT,
} from "@shammasov/mydux";
import { getAllSSESessionsChannel, getSSEAdminChannel } from "./sse-channels";

import { SSESessionState, startSSESession } from "./startSSESession";
import { sessionsSlice }                    from "./sessionsSlice";
import { SSESession }                       from "./common";
import fastifyPlugin                        from "fastify-plugin";
import type { BackendState, BackendStore }  from 'service/src/store/buildBackendStore.ts'
import { generateGuid }                     from '@shammasov/utils'

export type SSEPluginOptions = {
  protectedRouteOptions?: RouteShorthandOptions;
  // store: StoreWithSSESessions,
  // getUserByRequest: (req: FastifyRequest) => UserSliceExample['exampleItem']
  selectBootstrapByRequest: SelectStoreByRequest;
};
const userSliceExample = createEntitySlice('us', {
    id: AttrFactory.string(),
    email: AttrFactory.string(),
    password: AttrFactory.string()
},{})
export type UserSliceExample = typeof userSliceExample
 const ormForSSE = composeEntitiesOrm({us:userSliceExample, connection:connectionSlice,dispatcher:dispatcherSlice})
type StateForSSE = ReturnType<ConfigureBaseStoreOptions< typeof ormForSSE['exampleORMState']>['reducer']>
 declare module "fastify" {
    interface PassportUser {
        id: string;
        email: string;
        password: string;
    }

    interface FastifyRequest {
        logout: () => Promise<void>;
        user?: PassportUser;
    }
}


export type SelectStoreByRequest = (req: FastifyRequest) => StateForSSE

 const sseSessionsPluginRaw: FastifyPluginAsync<SSEPluginOptions> =  async (
    fastify: FastifyInstance,
    { selectBootstrapByRequest} : SSEPluginOptions) => {
    const store = fastify.store
    const brotliCompress = async (str: string) => {
        return new Promise( (res, rej) => zlib.brotliCompress(str , {params:{
                [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
                [zlib.constants.BROTLI_PARAM_QUALITY]: 4,
                [zlib.constants.BROTLI_PARAM_SIZE_HINT]: str.length,
            }}, (err, buffer) => {
            if(err)
                rej(err)
            res(buffer)
        }))
    }

    fastify.get( '/api/full-state',
       async (request, reply) => {

            const credentials = request.body
            const store = fastify.store
            const state = store.getState()
            const data = state
            return await reply.header('content-encoding', 'br').send(await brotliCompress(JSON.stringify(data)))

        }
    )


        fastify.post('/api/push-commands',
            async (request, reply) => {
                let events: any = request.body

                if (events['events'])
                    events = events['events']

                if(events && events[0]) {
                    return reply.send (fastify.store.dispatch (events[0]))
                } else {
                    return reply.status (400)
                        .send ({Error: 'No events sent'})
                }
            }
        )


        fastify.get('/api/sse/connect', async (request: FastifyRequest, reply) => {
                try {
                    const storeGuid = generateGuid()
                    const userId = request.user ? request.user.id : undefined
                    const boot = selectBootstrapByRequest (request)

                    const sessionState = {
                        userId,
                        storeGuid,
                        ip: request.ip,
                        headers: request.headers
                    }

                    const sseSession = await startSSESession (request.raw, reply.raw, sessionState)

                    sseSession.push (bootstrapAction (Object.assign (boot, {
                        connection: {preloaded: true},
                        dispatcher: {
                            userId,
                            storeGuid,
                            grade: 'user'
                        }
                    })), SSE_REDUX_EVENT)

                    reply.hijack ()
                } catch ( e ) {
                    return reply.status (401)
                        .send ({'Error': 'Unauthorized'})
                }
        })




        fastify.get(
            '/api/sse/admin',
            async (request, reply) => {
            const state = Object.assign({},fastify.store.getState() )
                const userId = 'admin'
            const {storeGuid} = request.query as { [key in string]: string }
            const sseSession = await startSSESession(request.raw, reply.raw, {
                userId,
                storeGuid,
                headers: request.headers,
                ip: request.ip
            })

            const channel = getSSEAdminChannel('admin')
            channel.register(sseSession)
                const adminSessionAdded =
            sseSession.push(bootstrapAction(Object.assign(state,{
                sse: {preloaded: true, userId:'admin', storeGuid},
                dispatcher: {
                    userId,
                    storeGuid,
                    grade: 'admin'
                }
            })),SSE_REDUX_EVENT)
                reply.hijack()

        }
    )
    const sessionRegistered = (session: SSESession<SSESessionState>) => {
        fastify.store.dispatch(sessionsSlice.actions.added({
            sessionId: session.state.storeGuid,
            userId: session.state.userId,
            ip: session.state.ip,
        }))
    }
    const sessionDeregistered = (session: SSESession<SSESessionState>) => {
        store.dispatch(sessionsSlice.actions.removed(session.state.storeGuid))
    }
    getAllSSESessionsChannel().addListener('session-registered', sessionRegistered)
    getAllSSESessionsChannel().addListener('session-deregistered', sessionDeregistered)


}


export  const sseSessionsPlugin = fastifyPlugin(sseSessionsPluginRaw,{name:'sse-plugin'})
