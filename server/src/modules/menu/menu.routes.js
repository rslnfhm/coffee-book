import { Router } from 'express'
import { z } from 'zod'
import { aw } from '../../utils/aw.js'
import { MenuItem } from './menu.model.js'
const r = Router()

// GET /api/menu?category=&tag=
r.get('/', aw(async (req, res) => {
    const { category, tag } = req.query
    const q = {}
    if (category) q.category = category
    if (tag) q.tags = tag
    res.json(await MenuItem.find(q).lean())
}))

// POST /api/menu
r.post('/', aw(async (req, res) => {
    const body = z.object({
        title: z.string().min(1),
        category: z.string().min(1),
        price: z.number().nonnegative(),
        tags: z.array(z.string()).optional(),
        description: z.string().optional(),
        image: z.string().optional()
    }).safeParse(req.body)
    if (!body.success) return res.status(400).json({ error: 'bad_input' })
    const item = await MenuItem.create(body.data)
    res.status(201).json(item)
}))

// PATCH /api/menu/:id
r.patch('/:id', aw(async (req, res) => {
    const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!updated) return res.status(404).json({ error: 'not_found' })
    res.json(updated)
}))

// DELETE /api/menu/:id
r.delete('/:id', aw(async (req, res) => {
    const ok = await MenuItem.findByIdAndDelete(req.params.id)
    if (!ok) return res.status(404).json({ error: 'not_found' })
    res.json({ ok: true })
}))

export default r
