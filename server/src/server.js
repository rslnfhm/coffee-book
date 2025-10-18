import { env } from './config/env.js'
import { connectMongo } from './db/mongo.js'
import { makeApp } from './app.js'
import { seedFromFiles } from './seed/seedFromFiles.js'   // ← новое

async function start() {
    await connectMongo(env.MONGODB_URI)
    await seedFromFiles()                                   // ← автозагрузка из .txt

    const app = makeApp()
    app.listen(env.PORT, () => console.log(`API: http://localhost:${env.PORT}`))
}
start()
