let jwt = require('jsonwebtoken')

module.exports = {
    existSessionActive: (req, res, next) => {
        try {
            if(jwt.verify(req.cookies.token, process.env.JWT_KEY_DEV)) {
                return res.location('/user/map').sendStatus(302)
            }
        } catch(err) {
            res.status(200)
        }

        return next()
    }
}  