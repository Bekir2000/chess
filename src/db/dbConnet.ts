import mongoose, { Mongoose } from "mongoose";

declare global {
  var mongoose: { conn: Mongoose | null; promise: Promise<Mongoose> | null };
}

const cached = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn; // ✅ Reuse the connection
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI!, { bufferCommands: false }).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;

