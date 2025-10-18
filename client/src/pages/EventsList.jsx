// src/pages/EventsList.jsx
import React, { useEffect, useState } from 'react'
import { getJSON, postJSON } from '../lib/api' // <-- оба хелпера тут

export default function EventsList() {
    const [events, setEvents] = useState([])
    const [ann, setAnn] = useState('') // текст анонсов из БД
    const [reg, setReg] = useState({ eventId: '', name: '', phone: '', email: '' })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancel = false
        async function load() {
            try {
                setLoading(true)

                // 1) События (GET /api/events). Если такого роута нет — вернётся [].
                const evs = await getJSON('/events').catch(() => [])

                // 2) Страница «Анонсы» (GET /api/pages/announcements). Если нет — null.
                const page = await getJSON('/pages/announcements').catch(() => null)

                if (!cancel) {
                    const list = Array.isArray(evs?.items) ? evs.items : (Array.isArray(evs) ? evs : [])
                    setEvents(list)
                    setAnn(page?.body || '')
                }
            } finally {
                if (!cancel) setLoading(false)
            }
        }
        load()
        return () => { cancel = true }
    }, [])

    async function submit(e) {
        e.preventDefault()
        if (!reg.eventId || !reg.name || !reg.phone) {
            alert('Выберите событие и заполните имя/телефон')
            return
        }

        const ev = events.find(x => String(x._id || x.id) === String(reg.eventId))
        const payload = {
            eventTitle: ev?.title || 'Событие',
            date: ev?.date || '',
            time: ev?.time || '',
            place: ev?.place || '',
            requiresRegistration: !!ev?.requiresRegistration,
            name: reg.name.trim(),
            phone: reg.phone.trim(),
            email: reg.email?.trim() || undefined,
        }

        try {
            const r = await postJSON('/api/registrations', payload)
            // наш бэкенд возвращает { ok: true, id: ... }
            if (r?.ok) {
                alert('Заявка отправлена!')
                setReg({ eventId: '', name: '', phone: '', email: '' })
            } else {
                alert('Не удалось отправить заявку')
            }
        } catch (err) {
            alert(err?.message || 'Ошибка отправки')
        }
    }

    return (
        <>
            <h1>Мероприятия</h1>

            {loading ? (
                <p>Загрузка…</p>
            ) : (
                <ul className="grid grid-3">
                    {events.map((ev) => (
                        <li key={ev._id || ev.id || ev.title} className="card">
                            <div className="media">
                                <img
                                    src={ev.image || '/images/coffee-steam.webp'}
                                    loading="lazy"
                                    alt={ev.title}
                                />
                            </div>
                            <div className="card-body">
                                <b>{ev.title}</b>
                                <p className="subtitle" style={{ margin: '6px 0' }}>
                                    {ev.date}{ev.time ? ` • ${ev.time}` : ''}
                                </p>
                                {ev.description && <p>{ev.description}</p>}
                                {ev.place && <p className="text-sm" style={{ opacity:.8 }}>Место: {ev.place}</p>}
                            </div>
                        </li>
                    ))}
                    {!events.length && <li>Пока нет запланированных событий</li>}
                </ul>
            )}

            {!!ann && (
                <>
                    <h2 style={{ marginTop: 24 }}>Анонсы (из бэкенда)</h2>
                    <div className="card">
                        <div className="card-body">
              <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'Inter, system-ui' }}>
                {ann}
              </pre>
                        </div>
                    </div>
                </>
            )}

            <h2 style={{ marginTop: 24 }}>Регистрация</h2>
            <form className="card" onSubmit={submit}>
                <div className="card-body grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <select
                        className="select"
                        value={reg.eventId}
                        onChange={(e) => setReg({ ...reg, eventId: e.target.value })}
                    >
                        <option value="">Выберите событие</option>
                        {events.map((ev) => (
                            <option key={ev._id || ev.id || ev.title} value={ev._id || ev.id || ''}>
                                {ev.title}
                            </option>
                        ))}
                    </select>

                    <input
                        className="input"
                        placeholder="Имя"
                        value={reg.name}
                        onChange={(e) => setReg({ ...reg, name: e.target.value })}
                        required
                    />
                    <input
                        className="input"
                        placeholder="Телефон"
                        value={reg.phone}
                        onChange={(e) => setReg({ ...reg, phone: e.target.value })}
                        required
                    />
                    <input
                        className="input"
                        placeholder="Email (необязательно)"
                        type="email"
                        value={reg.email}
                        onChange={(e) => setReg({ ...reg, email: e.target.value })}
                    />

                    <button className="btn primary" type="submit">Отправить</button>
                </div>
            </form>
        </>
    )
}
