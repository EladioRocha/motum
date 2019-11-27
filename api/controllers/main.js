let path = require('path'),
    viewsPath = path.join(__dirname, '..', '..', 'views');

module.exports = {
    index: (req, res) => {
        res.sendFile('index.html', {root: viewsPath})
    },

    login: (req, res) => {
        res.sendFile('login.html', {root: viewsPath})
    },

    history: (req, res) => {
        res.sendFile('history.html', {root: viewsPath})
    }
}