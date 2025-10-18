import { useState } from 'react'
import { useCreateReservation } from '../hooks/useApi'

export default function ReservationForm() {
    const [form, setForm] = useState({ date: '', time: '', guests: 2, name: '', phone: '' })
    const m = useCreateReservation()

    const submit = (e) => {
        e.preventDefault()
        m.mutate({ ...form, guests: Number(form.guests) || 1 })
    }

    const input = (p) => ({ ...form, ...p })

    return (
        <form onSubmit={submit} style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
            <h2>Бронирование</h2>
            <input type="date" value={form.date} onChange={(e) => setForm(input({ date: e.target.value }))} />
            <input type="time" value={form.time} onChange={(e) => setForm(input({ time: e.target.value }))} />
            <input
                type="number"
                min={1}
                value={form.guests}
                onChange={(e) => setForm(input({ guests: Number(e.target.value) || 1 }))}
            />
            <input placeholder="Имя" value={form.name} onChange={(e) => setForm(input({ name: e.target.value }))} />
            <input placeholder="Телефон" value={form.phone} onChange={(e) => setForm(input({ phone: e.target.value }))} />
            <button type="submit" disabled={m.isPending}>
                {m.isPending ? 'Отправка…' : 'Забронировать'}
            </button>
            {m.isSuccess && <div style={{ color: 'green' }}>Готово! ID: {m.data?.reservationId}</div>}
            {m.isError && <div style={{ color: 'crimson' }}>Ошибка, проверьте поля</div>}
        </form>
    )
}
