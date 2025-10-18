import { useState } from 'react'
import { postJSON } from '../api'

export default function Reservation(){
    const [f,setF] = useState({ date:'', time:'', guests:1, name:'', phone:'' })
    async function submit(e){
        e.preventDefault()
        const r = await postJSON('/api/reservations', f)
        if(r.ok){ alert('Бронь создана! Мы подтвердим по телефону.'); setF({ date:'', time:'', guests:1, name:'', phone:'' }) }
    }
    return (
        <>
            <h1>Бронирование столиков</h1>
            <form className="card" onSubmit={submit}>
                <div className="card-body grid">
                    <input className="input" type="date" value={f.date} onChange={e=>setF({...f,date:e.target.value})}/>
                    <input className="input" type="time" value={f.time} onChange={e=>setF({...f,time:e.target.value})}/>
                    <input className="input" type="number" min="1" value={f.guests} onChange={e=>setF({...f,guests:Number(e.target.value)})} placeholder="Гостей"/>
                    <input className="input" placeholder="Имя" value={f.name} onChange={e=>setF({...f,name:e.target.value})}/>
                    <input className="input" placeholder="Телефон" value={f.phone} onChange={e=>setF({...f,phone:e.target.value})}/>
                    <button className="btn">Забронировать</button>
                </div>
            </form>
        </>
    )
}
