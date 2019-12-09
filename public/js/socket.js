// let socket = io.connect('http://148.220.208.55:3000/');
// let socket = io.connect('http://192.168.1.73:3000')
// let socket = io.connect('http://192.168.1.77:3000')
let socket = io.connect()
socket.on('connect', () => {
    socket
        .emit('authenticate', {token: getCookie('token')})
        .on('authenticated', async () => {
            console.log('worked', socket.io)
            // let {lat, long} = await getPosition()
            let lat = 21.36161363911997 + Math.random()
            let long = -100.145994012827
            console.log(lat, long)
            socket
                .emit('userCoords', {lat, long})
                .on('userCoords', (data) => {
                    setMarker(data.lat, data.long, data.markerId)
                    console.log(data)
                })
                .on('usersOn', async (data) => {
                    console.log('jejeje', data)
                    await showAllDrivers(data)
                })
                .on('deleteUserMarker', (data) => {
                    removeMarker(data.markerId)
                })
                .on('newConnection', (data) => {
                    console.log(data)
                })
                .on('messageCommunity', (data) => {
                    console.log(data)
                })   
        })
        .on('unauthorized', () => {
            location.href = '/login'
        })
});

// FUNCTION TO WORK WITH HISTORY FILE
function createRoom(_id) { // Create room when the request is accepted
    socket.emit('createRoom', {_id})
}

function createChatRoom(data) {
    socket.emit('createChatRoom', data)
}

function sendMessageToRoom(data) {
    console.log(data)
    socket.emit('sendMessageToRoom', data)
}