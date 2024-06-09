import { Middleware, WithSlice } from "@reduxjs/toolkit";
import { Dispatch, MiddlewareAPI, UnknownAction } from "redux";
import { dispatcherSlice } from "./dispatcherSlice";
import { generateEventGuid } from "@common/utils";
import { isPersistentAction } from "./MyDuxEvent";

export const dispatcherMiddleware: Middleware<
  {}, // TODO: see if this can be used in type definition somehow (can't be removed, as is used to get final dispatch type)
  WithSlice<typeof dispatcherSlice>,
  Dispatch
> = (api: MiddlewareAPI<Dispatch, WithSlice<typeof dispatcherSlice>>) => {
  return (next: (action: unknown) => unknown) => {
    return (action: unknown) => {
      const { userId, storeGuid } = api.getState().dispatcher;
      let result: UnknownAction = action as any;
      console.log("ACTION", action);
      console.log("STATE", api.getState());
      if (isPersistentAction(action) && userId && !action.guid) {
        const guid = generateEventGuid();
        const timestamp = new Date().toISOString();
        const dispatcherMeta = { userId, storeGuid, guid, timestamp };
        const meta = { dispatcherMeta, ...action.meta };
        result = { ...result, ...dispatcherMeta, meta };
      }

      return next(result);
    };
  };
};
