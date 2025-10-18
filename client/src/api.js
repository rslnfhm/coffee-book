export const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export async function getJSON(path) {
    const r = await fetch(`${API}${path}`)
    return r.json()
}
export async function postJSON(path, data) {
    const r = await fetch(`${API}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    return r.json()
}
