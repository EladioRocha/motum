let socket = io.connect('http://localhost:3000');
socket.on('connect', () => {
    socket
        .emit('authenticate', {token: localStorage.getItem('token')})
        .on('authenticated', async () => {
            let {lat, long} = await getPosition()
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
        .on('unauthorized', (msg) => {
            alert(`unauthorized: ${JSON.stringify(msg.data.message)}`);
        })
});