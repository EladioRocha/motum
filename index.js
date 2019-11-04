let mongoose = require('mongoose'),
    app = require('./server'),
    http = require('http').createServer(app),
    socketioJwt = require("socketio-jwt"),
    io = require('socket.io')(http);

require('dotenv').config()

mongoose.connect(process.env.DB_DEV, {useNewUrlParser: true})

let markers = {}

io.sockets.on('connection', socketioJwt.authorize({
    secret: process.env.JWT_KEY_DEV,
    timeout: 15000 // 15 seconds to send the authentication message
})).on('authenticated', function(socket) {
    console.log('working')
    socket
        .on('userCoords', (data) => {
            console.log('jeje')
            if(!markers[socket.decoded_token._id]) {
                data.markerId = socket.decoded_token._id
                markers[socket.decoded_token._id] = {socketId: socket.id, latitude: data.lat, longitude: data.long, sessionActive: 1, isMe: true}
                socket
                    .broadcast.emit('userCoords', data)
                    .emit('usersOn', markers)
                markers[socket.decoded_token._id].isMe = false
            } else {
                // This meaning the user is the same
                markers[socket.decoded_token._id].isMe = true
                markers[socket.decoded_token._id].sessionActive++
                socket.emit('usersOn', markers)
                markers[socket.decoded_token._id].isMe = false
            }
        })
        .on('disconnect', () => {
            markers[socket.decoded_token._id].sessionActive--
            if(markers[socket.decoded_token._id].sessionActive === 0) {
                delete markers[socket.decoded_token._id]
                socket.broadcast.emit('deleteUserMarker', {markerId: socket.decoded_token._id})
                console.log('client disconnect')
            }
        })
    //this socket is authenticated, we are good to handle more events from it.
});

http.listen(process.env.PORT_DEV, () => console.log('SERVER ON'))