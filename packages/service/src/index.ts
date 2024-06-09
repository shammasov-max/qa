import mainFunctionWrapper from "@common/utils/src/main-function-wrapper";
import hmr from "node-hmr";
import { logger } from "./logger";

mainFunctionWrapper(async () => {
  let shutdownApp: () => Promise<void>;
  hmr(
    async () => {
      const appLogger = logger.child({ app: "qa" });
      appLogger.warn("HMR start app");
      console.time("startup");
      if (shutdownApp) await shutdownApp();
      const startApp = await import("./run.ts");
      shutdownApp = await startApp.default(logger);
      logger.info({ app: "qa" }, "App created");
      console.timeEnd("startup");
    },
    { watchDir: "./", debug: true }
  );
}, logger);
