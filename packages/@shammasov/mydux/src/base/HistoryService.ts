import { createBrowserHistory } from "history";
import { ServiceFactory } from "./saga-services-context";

export const HistoryService = new ServiceFactory("history", async () =>
  createBrowserHistory()
);
