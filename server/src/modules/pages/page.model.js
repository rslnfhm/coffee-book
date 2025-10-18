import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    slug: { type: String, required: true, unique: true }, // 'about', 'contacts'
    title: { type: String, default: '' },
    body:  { type: String, default: '' }                  // сырой текст из .txt
}, { timestamps: true })

export const Page = mongoose.model('Page', schema)
