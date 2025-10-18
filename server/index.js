import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))

// --- Mongo ---
await mongoose.connect(process.env.MONGODB_URI)

// --- Schemas ---
const Review = mongoose.model('Review', new mongoose.Schema({
    name: String,
    text: String,
    rating: { type: Number, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now }
}))

const MenuItem = mongoose.model('MenuItem', new mongoose.Schema({
    title: String,
    category: String,     // coffee | dessert | breakfast | book
    tags: [String],       // vegan, lactose-free, etc
    price: Number,
    description: String,
    image: String,
    available: { type: Boolean, default: true }
}))

const Reservation = mongoose.model('Reservation', new mongoose.Schema({
    date: String, // "2025-10-18"
    time: String, // "10:30"
    guests: Number,
    name: String,
    phone: String,
    createdAt: { type: Date, default: Date.now }
}))

const Event = mongoose.model('Event', new mongoose.Schema({
    title: String,
    date: String,        // "2025-10-25 18:00"
    description: String,
    image: String,
    registrations: [{ name: String, phone: String }]
}))

// --- Seed (минимум, если пусто) ---
async function seed() {
    const count = await MenuItem.countDocuments()
    if (count === 0) {
        await MenuItem.insertMany([
            { title: 'Эспрессо', category: 'coffee', price: 150, tags: [], description: 'Классика', image: '/images/espresso.jpg' },
            { title: 'Капучино', category: 'coffee', price: 220, tags: ['milk'], description: 'Молочная пена', image: '/images/cappuccino.jpg' },
            { title: 'Веган торт', category: 'dessert', price: 350, tags: ['vegan'], description: 'Без яиц и молока', image: '/images/vegan-cake.jpg' },
            { title: 'Книга: Кофейные истории', category: 'book', price: 990, tags: [], description: 'Для любителей кофе', image: '/images/book.jpg' }
        ])
    }
    const evCount = await Event.countDocuments()
    if (evCount === 0) {
        await Event.create({
            title: 'Книжный клуб: осенние новинки',
            date: '2025-10-30 19:00',
            description: 'Встреча для читателей',
            image: '/images/event.jpg'
        })
    }
}
seed()

// --- API ---
app.get('/api/health', (_, res) => res.json({ ok: true }))

// меню с фильтрами ?category=coffee&tag=vegan
app.get('/api/menu', async (req, res) => {
    const { category, tag } = req.query
    const q = {}
    if (category) q.category = category
    if (tag) q.tags = tag
    const items = await MenuItem.find(q).lean()
    res.json(items)
})

// отзывы
app.get('/api/reviews', async (_, res) => {
    const rev = await Review.find().sort({ createdAt: -1 }).limit(20).lean()
    res.json(rev)
})
app.post('/api/reviews', async (req, res) => {
    const { name, text, rating } = req.body
    if (!name || !text) return res.status(400).json({ error: 'name and text required' })
    const created = await Review.create({ name, text, rating: Number(rating) || 5 })
    res.status(201).json(created)
})

// бронирование
app.post('/api/reservations', async (req, res) => {
    const { date, time, guests, name, phone } = req.body
    if (!date || !time || !guests || !name || !phone) return res.status(400).json({ error: 'missing fields' })
    const created = await Reservation.create({ date, time, guests, name, phone })
    // имейл/SMS можно добавить позже; сейчас просто успешный ответ
    res.status(201).json({ ok: true, reservationId: created._id })
})

// события
app.get('/api/events', async (_req, res) => {
    const events = await Event.find().sort({ date: 1 }).lean()
    res.json(events)
})
app.post('/api/events/register', async (req, res) => {
    const { eventId, name, phone } = req.body
    if (!eventId || !name) return res.status(400).json({ error: 'missing fields' })
    const ev = await Event.findById(eventId)
    if (!ev) return res.status(404).json({ error: 'event not found' })
    ev.registrations.push({ name, phone })
    await ev.save()
    res.json({ ok: true })
})

const port = process.env.PORT || 4000
app.listen(port, () => console.log('API on http://localhost:' + port))
