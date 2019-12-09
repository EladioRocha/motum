let router = require('express').Router(),
    path = require('path'),
    controllers = require(path.join(__dirname, '..', 'api', 'controllers', 'user')),
    middlewares = require(path.join(__dirname, '..', 'api', 'middlewares', 'user'));


/* GET users listing. */
router.get('/map', middlewares.isValidToken, controllers.map)
router.get('/profile', controllers.profile) // FALTA AGREGAR MIDDLEWARE TOKEN
router.get('/history', middlewares.isValidToken, controllers.history)
router.get('/rides/community/all', middlewares.isValidToken, controllers.getAllCommunityRides)
router.get('/rides/request/all', middlewares.isValidToken, controllers.getAllRequestRides)
router.get('/rides/pending/all', middlewares.isValidToken, controllers.getAllPeningRides)
router.get('/rides/active/all', middlewares.isValidToken, controllers.getAllActivesRides)
router.get('/rides/finished/all', middlewares.isValidToken, controllers.getAllFinishedRides)
router.get('/messages/:key/:rideId', middlewares.isValidToken, controllers.getAllMessagesFromRoom)

router.post('/login', middlewares.isValidUser, controllers.login)
router.post('/exit', middlewares.isValidToken, controllers.closeSession)
router.post('/rides/add', [middlewares.isValidRide ,middlewares.isValidToken], controllers.takeAride)
router.post('/rides/request', middlewares.isValidToken, controllers.requestRide)

router.put('/status', middlewares.isValidToken, controllers.updateStatusDriver)
router.put('/rides/request', middlewares.isValidToken, controllers.acceptOrRejectRide)
router.put('/rides/start', middlewares.isValidToken, controllers.startRide)
router.put('/rides/end', middlewares.isValidToken, controllers.endRide)
module.exports = router;
