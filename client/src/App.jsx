import { Routes, Route, NavLink } from 'react-router-dom'
import MenuGrid from "./pages/MenuGrid.jsx";
import EventsList from "./pages/EventsList.jsx";
import PageView from "./pages/PageView.jsx";
import ReservationForm from "./pages/ReviewsList.jsx";


function ReviewsList() {
    return null;
}

export default function App() {
    const navStyle = { display: 'flex', gap: 16, flexWrap: 'wrap' }
    const wrap = { padding: 24, display: 'grid', gap: 24 }

    return (
        <div style={wrap}>
            <nav style={navStyle}>
                <NavLink to="/">Главная</NavLink>
                <NavLink to="/menu">Меню</NavLink>
                <NavLink to="/events">События</NavLink>
                <NavLink to="/reviews">Отзывы</NavLink>
                <NavLink to="/about">О нас</NavLink>
                <NavLink to="/contacts">Контакты</NavLink>
                <NavLink to="/reserve">Бронь</NavLink>
            </nav>

            <Routes>
                <Route path="/" element={<MenuGrid />} />
                <Route path="/menu" element={<MenuGrid />} />
                <Route path="/events" element={<EventsList />} />
                <Route path="/reviews" element={<ReviewsList />} />
                <Route path="/about" element={<PageView slug="about" />} />
                <Route path="/contacts" element={<PageView slug="contacts" />} />
                <Route path="/reserve" element={<ReservationForm />} />
            </Routes>
        </div>
    )
}
