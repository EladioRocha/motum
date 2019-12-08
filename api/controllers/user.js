let jwt = require('jsonwebtoken'),
    path = require('path'),
    mongoose = require('mongoose'),
    Ride = require(path.join(__dirname, '..', 'models', 'ride')),
    User = require(path.join(__dirname, '..', 'models', 'user')),
    RequestRide = require(path.join(__dirname, '..', 'models', 'requestRide')),
    viewsPath = path.join(__dirname, '..', '..', 'views');

module.exports = {
    login: (req, res) => {
        return res.status(200).json({message: 'Login realizado con exito', user: res.locals.user, token: res.locals.token})
    },

    map: (req, res) => {
        return res.sendFile('map.html', {root: viewsPath})
    },

    history: (req, res) => {
        res.sendFile('history.html', {root: viewsPath})
    },

    profile: async (req, res) => {
        try {
            if(req.query.token) {
                let data = jwt.verify(req.cookies.token, process.env.JWT_KEY_DEV)
                if(data) {
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
        try {
            await Ride.create({
                driver: (req.body.isDriver) ? mongoose.Types.ObjectId(res.locals.user._id) : null,
                riders: [],
                originName: req.body.originName,
                destinyName: req.body.destinyName,
                originCoordinates: req.body.originCoordinates,
                destinyCoordinates: req.body.destinyCoordinates,
                hour: req.body.hour,
                date: req.body.date,
                reserved: req.body.reserved,
                finished: false,
                active: (req.body.reserved) ? false : true,
                aroundOriginCoordinates: req.body.aroundOriginCoordinates,
                aroundDestinyCoordinates: req.body.aroundDestinyCoordinates,
                createdAt: new Date(),
                updatedAt: new Date()
            })        
        } catch(error) {
            console.log(error)
        }
        
        return res.status(200).json({works: true})
    },

    updateStatusDriver: async (req, res) => {
        try {
            let {_id} = res.locals.user
            await User.update({
                _id
            }, {$set: {
                isDriver: req.body.isDriver,
                updatedAt: new Date() 
            }})
            console.log(_id)
            
            return res.status(200).json({works: true})
        } catch (error) {
            console.log('Ha ocurrido un error en el servidor', error)
            res.status(500).json({message: 'Ha ocurrido un error en el servidro, intentelo más tarde'})
        }
    },

    getAllCommunityRides: async (req, res) => {
        try {
            let response = await Ride.find({
                driver: {$ne: null}
            }, ['_id', 'originName', 'destinyName', 'date', 'driver']).populate('driver', 'name')
            return res.status(200).json({data: response})
        } catch (error) {
            console.log('Ha ocurrido un erro en la base de datos', error)
            res.status(500).json({message: 'Ha ocurrido un erro en la base de datos'})
        }
    },

    requestRide: async (req, res) => {
        try {
            let {_id, driver} = await Ride.findOne({
                _id: mongoose.Types.ObjectId(req.body._id)
            }, ['_id']).populate('driver', '_id')

            await RequestRide.create({
                ride: _id,
                driver: driver._id,
                rider: res.locals.user._id
            })
            console.log(res.locals.user._id)
            return res.status(200).json({works: true})
        } catch (error) {
            console.log(error)
            return res.status(500).json({works: false})
        }
    },

    closeSession: (req, res) => {
        res.clearCookie('token')
        res.status(200).json({message: 'Se ha cerrado la sesión exitosamente'})
    }
}