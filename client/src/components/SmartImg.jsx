import { useEffect, useRef, useState } from 'react'

// БЭК-оригин можно указать в .env (если бэк не на том же порту, что фронт)
const BACK_ORIGIN =
    (import.meta.env.VITE_ASSET_BASE || import.meta.env.VITE_API_BASE || window.location.origin)
        .replace(/\/$/, '')

// Нормализуем входной путь к виду "images/xxx.jpg"
function normalize(p) {
    if (!p) return 'images/placeholder.jpg'
    if (p.startsWith('http')) return p                      // уже абсолютный
    const clean = p.replace(/^\.?\/+/, '')                  // убираем "./", "/" и т.п.
    return clean.startsWith('images/') ? clean : `images/${clean}`
}

// Сборка ссылок
function frontURL(p) {                // фронт: public/images/...
    const n = normalize(p)
    return n.startsWith('http') ? n : `/${n}`
}
function backURL(p) {                 // бэк: http://<BACK_ORIGIN>/images/...
    const n = normalize(p)
    return n.startsWith('http') ? n : `${BACK_ORIGIN}/${n}`
}

export default function SmartImg({ src, alt = '', onError, ...rest }) {
    const [url, setUrl] = useState(frontURL(src))
    const triedBack = useRef(false)

    // Сбрасываем состояние при смене src
    useEffect(() => {
        triedBack.current = false
        setUrl(frontURL(src))
    }, [src])

    return (
        <img
            src={url}
            alt={alt}
            onError={(e) => {
                // если уже пробовали бэк — больше не трогаем
                if (triedBack.current) {
                    onError?.(e)
                    return
                }
                triedBack.current = true
                setUrl(backURL(src))
            }}
            {...rest}
        />
    )
}
