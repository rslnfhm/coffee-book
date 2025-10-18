export default function Contacts() {
    return (
        <div className="container">
            <h1>Контакты</h1>
            <p>Адрес: г. Ваш город, ул. Примерная, 1</p>
            <p>Тел: +7 (999) 123-45-67 • Email: cafe@example.com</p>
            <div style={{height:300, border:'1px solid #e5e7eb', borderRadius:12, overflow:'hidden'}}>
                <iframe
                    title="map" width="100%" height="100%" style={{border:0}}
                    loading="lazy" allowFullScreen
                    src="https://maps.google.com/maps?q=Moscow&t=&z=13&ie=UTF8&iwloc=&output=embed">
                </iframe>
            </div>
            <p style={{marginTop:12}}>График работы: ежедневно 09:00–22:00</p>
        </div>
    )
}
