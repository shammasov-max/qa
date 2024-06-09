import { combineReducers } from "@reduxjs/toolkit";
import {
  buildBaseStore,
  contextBuilder,
  dispatcherSlice,
  RuntimeService,
} from "@common/mydux";
import { ORMService } from "iso";
import {
  createEventStoreMiddleware,
  MongoService,
} from "@common/mydux-backend";
//import { PostgresService }                                               from '@common/mydux-backend/src/PGService.ts'

const contextConfigurator = contextBuilder()
    .add(ORMService)
    .add(MongoService)
    //.add(PostgresService)
    .add(RuntimeService)

const buildBackendStore = async (cfg: Parameters<typeof contextConfigurator.configure>[0]) => {
    const context = await contextConfigurator
        .configure(cfg)

    const reducer = combineReducers({
        dispatcher: dispatcherSlice.reducer,
            ...context.orm.reducersMap,
    })
    const store = buildBaseStore({
        reducer,
        context,
        middleware:  getDef => getDef()
            .prepend(createEventStoreMiddleware(context.mongo)),
    }, )


    return store
}


export type BackendState = ReturnType<BackendStore['getState']>
export type BackendStore = Awaited<ReturnType<typeof buildBackendStore>>
var a = { } as any as BackendStore
export default buildBackendStore
export type BackendContext = Awaited<ReturnType<typeof buildBackendStore>>['context']['fullContext']
