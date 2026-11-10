import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { config } from './config/env.js';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const allowedOrigins = config.clientUrl
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.set('trust proxy', 1);
app.use(
  cors({
    origin: config.isProduction
      ? (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
          return callback(new Error(`CORS blocked for origin: ${origin}`));
        }
      : true,
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

if (!config.isProduction) {
  app.use(morgan('dev'));
}

app.use('/api/v1', routes);

// Serve the built React app when deployed as a single Node service.
// In the split deployment (Netlify + Back4App) the dist folder is absent,
// so the API root returns a small JSON response instead of a 500.
const clientDist = path.resolve(__dirname, '../../client/dist');

if (config.isProduction && fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    return res.sendFile(path.join(clientDist, 'index.html'));
  });
} else {
  app.get('/', (_req, res) =>
    res.status(200).json({
      success: true,
      message: 'Sindh Smart Quiz API',
      data: { health: '/api/v1/health' },
    })
  );
}

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
