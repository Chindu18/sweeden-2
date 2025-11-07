import express from 'express'
import { getTotalSeats,updatePaymentStatus,pendingMoney,getTotalShows,getBookingById} from '../controller/dashBoardController.js';

const dashboardRouter = express.Router()

dashboardRouter.get('/seats',getTotalSeats);
dashboardRouter.get('/pending',pendingMoney)
dashboardRouter.put('/booking/:bookingId/status', updatePaymentStatus);
dashboardRouter.get('/totalshow',getTotalShows)
dashboardRouter.get('/bookingdetails/:bookingId',getBookingById)

       

export default dashboardRouter;