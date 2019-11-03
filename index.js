let mongoose = require('mongoose'),
    app = require('./server');
require('dotenv').config()

mongoose.connect(process.env.DB_DEV, {useNewUrlParser: true})

app.listen(process.env.PORT_DEV, () => console.log('SERVER ON'))