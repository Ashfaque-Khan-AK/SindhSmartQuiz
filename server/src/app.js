import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { ensureDatabase } from './config/db.js';
import { config } from './config/env.js';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const allowedOrigins = Array.from(
  new Set([
    'https://sindhsmartquiz.netlify.app',
    ...config.clientUrl
      .split(',')
      .map((origin) => origin.trim().replace(/\/+$/, ''))
      .filter(Boolean),
  ])
);

app.set('trust proxy', 1);
app.use(
  cors({
    origin: config.isProduction
      ? (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
          return callback(null, false);
        }
      : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Back4App and local development connect once at startup. Vercel Functions are
// serverless, so make sure the cached connection exists before handling a request.
app.use(async (req, _res, next) => {
  if (req.method === 'OPTIONS') return next();

  try {
    await ensureDatabase();
    return next();
  } catch (error) {
    return next(error);
  }
});

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
