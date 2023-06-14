const { Router } = require("express");
const { createBooking, getBookings, deleteBooking, getBookingsByBarber, getBookingsByClient, updateBooking, uptadeBookingStatus, getBooking } = require("../controllers/booking");
const { validateJWT } = require("../middleware/jwt");
const router = Router();

router.get('/booking/:idBooking', [validateJWT], getBooking)
router.post('/booking', [validateJWT], createBooking)
router.get('/booking', [validateJWT], getBookings)
router.delete('/booking/:idBooking', [validateJWT], deleteBooking)
router.get('/booking/barber/:idBarber', [validateJWT], getBookingsByBarber)
router.get('/booking/client/:idClient', [validateJWT], getBookingsByClient)
router.put('/booking/:idBooking', updateBooking)
router.put('/booking/status/:idBooking', uptadeBookingStatus)

module.exports = router
