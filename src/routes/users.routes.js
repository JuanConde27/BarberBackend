const { Router } = require("express");
const { getUsers, getUser, uptadeUser, deleteUser, uptadePassword } = require("../controllers/users");
const { validateJWT } = require("../middleware/jwt");
const router = Router();

router.get("/users", [validateJWT], getUsers);
router.get("/users/:id", [validateJWT], getUser);
router.put("/users/:id", [validateJWT], uptadeUser);
router.delete("/users/:id", [validateJWT], deleteUser);
router.put("/users/password/:id", [validateJWT], uptadePassword);


module.exports = router;
