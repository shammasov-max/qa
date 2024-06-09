import { actionChannel, call, fork, take, takeEvery } from "typed-redux-saga";
import { filterNotStoreGuid, SSESessionState } from "./startSSESession";
import { getAllSSESessionsChannel } from "./sse-channels";
import { SSESession } from "./common";
import {
  isPersistentAction,
  MyDuxEvent,
  SSE_REDUX_EVENT,
} from "@common/mydux";
import { sessionsSlice } from "./sessionsSlice";
import { isPublicForAllAction } from "./isPublicForAllAction";
import { AnyAction } from "redux";
import { ActionPattern } from "redux-saga/effects";
import type { ActionMatchingPattern } from "@redux-saga/types";

export function* broadcastSSEEventsSaga() {
  const allSessions: SSESession<SSESessionState>[] = [];
  getAllSSESessionsChannel().addListener(
    "session-registered",
    (session: SSESession<SSESessionState>) => allSessions.push(session)
  );

  getAllSSESessionsChannel().addListener(
    "session-deregistered",
    (session: SSESession<SSESessionState>) => {
      const index = allSessions.findIndex(
        (s) => s.state.storeGuid === session.state.storeGuid
      );
      if (index > -1) {
        allSessions.splice(index, 1);
      }
    }
  );
  yield* takeEvery(
    (act: AnyAction) => {
      try {
        const result = sessionsSlice.actions.broadcast.match(act);
        return result;
      } catch (e) {
        console.error("BroadcastSSEEventsSagaError takeEvery ", act);
      }
      return false;
    },
    function* (action: ReturnType<typeof sessionsSlice.actions.broadcast>) {
      const { event, sessions } = action.payload;
      if (action.payload.sessions === "all") {
        getAllSSESessionsChannel().broadcast(
          action.payload.event,
          SSE_REDUX_EVENT,
          {
            filter: (session: SSESession<SSESessionState>) =>
              sessions.includes(session.state.storeGuid),
          }
        );
      } else {
        getAllSSESessionsChannel().broadcast(
          action.payload.event,
          SSE_REDUX_EVENT,
          {
            filter: (session: SSESession<SSESessionState>) => {
              return sessions.includes(session.state.storeGuid);
            },
          }
        );
      }
    }
  );

  yield* actionChannelWorker(
    (act) => {
      try {
        const result = isPersistentAction(act) || isPublicForAllAction(act);
        return result;
      } catch (e) {
        console.error("actionChannelWorker isPersistentAction test ", act);
        console.error(e);
      }
      console.error("actionChannelWorker isPersistentAction test ", act);
    },
    async (action: MyDuxEvent) => {
      const sourceStoreGuid = action.storeGuid;
      //console.log('BroadcastSSE: ', 'found persistent action', action)
      //console.log('\t', 'by entities ', sourceStoreGuid)

      const args = [
        SSE_REDUX_EVENT,
        action,
        { filter: filterNotStoreGuid(sourceStoreGuid) },
      ] as const;
      const channel = getAllSSESessionsChannel(); // getSSEAdminChannel('admin')

      // console.log('\t', 'to admins')
      // console.log('\t\t', 'active admin length', channel.activeSessions.length)
      // console.log('\t\t', 'send to SSE connection with storeGuids:')
      // console.log('\t\t\t', channel.activeSessions.filter(filterNotStoreGuid(sourceStoreGuid)).map(s => s.state.userId+':'+s.state.storeGuid).join(',\n'))

      channel.broadcast(action, SSE_REDUX_EVENT, {
        filter: filterNotStoreGuid(sourceStoreGuid),
      });

      return 0;
    }
  );
}

const isGeneratorFunction = (fn: Function) =>
  ["GeneratorFunction", "AsyncGeneratorFunction"].includes(fn.constructor.name);

function* actionChannelWorker<P extends ActionPattern>(
  pattern: P,
  worker:  (action:ActionMatchingPattern<P>) => any
) {
  const channel = yield* actionChannel<ActionMatchingPattern<P>>(pattern as any);

  function* sequentialWorker() {
    while (true) {
      const action = yield* take(channel);

      try {
        if (isGeneratorFunction(worker)) {
          yield* worker(action);
        } else {
          yield* call(worker, action);
        }
      } catch (e) {
        console.error("sequientalWorkerSaga error", e);
        console.error("take action", action);
      }
    }
  }

  return yield* fork(sequentialWorker);
}
