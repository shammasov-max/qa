import { getAllSSESessionsChannel } from "./sse-channels";
import { createSSESession, SSESession } from "./common";
import { RawReplyDefaultExpression, RawServerDefault } from "fastify";
import { RawRequestDefaultExpression } from "fastify/types/utils";

export type SSESessionState = {
  userId: string;
  storeGuid: string;
  headers: any;
  ip: string;
};

export const filterNotStoreGuid = (storeGuid: string) => <T extends SSESessionState>(session: SSESession<T>): boolean =>
    session.state.storeGuid !== storeGuid

export const startSSESession = async (req: RawRequestDefaultExpression<RawServerDefault>, res: RawReplyDefaultExpression<RawServerDefault>, sessionState: SSESessionState) => {
    
    const session = await createSSESession<SSESessionState>(req, res)
    session.state = sessionState
    getAllSSESessionsChannel().register(session)
    const channelAll = getAllSSESessionsChannel()
    console.log('\t\t', 'now sessions are', channelAll.activeSessions.length)
    return session
}
