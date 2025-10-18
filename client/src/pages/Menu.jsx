import { useEffect, useState } from 'react'
import { getJSON as getApi } from '../api'

export default function Menu(){
    const [items,setItems] = useState([])
    const [category,setCategory] = useState('')
    const [tag,setTag] = useState('')
    const [covers,setCovers] = useState({})

    useEffect(()=>{ fetch('/content/images.json').then(r=>r.json()).then(d=> setCovers(d.menuCovers||{})) },[])
    useEffect(()=>{
        const q = new URLSearchParams()
        if(category) q.set('category', category)
        if(tag) q.set('tag', tag)
        getApi('/api/menu'+(q.toString()?`?${q}`:'' )).then(setItems)
    },[category,tag])

    return (
        <>
            <h1>Меню</h1>
            <div className="row">
                <select className="select" value={category} onChange={e=>setCategory(e.target.value)}>
                    <option value="">Все категории</option>
                    <option value="coffee">Кофе</option>
                    <option value="dessert">Десерты</option>
                    <option value="breakfast">Завтраки</option>
                    <option value="book">Книги</option>
                </select>
                <select className="select" value={tag} onChange={e=>setTag(e.target.value)}>
                    <option value="">Все опции</option>
                    <option value="vegan">Веганское</option>
                    <option value="lactose-free">Безлактозное</option>
                    <option value="milk">С молоком</option>
                </select>
            </div>

            <ul className="grid" style={{marginTop:12}}>
                {items.map(x=>(
                    <li key={x._id} className="card menu-card">
                        <img src={x.image || covers[x.category] || '/images/coffee-steam.webp'} loading="lazy" alt={x.title}/>
                        <div className="card-body">
                            <div className="row" style={{justifyContent:'space-between'}}>
                                <b>{x.title}</b><span>{x.price} ₽</span>
                            </div>
                            <p style={{color:'var(--muted)'}}>{x.description}</p>
                            <div className="row">{(x.tags||[]).map(t=><span className="badge" key={t}>{t}</span>)}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    )
}
