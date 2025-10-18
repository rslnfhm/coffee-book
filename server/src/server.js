import { env } from './config/env.js'
import { connectMongo } from './db/mongo.js'
import { makeApp } from './app.js'

async function start() {
    await connectMongo(env.MONGODB_URI)
    const app = makeApp()
    app.listen(env.PORT, () => console.log(`API: http://localhost:${env.PORT}`))
}
start()
