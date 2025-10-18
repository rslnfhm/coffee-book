import mongoose from 'mongoose'
const schema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true },
    rating: { type: Number, min: 1, max: 5, default: 5 }
}, { timestamps: true })
export const Review = mongoose.model('Review', schema)
