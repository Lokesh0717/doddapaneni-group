import mongoose from 'mongoose';

const MONGODB_URI =
  process.env.DATABASE_URL ??
  process.env.MONGODB_URI ??
  'mongodb://127.0.0.1:27017/doddapaneni_group';

type Mongoose = typeof mongoose;

declare global {
  // eslint-disable-next-line no-var
  var _mongodbCache: { conn: Mongoose | null; promise: Promise<Mongoose> | null } | undefined;
}

const cached = global._mongodbCache ?? (global._mongodbCache = { conn: null, promise: null });

const READY_STATE_CONNECTED = 1;

export async function connectDb(): Promise<Mongoose> {
  const state = cached.conn?.connection?.readyState;
  if (cached.conn && state === READY_STATE_CONNECTED) return cached.conn;

  cached.conn = null;
  cached.promise = null;

  try {
    cached.promise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    cached.conn = null;
    throw err;
  }
}
