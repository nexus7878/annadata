import { MongoClient, ServerApiVersion, Db } from "mongodb";

// The URI provided by the user
const MONGODB_URI = "mongodb+srv://ahhsamaj_db_user:znv4OnGsrIqrZcPw@annadata.yi8njic.mongodb.net/?appName=annadata";

interface MongoClientCache {
  client: MongoClient | null;
  promise: Promise<MongoClient> | null;
}

// Cache the client in development to avoid creating multiple connections
const globalCache = globalThis as unknown as {
  _mongoClientCache?: MongoClientCache;
};

if (!globalCache._mongoClientCache) {
  globalCache._mongoClientCache = { client: null, promise: null };
}

const cache = globalCache._mongoClientCache;

/**
 * Connect to MongoDB and return the client.
 * Re-uses the connection across hot reloads in development.
 */
export async function getMongoClient(): Promise<MongoClient> {
  if (cache.client) return cache.client;

  if (!cache.promise) {
    const client = new MongoClient(MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      maxPoolSize: 10,
    });

    cache.promise = client.connect().then((connectedClient) => {
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
      cache.client = connectedClient;
      return connectedClient;
    }).catch(err => {
      console.error("Failed to connect to MongoDB:", err);
      throw err;
    });
  }

  return cache.promise;
}

/**
 * Get a reference to the default database (annadata).
 */
export async function getDb(): Promise<Db> {
  const client = await getMongoClient();
  return client.db("annadata");
}

/**
 * Check if MongoDB is reachable via ping.
 */
export async function isDbAvailable(): Promise<boolean> {
  try {
    const client = await getMongoClient();
    await client.db("admin").command({ ping: 1 });
    return true;
  } catch {
    return false;
  }
}
