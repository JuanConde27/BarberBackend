const { Router } = require("express");
const { getBarbers, getBarber, deleteBarber, createBarber } = require("../controllers/barber");
const { validateJWT } = require("../middleware/jwt");
const router = Router();

router.get('/barber', [validateJWT], getBarbers)
router.get('/barber/:id', [validateJWT], getBarber)
router.delete('/barber/:id', [validateJWT], deleteBarber)
router.post('/barber', [validateJWT], createBarber)

module.exports = router
