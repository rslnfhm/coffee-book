import mongoose from 'mongoose'

export async function connectMongo(uri) {
    mongoose.set('strictQuery', false)
    await mongoose.connect(uri)
    console.log('MongoDB connected')
}
