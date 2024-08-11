import { MongoClient, Db } from "mongodb";

//const connectionString = "mongodb://hyde:An0ther12@105.27.252.106:28028";
// const connectionString = "mongodb://hyde:An0ther12@localhost:28028/";
  const connectionString = "mongodb://hyde:An0ther12@172.40.1.223:28028/";

const mClient: MongoClient = new MongoClient(connectionString);

export async function connectToDatabase(dbName: string): Promise<Db> {
  const database: MongoClient = await mClient.connect();
  return database.db(dbName);
}

export async function closeClient(): Promise<void> {
  await mClient.close();
}
