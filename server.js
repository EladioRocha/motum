let express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    path = require('path'),
    cookieParser = require('cookie-parser');

// ========== ROUTES ========== 
let publicPath = path.join(__dirname, 'public'),
    routesMainPath = path.join(__dirname, 'routes', 'main'),
    routesUserPath = path.join(__dirname, 'routes', 'user');
// ========== END ROUTES ==========
app.use(morgan('dev'));
app.use(cookieParser())
app.use('/public', express.static(publicPath))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/', require(routesMainPath))
app.use('/user', require(routesUserPath))

module.exports = app