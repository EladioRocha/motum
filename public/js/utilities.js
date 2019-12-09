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

function setMarker(lat = 0, long = 0, markerId = getCookie('_id'), isMe) {
    if(location.pathname === '/user/map') {
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
}

function removeMarker(id) {
    if(location.pathname === '/user/map') {
        map.removeLayer(markers[id])
        delete markers[id]
    }
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

async function getDataUser() {
    return await sendHttpRequest(null, `/user/profile?token=${getCookie('token')}`, 'GET');
}

function toRad(n) {
 return n * Math.PI / 180;
}

function toDeg(n) {
 return n * 180 / Math.PI;
}

function destVincenty(lat1 = 0, lon1 = 0, brng = -189, dist = 2000) {
    var a = 6378137,
        b = 6356752.3142,
        f = 1 / 298.257223563, // WGS-84 ellipsiod
        s = dist,
        alpha1 = toRad(brng),
        sinAlpha1 = Math.sin(alpha1),
        cosAlpha1 = Math.cos(alpha1),
        tanU1 = (1 - f) * Math.tan(toRad(lat1)),
        cosU1 = 1 / Math.sqrt((1 + tanU1 * tanU1)), sinU1 = tanU1 * cosU1,
        sigma1 = Math.atan2(tanU1, cosAlpha1),
        sinAlpha = cosU1 * sinAlpha1,
        cosSqAlpha = 1 - sinAlpha * sinAlpha,
        uSq = cosSqAlpha * (a * a - b * b) / (b * b),
        A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq))),
        B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq))),
        sigma = s / (b * A),
        sigmaP = 2 * Math.PI;
    while (Math.abs(sigma - sigmaP) > 1e-12) {
    var cos2SigmaM = Math.cos(2 * sigma1 + sigma),
        sinSigma = Math.sin(sigma),
        cosSigma = Math.cos(sigma),
        deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) - B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));
    sigmaP = sigma;
    sigma = s / (b * A) + deltaSigma;
    };
    var tmp = sinU1 * sinSigma - cosU1 * cosSigma * cosAlpha1,
        lat2 = Math.atan2(sinU1 * cosSigma + cosU1 * sinSigma * cosAlpha1, (1 - f) * Math.sqrt(sinAlpha * sinAlpha + tmp * tmp)),
        lambda = Math.atan2(sinSigma * sinAlpha1, cosU1 * cosSigma - sinU1 * sinSigma * cosAlpha1),
        C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha)),
        L = lambda - (1 - C) * f * sinAlpha * (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM))),
        revAz = Math.atan2(sinAlpha, -tmp); // final bearing
    return {
        lat: toDeg(lat2),
        lng: lon1 + toDeg(L),
    };
};

document.addEventListener('click', (e) => {
    if(e.target.id === 'close-session') {
        closeSession()
    }
})

function showToast(message, status) {
    let toast = document.querySelector("#toast"),
        color = '';
    
    if(status === 'OK') {
        color = '#2FD69A'
    } else if(status === 'ALERT') {
        color = '#fa9614'
    } else if(status === 'WARNING') {
        color = '#f52f38'
    }
    toast.style.backgroundColor = color
    toast.innerText = message
    toast.className = "show";
    setTimeout(() => toast.className = toast.className.replace("show", ""), 3000);
}