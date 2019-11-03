let router = require('express').Router(),
    path = require('path'),
    controllersMainPath = path.join(__dirname, '..', 'api', 'controllers', 'main'),
    controllers = require(controllersMainPath);

router.get('/', controllers.index)
router.get('/login', controllers.login)

module.exports = router