import { MongoClient } from 'mongodb'

const client = new MongoClient(process.env.MONGODB_URL!)

async function connectToDatabase() {
    await client.connect()
    return client.db('commerce24')
}


export {
    client,
    connectToDatabase
}