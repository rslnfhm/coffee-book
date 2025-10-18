import axios from 'axios'

// Укажи порт твоего бэка. Если бэк сейчас слушает 8000 — оставь 8000.
// Рекомендовано держать бэк на 4000 и проксировать, но это на твоё усмотрение.
export const API_BASE =
    (import.meta.env.VITE_API_BASE || 'http://localhost:8000').replace(/\/$/, '')

// ЕДИНАЯ база: .../api
export const api = axios.create({
    baseURL: `${API_BASE}/api`,
    withCredentials: false,
})

// Нормализация пути (чтобы всегда начинался с '/')
const n = (path) => (path.startsWith('/') ? path : `/${path}`)

// Хелперы поверх axios (всегда используют baseURL = .../api)
export async function getJSON(path, config) {
    const { data } = await api.get(n(path), config)
    return data
}

export async function postJSON(path, body, config) {
    const { data } = await api.post(n(path), body, config)
    return data
}
