import { useState } from 'react'
import { NavLink } from 'react-router-dom'

export default function Header() {
    const [open, setOpen] = useState(false)
    const close = () => setOpen(false)

    return (
        <header className="site-header">
            <div className="container header-inner">
                {/* ЛОГОТИП */}
                <NavLink to="/" className="logo" onClick={close}>
                   <img src='/images/logo.webp' className="logo__logo" width={50} height={50} />
                    <span className="logo-title">Кофе&nbsp;&amp;&nbsp;Книги</span>
                </NavLink>

                {/* БУРГЕР */}
                <button
                    className={`burger ${open ? 'is-open' : ''}`}
                    aria-label="Открыть меню"
                    aria-controls="site-nav"
                    aria-expanded={open ? 'true' : 'false'}
                    onClick={() => setOpen(v => !v)}
                >
                    <span />
                    <span />
                    <span />
                </button>

                {/* НАВИГАЦИЯ (десктоп) */}
                <nav className="nav-desktop">
                    <NavLink to="/" end>Главная</NavLink>
                    <NavLink to="/menu">Меню</NavLink>
                    <NavLink to="/events">События</NavLink>
                    <NavLink to="/reviews">Бронировать </NavLink>
                    <NavLink to="/about">О нас</NavLink>
                    <NavLink to="/contacts">Контакты</NavLink>
                    <NavLink to="/reserve" className="btn btn-small">Бронь</NavLink>
                </nav>
            </div>

            {/* НАВИГАЦИЯ (мобилка) */}
            <nav id="site-nav" className={`nav-panel ${open ? 'open' : ''}`}>
                <NavLink to="/" end onClick={close}>Главная</NavLink>
                <NavLink to="/menu" onClick={close}>Меню</NavLink>
                <NavLink to="/events" onClick={close}>События</NavLink>
                <NavLink to="/reviews" onClick={close}>Отзывы</NavLink>
                <NavLink to="/about" onClick={close}>О нас</NavLink>
                <NavLink to="/contacts" onClick={close}>Контакты</NavLink>
                <NavLink to="/reserve" onClick={close} className="btn w-full">Забронировать</NavLink>
            </nav>
        </header>
    )
}

/** Небольшой SVG-логотип (чашка кофе) */
function CupIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 64 64" width="28" height="28" aria-hidden="true">
            <path d="M10 26h36a0 0 0 0 1 0 0v6a12 12 0 0 1-12 12H22A12 12 0 0 1 10 32v-6a0 0 0 0 1 0 0Z" fill="currentColor"/>
            <path d="M46 26h6a6 6 0 0 1 0 12h-4" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
            <path d="M14 48h28" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
            <path d="M24 10c-2 3 2 4 0 7m8-7c-2 3 2 4 0 7m8-7c-2 3 2 4 0 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none"/>
        </svg>
    )
}
