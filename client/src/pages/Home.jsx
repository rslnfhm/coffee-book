import { useEffect, useState } from 'react'
import { getJSON, postJSON } from '../api'

export default function Home() {
    const [reviews, setReviews] = useState([])
    const [form, setForm] = useState({ name:'', text:'', rating:5 })

    useEffect(()=>{ getJSON('/api/reviews').then(setReviews) }, [])
    const submit = async (e) => {
        e.preventDefault()
        const r = await postJSON('/api/reviews', form)
        if (r._id){ setReviews([r,...reviews]); setForm({name:'',text:'',rating:5}); alert('Спасибо!') }
    }

    return (
        <div className="container">
            <h1>Уютная кофейня для любителей книг</h1>
            <p>Кофе, десерты, завтраки и книжные события.</p>

            <div className="slider" aria-label="Акции и события">
                <div className="slide"><img loading="lazy" src="/images/slide1.jpg" alt="Акция"/></div>
                <div className="slide"><img loading="lazy" src="/images/slide2.jpg" alt="Новинка"/></div>
                <div className="slide"><img loading="lazy" src="/images/slide3.jpg" alt="Событие"/></div>
            </div>

            <div className="row" style={{marginTop:12}}>
                <a className="btn" href="/menu">Посмотреть меню</a>
                <a className="btn outline" href="/reservation">Забронировать столик</a>
                <a className="btn outline" href="/contacts">Контакты</a>
            </div>

            <h2 style={{marginTop:24}}>Отзывы</h2>
            <form className="card" onSubmit={submit}>
                <div className="card-body grid">
                    <input className="input" placeholder="Ваше имя" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
                    <textarea className="textarea" rows="3" placeholder="Ваш отзыв" value={form.text} onChange={e=>setForm({...form,text:e.target.value})}/>
                    <select className="select" value={form.rating} onChange={e=>setForm({...form,rating:e.target.value})}>
                        <option value="5">Оценка: 5</option><option value="4">4</option><option value="3">3</option>
                    </select>
                    <button className="btn">Отправить</button>
                </div>
            </form>

            <ul className="grid" style={{marginTop:12}}>
                {reviews.map(r=>(
                    <li key={r._id} className="card">
                        <div className="card-body">
                            <div className="row" style={{justifyContent:'space-between'}}>
                                <b>{r.name}</b><span className="badge">{r.rating || 5}★</span>
                            </div>
                            <p>{r.text}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
