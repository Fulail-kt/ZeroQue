// import { MongoDBAdapter } from "@auth/mongodb-adapter";
// import mongoose from "mongoose";
// import dbConnect from "~/server/db"; // Your existing database connection utility

// // Create a function to get the MongoDB client from the Mongoose connection
// async function getMongoClient() {
//   // Ensure the database is connected
//   await dbConnect();
  
//   // Get the underlying MongoDB client from the Mongoose connection
//   const mongoClient = mongoose.connection.getClient();
  
//   return mongoClient;
// }

// // Create a clientPromise that can be used with MongoDBAdapter
// const clientPromise = getMongoClient();

// export default clientPromise;


import { MongoDBAdapter } from "@auth/mongodb-adapter";
import mongoose from "mongoose";
import { MongoClient } from "mongodb";
import { env } from "~/env";
import dbConnect from "~/server/db";

async function getMongoClient() {
  // Ensure the database is connected via Mongoose
  await dbConnect();
  
  // Create a new MongoClient instance directly
  const client = new MongoClient(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    retryWrites: true,
  });

  // Connect the client
  await client.connect();

  return client;
}

// Create a clientPromise that can be used with MongoDBAdapter
const clientPromise = getMongoClient();

export default clientPromise;