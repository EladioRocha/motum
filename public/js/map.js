function hideDateInput(e) {
    document.querySelector('#reserve').removeAttribute('checked')
    e.target.setAttribute('checked', true)
    document.querySelector('#item-4').firstElementChild.lastElementChild.firstElementChild.firstElementChild.setAttribute('disabled', true)
}

function showDateInput(e) {
    document.querySelector('#now').removeAttribute('checked')
    e.target.setAttribute('checked', true)
    document.querySelector('#item-4').firstElementChild.lastElementChild.firstElementChild.firstElementChild.removeAttribute('disabled')
}

async function takeAride() {
    let origin = date = isDriver = '',
        currentDate = new Date;
    origin = document.querySelector('#searchboxinput-origin')
    destiny = document.querySelector('#searchboxinput-destiny')
    date = (document.querySelector('#reserve').checked) ? document.querySelector('#datepicker').value : `${[currentDate.getDate(), currentDate.getMonth()+1, currentDate.getFullYear()].join('/')} ${[currentDate.getHours(), currentDate.getMinutes()].join(':')}`
    isDriver = (document.querySelector('#driver').checked) ? true : false
    let originCoordinates = {lat: origin.getAttribute('data-lat'), long: origin.getAttribute('data-long')},
    destinyCoordinates = {lat: destiny.getAttribute('data-lat'), long: destiny.getAttribute('data-long')},
    response = await sendHttpRequest(JSON.stringify({
        originName: origin.value,
        destinyName: destiny.value,
        date,
        isDriver,
        originCoordinates,
        destinyCoordinates,
        hour: date.split(' ').pop(),
        reserved: (document.querySelector('#reserve').checked) ? true: false,
        aroundOriginCoordinates: destVincenty(parseFloat(originCoordinates.lat), parseFloat(originCoordinates.long), 90, 2000),
        aroundDestinyCoordinates: destVincenty(parseFloat(destinyCoordinates.lat), parseFloat(destinyCoordinates.long), -90, 2000)
    }), '/user/rides/add');
    console.log(response)
    showToast(response.message, response.status)
    if(response.status === 'OK') {
        cleanInputs(origin, destiny, document.querySelector('#datepicker'))
        createRoom('1')
        if(!!document.querySelector('#now').getAttribute('checked') && !!document.querySelector('#driver').getAttribute('checked')) {
            localStorage.setItem('pending', 'true')
            location.href = '/user/history'
        }
    }
}

function cleanInputs(origin, destiny, date) {
    origin.value = ''
    destiny.value = ''
    date.value = ''
}

function setUserImage(image) {
    document.querySelector('#user-img').src = image
}

function setUserName(name) {
    document.querySelector('#user-name').innerText = name.split(' ').pop().split('').map((letter, i) => (i === 0) ? letter : letter.toLowerCase()).join('')
}

function showMenuBottomIfIsDriver(isDriver) { 
    if(isDriver) {
        let rootContainer = document.querySelector('.controlbox-container'),
            menuBottomHtml = `
            <div class="controlbox mt-1em" style="top: 170px; z-index: 1000;" id="item-6">
                <div class="searchbox searchbox-shadow bg-gray" style="border-radius:20px"> 
                    <div class="searchbox-menu-container">
                        <button aria-label="Menu" id="searchbox-like-driver" class="car-icon searchbox-menubutton"></button> 
                    </div>
                    <div class="active-options">
                        <div class="controlbox-input-checkbox">
                            <input class="inp-cbx" checked="true" id="rider" type="radio"  name="rider-or-driver" style="display: none;" /><label class="cbx" for="rider"><span><svg width="12px" height="10px" viewbox="0 0 12 10"><polyline points="1.5 6 4.5 9 10.5 1"></polyline></svg></span><span>Pasajero</span></label>
                            <input class="inp-cbx" id="driver" type="radio" name="rider-or-driver" style="display: none;" /><label class="cbx" for="driver"><span><svg width="12px" height="10px" viewbox="0 0 12 10"><polyline points="1.5 6 4.5 9 10.5 1"></polyline></svg></span><span>Conductor</span></label>
                        </div>
                    </div>
                </div>
            </div>`;

        rootContainer.insertAdjacentHTML('beforeend', menuBottomHtml)
    }
}

function changeStatusRiderOrDriver(e) {
    e.target.setAttribute('checked', true)
    if(e.target.id === 'rider') {
        document.querySelector('#driver').removeAttribute('checked')
    } else {
        document.querySelector('#rider').removeAttribute('checked')
    }

    console.log(e.target)
}

async function initiliziation() {
    let {expedient, name, isDriver} = await getDataUser(),
        flagMarkers = {lat1: 0, long1: 0, marker1: 0, lat2: 0, long2: 0, marker2: 0, counter: 0};
    if(localStorage.getItem('origin') && localStorage.getItem('origin')) {
        showRidePath(true)
    }
    setUserImage(`/assets/img/students/${expedient}.png`)
    setUserName(name)
    showMenuBottomIfIsDriver(isDriver)
    document.querySelector('#now').addEventListener('click', hideDateInput)
    document.querySelector('#reserve').addEventListener('click', showDateInput)
    document.querySelector('#rider').addEventListener('click', changeStatusRiderOrDriver)
    document.querySelector('#driver').addEventListener('click', changeStatusRiderOrDriver)
    document.querySelector('#searchboxride').addEventListener('click', takeAride)
    map.on('click', (e) => setClickMarker(e, flagMarkers))
    localStorage.clear()
}

function showRidePath(rideStarted = false) {
    let {lat: lat1, long: lon1} = JSON.parse(localStorage.getItem('origin'))
    let {lat: lat2, long: lon2} = JSON.parse(localStorage.getItem('destiny'))
    if(rideStarted) {
        map.setView([lat1, lon1], 13)
        let marker1 = new L.marker({lat: lat1, lng: lon1}).addTo(map)
        let marker2 = new L.marker({lat: lat2, lng: lon2}).addTo(map)
    }
    putLatLngDataInput(lat1, lon1, lat2, lon2)
}

function insertPathIntoMap(lat1, lon1, lat2, lon2) {
    routeControl = L.Routing.control({
        waypoints: [
          L.latLng(lat1, lon1),
          L.latLng(lat2, lon2)
        ],
        draggableWaypoints : false,//to set draggable option to false
        addWaypoints : false //disable adding new waypoints to the existing path 
    }).addTo(map);
    putLatLngDataInput(lat1, lon1, lat2, lon2)
}

function setClickMarker(e, flagMarkers) {
    console.log(e.latlng)
    let marker = new L.marker(e.latlng).addTo(map)
    flagMarkers.counter++
    if (flagMarkers.counter === 3) {
        flagMarkers.counter = 1
        map.removeLayer(flagMarkers.marker1)
        map.removeLayer(flagMarkers.marker2)
    }
    if(!!routeControl) {
        routeControl.getPlan().setWaypoints({latLng: L.latLng([0, 0])})
    }
    if(flagMarkers.counter === 1) {
        flagMarkers.lat1 = e.latlng.lat
        flagMarkers.lon1 = e.latlng.lng
        map.setView([flagMarkers.lat1, flagMarkers.lon1], 13)
        flagMarkers.marker1 = marker
        // var geocoder = new google.maps.Geocoder;
        // geocoder.geocode( { 'location': {lat: flagMarkers.lat1, lng: flagMarkers.lon1} }, (results, status) => {
        //     console.log(results)
        // });
    } else if(flagMarkers.counter === 2) {
        flagMarkers.lat2 = e.latlng.lat
        flagMarkers.lon2 = e.latlng.lng
        map.setView([flagMarkers.lat2, flagMarkers.lon2], 13)
        flagMarkers.marker2 = marker
    }
    if(!!flagMarkers.lat1 && !!flagMarkers.lon1 && !!flagMarkers.lat2 && !!flagMarkers.lon2) {
        insertPathIntoMap(flagMarkers.lat1, flagMarkers.lon1, flagMarkers.lat2, flagMarkers.lon2)
    }
}

function putLatLngDataInput(lat1, lon1, lat2, lon2) {
    let origin = document.querySelector('#searchboxinput-origin'),
        destiny = document.querySelector('#searchboxinput-destiny');
    
    origin.setAttribute('data-lat', lat1)
    origin.setAttribute('data-lon', lon1)
    origin.value = 'Origen'
    destiny.setAttribute('data-lat', lat2)
    destiny.setAttribute('data-lon', lon2)
    destiny.value = 'Destino'
}


document.addEventListener('DOMContentLoaded', initiliziation)