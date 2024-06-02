import { type TypedUseSelectorHook, useSelector, useStore } from "react-redux";
import {
  createRouterMiddleware,
  createRouterReducerMapObject,
} from "@lagunovsky/redux-react-router";
import { combineReducers } from "@reduxjs/toolkit";
import {
  buildBaseStore,
  connectionSlice,
  contextBuilder,
  dispatcherSlice,
  HistoryService,
} from "@shammasov/mydux";
import { ORMService } from "iso";
import {uiSlice} from "../hooks/common/useUI.ts";

export const buildAdminStore = async () => {
  const context = await contextBuilder()
    .add(ORMService)
    .add(HistoryService)
    .configure({});

  const routerMiddleware = createRouterMiddleware(context.history);

  const store = buildBaseStore({
    reducer: combineReducers({
      dispatcher: dispatcherSlice.reducer,
      ...createRouterReducerMapObject(context.history),
      ...context.orm.reducersMap,
      ui:uiSlice.reducer,
      connection: connectionSlice.reducer,
    }),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(routerMiddleware),
    context,
    //enhancers: getDefaultEnhancers => getDefaultEnhancers().push(eventSourceEnhancer)
  });

  return store;
};

export type BuildAdminStore = typeof buildAdminStore
export type AdminReduxStore = Awaited<ReturnType<BuildAdminStore>>
export type AdminState = ReturnType<AdminReduxStore['getState']>
export const useAdminReduxStore = () => useStore<AdminReduxStore>() as any as AdminReduxStore
export const useAdminState = () => useAdminSelector(state => state as AdminState)
export const useAdminSelector : TypedUseSelectorHook<AdminState> = useSelector
