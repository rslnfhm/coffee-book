export function notFound(_req, res, _next) {
    res.status(404).json({ error: 'not_found' })
}
export function onError(err, _req, res, _next) {
    console.error(err)
    res.status(500).json({ error: 'internal_error' })
}
