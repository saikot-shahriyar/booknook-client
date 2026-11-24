// import dns from "node:dns";
import { MongoClient, ServerApiVersion, Db } from "mongodb";

// Configure public DNS resolution for SRV records on Windows networks where local DNS can fail
// try {
//   dns.setServers(["8.8.8.8", "1.1.1.1"]);
//   dns.setDefaultResultOrder("ipv4first");
// } catch (err) {
//   console.warn("Could not set custom DNS servers:", err);
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
};

declare global {
  // Preserve the client across module reloads during development HMR and
  // across serverless function contexts while they are kept warm (Vercel production).
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  var _mongoClient: MongoClient | undefined;
}

// Single `globalThis`-based client in development AND production: when a reusable
// instance already exists it is reused, so no new MongoClient is created on every
// module initialization.
if (!globalThis._mongoClient) {
  globalThis._mongoClient = new MongoClient(uri, options);
  globalThis._mongoClientPromise = globalThis._mongoClient.connect();

  // Make the initial connection failure visible in the server logs. The MongoDB
  // driver closes the topology itself when `connect()` fails, so the client must
  // not be treated as usable until the connection has succeeded. This is logging
  // only: there is no automatic retry, and the rejected promise is left in place
  // for any consumer (driver operations) to surface the failure.
  globalThis._mongoClientPromise.catch((err: unknown) => {
    console.error("[booknook] MongoDB initial connection failed:", err);
  });
}

const client: MongoClient = globalThis._mongoClient!;
const clientPromise: Promise<MongoClient> = globalThis._mongoClientPromise!;
const db: Db = client.db("booknook");

export { client, clientPromise, db };
export default clientPromise;
