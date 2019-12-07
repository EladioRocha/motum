let express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    path = require('path'),
    cookieParser = require('cookie-parser');

// ========== END ROUTES ==========
app.use(morgan('dev'));
app.use(cookieParser())
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use('/assets', express.static(path.join(__dirname, 'assets')))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/', require(path.join(__dirname, 'routes', 'main')))
app.use('/user', require(path.join(__dirname, 'routes', 'user')))

module.exports = app