let mongoose = require('mongoose'),
    app = require('./server'),
    http = require('http').createServer(app),
    socketioJwt = require("socketio-jwt"),
    path = require('path'),
    Chat = require(path.join(__dirname, 'api', 'models', 'chat')),
    io = require('socket.io')(http);

require('dotenv').config()

mongoose.connect(process.env.DB_DEV, {useNewUrlParser: true})
mongoose.set('useFindAndModify', false)

io.sockets.on('connection', socketioJwt.authorize({
    secret: process.env.JWT_KEY_DEV,
    timeout: 15000 // 15 seconds to send the authentication message
})).on('authenticated', function(socket) {
    let markers = {},
        rooms = {}
    socket
        .on('userCoords', (data) => {
            if(!markers[socket.decoded_token._id]) {
                data.markerId = socket.decoded_token._id
                markers[socket.decoded_token._id] = {socketId: socket.id, latitude: data.lat, longitude: data.long, sessionActive: 1, isMe: true}
                socket
                    .broadcast.emit('userCoords', data)
                    .emit('usersOn', markers)
                markers[socket.decoded_token._id].isMe = false
            } else {
                // This meaning that the user is the same
                markers[socket.decoded_token._id].isMe = true
                markers[socket.decoded_token._id].sessionActive++
                socket.emit('usersOn', markers)
                markers[socket.decoded_token._id].isMe = false
            }
        })
        .on('createRoom', (data) => {
            let keys = [data.driverId, data.rideId].sort()
            let key = keys[0] + keys[1]
            socket.join(data._id)
            io.to(data._id).emit('newConnection', 'Usuario nuevo contectado')
        })
        // .on('createChatRoom', (data) => {
        //     let keys = [data.driverId, data.rideId].sort()
        //     let key = keys[0]+keys[1]
        //     socket.join(key)
        // })
        // .on('sendMessageToRoom', async (data) => {
        //     try {
        //         let keys = 
        //         let key = keys[0]+keys[1]
        //         await Chat.create({
        //             from: socket.decoded_token._id,
        //             to: mongoose.Types.ObjectId(data.driverId),
        //             ride: mongoose.Types.ObjectId(data.rideId),
        //             key,
        //             message: data.message,
        //             createdAt: new Date(),
        //             updatedAt: new Date()
        //         })
        //         io.to(key).emit('messageCommunity')
        //     } catch (error) {
        //         console.log('Ocurrio un error al mandar el mensaje', error)
        //     }

        // })
        .on('disconnect', () => {
            try {
                if(!!markers[socket.decoded_token._id]) {
                    markers[socket.decoded_token._id].sessionActive--
                    if(markers[socket.decoded_token._id].sessionActive === 0) {
                        delete markers[socket.decoded_token._id]
                        socket.broadcast.emit('deleteUserMarker', {markerId: socket.decoded_token._id})
                        console.log('client disconnect')
                    }
                }
            } catch (error) {
                console.log(error)
            }
        })
    //this socket is authenticated, we are good to handle more events from it.
});

http.listen(process.env.PORT_DEV, () => console.log('SERVER ON'))