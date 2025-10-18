import { Router } from 'express'
import { Page } from './page.model.js'
const r = Router()

r.get('/', async (req, res) => {
    const page = await Page.findOne({ slug: req.params.slug }).lean()
    if (!page) return res.status(404).json({ error: 'not_found' })
    res.json(page)
})

export default r
