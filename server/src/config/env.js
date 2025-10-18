import dotenv from 'dotenv'
dotenv.config()

export const env = {
    PORT: Number(process.env.PORT ?? 4000),
    MONGODB_URI: process.env.MONGODB_URI,
    CORS_ORIGIN: process.env.CORS_ORIGIN ?? true
}

if (!env.MONGODB_URI) {
    console.error('MONGODB_URI is not set'); process.exit(1)
}
