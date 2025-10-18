import { NavLink, Link } from 'react-router-dom'
import { useState } from 'react'

export default function Header(){
    const [open, setOpen] = useState(false)
    const cls = ({isActive}) => isActive ? 'nav__link active' : 'nav__link'
    return (
        <header className="header">
            <div className="header__inner container">
                <Link to="/" className="logo">Кофе&nbsp;&amp;&nbsp;Книги</Link>

                <nav className={`nav ${open ? 'open' : ''}`}>
                    <NavLink to="/menu" className={cls}>Меню</NavLink>
                    <NavLink to="/reservation" className={cls}>Бронь</NavLink>
                    <NavLink to="/events" className={cls}>Мероприятия</NavLink>
                    <NavLink to="/contacts" className={cls}>Контакты</NavLink>
                </nav>

                <button className="burger" aria-label="Меню" onClick={()=>setOpen(v=>!v)}>
                    <span/><span/><span/>
                </button>
            </div>
        </header>
    )
}
