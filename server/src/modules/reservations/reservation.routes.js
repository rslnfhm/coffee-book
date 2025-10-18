import { Router } from 'express'
import { aw } from '../../utils/aw.js'
import { Reservation } from './reservation.model.js'
const r = Router()

r.post('/', aw(async (req, res) => {
    const { date, time, guests, name, phone } = req.body || {}
    if (!date || !time || !guests || !name || !phone)
        return res.status(400).json({ error: 'missing_fields' })
    const created = await Reservation.create({ date, time, guests, name, phone })
    res.status(201).json({ ok: true, reservationId: created._id })
}))

r.get('/', aw(async (req, res) => {
    const items = await Reservation.find().sort({ createdAt: -1 }).limit(100).lean()
    res.json(items)
}))
export default r
