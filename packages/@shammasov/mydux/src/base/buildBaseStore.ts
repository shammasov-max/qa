import {
  Action,
  configureStore,
  current,
  StoreEnhancer,
  Tuple,
  UnknownAction,
} from "@reduxjs/toolkit";
import type { ExtractDispatchExtensions } from "@reduxjs/toolkit/dist/tsHelpers";
import type { Middlewares } from "@reduxjs/toolkit/dist/configureStore";
import type { ThunkMiddlewareFor } from "@reduxjs/toolkit/dist/getDefaultMiddleware";
import createSagaMiddleware from "redux-saga";
import type { ImmutableStateInvariantMiddlewareOptions } from "@reduxjs/toolkit/src/immutableStateInvariantMiddleware";
import type { SerializableStateInvariantMiddlewareOptions } from "@reduxjs/toolkit/src/serializableStateInvariantMiddleware";
import type { ActionCreatorInvariantMiddlewareOptions } from "@reduxjs/toolkit/src/actionCreatorInvariantMiddleware";
import {
  dispatcherMiddleware,
  dispatcherSlice,
  type DispatcherState,
} from "../features/dispatcher";
import { getGlobal } from "@shammasov/utils";
import type { Reducer } from "redux";
import type { GetDefaultMiddleware } from "@reduxjs/toolkit/src/getDefaultMiddleware";
import type { DevToolsEnhancerOptions as DevToolsOptions } from "@reduxjs/toolkit/src/devtoolsExtension";
import type { GetDefaultEnhancers } from "@reduxjs/toolkit/src/getDefaultEnhancers";
import type { FullContextGeneric } from "./saga-services-context";
import axios from "axios";
import * as R from "ramda";

export type Enhancers = ReadonlyArray<StoreEnhancer>;
interface ThunkOptions<E = any> {
  extraArgument: E;
}
interface GetDefaultMiddlewareOptions {
  thunk?: boolean | ThunkOptions;
  immutableCheck?: boolean | ImmutableStateInvariantMiddlewareOptions;
  serializableCheck?: boolean | SerializableStateInvariantMiddlewareOptions;
  actionCreatorCheck?: boolean | ActionCreatorInvariantMiddlewareOptions;
}

export type ConfigureBaseStoreOptions<

    S = any,
    A extends Action = UnknownAction,
    M extends Tuple<Middlewares<S>> = Tuple<Middlewares<S>>,
    E extends Tuple<Enhancers> = Tuple<Enhancers>,
    P = S,
    C extends FullContextGeneric = FullContextGeneric,
> = {
    /**
     * A single reducer function that will be
     * used as the root reducer, or an object of
     * slice reducers that will be passed to
     * `combineReducers()`.
     */
    reducer:  Reducer<S>

    /**
     * An array of Redux middleware to install,
     * or a callback receiving
     * `getDefaultMiddleware` and returning a
     * Tuple of middleware. If not supplied,
     * defaults to the set of middleware returned
     * by `getDefaultMiddleware()`.
     *
     * @example `middleware: (gDM) =>
     *     gDM().concat(logger, apiMiddleware,
     *     yourCustomMiddleware)`
     * @see https://redux-toolkit.js.org/api/getDefaultMiddleware#intended-usage
     */
    middleware: (getDefaultMiddleware: GetDefaultMiddleware<S>) => M

    /**
     * Whether to enable Redux DevTools
     * integration. Defaults to `true`.
     *
     * Additional configuration can be done by
     * passing Redux DevTools options
     */
    devTools?: boolean | DevToolsOptions

    /**
     * The initial state, same as Redux's
     * createStore. You may optionally specify it
     * to hydrate the state from the server in
     * universal apps, or to restore a previously
     * serialized user session. If you use
     * `combineReducers()` to produce the root
     * reducer function (either directly or
     * indirectly by passing an object as
     * `reducer`), this must be an object with
     * the same shape as the reducer map keys.
     */
    // we infer here, and instead complain if the reducer doesn't match
    preloadedState?: P

    /**
     * The entities enhancers to apply. See
     * Redux's `createStore()`. All enhancers
     * will be included before the DevTools
     * Extension enhancer. If you need to
     * customize the order of enhancers, supply a
     * callback function that will receive a
     * `getDefaultEnhancers` function that
     * returns a Tuple, and should return a Tuple
     * of enhancers (such as
     * `getDefaultEnhancers().concat(offline)`).
     * If you only need to add middleware, you can use the `middleware` parameter instead.
     */
    enhancers?: (getDefaultEnhancers: GetDefaultEnhancers<M>) => E

    context:C
}


export function buildBaseStore<

    S = any,
    A extends Action = UnknownAction,
    M extends Tuple<Middlewares<S>> = Tuple<[ThunkMiddlewareFor<S>]>,
    E extends Tuple<Enhancers> = Tuple<
        [StoreEnhancer<{ dispatch: ExtractDispatchExtensions<M> }>, StoreEnhancer]
    >,
    P = S,
    C extends FullContextGeneric =FullContextGeneric,
>(options: ConfigureBaseStoreOptions<S, A, M, E, P,C>)   {
    const context = options.context
   // const devTools:DevToolsEnhancerOptions = options.devTools || true// {trace:true, traceLimit:30,features: {jump:true}, shouldCatchErrors:true, }
    const makeReducerWithDispatcher =  (
        state: S & {dispatcher: DispatcherState},
        action: Parameters<typeof dispatcherSlice.reducer>[1] | A
    ) => {
        const {dispatcher, ...restState} = current(state) as any  as ReturnType<typeof options.reducer> & {dispatcher: DispatcherState}
        return {
            dispatcher: dispatcherSlice.reducer(dispatcher, action),
            ...options.reducer(restState as any as ReturnType<typeof options.reducer>, action as any as Parameters<typeof options.reducer>[1])
        }
    }
    const fullContext = Object.assign(context, {store: {} as any as RawStoreWithoutContext})
    const buildStoreWithoutSagaContext = () =>  configureStore({
        reducer: options.reducer,
        enhancers: options.enhancers,
        devTools: options.devTools,
    })
    const buildRawStore = () =>
        configureStore({
            reducer: options.reducer,//dispatcherSlice.injectInto(options.reducer).reducer,
            enhancers: options.enhancers,
            devTools:options.devTools,
            middleware: getDef => options.middleware(getDef).prepend(dispatcherMiddleware).concat(sagaMiddleware) as any as M
        })
    type RawStoreWithoutContext = ReturnType<typeof buildStoreWithoutSagaContext>

    const sagaContext =  {...fullContext, fullContext: fullContext}
    const sagaMiddleware = createSagaMiddleware({context:sagaContext,onError: (error: Error, options: { sagaStack: string })=> {
        console.error('SagaError ' , error,' Stack '+options.sagaStack)
        }})
    const store = buildRawStore()
    fullContext.store = store

    const resultStore = Object.assign(store, {context: sagaContext, run: sagaMiddleware.run, ...context})

    const root = getGlobal() as any
    root['axios'] = axios
    root['store'] = root['redux'] = store
    root['R'] = R
    root['ctx'] = root['context'] = context

    return resultStore
}
