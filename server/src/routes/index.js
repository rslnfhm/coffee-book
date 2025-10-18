import { Router } from 'express'
import menuRoutes from '../modules/menu/menu.routes.js'
import reviewRoutes from '../modules/reviews/review.routes.js'
import reservationRoutes from '../modules/reservations/reservation.routes.js'
import eventRoutes from '../modules/events/event.routes.js'
import pageRoutes from "../modules/pages/page.routes.js";

const router = Router()
router.use('/menu', menuRoutes)
router.use('/reviews', reviewRoutes)
router.use('/reservations', reservationRoutes)
router.use('/events', eventRoutes)
router.use('/pages', pageRoutes)                                 // ← добавили

export default router
