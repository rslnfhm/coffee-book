// src/pages/Home.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getJSON as getApi, postJSON as postApi } from '../lib/api.js'
import { parseReviews } from '../lib/content'

// ── Вставленный контент (локальные фолбэки) ───────────────────────────────────
const ABOUT_TEXT = `Наша кофейня — это гармоничное пространство, где можно
остановиться, перевести дух и провести время с книгой или в беседе.
Уютные кресла, тихая музыка, полки с современной и классической
литературой и безупречный кофе создают атмосферу, в которой приятно
работать, читать и встречаться с друзьями.

Мы готовим эспрессо-бар, альтернативу и авторские напитки, а к кофе —
свежие десерты и лёгкие завтраки. У нас часто проходят встречи
книжного клуба, презентации новых изданий и камерные творческие вечера.`

const REVIEWS_TEXT = `Марина

Зашла спонтанно и не пожалела: очень спокойно, бариста приветливые,
капучино плотный с нежной пеной, десерты свежие. Приятно, что музыка
не мешает разговаривать. Вернусь ещё!

Сергей

Брал раф и фильтр — оба отличные. Понравилась подборка книг: нашёл
несколько редких изданий. Цены адекватные, сотрудники готовы подсказать.

Ольга

Место для тех, кто любит тишину и хорошие напитки. Из еды брала чизкейк —
сбалансированный вкус, не приторно. Рекомендую.`
// ───────────────────────────────────────────────────────────────────────────────

export default function Home(){
    const [about,setAbout] = useState(ABOUT_TEXT)
    const [slider,setSlider] = useState([
        '/images/espresso.jpg',
        '/images/cappuccino.jpg',
        '/images/vegan-cake.jpg'
    ])
    const [reviews,setReviews] = useState(parseReviews(REVIEWS_TEXT))
    const [form,setForm] = useState({ name:'', text:'', rating:5 })

    useEffect(()=>{
        // тянем актуальный контент с бэка; если что-то не придёт — остаются фолбэки сверху
        ;(async () => {
            try {
                const [aboutPage, images, apiReviews] = await Promise.all([
                    getApi('/pages/about').catch(()=>null),
                    fetch('/content/images.json').then(r=>r.ok?r.json():{slider:[]}).catch(()=>({slider:[]}))
                        .then(d=>d.slider||[]),
                    getApi('/reviews').catch(()=>[])
                ])
                if (aboutPage?.body) setAbout(aboutPage.body)
                if (Array.isArray(images) && images.length) setSlider(images)
                if (Array.isArray(apiReviews) && apiReviews.length) setReviews(apiReviews)
            } catch (_) { /* молча оставляем локальные фолбэки */ }
        })()
    },[])

    async function submit(e){
        e.preventDefault()
        // ВАЖНО: api.js уже имеет baseURL '/api', поэтому путь без повторного /api
        const r = await postApi('/reviews', form)
        if(r && r._id){
            setReviews([r, ...reviews])
            setForm({name:'', text:'', rating:5})
            alert('Спасибо за отзыв!')
        }
    }

    return (
        <>
            <section className="hero">
                <div>
                    <h1>Кофе & Книги — уютное место для вдохновения</h1>
                    <p style={{color:'var(--muted)', marginTop:8}}>{about}</p>
                    <div className="row" style={{marginTop:14}}>
                        <Link className="btn" to="/menu">Посмотреть меню</Link>
                        <Link className="btn outline" to="/reserve">Забронировать столик</Link>
                        <Link className="btn outline" to="/contacts">Контакты</Link>
                    </div>
                </div>

                {!!slider.length && (
                    <div className="hero__img">
                        <div className="slider" aria-label="Слайдер">
                            {slider.map((src,i)=>(
                                <div className="slide" key={i}>
                                    <img loading="lazy" src={src} alt={`Слайд ${i+1}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            <h2>Отзывы</h2>
            <form className="card" onSubmit={submit}>
                <div className="card-body grid">
                    <input
                        className="input"
                        placeholder="Ваше имя"
                        value={form.name}
                        onChange={e=>setForm({...form, name:e.target.value})}
                    />
                    <textarea
                        className="textarea"
                        rows="3"
                        placeholder="Ваш отзыв"
                        value={form.text}
                        onChange={e=>setForm({...form, text:e.target.value})}
                    />
                    <select
                        className="select"
                        value={form.rating}
                        onChange={e=>setForm({...form, rating:Number(e.target.value)||5})}
                    >
                        <option value="5">Оценка: 5</option>
                        <option value="4">4</option>
                        <option value="3">3</option>
                    </select>
                    <button className="btn">Отправить</button>
                </div>
            </form>

            <ul className="grid" style={{marginTop:12}}>
                {reviews.map((r, i)=>(
                    <li key={r._id || `${r.name}-${i}`} className="card">
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
