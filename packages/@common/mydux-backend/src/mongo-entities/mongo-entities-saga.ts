import { logger } from "service/src/logger";
import { fork, take } from "typed-redux-saga";
import oneMongoEntitySaga from "./oneMongoEntitySaga";
import { type EntitySlice, GenericORM } from "@common/mydux";

export function* mongoEntitiesSaga<O extends GenericORM = GenericORM>(orm: O) {
  const repos: Record<
    string,
    ReturnType<EntitySlice["actions"]["allSet"]>
  > = {};
  for (let entitySlice of orm.tuple) {
    const task = yield* fork(oneMongoEntitySaga, entitySlice);
    const action = yield* take(entitySlice.actions.allSet.match);
    repos[entitySlice.name] = action;
  }

  let msg = orm.tuple
    .map((repo) => repo.name + " " + repos[repo.name].payload.length)
    .join(", ");
  logger.debug("Mongo Repositories started " + msg);
}
