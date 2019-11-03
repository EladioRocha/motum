let router = require('express').Router(),
    path = require('path'),
    controllersUserPath = path.join(__dirname, '..', 'api', 'controllers', 'user'),
    controllers = require(controllersUserPath),
    middlewaresUserPath = path.join(__dirname, '..', 'api', 'middlewares', 'user'),
    middlewares = require(middlewaresUserPath);


/* GET users listing. */
router.get('/map', middlewares.isValidToken, controllers.map)
router.post('/login', middlewares.isValidUser, controllers.login)

module.exports = router;
