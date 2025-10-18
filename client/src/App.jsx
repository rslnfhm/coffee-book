import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'

import Home from './pages/Home.jsx'
import MenuGrid from './pages/MenuGrid.jsx'
import EventsList from './pages/EventsList.jsx'
import ReviewsList from './pages/ReviewsList.jsx'
import PageView from './pages/PageView.jsx'
import ReservationForm from './pages/ReservationForm.jsx'

export default function App() {
    return (
        <>
            <Header />
            <main className="container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/menu" element={<MenuGrid />} />
                    <Route path="/events" element={<EventsList />} />
                    <Route path="/reviews" element={<ReviewsList />} />
                    <Route path="/about" element={<PageView slug="about" />} />
                    <Route path="/contacts" element={<PageView slug="contacts" />} />
                    <Route path="/reserve" element={<ReservationForm />} />
                </Routes>
            </main>
            <Footer />
        </>
    )
}
