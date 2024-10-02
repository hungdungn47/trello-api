const MONGODB_URI = 'mongodb://127.0.0.1:27017'
const DATABASE_NAME = 'trello-mern-stack'

const { MongoClient, ServerApiVersion } = require('mongodb')

let trelloDatabaseInstance = null

const client = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const connectDb = async () => {
  await client.connect()

  trelloDatabaseInstance = client.db(DATABASE_NAME)
}

export const getDb = () => {
  if (!trelloDatabaseInstance) throw new Error('Database is not connected yet!')
  return trelloDatabaseInstance
}

export const closeDb = async () => {
  await client.close()
}