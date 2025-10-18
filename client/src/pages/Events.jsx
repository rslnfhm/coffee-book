import { useEffect, useState } from 'react'
import { getJSON as getApi, postJSON } from '../api'
import { getText } from '../lib/content'

export default function Events(){
    const [events,setEvents] = useState([])
    const [ann,setAnn] = useState('')
    const [reg,setReg] = useState({ eventId:'', name:'', phone:'' })

    useEffect(()=>{ getApi('/api/events').then(setEvents) },[])
    useEffect(()=>{ getText('Анонсы и события.txt').then(setAnn) },[]) // из ZIP :contentReference[oaicite:6]{index=6}

    async function submit(e){
        e.preventDefault()
        const r = await postJSON('/api/events/register', reg)
        if(r.ok){ alert('Заявка отправлена!'); setReg({eventId:'',name:'',phone:''}) }
    }

    return (
        <>
            <h1>Мероприятия</h1>
            <ul className="grid">
                {events.map(ev=>(
                    <li key={ev._id} className="card">
                        <img src="/images/coffee-steam.webp" loading="lazy" alt={ev.title}/>
                        <div className="card-body">
                            <b>{ev.title}</b>
                            <p style={{color:'var(--muted)'}}>{ev.date}</p>
                            <p>{ev.description}</p>
                        </div>
                    </li>
                ))}
            </ul>

            {!!ann && (
                <>
                    <h2>Анонсы (из архива)</h2>
                    <div className="card"><div className="card-body">
                        <pre style={{whiteSpace:'pre-wrap',fontFamily:'Inter, system-ui'}}>{ann}</pre>
                    </div></div>
                </>
            )}

            <h2>Регистрация</h2>
            <form className="card" onSubmit={submit}>
                <div className="card-body grid">
                    <select className="select" value={reg.eventId} onChange={e=>setReg({...reg,eventId:e.target.value})}>
                        <option value="">Выберите событие</option>
                        {events.map(ev=> <option key={ev._id} value={ev._id}>{ev.title}</option>)}
                    </select>
                    <input className="input" placeholder="Имя" value={reg.name} onChange={e=>setReg({...reg,name:e.target.value})}/>
                    <input className="input" placeholder="Телефон" value={reg.phone} onChange={e=>setReg({...reg,phone:e.target.value})}/>
                    <button className="btn">Отправить</button>
                </div>
            </form>
        </>
    )
}
