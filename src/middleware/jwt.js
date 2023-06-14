const jwt = require('jsonwebtoken')

const validateJWT = (req, res, next) => {
    try {

        const authorization = req.header('Authorization')
        
        if (!authorization && authorization.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'There is no token in the request'
            })
        }

        const token = authorization.split(' ')[1]

        console.log(token)

        const { id } = jwt.verify(token, process.env.SECRET_JWT_SEED)
        console.log({id})
        req.userId = id

        next()


    } catch (e) {
        res.status(401).json({
            message: 'Invalid Token'
        })
    }
}
  
module.exports = {
    validateJWT
}