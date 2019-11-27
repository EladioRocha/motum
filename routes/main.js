let router = require('express').Router(),
    path = require('path'),
    controllers = require(path.join(__dirname, '..', 'api', 'controllers', 'main')),
    middlewares = require(path.join(__dirname, '..', 'api', 'middlewares', 'main'));

router.get('/', controllers.index)
router.get('/login', middlewares.existSessionActive, controllers.login)
router.get('/history', controllers.history)


module.exports = router