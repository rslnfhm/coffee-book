import mongoose from 'mongoose'
const schema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    date: { type: String, required: true },            // YYYY-MM-DD HH:mm
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    registrations: [{ name: String, phone: String }]
}, { timestamps: true })
export const Event = mongoose.model('Event', schema)
