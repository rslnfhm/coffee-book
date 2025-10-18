import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

dotenv.config()
const app = express()

// ---------- middleware ----------
app.use(express.json())
app.use(helmet())
app.use(morgan('dev'))
app.use(cors({
    origin: process.env.CORS_ORIGIN ?? true,
    credentials: false
}))
app.set('trust proxy', 1)
app.use(rateLimit({ windowMs: 60_000, max: 300 }))

// ---------- models ----------
const reviewSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true },
    rating: { type: Number, min: 1, max: 5, default: 5 }
}, { timestamps: true })
const Review = mongoose.model('Review', reviewSchema)

const menuItemSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true },           // coffee|dessert|breakfast|book
    tags: { type: [String], default: [] },
    price: { type: Number, required: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    available: { type: Boolean, default: true }
}, { timestamps: true })
const MenuItem = mongoose.model('MenuItem', menuItemSchema)

const reservationSchema = new mongoose.Schema({
    date: { type: String, required: true },               // YYYY-MM-DD
    time: { type: String, required: true },               // HH:mm
    guests: { type: Number, required: true, min: 1 },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true }
}, { timestamps: true })
const Reservation = mongoose.model('Reservation', reservationSchema)

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    date: { type: String, required: true },               // YYYY-MM-DD HH:mm
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    registrations: [{ name: String, phone: String }]
}, { timestamps: true })
const Event = mongoose.model('Event', eventSchema)

// ---------- helpers ----------
const aw = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

// ---------- routes ----------
app.get('/api/health', (_req, res) => res.json({ ok: true }))

// меню (+ ?category=&tag=)
app.get('/api/menu', aw(async (req, res) => {
    const { category, tag } = req.query
    const q = {}
    if (category) q.category = category
    if (tag) q.tags = tag
    res.json(await MenuItem.find(q).lean())
}))

// отзывы
app.get('/api/reviews', aw(async (_req, res) => {
    res.json(await Review.find().sort({ createdAt: -1 }).limit(50).lean())
}))
app.post('/api/reviews', aw(async (req, res) => {
    const { name, text, rating } = req.body || {}
    if (!name || !text) return res.status(400).json({ error: 'name and text required' })
    const created = await Review.create({ name, text, rating: Number(rating) || 5 })
    res.status(201).json(created)
}))

// бронирование
app.post('/api/reservations', aw(async (req, res) => {
    const { date, time, guests, name, phone } = req.body || {}
    if (!date || !time || !guests || !name || !phone) {
        return res.status(400).json({ error: 'missing fields' })
    }
    const created = await Reservation.create({ date, time, guests, name, phone })
    res.status(201).json({ ok: true, reservationId: created._id })
}))

// события
app.get('/api/events', aw(async (_req, res) => {
    res.json(await Event.find().sort({ date: 1 }).lean())
}))
app.post('/api/events/register', aw(async (req, res) => {
    const { eventId, name, phone } = req.body || {}
    if (!eventId || !name) return res.status(400).json({ error: 'missing fields' })
    const ev = await Event.findById(eventId)
    if (!ev) return res.status(404).json({ error: 'event not found' })
    ev.registrations.push({ name, phone })
    await ev.save()
    res.json({ ok: true })
}))

// ---------- errors ----------
app.use((err, _req, res, _next) => {
    console.error(err)
    res.status(500).json({ error: 'internal_error' })
})

// ---------- start ----------
async function start() {
    const { MONGODB_URI, PORT } = process.env
    if (!MONGODB_URI) {
        console.error('MONGODB_URI is not set')
        process.exit(1)
    }
    await mongoose.connect(MONGODB_URI)
    console.log('MongoDB connected')

    // seed если пусто
    if (await MenuItem.countDocuments() === 0) {
        await MenuItem.insertMany([
            { title: 'Эспрессо', category: 'coffee', price: 150, tags: [], description: 'Классика', image: '/images/espresso.jpg' },
            { title: 'Капучино', category: 'coffee', price: 220, tags: ['milk'], description: 'Молочная пена', image: '/images/cappuccino.jpg' },
            { title: 'Веган торт', category: 'dessert', price: 350, tags: ['vegan'], description: 'Без яиц и молока', image: '/images/vegan-cake.jpg' },
            { title: 'Книга: Кофейные истории', category: 'book', price: 990, tags: [], description: 'Для любителей кофе', image: '/images/book.jpg' }
        ])
        console.log('Seed: menu items added')
    }
    if (await Event.countDocuments() === 0) {
        await Event.create({
            title: 'Книжный клуб: осенние новинки',
            date: '2025-10-30 19:00',
            description: 'Встреча для читателей',
            image: '/images/event.jpg'
        })
        console.log('Seed: event added')
    }

    const port = Number(PORT) || 4000
    app.listen(port, () => console.log(`API: http://localhost:${port}`))
}
start()
