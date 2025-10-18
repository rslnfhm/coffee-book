// src/lib/api.js
import axios from 'axios'

export const API_BASE =
    import.meta.env.VITE_API_BASE?.replace(/\/$/, '') || 'http://localhost:8000'

/** Axios-инстанс для /api */
export const api = axios.create({
    baseURL: `${API_BASE}/api`,
    withCredentials: false,
})

/** fetch-хелпер: GET JSON (baseURL = API_BASE + path) */
export async function getJSON(path, options = {}) {
    const res = await fetch(toUrl(path), { ...options, method: 'GET' })
    if (!res.ok) throw new Error(`GET ${path} ${res.status}`)
    const ct = res.headers.get('content-type') || ''
    return ct.includes('application/json') ? res.json() : res.text()
}

/** fetch-хелпер: POST JSON (baseURL = API_BASE + path) */
export async function postJSON(path, body, options = {}) {
    const res = await fetch(toUrl(path), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        body: JSON.stringify(body),
        ...options,
    })
    if (!res.ok) {
        const msg = await res.text().catch(() => '')
        throw new Error(msg || `POST ${path} ${res.status}`)
    }
    const ct = res.headers.get('content-type') || ''
    return ct.includes('application/json') ? res.json() : res.text()
}

/* утилита: аккуратно склеиваем базу и путь */
function toUrl(path) {
    const p = path.startsWith('/') ? path : `/${path}`
    return `${API_BASE}${p}`
}
