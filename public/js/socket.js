// let socket = io.connect('http://148.220.208.55:3000/');
// let socket = io.connect('http://192.168.1.73:3000')
let socket = io.connect('http://localhost:3000/')
socket.on('connect', () => {
    socket
        .emit('authenticate', {token: localStorage.getItem('token')})
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
                
        })
        .on('unauthorized', () => {
            location.href = '/'
        })
});