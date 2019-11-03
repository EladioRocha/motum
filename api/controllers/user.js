let jwt = require('jsonwebtoken'),
    path = require('path'),
    viewsPath = path.join(__dirname, '..', '..', 'views');

module.exports = {
    login: (req, res) => {
        return res.status(200).json({message: 'Login realizado con exito', user: res.locals.user, token: res.locals.token})
    },

    map: (req, res) => {
        return res.sendFile('map.html', {root: viewsPath})
    },

    closeSession: (req, res) => {
        res.clearCookie('token')
        res.location('/login').sendStatus(302)
    }
}

// var token = req.headers['authorization']

// if(!token){
//   return res.status(401).send({
//     error: "Es necesario el token de autenticación"
//   })
// }

// token = token.replace('Bearer ', '')

// console.log(token)

// jwt.verify(token, 'Secret Password', function(err, user) {
//   console.log(user)
//   if (err) {
//     res.status(401).send({
//       error: 'Token inválido'
//     })
//   } else {
//     res.send({
//       message: 'Awwwww yeah!!!!'
//     })
//   }
// })