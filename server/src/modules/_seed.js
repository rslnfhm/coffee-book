import { env } from '../config/env.js'
import { connectMongo } from '../db/mongo.js'
import { MenuItem } from './menu/menu.model.js'
import { Event } from './events/event.model.js'

await connectMongo(env.MONGODB_URI)

if (await MenuItem.countDocuments() === 0) {
    await MenuItem.insertMany([
        { title: 'Эспрессо', category: 'coffee', price: 150, tags: [], description: 'Классика', image: '/images/espresso.jpg' },
        { title: 'Капучино', category: 'coffee', price: 220, tags: ['milk'], description: 'Молочная пена', image: '/images/cappuccino.jpg' },
        { title: 'Веган торт', category: 'dessert', price: 350, tags: ['vegan'], description: 'Без яиц и молока', image: '/images/vegan-cake.jpg' },
        { title: 'Книга: Кофейные истории', category: 'book', price: 990, tags: [], description: 'Для любителей кофе', image: '/images/book.jpg' }
    ])
    console.log('Seed: menu items added')
}
if (await Event.countDocuments() === 0) {
    await Event.create({
        title: 'Книжный клуб: осенние новинки',
        date: '2025-10-30 19:00',
        description: 'Встреча для читателей',
        image: '/images/event.jpg'
    })
    console.log('Seed: event added')
}
process.exit(0)
