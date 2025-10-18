import { useEffect, useState } from 'react'
import { getJSON, postJSON } from '../lib/api'

export default function EventsList() {
    const [events, setEvents] = useState([])
    const [ann, setAnn] = useState('') // текст анонсов из БД
    const [reg, setReg] = useState({ eventId: '', name: '', phone: '' })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancel = false
        async function load() {
            try {
                setLoading(true)
                // 1) события
                const evs = await getJSON('/events')
                // 2) «Анонсы и события» — как страница из БД (slug: announcements)
                const page = await getJSON('/pages/announcements').catch(() => null)
                if (!cancel) {
                    setEvents(evs || [])
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
        if (!reg.eventId || !reg.name) return
        const r = await postJSON('/events/register', reg)
        if (r?.ok) {
            alert('Заявка отправлена!')
            setReg({ eventId: '', name: '', phone: '' })
        }
    }

    return (
        <>
            <h1>Мероприятия</h1>

            {loading ? (
                <p>Загрузка…</p>
            ) : (
                <ul className="grid">
                    {events.map((ev) => (
                        <li key={ev._id} className="card">
                            <img src="/images/coffee-steam.webp" loading="lazy" alt={ev.title} />
                            <div className="card-body">
                                <b>{ev.title}</b>
                                <p style={{ color: 'var(--muted)' }}>{ev.date}</p>
                                <p>{ev.description}</p>
                            </div>
                        </li>
                    ))}
                    {!events.length && <li>Пока нет запланированных событий</li>}
                </ul>
            )}

            {!!ann && (
                <>
                    <h2>Анонсы (из бэкенда)</h2>
                    <div className="card">
                        <div className="card-body">
                            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'Inter, system-ui' }}>{ann}</pre>
                        </div>
                    </div>
                </>
            )}

            <h2>Регистрация</h2>
            <form className="card" onSubmit={submit}>
                <div className="card-body grid">
                    <select
                        className="select"
                        value={reg.eventId}
                        onChange={(e) => setReg({ ...reg, eventId: e.target.value })}
                    >
                        <option value="">Выберите событие</option>
                        {events.map((ev) => (
                            <option key={ev._id} value={ev._id}>
                                {ev.title}
                            </option>
                        ))}
                    </select>
                    <input
                        className="input"
                        placeholder="Имя"
                        value={reg.name}
                        onChange={(e) => setReg({ ...reg, name: e.target.value })}
                    />
                    <input
                        className="input"
                        placeholder="Телефон"
                        value={reg.phone}
                        onChange={(e) => setReg({ ...reg, phone: e.target.value })}
                    />
                    <button className="btn">Отправить</button>
                </div>
            </form>
        </>
    )
}
