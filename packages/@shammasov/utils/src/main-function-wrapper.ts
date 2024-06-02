import { Logger } from "pino";

export default async (mainFunction: () => Promise<void>, logger: Logger) => {
  mainFunction()
    .catch((e) => {
      logger.fatal("Main function error", e);
    })
    .then(() => logger.info("Main function Started"));
};
