import { usePage } from '../hooks/useApi'

export default function PageView({ slug }) {
    const { data, isLoading, error } = usePage(slug)
    if (isLoading) return <p>Загрузка…</p>
    if (error || !data) return <p>Не удалось загрузить страницу</p>
    return (
        <article style={{ maxWidth: 900 }}>
            <h1>{data.title}</h1>
            <pre style={{ whiteSpace: 'pre-wrap', font: 'inherit' }}>{data.body}</pre>
        </article>
    )
}
