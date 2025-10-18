import { Router } from 'express'
import { aw } from '../../utils/aw.js'
import { Review } from './review.model.js'
const r = Router()

r.get('/', aw(async (_req, res) => {
    res.json(await Review.find().sort({ createdAt: -1 }).limit(50).lean())
}))
r.post('/', aw(async (req, res) => {
    const { name, text, rating } = req.body || {}
    if (!name || !text) return res.status(400).json({ error: 'name and text required' })
    const created = await Review.create({ name, text, rating: Number(rating) || 5 })
    res.status(201).json(created)
}))
r.delete('/:id', aw(async (req, res) => {
    const ok = await Review.findByIdAndDelete(req.params.id)
    if (!ok) return res.status(404).json({ error: 'not_found' })
    res.json({ ok: true })
}))
export default r
