let router = require('express').Router(),
    path = require('path'),
    controllers = require(path.join(__dirname, '..', 'api', 'controllers', 'user')),
    middlewares = require(path.join(__dirname, '..', 'api', 'middlewares', 'user'));


/* GET users listing. */
router.get('/map', middlewares.isValidToken, controllers.map)
router.get('/profile', middlewares.isValidToken, controllers.profile)
router.get('/history', middlewares.isValidToken, controllers.history)
router.get('/rides/community/all', middlewares.isValidToken, controllers.getAllCommunityRides)

router.post('/login', middlewares.isValidUser, controllers.login)
router.post('/exit', middlewares.isValidToken, controllers.closeSession)
router.post('/rides/add', [middlewares.isValidRide ,middlewares.isValidToken], controllers.takeAride)
router.post('/rides/request', middlewares.isValidToken, controllers.requestRide)

router.put('/status', middlewares.isValidToken, controllers.updateStatusDriver)
module.exports = router;
