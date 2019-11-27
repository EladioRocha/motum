let router = require('express').Router(),
    path = require('path'),
    controllers = require(path.join(__dirname, '..', 'api', 'controllers', 'user')),
    middlewares = require(path.join(__dirname, '..', 'api', 'middlewares', 'user'));


/* GET users listing. */
router.get('/map', middlewares.isValidToken, controllers.map)
router.get('/profile', middlewares.isValidToken, controllers.profile)
router.post('/login', middlewares.isValidUser, controllers.login)
router.post('/exit', controllers.closeSession)

module.exports = router;
