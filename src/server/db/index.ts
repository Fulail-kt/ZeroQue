// import mongoose from "mongoose";
// import { env } from "../../env";

// if (!env.MONGODB_URI) {
//   throw new Error("Please define the MONGODB_URI environment variable");
// }

// interface MongooseConnection {
//   conn: typeof mongoose | null;
//   promise: Promise<typeof mongoose> | null;
// }

// declare global {
//   // eslint-disable-next-line no-var
//   var mongooseConnection: MongooseConnection | undefined;
// }

// let cached = global.mongooseConnection;

// if (!cached) {
//   cached = global.mongooseConnection = {
//     conn: null,
//     promise: null,
//   };
// }

// async function dbConnect(): Promise<typeof mongoose> {
//   if (cached?.conn) {
//     return cached.conn;
//   }

//   if (!cached?.promise) {
//     const opts = {
//       bufferCommands: false,
//     };

//     cached!.promise = mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 5000,
//       retryWrites: true,
//       w: 'majority'});
//   }

//   try {
//     const conn = await cached!.promise;
//     cached!.conn = conn;
//     return conn;
//   } catch (e) {
//     cached!.promise = null;
//     throw e;
//   }
// }

// export default dbConnect;


import mongoose from "mongoose";
import { env } from "../../env";

if (!env.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseConnection: MongooseConnection | undefined;
}

let cached = global.mongooseConnection;

if (!cached) {
  cached = global.mongooseConnection = {
    conn: null,
    promise: null,
  };
}

async function dbConnect(): Promise<typeof mongoose> {
  if (cached?.conn) {
    return cached.conn;
  }

  if (!cached?.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
    };

    cached!.promise = mongoose.connect(env.MONGODB_URI, opts);
  }

  try {
    const conn = await cached!.promise;
    cached!.conn = conn;
    return conn;
  } catch (e) {
    cached!.promise = null;
    console.error("Database connection error:", e);
    throw e;
  }
}

export default dbConnect;