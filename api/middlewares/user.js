let path = require('path'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt'),
    User = require(path.join(__dirname, '..', 'models', 'user')),
    uaqAuthenticationPath = path.join(__dirname, '..', '..', 'helpers', 'uaq-authentication'),
    uaqAuthentication = require(uaqAuthenticationPath);

module.exports = {
    isValidUser: async (req, res, next) => {
        let user;
        try {
            let expedient = req.body.expedient,
                password = req.body.password;

            user = await User.collection.findOne({
                expedient
            })

            let passwordHash = bcrypt.hashSync(password, 10)

            if(!user) {
                let result = await uaqAuthentication.main(expedient, password)
                if(typeof result === 'string') {
                    return res.status(401).json({message: 'Usuario o contraseña incorrectos'})
                }

                let inserted = await User.collection.insertOne({
                    name: result[0][1],
                    email: result[0][4],
                    expedient: result[0][0],
                    password: passwordHash,
                    birthday: result[0][5],
                    profilePictureUaq: result[2],
                    college: result[1][0],
                    career: result[1][1],
                    semester: parseInt(result[1][7]),
                    isDriver: false,
                    createdAt: new Date(),
                    updatedAt: new Date()
                })

                user = inserted.ops[0] 
            } else {
                if(!bcrypt.compareSync(password, user.password)) {
                    return res.status(401).json({message: 'Usuario o contraseña incorrectos'})  
                }
            }

            res.locals.user = user
            res.locals.token = jwt.sign({
                _id: user._id,
                expedient: user.expedient,
                password: user.password,
                name: user.name,
                email: user.email,
            }, process.env.JWT_KEY_DEV, {
                expiresIn: '1d'
            })
            res.cookie('token', res.locals.token)

            return next()
        } catch (error) {
            console.log(error)
            return res.status(500).json({message: 'Hubo un error en el servidor, intentelo más tarde'})
        }
    },

    isValidToken: (req, res, next) => {
        try {
            let {_id, expedient, password, name, email} = jwt.verify(req.cookies.token, process.env.JWT_KEY_DEV)
            res.locals.user = {
                _id,
                expedient,
                password,
                name,
                email
            }
        } catch(err) {
            return res.location('/login').sendStatus(302)
        }

        return next()
    },

    isActiveSession: (req, res, next) => {
        try {
            jwt.verify(req.cookies.token, process.env.JWT_KEY_DEV)
        } catch(err) {
            return res.status(200)
        }

        return next()
    }
}