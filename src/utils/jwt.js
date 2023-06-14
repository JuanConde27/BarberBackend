const jwt = require('jsonwebtoken')

const createJWT = (id) => {

    try {

        const payload = { id }

        const token = jwt.sign(payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '1h'
        })

        return token

    } catch (e) {
        res.status(500).json({
            message: 'Something went wrong, try again'
        })
    }

}

module.exports = {
    createJWT
}