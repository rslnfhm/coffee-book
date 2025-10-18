import axios from 'axios'

// Бэк на 4000. Если используешь Vite proxy — можно убрать VITE_API_URL и оставить относительные пути.
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export const api = axios.create({ baseURL: `${BASE}/api` })

// Универсальные хелперы (чтобы не переписывать существующие импорты)
export async function getJSON(url, config) {
    // ВНИМАНИЕ: здесь ждём путь БЕЗ /api, т.к. baseURL уже /api
    return (await api.get(url, config)).data
}
export async function postJSON(url, data, config) {
    return (await api.post(url, data, config)).data
}

// Алиасы на всякий случай (если где-то остались старые названия)
export const getApi = getJSON
export const postApi = postJSON
