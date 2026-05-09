import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    return;
  }

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  try {
    if (!global.mongooseCache) {
      global.mongooseCache = { conn: null, promise: null };
    }

    if (!global.mongooseCache.promise) {
      global.mongooseCache.promise = mongoose.connect(mongoUri);
    }

    const db = await global.mongooseCache.promise;
    global.mongooseCache.conn = db;

    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    global.mongooseCache = { conn: null, promise: null };
    throw error;
  }
}

export default dbConnect;