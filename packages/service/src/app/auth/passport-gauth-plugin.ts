import * as Fastify from "fastify";
import { FastifyInstance, FastifyRequest } from "fastify";
import fastifyPassport from "@fastify/passport";
import fastifySecureSession from "@fastify/secure-session";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { envConf, USERS, type UserVO } from "iso";
import { generateGuid } from "@common/utils";
import {
  sseSessionsPlugin,
  type UserSliceExample,
} from "@common/mydux-backend";
import type { DispatcherState } from "@common/mydux";
import { pathOr } from "ramda";
import { Strategy as JsonStrategy } from "passport-json";

const fs = require("fs");
const path = require('path')


export default async (fastify: FastifyInstance) => {

    const store =fastify.store

    fastify.register(fastifySecureSession, {
        key: fs.readFileSync(path.join(__dirname, 'secret-key')),
        cookie: {
            secure:false,
            path: '/'
        }
    })

    await fastify.register(fastifyPassport.initialize())
    fastify.register(fastifyPassport.secureSession({}))

    fastifyPassport.use('json',
        new JsonStrategy(
            {


    },
        function(email, password, done) {
            try {
                const user = USERS.selectUserByEmail (email) (store.getState ())
                if ( user && ( user.password === password ) ) {
                    done (null, user)
                } else {
                    done (null, false)
                }
            } catch ( e ) {
                return done (e)
            }
            /*     User.findOne({ username: username }, function (err, user) {
             if (err) { return done(err); }
             if (!user) { return done(null, false); }
             if (!user.verifyPassword(password)) { return done(null, false); }
             return done(null, user);*/

        }

    ) )
    fastify.post('/api/login',
        {preValidation: fastifyPassport.authenticate('json', {})},
        async (req, reply) => {
            if(req.user) {
                return reply.send({authorized: true})
            }
            else {
                return reply.send ({authorized: false})
            }
    })


    fastifyPassport.registerUserDeserializer(async (user, req) => {
        return user
    })

    fastifyPassport.registerUserSerializer(async (user, req) => {
        return user
    })

    fastify.get('/api/self',  (req,res) => {

        return res.send(req.user)
    })

    fastify.get('/api/logout',
        async (req, res) => {
            req.logout()
            return res.redirect('/auth')
        }
    )

    await sseSessionsPlugin(fastify,{

        selectBootstrapByRequest: (req: FastifyRequest) => {
            if(!req.user) {
                throw new Error('User not found, '+req.id+'payload '+JSON.stringify(req.user))
            }
            const state = fastify.store.getState()
            const user = USERS.selectors.selectById(req.user.id)(state)
            if(!user)  {
                throw new Error('User not found, '+req.id+'payload '+JSON.stringify(req.user))
            }
            if(req.user.id) {
                const users: ReturnType<UserSliceExample['reducer']> = {
                    ids: [ user.id! ],
                    entities: {
                        [req.user.id]: user
                    }
                }
                const result = {...state,
                    dispatched: {
                        userId: user.id,
                        storeGuid: generateGuid (),
                        environment: 'browser'
                    } as DispatcherState
                }
                return result
            }
            else {
                throw new Error ('user.id not defined')
                return {}
            }
        }
    })

}



export const createUserByPassportDataIfNotExists = (
    user: Fastify.PassportUser,
    fastify: FastifyInstance
) => {
    const store = fastify.store;
    let userVO = USERS.selectors.selectById(user.id)(store.getState());
    if (!userVO) {
        const newUser: UserVO = {
            id: user.id as string,
            email: pathOr("bot@godj.pro", ["emails", "0", "value"], user),
            avatarUrl: pathOr("No photo", ["photos", "0", "value"], user), // user.photos?user.photos[0]:undefined as any as string,
            name: user.displayName,
            password: user.password,
            balance: 0,
            downloadedTrackIds: [],
            likedTrackIds: [],
            listenedTrackIds: [],
            addedAtTs: Date.now(),
            removed: false,
        };
        console.log("Register new user");
        store.dispatch(USERS.actions.added(newUser));
        const updatedState = store.getState();
        const userVO = USERS.selectors.selectById(newUser.id)(updatedState);
        return userVO;
    }

    userVO = USERS.selectors.selectById(user.id)(store.getState());
    return userVO;
};
