import { Server } from "http";

export default function createShutdownMiddleware(
  server: Server,
  opts: Partial<{ logger: typeof console; forceTimeout: number }> = {}
) {
  const logger = opts.logger || console; // Defaults to console
  const forceTimeout =
    typeof opts.forceTimeout === "number" ? opts.forceTimeout : 30 * 1000; // Defaults to 30s

  let shuttingDown = false;

  process.on("SIGTERM", function gracefulExit(signal) {
    if (!server.listening)
      logger.error("Shutdown in progress, ambigous shutdown call");

    logger.info("Shutdown server SIGTERM   recieved ", signal);
    if (shuttingDown) {
      logger.error("Shutdown in progress, ambigous shutdown call");
      // We already know we're shutting down, don't continue this function
      return;
    } else {
      shuttingDown = true;
    }

    // Don't bother with graceful shutdown in development
    /*  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            return process.exit(0);
        }
        */
    logger.warn("Received kill signal (SIGTERM), shutting down...");

    setTimeout(() => {
      logger.error(
        "Could not close connections in time, forcefully shutting down"
      );
      process.exit(1);
    }, forceTimeout);

    server.close((err?) => {
      if (err) logger.error("On server close error", err);
      logger.info("Closed out remaining connections");
      process.exit(0);
    });
  });

  return function shutdown(ctx, next) {
    if (shuttingDown) {
      ctx.status = 503;
      ctx.set("Connection", "close");
      ctx.body = "Server is in the process of shutting down";
    } else {
      return next();
    }
  };
};
