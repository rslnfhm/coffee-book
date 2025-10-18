import { Router } from 'express'
import { aw } from '../../utils/aw.js'
import { Event } from './event.model.js'
const r = Router()

r.get('/', aw(async (_req, res) => {
    res.json(await Event.find().sort({ date: 1 }).lean())
}))

r.post('/', aw(async (req, res) => {
    const created = await Event.create(req.body || {})
    res.status(201).json(created)
}))

r.post('/register', aw(async (req, res) => {
    const { eventId, name, phone } = req.body || {}
    if (!eventId || !name) return res.status(400).json({ error: 'missing_fields' })
    const ev = await Event.findById(eventId)
    if (!ev) return res.status(404).json({ error: 'event_not_found' })
    ev.registrations.push({ name, phone })
    await ev.save()
    res.json({ ok: true })
}))
export default r
