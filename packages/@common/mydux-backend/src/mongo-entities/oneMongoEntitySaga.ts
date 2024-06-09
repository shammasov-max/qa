import { call, put, select, takeEvery } from "typed-redux-saga";

import mongoRepository from "./mongoRepository";
import {
  type EntitySlice,
  getSagaService,
  isPersistentAction,
} from "@common/mydux";

import type { EmptyObject } from "type-fest";
import { isError } from "@common/utils";
import { MongoService } from "../MongoService";

export default function* oneMongoEntitySaga<
  S extends EntitySlice,
  K extends string,
  V extends object,
  C extends object = EmptyObject
>(entitySlice: S) {
  const mongo = yield* getSagaService(MongoService);

  const repo = yield* call(mongoRepository, entitySlice);

  yield* takeEvery(entitySlice.match, function* (action) {
    if (isPersistentAction(action)) {
      try {
        if (entitySlice.actions.manyAdded.match(action)) {
          yield* call(async () => {
            await repo.createMany(action.payload);
          });
        } else if (entitySlice.actions.added.match(action)) {
          yield* call(async () => {
            await repo.create(action.payload);
          });
        } else if (entitySlice.actions.removed.match(action)) {
          yield* call(async () => {
            await repo.removeById(action.payload);
          });
        } else if (entitySlice.match(action) && action.meta.noRepo !== true) {
          const id = action.payload.id;
          if (id) {
            const state = yield* select();
            const item: Item = entitySlice.selectors.selectById(id)(state);

            //const item: Item = yield* select(duck.selectSlice().entities[id])
            if (item)
              yield* call(async () => {
                await repo.updateById(Object.assign({}, item, action.payload));
              });
          }
        }
      } catch (e: unknown) {
        if (isError(e)) console.log("Error save event", action, e, e.stack);
        else console.log("mongoEntitySaga unknown catched", e);
      }
    }
  });

  let items = yield* call(repo.getAll);
  type Item = S["exampleItem"];
  const state = yield* select();
  if (items.length === 0 && entitySlice.generateDefaultItems) {
    items = yield* call(entitySlice.generateDefaultItems, state);
    yield* put(entitySlice.actions.manyAdded(items));
  }

  const action = entitySlice.actions.allSet(items);
  yield* put(action);
}
