import { useEffect, useState } from 'react'
import { getText } from '../lib/content'

export default function Contacts(){
    const [txt,setTxt] = useState('')
    useEffect(()=>{ getText('Контакты.txt').then(setTxt) },[]) // из ZIP :contentReference[oaicite:7]{index=7}
    const lines = txt.split(/\r?\n/).filter(Boolean)
    const address = lines.slice(0,2).join(', ')

    return (
        <>
            <h1>Контакты</h1>
            <div className="card"><div className="card-body">
                <pre style={{whiteSpace:'pre-wrap', fontFamily:'Inter, system-ui'}}>{txt || 'Загрузка контактов...'}</pre>
            </div></div>

            <h3>Карта</h3>
            <div style={{height:320,border:'1px solid #E7E1D6',borderRadius:12,overflow:'hidden'}}>
                <iframe
                    title="map" width="100%" height="100%" style={{border:0}}
                    loading="lazy" allowFullScreen
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(address||'Калуга')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}>
                </iframe>
            </div>
        </>
    )
}
