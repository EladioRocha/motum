async function sendHttpRequest(body = JSON.stringify({}), url = '/user/auth', method = 'POST', headers = {'Content-Type': 'application/json'}) {
    let response = await fetch(url, {
        method,
        body,
        headers
    })

    return await response.json()
}

function getPosition() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(position => {
                let lat = position.coords.latitude
                let long = position.coords.longitude
                resolve({lat, long})
            })
        } else {
            reject('Geolocalización no es soportado por tu navegador')
        }
    })
}

function setMarker(lat = 0, long = 0, markerId = JSON.parse(localStorage.getItem('user'))._id, isMe) {
    if(!markers[markerId]) {
        markers[markerId] = L.marker([lat, long], {icon: L.icon({
            iconUrl: '/public/img/troyano.png',
            iconSize: [24, 24],
            iconAnchor:   
            [24, 24], // point of the icon which will correspond to marker's location
        })}).addTo(map)
    }

    if(isMe) {
        map.setView([lat, long], 16)
    }
}

function removeMarker(id) {
    map.removeLayer(markers[id])
    delete markers[id]
}

async function showAllDrivers(data) {
    for(let key of Object.keys(data)) {
        setMarker(data[key].latitude, data[key].longitude, key, data[key].isMe)
    }
}

async function closeSession() {
    let data = await sendHttpRequest(JSON.stringify({}), '/user/exit', 'POST')
    if(data.message === 'Se ha cerrado la sesión exitosamente') {
        location.href = '/login'
    }
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    
    return "";
}