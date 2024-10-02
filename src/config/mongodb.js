const { MongoClient, ServerApiVersion } = require('mongodb')
import { env } from '~/config/environment'

let trelloDatabaseInstance = null

const client = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const connectDb = async () => {
  await client.connect()

  trelloDatabaseInstance = client.db(env.DATABASE_NAME)
}

export const getDb = () => {
  if (!trelloDatabaseInstance) throw new Error('Database is not connected yet!')
  return trelloDatabaseInstance
}

export const closeDb = async () => {
  await client.close()
}