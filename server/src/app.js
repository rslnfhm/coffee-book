import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import { apiLimiter } from './middlewares/rateLimit.js'
import routes from './routes/index.js'
import { notFound, onError } from './middlewares/error.js'
import { env } from './config/env.js'

export function makeApp() {
    const app = express()
    app.use(express.json())
    app.use(helmet())
    app.use(morgan('dev'))
    app.use(cors({ origin: env.CORS_ORIGIN, credentials: false }))
    app.set('trust proxy', 1)
    app.use(apiLimiter)

    app.get('/api/health', (_req, res) => res.json({ ok: true }))
    app.use('/api', routes)

    app.use(notFound)
    app.use(onError)
    return app
}
