import { cancelled, fork, put, select } from "typed-redux-saga";
import {orm, ORMService, topListsSchema, USERS} from "iso";
import {
  broadcastSSEEventsSaga,
  mongoEntitiesSaga,
  MongoService,
} from "@shammasov/mydux-backend";
import { getFullSagaContext, getSagaService } from "@shammasov/mydux";
import type { BackendStore } from "./buildBackendStore";
import { logger } from "../logger";
import {generateGuid, Resolve} from "@shammasov/utils";

const log = logger.child({ saga: "rootSaga" });

export function* rootSaga() {
    try {
        const ctx = yield* getFullSagaContext<BackendStore>();
         yield* getSagaService(ORMService)

        const mongo = yield* getSagaService(MongoService)
        const simple:Resolve<typeof orm> = orm as Resolve<typeof orm>
        const entitySetActions = yield* mongoEntitiesSaga(simple)
        yield* fork(broadcastSSEEventsSaga)

        const users  = yield* select(orm.USERS.selectors.selectAll)
        orm.PROJECTS.attributes['lastUSERSUSERSName']
       /* if(users.length === 0) {
            yield* put(USERS.actions.added({



            }))
        }*/


    } catch (e) {
        if(yield* cancelled()) {
            return

        } else {
            log.fatal(e)
        }
    }
    // yield* fork(syncWBSaga)
}
