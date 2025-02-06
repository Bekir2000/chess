import mongoose, { Connection } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

// Use global object to store the database connection
interface MongooseGlobal {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

// Attach to global (only in development, to prevent multiple connections)
declare global {
  var mongooseGlobal: MongooseGlobal;
}

// Use global connection object
global.mongooseGlobal = global.mongooseGlobal || { conn: null, promise: null };

export const connectToDatabase = async (): Promise<Connection> => {
  if (global.mongooseGlobal.conn) {
    console.log("✅ Using existing database connection");
    return global.mongooseGlobal.conn;
  }

  try {
    console.log("⚡ Connecting to MongoDB...");
    global.mongooseGlobal.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose.connection);

    global.mongooseGlobal.conn = await global.mongooseGlobal.promise;
    console.log("✅ Connected to MongoDB");
    return global.mongooseGlobal.conn;
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    throw new Error("Could not connect to MongoDB");
  }
};


