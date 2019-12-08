let router = require('express').Router(),
    path = require('path'),
    controllers = require(path.join(__dirname, '..', 'api', 'controllers', 'user')),
    middlewares = require(path.join(__dirname, '..', 'api', 'middlewares', 'user'));


/* GET users listing. */
router.get('/map', middlewares.isValidToken, controllers.map)
router.get('/profile', middlewares.isValidToken, controllers.profile)
router.get('/history', middlewares.isValidToken, controllers.history)
router.get('/rides/all', middlewares.isValidToken, controllers.getAllRides)
router.post('/login', middlewares.isValidUser, controllers.login)
router.post('/rides/add', [middlewares.isValidRide ,middlewares.isValidToken], controllers.takeAride)
router.post('/exit', middlewares.isValidToken, controllers.closeSession)
router.put('/updateStatusDriver', middlewares.isValidToken, controllers.updateStatusDriver)

module.exports = router;
