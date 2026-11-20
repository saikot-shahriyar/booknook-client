import dns from "node:dns";
import { MongoClient, ServerApiVersion, Db } from "mongodb";

// Configure public DNS resolution for SRV records on Windows networks where local DNS can fail
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Ignore in restricted environments
}

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

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // Preserve client across module reloads during development HMR
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  var _mongoClient: MongoClient | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri, options);
    global._mongoClientPromise = global._mongoClient.connect();
  }
  client = global._mongoClient;
  clientPromise = global._mongoClientPromise!;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

const db: Db = client.db("booknook");

export { client, clientPromise, db };
export default clientPromise;
