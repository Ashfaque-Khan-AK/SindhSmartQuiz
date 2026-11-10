import dotenv from 'dotenv';

dotenv.config();

function normalizeMongoUri(value) {
  if (value == null) return '';

  let uri = String(value).trim();

  // Strip surrounding quotes, which are easy to paste accidentally.
  if (
    uri.length >= 2 &&
    ((uri.startsWith('"') && uri.endsWith('"')) ||
      (uri.startsWith("'") && uri.endsWith("'")) ||
      (uri.startsWith('`') && uri.endsWith('`')))
  ) {
    uri = uri.slice(1, -1).trim();
  }

  // Strip an accidental "MONGO_URI=" / "MONGODB_URI=" prefix.
  uri = uri.replace(/^(?:MONGODB_URI|MONGO_URI)\s*=\s*/i, '').trim();

  return uri;
}

const mongoUri = normalizeMongoUri(process.env.MONGODB_URI || process.env.MONGO_URI);
const required = ['JWT_SECRET'];

for (const key of required) {
  if (!process.env[key]) {
    console.error(`[config] Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

if (!mongoUri) {
  console.error('[config] Missing required environment variable: MONGODB_URI (or MONGO_URI)');
  process.exit(1);
}

if (!/^mongodb(\+srv)?:\/\//i.test(mongoUri)) {
  console.error(
    '[config] MONGODB_URI/MONGO_URI must start with "mongodb://" or "mongodb+srv://". ' +
      'Do not include the variable name or quotes in the value.'
  );
  process.exit(1);
}

export const config = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  isProduction: process.env.NODE_ENV === 'production',
};
