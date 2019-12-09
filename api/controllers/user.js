let jwt = require('jsonwebtoken'),
    path = require('path'),
    mongoose = require('mongoose'),
    Ride = require(path.join(__dirname, '..', 'models', 'ride')),
    User = require(path.join(__dirname, '..', 'models', 'user')),
    RequestRide = require(path.join(__dirname, '..', 'models', 'requestRide')),
    Chat = require(path.join(__dirname, '..', 'models', 'chat'))
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
            console.log('Ha ocurrido un error en el servidro, intentelo más tarde')
            res.status(500).json({message: 'Ha ocurrido un error en el servidro, intentelo más tarde', status: 'WARNING'})
        }

    },

    takeAride: async (req, res) => {
        try {
            let existRide = await Ride.find({
                riders: {$in: [res.locals.user._id]},
                finished: false,
            }).count()
            if(!existRide || req.body.isDriver) {
                let {_id} = await Ride.create({
                    driver: (req.body.isDriver) ? mongoose.Types.ObjectId(res.locals.user._id) : null,
                    riders: (!req.body.isDriver) ? [res.locals.user._id] : [],
                    originName: req.body.originName,
                    destinyName: req.body.destinyName,
                    originCoordinates: req.body.originCoordinates,
                    destinyCoordinates: req.body.destinyCoordinates,
                    hour: req.body.hour,
                    date: req.body.date,
                    reserved: req.body.reserved,
                    finished: false,
                    active: false,
                    aroundOriginCoordinates: req.body.aroundOriginCoordinates,
                    aroundDestinyCoordinates: req.body.aroundDestinyCoordinates,
                    createdAt: new Date(),
                    updatedAt: new Date()
                })


                return res.status(200).json({_id, message: 'Viaje agendado', status: 'OK'})
            }

            return res.status(200).json({message: 'Actualmente no puedes agendar dos viaje o más como pasajero', status: 'ALERT'})
        } catch(error) {
            console.log(error)
        }
        
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
            
            return res.status(200).json({message: 'Se ha actualizado su estado a conductor', status: 'OK'})
        } catch (error) {
            console.log('Ha ocurrido un error en el servidor', error)
            res.status(500).json({message: 'Ha ocurrido un error en el servidro, intentelo más tarde', status: 'WARNING'})
        }
    },

    getAllCommunityRides: async (req, res) => {
        try {
            let response = await Ride.find({
                driver: {$ne: res.locals.user._id},
                riders: {$ne: res.locals.user._id},
                active: false
            }, ['_id', 'originName', 'destinyName', 'date', 'driver', 'riders[0]']).populate('driver', 'name expedient').populate('riders', 'name expedient')

            return res.status(200).json({data: response})
        } catch (error) {
            console.log('Ha ocurrido un erro en la base de datos', error)
            res.status(500).json({message: 'Ha ocurrido un erro en la base de datos', status: 'WARNING'})
        }
    },

    getAllRequestRides: async (req, res) => {
        try {
            let response = await RequestRide.find({
                driver: res.locals.user._id,
                pending: {$ne: false}
            }, ['_id']).populate('rider', 'name email expedient college career')

            return res.status(200).json({data: response})
        } catch (error) {
            console.log('Ha ocurrido un error en el servidor, intentelo más tarde', error)
            res.status(500).json({message: 'Ha ocurrido un error en el servidor', status: 'WARNING'})
        }
    },

    getAllPeningRides: async (req, res) => {
        try {
            let response = await Ride.find({
                $or: [{
                    riders: {$in: res.locals.user._id},
                }, {
                    driver: res.locals.user._id
                }],
                active: false
            }, ['_id', 'originName', 'destinyName', 'date', 'riders', 'driver', 'active']).populate('driver', 'name expedient')

            return res.status(200).json({data: response, self: res.locals.user._id})
        } catch (error) {
            console.log('Ha ocurrido un error en el servidor, intentelo más tarde', error)
            res.status(500).json({message: 'Ha ocurrido un error en el servidor', status: 'WARNING'})
        }
    },

    getAllActivesRides: async (req, res) => {
        try {
            let response = await Ride.find({
                $or: [{
                    riders: {$in: res.locals.user._id},
                }, {
                    driver: res.locals.user._id
                }],
                active: true,
                finished: false
            }, ['_id', 'originName', 'destinyName', 'date', 'riders', 'driver', 'active']).populate('driver', 'name expedient')

            return res.status(200).json({data: response, self: res.locals.user._id})
        } catch (error) {
            console.log('Ha ocurrido un error en el servidor, intentelo más tarde', error)
            return res.status(500).json({message: 'Ha ocurrido un error en el servidor', status: 'WARNING'})
        }
    },

    getAllFinishedRides: async (req, res) => {
        try {
            let response = await Ride.find({
                $or: [{
                    riders: {$in: res.locals.user._id},
                }, {
                    driver: res.locals.user._id
                }],
                finished: true
            }, ['_id', 'originName', 'destinyName', 'date', 'riders', 'driver', 'active']).populate('driver', 'name expedient')
            return res.status(200).json({data: response})
        } catch (error) {
            console.log(error)
            return res.status(500).json({message: 'Ha ocurrido un error en el servidor'})
        }
    },

    acceptOrRejectRide: async (req, res) => {
        try {
            let {ride: _id , rider} = await RequestRide.findOneAndUpdate({
                _id: req.body._id
            }, {$set: {
                accepted: req.body.accepted,
                reason: (req.body.accepted) ? 'Aceptado' : req.body.reason,
                pending: false
            }}, ['ride', 'rider'])
            if(req.body.accepted) {
                await Ride.update({
                    _id,
                }, {$push: {
                    riders: rider 
                }, $set: {updatedAt: new Date()}})
            }
            return res.status(200).json({message: (req.body.accepted) ? 'Solicitud aceptada' : 'Solicitud rechazada', status: (req.body.accepted) ? '0K' : 'ALERT'})
        } catch (error) {
            console.log('Ha ocurrido un error en el servidor, intentelo más tarde', error)
            return res.status(500).json({message: 'Ha ocurrido un error en el servidor', status: 'WARNING'})
        }
    },

    requestRide: async (req, res) => {
        try {
            let existRequest = await RequestRide.find({
                ride: mongoose.Types.ObjectId(req.body._id),
                rider: res.locals.user._id
            }).count()

            if(!existRequest) {
                let {_id, driver} = await Ride.findOne({
                    _id: mongoose.Types.ObjectId(req.body._id)
                }, ['_id']).populate('driver', '_id')

                if(!!driver) {
                    await RequestRide.create({
                        ride: _id,
                        driver: driver._id,
                        rider: res.locals.user._id
                    })
                    return res.status(200).json({message: 'Tu solicitud ha sido enviada exitosamente', status: 'OK'})
                } else {
                    await Ride.update({
                        _id: req.body._id
                    }, {$set: {
                        driver: res.locals.user._id
                    }})
                }
            }

            return res.status(200).json({message: 'Ya has hecho una solicitud a este viaje anteriormente', status: 'ALERT'})
        } catch (error) {
            console.log(error)
            return res.status(500).json({message: 'Ha ocurrido un erro en el servidor, intentelo más tarde', status: 'WARNING'})
        }
    },

    startRide: async (req, res) => {
        try {
            let response = await Ride.findOneAndUpdate({
                _id: req.body._id
            }, {$set: {active: true, updatedAt: new Date()}})// DESCOMENTAR AL FINALIZAR SOCKEETEEEEEEEEEEEEES
            return res.status(200).json({data: response})
        } catch (error) {
            console.log(error)
            return res.status(500).json({message: 'Ha ocurrido un erro en el servidor, intentelo más tarde', status: 'WARNING'})
        }
    },

    endRide: async (req, res) => {
        try {
            await Ride.update({
                _id: req.body._id
            }, {$set: {finished: true}})
            return res.status(200).json({message: 'Viaje finalizado', status: 'OK'})
        } catch (error) {
            console.log(error)
            return res.status(500).json({message: 'Ha ocurrido un erro en el servidor, intentelo más tarde', status: 'WARNING'})
        }
    },

    getAllMessagesFromRoom: async (req, res) => {
        try {
            let response = await Chat.find({
                key: req.params.key
            })
            console.log(req.params.key)
            return res.status(200).json({data: response})
        } catch (error) {
            console.log(error)
            return res.status(500).json({message: 'Ha ocurrido un erro en el servidor, intentelo más tarde', status: 'WARNING'})
        }
    },

    closeSession: (req, res) => {
        res.clearCookie('token')
        res.status(200).json({message: 'Se ha cerrado la sesión exitosamente', status: 'OK'})
    }
}