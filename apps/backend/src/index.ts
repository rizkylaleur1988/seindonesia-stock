import { app } from "./app.ts";
import { APP_NAME, NODE_ENV, PORT } from "./infrastructure/config/env.config.ts";
import { closeDatabase, testConnection } from "./infrastructure/database/connection.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

try {
  await testConnection();
  const server = app.listen(PORT, () => console.log(`🚀 ${APP_NAME} listening on port ${PORT} environment ${NODE_ENV}`));
  const shutdown = async (signal: string): Promise<void> => {
    console.log(`${signal} received. shutting down`);
    try {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      });
      await closeDatabase();
      process.exit(0);
    } catch (error) {
      console.error("Error during shutdown:", error);
      process.exit(1);
    }
  };
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
  process.on("SIGINT", () => void shutdown("SIGINT"));
} catch (error) {
  console.error("error: ", error);
  await closeDatabase();
  process.exit(1);
}

process.on("unhandledRejection", (reason, promise) => console.error("Unhandled Rejection at: ", promise, "reason: ", reason));
