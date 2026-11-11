import app from './app.js';
import { connectDatabase, disconnectDatabase } from './config/db.js';
import { config } from './config/env.js';

async function bootstrap() {
  await connectDatabase();

  const server = app.listen(config.port, () => {
    console.log(`[server] Sindh Smart Quiz API running on http://localhost:${config.port}/api/v1`);
    console.log(`[server] Environment: ${config.nodeEnv}`);
  });

  const shutdown = async (signal) => {
    console.log(`\n[server] ${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('unhandledRejection', (error) => {
    console.error('[server] Unhandled rejection:', error);
  });
}

bootstrap();
