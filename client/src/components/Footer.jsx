import { useEffect, useState } from 'react'
import { getText } from '../lib/content'

export default function Footer(){
    const [txt, setTxt] = useState('')
    useEffect(()=>{ getText('Контакты.txt').then(setTxt) },[])
    const lines = txt.split(/\r?\n/).filter(Boolean)
    const phone = (lines.find(l=>/тел|phone/i.test(l))||'').replace(/.*?:\s*/,'')
    const email = (lines.find(l=>/@/.test(l))||'').match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || ''
    const addr  = lines[0] || ''

    return (
        <footer className="footer">
            <div className="container footer__grid">
                <div>
                    <div className="logo">Кофе&nbsp;&amp;&nbsp;Книги</div>
                    <p className="muted">Уютное место для кофе и чтения.</p>
                </div>
                <div>
                    <h3>Контакты</h3>
                    <p>{addr}</p>
                    {phone && <p><a href={`tel:${phone.replace(/\s+/g,'')}`}>{phone}</a></p>}
                    {email && <p><a href={`mailto:${email}`}>{email}</a></p>}
                </div>
                <div>
                    <h3>Мы в соцсетях</h3>
                    <div className="row">
                        <a className="chip" href="#" aria-label="Telegram">TG</a>
                        <a className="chip" href="#" aria-label="VK">VK</a>
                        <a className="chip" href="#" aria-label="YouTube">YT</a>
                    </div>
                </div>
            </div>
            <div className="copy">© {new Date().getFullYear()} Кофе & Книги</div>
        </footer>
    )
}
