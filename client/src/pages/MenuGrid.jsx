// src/pages/MenuGrid.jsx
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

export default function MenuGrid({ category, tag }) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['menu', category, tag],
        queryFn: async () => {
            const { data } = await api.get('/menu', {
                params: { category, tag }
            })

            // Нормализация: всегда вернуть МАССИВ
            if (Array.isArray(data)) return data
            if (data && Array.isArray(data.items)) return data.items
            return [] // на любой неожиданный формат (объект/строка/HTML)
        },
        initialData: [],   // до ответа — тоже массив
        retry: 1
    })

    const items = Array.isArray(data) ? data : []

    if (isLoading) return <p>Загрузка меню…</p>
    if (error)     return <p>Не удалось загрузить меню</p>
    if (!items.length) return <p>Пока нет позиций меню</p>

    return (
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
            {items.map((m) => (
                <div key={m._id || m.id || m.slug || m.title} style={{ border: '1px solid #eee', borderRadius: 12, padding: 16 }}>
                    <div style={{ aspectRatio: '4/3', background: '#f6f6f6', marginBottom: 8 }}>
                        {m.image ? (
                            <img
                                src={m.image}
                                alt={m.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                loading="lazy"
                            />
                        ) : null}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                        <strong>{m.title}</strong>
                        <span>{m.price} ₽</span>
                    </div>
                    <div style={{ opacity: 0.7, fontSize: 14 }}>{m.description}</div>
                    {!!m.tags?.length && (
                        <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>{m.tags.join(' · ')}</div>
                    )}
                </div>
            ))}
        </div>
    )
}
