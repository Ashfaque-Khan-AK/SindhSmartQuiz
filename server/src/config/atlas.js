import dns from 'node:dns/promises';
import mongoose from 'mongoose';

const TXT_LOOKUP_FAILURE = /queryTxt|ESERVFAIL/i;

function parseMongoUri(uri) {
  const parsed = new URL(uri);
  const query = parsed.searchParams;

  return {
    username: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, '') || 'admin',
    hostname: parsed.hostname,
    authSource: query.get('authSource') || 'admin',
    replicaSet: query.get('replicaSet') || '',
  };
}

function credentials(parts) {
  return `${encodeURIComponent(parts.username)}:${encodeURIComponent(parts.password)}`;
}

async function connectWithDirectHosts(uri, options) {
  const parts = parseMongoUri(uri);
  const srv = await dns.resolveSrv(`_mongodb._tcp.${parts.hostname}`);
  let replicaSet = parts.replicaSet;

  if (!replicaSet) {
    for (const host of srv) {
      const direct = `mongodb://${credentials(parts)}@${host.name}:${host.port}/${
        parts.database
      }?tls=true&authSource=${encodeURIComponent(parts.authSource)}&directConnection=true`;

      try {
        await mongoose.connect(direct, {
          ...options,
          serverSelectionTimeoutMS: 10000,
        });
        const hello = await mongoose.connection.db.admin().command({ hello: 1 });
        replicaSet = hello.setName || '';
        await mongoose.disconnect();
        if (replicaSet) break;
      } catch {
        await mongoose.disconnect().catch(() => {});
      }
    }
  }

  if (!replicaSet) {
    throw new Error('Could not discover the MongoDB replica set name');
  }

  const hosts = srv.map((host) => `${host.name}:${host.port}`).join(',');
  const direct = `mongodb://${credentials(parts)}@${hosts}/${
    parts.database
  }?tls=true&authSource=${encodeURIComponent(
    parts.authSource
  )}&replicaSet=${replicaSet}&retryWrites=true&w=majority`;

  return mongoose.connect(direct, {
    ...options,
    serverSelectionTimeoutMS: options.serverSelectionTimeoutMS || 15000,
  });
}

/**
 * Connect with the normal mongodb+srv URI. Some networks block Atlas TXT
 * lookups, so fall back to the SRV hosts reported for the cluster.
 */
export async function connectMongo(uri, options = {}) {
  try {
    return await mongoose.connect(uri, options);
  } catch (error) {
    if (!TXT_LOOKUP_FAILURE.test(error.message)) throw error;
    await mongoose.disconnect().catch(() => {});
    return connectWithDirectHosts(uri, options);
  }
}
