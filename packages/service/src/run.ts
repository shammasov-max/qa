import { Logger } from "pino";
import { sleep } from "effect/Clock";
import createApp from "./app/create-app";

export default async (logger: Logger) => {
  const closeApp = await createApp(logger);
  return async () => {
    logger.info("Stop app called");
    await closeApp();
    await sleep(1000);
    logger.info("App SOTPPED");
  };
};
