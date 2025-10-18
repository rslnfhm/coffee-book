import { useState } from 'react'
import { postJSON } from '../lib/api'

export default function ReservationForm() {
    const [form, setForm] = useState({ date: '', time: '', guests: 2, name: '', phone: '' })
    const [status, setStatus] = useState('idle') // idle | pending | success | error
    const [message, setMessage] = useState('')

    async function submit(e) {
        e.preventDefault()
        setStatus('pending'); setMessage('')
        try {
            const payload = { ...form, guests: Number(form.guests) || 1 }
            const r = await postJSON('/reservations', payload)
            if (r?.ok) {
                setStatus('success'); setMessage(`Готово! Номер брони: ${r.reservationId}`)
                setForm({ date: '', time: '', guests: 2, name: '', phone: '' })
            } else {
                setStatus('error'); setMessage('Не удалось отправить бронь')
            }
        } catch {
            setStatus('error'); setMessage('Ошибка сети')
        }
    }

    const input = (p) => setForm((f) => ({ ...f, ...p }))

    return (
        <>
            <h1>Бронирование</h1>
            <form className="card" onSubmit={submit}>
                <div className="card-body grid">
                    <input type="date" className="input" value={form.date} onChange={e=>input({date:e.target.value})}/>
                    <input type="time" className="input" value={form.time} onChange={e=>input({time:e.target.value})}/>
                    <input type="number" min={1} className="input" value={form.guests} onChange={e=>input({guests:e.target.value})}/>
                    <input className="input" placeholder="Имя" value={form.name} onChange={e=>input({name:e.target.value})}/>
                    <input className="input" placeholder="Телефон" value={form.phone} onChange={e=>input({phone:e.target.value})}/>
                    <button className="btn" disabled={status==='pending'}>
                        {status==='pending' ? 'Отправка…' : 'Забронировать'}
                    </button>
                    {message && <div style={{color: status==='error' ? 'crimson' : 'green'}}>{message}</div>}
                </div>
            </form>
        </>
    )
}
