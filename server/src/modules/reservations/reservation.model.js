import mongoose from 'mongoose'
const schema = new mongoose.Schema({
    date: { type: String, required: true },  // YYYY-MM-DD
    time: { type: String, required: true },  // HH:mm
    guests: { type: Number, required: true, min: 1 },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true }
}, { timestamps: true })
export const Reservation = mongoose.model('Reservation', schema)

