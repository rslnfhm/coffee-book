import { useEffect, useState } from 'react'
import { getJSON as getApi, postJSON as postApi } from '../api'
import { getText, getJSON, parseReviews } from '../lib/content'

export default function Home(){
    const [about,setAbout] = useState('')
    const [slider,setSlider] = useState([])
    const [reviews,setReviews] = useState([])
    const [form,setForm] = useState({ name:'', text:'', rating:5 })

    useEffect(()=>{
        getText('Описание.txt').then(setAbout)          // из ZIP :contentReference[oaicite:4]{index=4}
        getJSON('/content/images.json').then(d=> setSlider(d.slider || []))
        Promise.all([
            getText('Отзывы.txt').then(parseReviews),     // из ZIP :contentReference[oaicite:5]{index=5}
            getApi('/api/reviews')
        ]).then(([fromZip, fromApi])=> setReviews([...(fromZip||[]), ...(fromApi||[])]))
    },[])

    async function submit(e){
        e.preventDefault()
        const r = await postApi('/api/reviews', form)
        if(r._id){ setReviews([r,...reviews]); setForm({name:'',text:'',rating:5}); alert('Спасибо!') }
    }

    return (
        <>
            <section className="hero">
                <div>
                    <h1>Кофе & Книги — уютное место для вдохновения</h1>
                    <p style={{color:'var(--muted)', marginTop:8}}>{about || 'Атмосфера кофе и литературы — для встреч, чтения и отдыха.'}</p>
                    <div className="row" style={{marginTop:14}}>
                        <a className="btn" href="/menu">Посмотреть меню</a>
                        <a className="btn outline" href="/reservation">Забронировать столик</a>
                        <a className="btn outline" href="/contacts">Контакты</a>
                    </div>
                </div>

                {slider.length>0 && (
                    <div className="hero__img">
                        <div className="slider" aria-label="Слайдер">
                            {slider.map((src,i)=>(
                                <div className="slide" key={i}><img loading="lazy" src={src} alt={`Слайд ${i+1}`} /></div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            <h2>Отзывы</h2>
            <form className="card" onSubmit={submit}>
                <div className="card-body grid">
                    <input className="input" placeholder="Ваше имя" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
                    <textarea className="textarea" rows="3" placeholder="Ваш отзыв" value={form.text} onChange={e=>setForm({...form, text:e.target.value})}/>
                    <select className="select" value={form.rating} onChange={e=>setForm({...form, rating:e.target.value})}>
                        <option value="5">Оценка: 5</option><option value="4">4</option><option value="3">3</option>
                    </select>
                    <button className="btn">Отправить</button>
                </div>
            </form>

            <ul className="grid" style={{marginTop:12}}>
                {reviews.map(r=>(
                    <li key={r._id} className="card">
                        <div className="card-body review-quote">
                            <div className="row" style={{justifyContent:'space-between'}}>
                                <b>{r.name}</b><span className="badge">{r.rating || 5}★</span>
                            </div>
                            <p>{r.text}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    )
}
