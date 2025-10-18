import fs from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { Review } from '../modules/reviews/review.model.js'
import { Event } from '../modules/events/event.model.js'
import { Page } from '../modules/pages/page.model.js'
import { env } from '../config/env.js'
import { connectMongo } from '../db/mongo.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)

/** Абсолютный путь к папке с файлами */
function seedBaseDir() {
    const d = process.env.SEED_DIR || 'seed-data'
    return d.startsWith('/') ? d : join(process.cwd(), 'apps', 'api', d)
}

/** Без падения, если файла нет */
async function readOrNull(p) {
    try { return await fs.readFile(p, 'utf8') } catch { return null }
}

/** "Имя\n\nТекст\n\nИмя\n\nТекст" -> [{name,text,rating}] */
function parseReviews(raw) {
    if (!raw) return []
    const blocks = raw.trim().split(/\n{2,}/)
    const out = []
    for (let i = 0; i < blocks.length; ) {
        const name = (blocks[i] || '').trim()
        const text = (blocks[i + 1] || '').trim()
        if (name && text) out.push({ name, text, rating: 5 })
        i += 2
    }
    return out
}

/** Грубый, но надёжный парсер событий */
function parseEvents(raw) {
    if (!raw) return []
    const lines = raw.split('\n').map(s => s.trim()).filter(Boolean)
    const events = []
    let title = null, date = null, place = null, desc = []
    const push = () => {
        if (title && date) {
            const description = [ ...desc, place ? `Место: ${place}` : '' ]
                .filter(Boolean).join(' | ')
            events.push({ title, date, description, image: '' })
        }
        title = null; date = null; place = null; desc = []
    }

    for (const l of lines) {
        if (/^(Анонсы|Встречи|Мастер-классы|Литературные)/i.test(l)) continue
        if (l.startsWith('Дата:')) { date = l.slice(5).trim(); continue }
        if (l.startsWith('Время:')) { date = date ? `${date} ${l.slice(6).trim()}` : l.slice(6).trim(); continue }
        if (l.startsWith('Место:')) { place = l.slice(6).trim(); continue }
        if (l.startsWith('Тема:') || l.startsWith('Важно:') || l.startsWith('Формат:')
            || l.startsWith('Организатор:') || l.startsWith('Программа:') || l.startsWith('Ведущ')) {
            desc.push(l); continue
        }
        // Новая "шапка" события — строка без двоеточия
        if (!l.includes(':')) {
            if (title && date) push()
            title = l
        }
    }
    push()
    return events
}

export async function seedFromFiles() {
    const base = seedBaseDir()

    // Pages: about + contacts (upsert)
    const aboutTxt    = await readOrNull(join(base, 'Описание.txt'))
    const contactsTxt = await readOrNull(join(base, 'Контакты.txt'))
    if (aboutTxt) {
        await Page.updateOne(
            { slug: 'about' },
            { $set: { title: 'Описание', body: aboutTxt } },
            { upsert: true }
        )
    }
    if (contactsTxt) {
        await Page.updateOne(
            { slug: 'contacts' },
            { $set: { title: 'Контакты', body: contactsTxt } },
            { upsert: true }
        )
    }

    // Reviews: вставим, если БД пуста; иначе — добавим только новые по (name+text)
    const reviewsTxt = await readOrNull(join(base, 'Отзывы.txt'))
    const reviews = parseReviews(reviewsTxt)
    if (reviews.length) {
        for (const r of reviews) {
            const exists = await Review.exists({ name: r.name, text: r.text })
            if (!exists) await Review.create(r)
        }
    }

    // Events: upsert по (title+date)
    const eventsTxt = await readOrNull(join(base, 'Анонсы и события.txt'))
    const events = parseEvents(eventsTxt)
    if (events.length) {
        for (const e of events) {
            await Event.findOneAndUpdate(
                { title: e.title, date: e.date },
                { $setOnInsert: e },
                { upsert: true, new: false }
            )
        }
    }

    console.log('[seed] pages:', !!aboutTxt + !!contactsTxt,
        'reviews+', reviews.length, 'events+', events.length)
}

/* Позволяет запускать сидер как скрипт: npm -w apps/api run seed */
if (import.meta.url === `file://${process.argv[1]}`) {
    const rootEnvOK = !!process.env.MONGODB_URI
    if (!rootEnvOK) {
        // подхватим env, если пришли вне server.js
        const { default: dotenv } = await import('dotenv')
        dotenv.config({ path: join(process.cwd(), 'apps', 'api', '.env') })
    }
    await connectMongo(process.env.MONGODB_URI)
    await seedFromFiles()
    process.exit(0)
}
