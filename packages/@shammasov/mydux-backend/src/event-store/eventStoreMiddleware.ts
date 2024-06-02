import { Middleware } from "@reduxjs/toolkit";
import { Dispatch, MiddlewareAPI } from "redux";
import { Mongoose } from "mongoose";
import EventStore from "./EventStore";
import { isPersistentAction } from "@shammasov/mydux";

export const createEventStoreMiddleware =
  (mongo: Mongoose): Middleware =>
  (api: MiddlewareAPI<Dispatch>) => {
    const eventStore = EventStore(mongo);
    const appliedGuids: string[] = [];
    return (next: (action: unknown) => unknown) => {
      return (action: unknown) => {
        if (isPersistentAction(action)) {
          if (
            action &&
            action.meta &&
            action.meta.persistent &&
            !action.meta.replay
          ) {
            if (
              !action.type.endsWith("reset") &&
              !action.type.startsWith("sessions") &&
              !action.meta.replay
            ) {
              if (!appliedGuids.includes(action.guid)) {
                eventStore.create(action);
                appliedGuids.push(action.guid);
              }
            }
          }
        }
        const stateBefore = api.getState();
        console.log(stateBefore, action);
        return next(action);
      };
    };
  };
