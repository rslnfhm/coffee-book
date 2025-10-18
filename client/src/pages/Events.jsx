import { useEffect, useState } from 'react'
import { getJSON, postJSON } from '../api'

export default function Events() {
    const [events, setEvents] = useState([])
    const [reg, setReg] = useState({ eventId:'', name:'', phone:'' })

    useEffect(()=>{ getJSON('/api/events').then(setEvents) }, [])
    const submit = async (e)=>{
        e.preventDefault()
        const r = await postJSON('/api/events/register', reg)
        if (r.ok){ alert('Заявка отправлена!'); setReg({eventId:'',name:'',phone:''}) }
    }

    return (
        <div className="container">
            <h1>Мероприятия</h1>
            <ul className="grid">
                {events.map(ev=>(
                    <li key={ev._id} className="card">
                        <img src={ev.image} loading="lazy" alt={ev.title}/>
                        <div className="card-body">
                            <b>{ev.title}</b>
                            <p>{ev.date}</p>
                            <p>{ev.description}</p>
                        </div>
                    </li>
                ))}
            </ul>

            <h2 style={{marginTop:16}}>Регистрация</h2>
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
        </div>
    )
}
