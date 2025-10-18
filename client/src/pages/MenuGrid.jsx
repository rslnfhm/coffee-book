import { useMenu } from '../hooks/useApi'

export default function MenuGrid({ category, tag }) {
    const { data, isLoading } = useMenu({ category, tag })
    if (isLoading) return <p>Загрузка меню…</p>

    const grid = { display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))' }
    const card = { border: '1px solid #eee', borderRadius: 12, padding: 16 }

    return (
        <div style={grid}>
            {data?.map((m) => (
                <div key={m._id} style={card}>
                    <div style={{ aspectRatio: '4/3', background: '#f6f6f6', marginBottom: 8 }}>
                        {m.image ? (
                            <img src={m.image} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : null}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                        <strong>{m.title}</strong>
                        <span>{m.price} ₽</span>
                    </div>
                    <div style={{ opacity: 0.7, fontSize: 14 }}>{m.description}</div>
                    {m.tags?.length ? (
                        <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>{m.tags.join(' · ')}</div>
                    ) : null}
                </div>
            ))}
        </div>
    )
}
