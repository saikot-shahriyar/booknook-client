// import dns from "node:dns";
import { MongoClient, ServerApiVersion, Db } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

// if (process.env.NODE_ENV === "development") {
//   try {
//     dns.setServers(["8.8.8.8", "1.1.1.1"]);
//     dns.setDefaultResultOrder("ipv4first");
//   } catch (err) {
//     console.warn("Could not set custom DNS servers:", err);
//   }
// }

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Invalid or missing environment variable: "MONGODB_URI"');
}

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  maxPoolSize: 10,
  minPoolSize: 0,
  maxIdleTimeMS: 5000,
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
};

const globalForMongo = globalThis as unknown as {
  _mongoClient?: MongoClient;
};

function createClient(): MongoClient {
  const newClient = new MongoClient(uri as string, options);
  attachDatabasePool(newClient);
  return newClient;
}

const client: MongoClient =
  globalForMongo._mongoClient ?? (globalForMongo._mongoClient = createClient());

const db: Db = client.db("booknook");

const clientPromise: Promise<MongoClient> = Promise.resolve(client);


export async function ensureMongoConnected(): Promise<void> {
  try {
    await client.connect();
  } catch (err) {
    console.error("[mongodb] connect failed:", err);
    throw err;
  }
}

export { client, clientPromise, db };
export default clientPromise;