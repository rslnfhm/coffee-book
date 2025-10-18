// src/pages/Home.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getJSON as getApi, postJSON as postApi } from '../lib/api.js'
import { parseReviews as parseFromLib } from '../lib/content'

// --- текстовые фолбэки ---
const ABOUT_TEXT = `Наша кофейня — это гармоничное пространство, где каждый гость может погрузиться в мир любимых книг за чашечкой ароматного кофе, наслаждаясь атмосферой спокойствия и умиротворения.

Уютные кресла, тщательно подобранная коллекция литературы и безупречный кофе создают особую атмосферу, где время словно замедляется, позволяя отвлечься от суеты и погрузиться в чтение.

Мы создали идеальное место для тех, кто ценит интеллектуальный досуг: здесь можно не только насладиться великолепным кофе, но и провести время с пользой, листая страницы любимых книг в комфортной обстановке.`

const REVIEWS_TEXT = `Марина

Зашла сюда спонтанно, проходя мимо, и не пожалела! Атмосфера очень уютная, играет приятная музыка, нет навязчивого шума. Бариста встретила с улыбкой, помогла определиться с выбором — я взяла раф с карамелью. Кофе приготовили буквально за 5 минут, напиток получился просто божественный — насыщенный, с приятным ароматом и идеальным балансом сладости. Обязательно вернусь ещё!

Ольга

Посещаю эту кофейню уже второй месяц подряд, практически каждый день. Здесь работает замечательный бариста, который всегда помнит мои предпочтения и готовит идеальный эспрессо. Особенно радует, что в кофейне чисто и аккуратно, есть удобные столики, где можно спокойно поработать с ноутбуком. Ценник более чем адекватный, а качество напитков на высоте. Рекомендую всем!

Сергей

Отмечали с подругами день рождения, выбрали эту кофейню из-за хороших отзывов. Не прогадали! Персонал был внимателен и дружелюбен, быстро обслужили всю нашу компанию. Брали разные напитки — от классического капучино до экзотического бамбла, все оказались превосходными. Десерты тоже не подвели, особенно впечатлил шоколадный торт. Атмосфера располагала к общению, музыка не мешала разговаривать. Однозначно будем приходить ещё!`

const CONTACTS = {
    city: 'г. Калуга',
    address: 'ул. Автозаводская, 15',
    phone: '8-956-123-00-05',
    email: 'KofeiKnigi@mail.ru',
    hours: ['пн–пт: 8:00–19:00', 'сб–вс: 8:00–16:00'],
    socials: [{ name: 'VK', href: '#' }, { name: 'Telegram', href: '#' }, { name: 'Instagram', href: '#' }],
}

// ---- всегда локальные картинки ----
// BASE нужен, если деплой не в корень (GitHub Pages и т.п.)
const BASE = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/')
const asset = (name) => `${BASE}images/${name}`
const filename = (p, fallback) => {
    if (!p) return fallback
    try {
        if (p.startsWith('http')) return p.split('/').pop() || fallback
        return p.split('/').pop() || fallback
    } catch { return fallback }
}

// дефолтные слайды (локально)
const SLIDES_FALLBACK = [
    { src: asset('cappuccino.jpg'), caption: 'Новая обжарка эспрессо — попробуйте!' },
    { src: asset('latte.jpg'),      caption: 'Капучино недели — второй со скидкой 30%' },
    { src: asset('books2.jpg'),     caption: 'Книжный клуб: осенние новинки — регистрируйтесь' },
]

// запасной парсер отзывов
function parseLocalReviews(raw) {
    if (!raw) return []
    const blocks = raw.trim().split(/\n{2,}/)
    const out = []
    for (let i = 0; i < blocks.length; i += 2) {
        const name = (blocks[i] || '').trim()
        const text = (blocks[i + 1] || '').trim()
        if (name && text) out.push({ name, text, rating: 5 })
    }
    return out
}

export default function Home() {
    const parseReviews = parseFromLib || parseLocalReviews

    const [about, setAbout] = useState(ABOUT_TEXT)
    const [slides, setSlides] = useState(SLIDES_FALLBACK)
    const [reviews, setReviews] = useState(parseReviews(REVIEWS_TEXT))
    const [form, setForm] = useState({ name: '', text: '', rating: 5 })
    const [busy, setBusy] = useState(false)

    useEffect(() => {
        let alive = true
        ;(async () => {
            try {
                const [aboutPage, events, menu, apiReviews] = await Promise.all([
                    getApi('/pages/about').catch(() => null),
                    getApi('/events').catch(() => []),
                    getApi('/menu').catch(() => []),
                    getApi('/reviews').catch(() => []),
                ])
                if (!alive) return

                if (aboutPage?.body) setAbout(aboutPage.body)

                // Слайды собираем ТОЛЬКО локально: берём имена файлов из API и подставляем /images/<name>
                const menuArr = Array.isArray(menu) ? menu : (Array.isArray(menu?.items) ? menu.items : [])
                const menuSlides = menuArr.slice(0, 2).map(m => ({
                    src: asset(filename(m.image, 'espresso.jpg')),
                    caption: `${m.title} — ${m.price} ₽`,
                }))
                const eventArr = Array.isArray(events) ? events : []
                const eventSlides = eventArr.slice(0, 1).map(e => ({
                    src: asset(filename(e.image, 'event.jpg')),
                    caption: `${e.title}: ${e.date}`,
                }))

                const merged = [...menuSlides, ...eventSlides]
                if (merged.length) setSlides(merged)

                if (Array.isArray(apiReviews) && apiReviews.length) setReviews(apiReviews)
            } catch {
                // фолбэки уже есть
            }
        })()
        return () => { alive = false }
    }, [])

    async function submit(e) {
        e.preventDefault()
        if (!form.name || !form.text) return
        setBusy(true)
        try {
            const r = await postApi('/reviews', { ...form, rating: Number(form.rating) || 5 })
            if (r && r._id) {
                setReviews([r, ...reviews])
                setForm({ name: '', text: '', rating: 5 })
                alert('Спасибо за отзыв!')
            }
        } finally {
            setBusy(false)
        }
    }

    return (
        <>
            {/* HERO */}
            <section className="hero">
                <div>
                    <h1>Кофе & Книги — уютное место для вдохновения</h1>
                    <p style={{ color: 'var(--muted)', marginTop: 8 }}>{about}</p>
                    <div className="row" style={{ marginTop: 14 }}>
                        <Link className="btn" to="/menu">Посмотреть меню</Link>
                        <Link className="btn outline" to="/reserve">Забронировать столик</Link>
                        <Link className="btn outline" to="/contacts">Контакты</Link>
                    </div>
                </div>

                {!!slides.length && (
                    <div className="hero__img" role="region" aria-label="Акции, новинки и события">
                        <div className="slider">
                            {slides.map((s, i) => (
                                <figure className="slide" key={i} style={{ margin: 0 }}>
                                    <img src={s.src} alt={s.caption} loading="lazy" />
                                    <figcaption style={{ padding: 8, fontSize: 14 }}>{s.caption}</figcaption>
                                </figure>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* ОТЗЫВЫ + ФОРМА */}
            <h2>Отзывы</h2>
            <form className="card" onSubmit={submit}>
                <div className="card-body grid">
                    <input className="input" placeholder="Ваше имя"
                           value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}/>
                    <textarea className="textarea" rows="3" placeholder="Ваш отзыв"
                              value={form.text} onChange={e => setForm({ ...form, text: e.target.value })}/>
                    <select className="select" value={form.rating}
                            onChange={e => setForm({ ...form, rating: Number(e.target.value) || 5 })}>
                        <option value="5">Оценка: 5</option>
                        <option value="4">Оценка: 4</option>
                        <option value="3">Оценка: 3</option>
                    </select>
                    <button className="btn" disabled={busy}>{busy ? 'Отправка…' : 'Отправить'}</button>
                </div>
            </form>

            <ul className="grid" style={{ marginTop: 12 }}>
                {reviews.map((r, i) => (
                    <li key={r._id || `${r.name}-${i}`} className="card">
                        <div className="card-body review-quote">
                            <div className="row" style={{ justifyContent: 'space-between' }}>
                                <b>{r.name}</b><span className="badge">{r.rating || 5}★</span>
                            </div>
                            <p>{r.text}</p>
                        </div>
                    </li>
                ))}
                {!reviews.length && <li>Отзывов пока нет — станьте первым!</li>}
            </ul>

            {/* КОНТАКТЫ */}
            <h2 style={{ marginTop: 24 }}>Контакты</h2>
            <div className="card">
                <div className="card-body">
                    <p><b>Адрес:</b> {CONTACTS.city}, {CONTACTS.address}</p>
                    <p><b>Телефон:</b> <a href={`tel:${CONTACTS.phone.replace(/\D/g,'')}`}>{CONTACTS.phone}</a></p>
                    <p><b>Email:</b> <a href={`mailto:${CONTACTS.email}`}>{CONTACTS.email}</a></p>
                    <p><b>График работы:</b> {CONTACTS.hours.join(' · ')}</p>
                    <p className="row" style={{ marginTop: 6 }}>
                        {CONTACTS.socials.map(s => (
                            <a key={s.name} className="btn outline" href={s.href} target="_blank" rel="noreferrer">{s.name}</a>
                        ))}
                    </p>
                </div>
            </div>
        </>
    )
}
