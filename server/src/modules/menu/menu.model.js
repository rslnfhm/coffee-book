import mongoose from 'mongoose'
const schema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true },      // coffee|dessert|breakfast|book
    tags: { type: [String], default: [] },
    price: { type: Number, required: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    available: { type: Boolean, default: true }
}, { timestamps: true })
schema.index({ category: 1, available: 1 })
export const MenuItem = mongoose.model('MenuItem', schema)
