import {
  Action,
  Store,
  StoreEnhancer,
  Tuple,
  UnknownAction,
} from "@reduxjs/toolkit";
import { type SelectStoreByRequest, sessionsSlice } from "../sessions";
import {
  AttrFactory,
  buildBaseStore,
  composeEntitiesOrm,
  type ConfigureBaseStoreOptions,
  connectionSlice,
  createEntitySlice,
  dispatcherSlice,
  type Enhancers,
  type FullContextGeneric,
  StateWithSlice,
} from "@common/mydux";
import type { Middlewares } from "@reduxjs/toolkit/dist/configureStore";
import type { ThunkMiddlewareFor } from "@reduxjs/toolkit/dist/getDefaultMiddleware";
import type { ExtractDispatchExtensions } from "@reduxjs/toolkit/dist/tsHelpers";

export type StoreWithSSESessions = Store<StateWithSlice<typeof sessionsSlice>>;
export type SSEPluginOptions = {
    store: StoreWithSSESessions,
    // getUserByRequest: (req: FastifyRequest) => UserSliceExample['exampleItem']
    selectBootstrapByRequest:  SelectStoreByRequest
}
const userSliceExample = createEntitySlice('us', {
    id: AttrFactory.string(),
    email: AttrFactory.string(),
    password: AttrFactory.string()
},{})
type UserSliceExample = typeof userSliceExample
const ormForSSE = composeEntitiesOrm(userSliceExample, connectionSlice,dispatcherSlice)
const createBaseStore = <
    S = any,
    A extends Action = UnknownAction,
    M extends Tuple<Middlewares<S>> = Tuple<[ThunkMiddlewareFor<S>]>,
    E extends Tuple<Enhancers> = Tuple<
        [StoreEnhancer<{ dispatch: ExtractDispatchExtensions<M> }>, StoreEnhancer]
    >,
    P = S,
    C extends FullContextGeneric =FullContextGeneric,
>(options: ConfigureBaseStoreOptions<S, A, M, E, P,C>)   =>  () => buildBaseStore(options)
type StoreBasic = Awaited<ReturnType<ReturnType<typeof createBaseStore>>>
export type FastifyBasicStore = StoreBasic
declare module 'fastify' {
    interface FastifyInstance {
        store: FastifyBasicStore
    }
}
