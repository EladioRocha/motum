let jwt = require('jsonwebtoken'),
    path = require('path'),
    viewsPath = path.join(__dirname, '..', '..', 'views');

module.exports = {
    login: (req, res) => {
        return res.status(200).json({message: 'Login realizado con exito', user: res.locals.user, token: res.locals.token})
    },

    map: (req, res) => {
        return res.sendFile('map.html', {root: viewsPath})
    },

    profile: (req, res) => {
        console.log(req.cookies)
        if(req.query.token) {
            let data = jwt.verify(req.cookies.token, process.env.JWT_KEY_DEV)
            console.log(data)
            if(data) {
                return res.status(200).json({expedient: data.expedient, nip: '********', name: data.name, email: data.email})
            }
            return res.status(200).json()
        }
        return res.sendFile('profile.html', {root: viewsPath})
    },

    closeSession: (req, res) => {
        res.clearCookie('token')
        res.status(200).json({message: 'Se ha cerrado la sesión exitosamente'})
    }
}