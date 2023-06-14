const { Router } = require("express");
const { getAdmins, getAdmin } = require("../controllers/admin");
const { validateJWT } = require("../middleware/jwt");
const router = Router();

router.get("/admin", [validateJWT], getAdmins);
router.get("/admin/:id", [validateJWT], getAdmin);

module.exports = router;
