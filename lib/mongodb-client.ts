import { MongoClient, MongoClientOptions } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Please add your MongoDB URI to .env.local");

// Explicit TLS options (safe for Atlas)
const options: MongoClientOptions = {
  ssl: true,
  retryWrites: true,
  tlsAllowInvalidCertificates: false,
  tlsAllowInvalidHostnames: false,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development, reuse the same client to avoid hot-reload issues
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
