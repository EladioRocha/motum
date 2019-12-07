let jwt = require('jsonwebtoken'),
    path = require('path'),
    mongoose = require('mongoose'),
    Ride = require(path.join(__dirname, '..', 'models', 'ride')),
    User = require(path.join(__dirname, '..', 'models', 'user')),
    viewsPath = path.join(__dirname, '..', '..', 'views');

module.exports = {
    login: (req, res) => {
        return res.status(200).json({message: 'Login realizado con exito', user: res.locals.user, token: res.locals.token})
    },

    map: (req, res) => {
        return res.sendFile('map.html', {root: viewsPath})
    },

    profile: async (req, res) => {
        try {
            if(req.query.token) {
                let data = jwt.verify(req.cookies.token, process.env.JWT_KEY_DEV)
                if(data) {
                    console.log(req.path)
                    let {isDriver} = await User.findOne({expedient: data.expedient}, ['isDriver'])
                    return res.status(200).json({expedient: data.expedient, nip: '********', name: data.name, email: data.email, isDriver})
                }
                return res.location('/login').sendStatus(302)
            }
            return res.sendFile('profile.html', {root: viewsPath})
        } catch (error) {
            console.log('Ha ocurrido un erro en la base de datos')
            res.status(500).json({})
        }

    },

    takeAride: async (req, res) => {
        console.log(res.locals.user)
        
        return res.status(200).json({works: true})
    },

    updateStatusDriver: async (req, res) => {
        let user = new User()
        let {_id} = res.locals.user
        user.collection.update({
            _id: mongoose.Types.ObjectId(_id)
        }, {$set: {
                isDriver: req.body.isDriver,
                updatedAt: new Date() 
            }})
        
        return res.status(200).json({works: true})
    },

    closeSession: (req, res) => {
        res.clearCookie('token')
        res.status(200).json({message: 'Se ha cerrado la sesión exitosamente'})
    }
}