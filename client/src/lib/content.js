const C = (name) => '/content/' + encodeURIComponent(name)

export async function getText(name){
    const url = C(name)
    const r = await fetch(url)
    if (!r.ok) {
        console.warn('No content:', url, r.status)
        return ''
    }
    const ct = r.headers.get('content-type') || ''
    // если отдали index.html вместо текста — считаем, что файла нет
    if (!ct.includes('text/plain')) {
        console.warn('Unexpected content-type for', url, ct)
        return ''
    }
    return (await r.text()).trim()
}

export async function getJSON(path){
    const r = await fetch(path)
    return r.ok ? r.json() : {}
}

export function parseReviews(txt){
    const blocks = txt.split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean)
    return blocks.map(b=>{
        const [name, ...rest] = b.split('\n').map(s=>s.trim())
        return { _id:'zip-'+Math.random().toString(36).slice(2), name, text:rest.join(' '), rating:5 }
    })
}
