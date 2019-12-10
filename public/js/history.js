function startNow() {
    location.href = '/user/map'
}

async function configureView(node) {
    let container = document.querySelector('#container-cards')
    node.classList.add('txt-selected')
    cleanContainerCards(node)
    
    switch (node.innerText) {
        case 'Comunidad':
            // NAVBAR MENU OPTIONS
            node.parentElement.children[1].classList.remove('txt-selected')
            node.parentElement.children[2].classList.remove('txt-selected')
            node.parentElement.children[3].classList.remove('txt-selected')
            node.parentElement.children[4].classList.remove('txt-selected')
            changeTItleText(document.querySelector('#history-title'), 'Viajes proximos de la comunidad')
            // LISTENERS AND REQUESTS
            let {add, notDriver} = await getAllCards(container, '/user/rides/community/all')
            addFirstSubtitle()
            console.log(add)
            if(add) {
                addLastSubtitle()
                for(let html of notDriver) {
                    document.querySelector(`#container-cards`).innerHTML += html
                }
            }
            listenersCommunity()
            break;
        case 'Activos':
            node.parentElement.children[0].classList.remove('txt-selected')
            node.parentElement.children[2].classList.remove('txt-selected')
            node.parentElement.children[3].classList.remove('txt-selected')
            node.parentElement.children[4].classList.remove('txt-selected')
            changeTItleText(document.querySelector('#history-title'), 'Tus viajes activos')
            await getAllCards(container, '/user/rides/active/all', htmlPendingAndActiveCards, 'car-image', 'Aún no tienes viajes activos')
            addFirstSubtitle()
            listenersActive()
            break;
        case 'Pendientes':
            node.parentElement.children[0].classList.remove('txt-selected')
            node.parentElement.children[1].classList.remove('txt-selected')
            node.parentElement.children[3].classList.remove('txt-selected')
            node.parentElement.children[4].classList.remove('txt-selected')
            changeTItleText(document.querySelector('#history-title'), 'Tus viajes por empezar')

            await getAllCards(container, '/user/rides/pending/all', htmlPendingAndActiveCards, 'request-image', 'No tienes viajes pendientes')
            listenersPending()
            if(document.querySelector('#chat')) {
                document.querySelector('#chat').style.display = 'none'
                document.querySelector('#close-chat').addEventListener('click', closeChat)
                document.querySelector('#open-chat').addEventListener('click', openChat)
                document.querySelector('#send-message').addEventListener('click', sendMessage)
            }
            break;
        case 'Finalizados':
            node.parentElement.children[0].classList.remove('txt-selected')
            node.parentElement.children[1].classList.remove('txt-selected')
            node.parentElement.children[2].classList.remove('txt-selected')
            node.parentElement.children[4].classList.remove('txt-selected')
            changeTItleText(document.querySelector('#history-title'), 'Tus viajes finalizados')

            await getAllCards(container, '/user/rides/finished/all', htmlPendingAndActiveCards, 'finished-image', 'No tienes viajes finalizados')
            break;
        case 'Peticiones':
            node.parentElement.children[0].classList.remove('txt-selected')
            node.parentElement.children[1].classList.remove('txt-selected')
            node.parentElement.children[2].classList.remove('txt-selected')
            node.parentElement.children[3].classList.remove('txt-selected')
            changeTItleText(document.querySelector('#history-title'), 'Peticiones de viajeros')

            await getAllCards(container, '/user/rides/request/all', htmlRequestCard, 'work-image', 'No tìenes peticiones pendientes')
            listenersRequest()
            break;
    }
}

function addFirstSubtitle(text = 'Conductores') {
    document.querySelector('#subtitle').innerHTML = `<h3>${text}</h3>`
}

function addLastSubtitle(text = 'Pasajeros') {
    document.querySelector('#container-cards').innerHTML += `<div class="mb-2em mt-2em" id="last-subtitle"><h3>${text}</h3></div>`
}

function changeTItleText(node, text) {
    node.innerText = text
}

function cleanContainerCards(node) {
    node.parentElement.nextElementSibling.nextElementSibling.innerHTML = ''
}

async function initiliziation() {
    let nodes = document.querySelectorAll('.history-navbar-text')
    for(let node of nodes) {
        node.addEventListener('click', addSettings)
    }
    if(localStorage.getItem('pending')) {
        nodes[0].classList.remove('txt-selected')
        nodes[2].classList.add('txt-selected')
        changeTItleText(document.querySelector('#history-title'), 'Tus viajes por empezar')

        await getAllCards(undefined, '/user/rides/pending/all', htmlPendingAndActiveCards, 'request-image', 'No tienes viajes pendientes')
        listenersPending()
        localStorage.clear()
    } else {
        let {add, notDriver} = await getAllCards(undefined, '/user/rides/community/all')
        addFirstSubtitle()
        console.log(add)
        if(add) {
            addLastSubtitle()
            for(let html of notDriver) {
                document.querySelector(`#container-cards`).innerHTML += html
            }
            document.querySelector('#container-cards').classList.add('p-1em')
        }
        listenersCommunity()
    }

    if(document.querySelector('#chat')) {
        document.querySelector('#chat').style.display = 'none'
        document.querySelector('#close-chat').addEventListener('click', closeChat)
        document.querySelector('#open-chat').addEventListener('click', openChat)
        document.querySelector('#send-message').addEventListener('click', sendMessage)
    }
}

async function addSettings(e) {
    await configureView(e.target)
}

async function getAllCards(container = document.querySelector('#container-cards'), url = '/user/rides/community/all', html = htmlCommunityCards, className = 'community-image', text) {
    let response = await sendHttpRequest(null, url, 'GET'),
        result = (response.data.length === 0) ? showDefaultImg(className, text) : cleanDefaultImg(),
        notDriver = [];

    console.log(response)
    for(let card of response.data) {
        if(!!card.driver || className !== 'community-image') {
            result += html(card, response)
        } else {
            notDriver.push(html(card, response))
        }
    }
    container.innerHTML = result
    if(response.data.length === 0) {
        document.querySelector('#start-now').addEventListener('click', startNow)
    }
    return (notDriver.length > 0) ? {add: true, notDriver} : {add: false} 
}

function showDefaultImg(className = 'community-image', text = 'Aún no hay viajes') {
    return `
        <div class="profile-options p-1em grid-container" id="default-blank-history">
            <div class="bg-default-container flex-container">
                <div class="bg-default-history ${className} mb-2em"></div>
                <h2><span id="text-default-history">${text}</span> <span id="start-now">¡Empieza haciendo uno!</span></h2>
            </div>
        </div>
    `
}

function cleanDefaultImg() {
    if(document.querySelector('#default-blank-history')) document.querySelector('#default-blank-history').remove();
    return ''
}

document.addEventListener('DOMContentLoaded', initiliziation)

// ================================= COMMUNITY CARDS =========================================== //

function sendMessage(e) {
    sendMessageToRoom({driverId: e.target.getAttribute('data-id-user'), rideId: e.target.getAttribute('data-id-ride'), message: e.target.value})
}

async function createRoomOfChat(e) {
    let keys = [e.target.parentElement.parentElement.getAttribute('data-id-user'), e.target.parentElement.parentElement.getAttribute('data-id-ride')].sort(),
        key = keys[0]+keys[1],
        response = await sendHttpRequest(null, `/user/messages/${key}/${e.target.parentElement.parentElement.getAttribute('data-id-ride')}`, 'GET');

    console.log(keys)
    createChatRoom({driverId: e.target.parentElement.parentElement.getAttribute('data-id-user'), rideId: e.target.parentElement.parentElement.getAttribute('data-id-ride')})
}

async function requestRide(e) {
    
    let response = await sendHttpRequest(JSON.stringify({_id: e.target.id}), '/user/rides/request')
    console.log(response)
    showToast(response.message, response.status)
}

function closeChat() {
    document.querySelector('#chat').style.display = 'none'
}

function openChat(e) {
    document.querySelector('#chat').style.display = 'block'
    createRoomOfChat(e)
}

function htmlCommunityCards({_id, date, originName, destinyName, driver, riders}) {
    return  `   <div>
                    <div class="p-1em flex-container card-position">
                            <div class="card p-1em">
                                ${!!driver 
                                    ? 
                                    `
                                    <div class="card-item card-name flex-container">
                                        <div class="icon-box">
                                            <img class="icon-profile" src="/assets/img/students/${driver.expedient}.png" alt="Imágen del conductor">
                                        </div>
                                        <div class="text-box flex-container">
                                            <small class="user-text-name px-1em">${driver.name}</small>
                                        </div>
                                    </div>
                                    `
                                    :
                                    `
                                    <div class="card-item card-name flex-container">
                                        <div class="icon-box">
                                            <img class="icon-profile" src="/assets/img/students/${riders[0].expedient}.png" alt="Imágen del conductor">
                                        </div>
                                        <div class="text-box flex-container">
                                            <small class="user-text-name px-1em fw-600">${riders[0].name}</small>
                                        </div>
                                    </div>
                                    `
                                } 

                                <div class="card-item card-date flex-container">
                                    <div class="icon-box">
                                        <i class="far fa-calendar-alt"></i>
                                    </div>
                                    <div class="text-box">
                                        <small class="txt-0-dot-5em px-1em">${date}</small>
                                    </div>
                                </div>
                                <div class="card-item card-origin flex-container">
                                    <div class="icon-box">
                                        <i class="fas fa-map-marker-alt svg_card"></i>
                                    </div>
                                    <div class="text-box">
                                        <small class="px-1em">${originName}</small>
                                    </div>
                                </div>
                                <div class="card-item card-destiny flex-container">
                                    <div class="icon-box">
                                        <i class="fas fa-map-marker"></i>
                                    </div>
                                    <div class="text-box">
                                        <small class="px-1em">${destinyName}</small>
                                    </div>
                                </div>
                                <div class="card-item card-button flex-container mt-1em">
                                    <div class="text-box flex-container" style="width: 100%; justify-content: space-between;">
                                        ${!!driver 
                                        ? 
                                        `
                                        <button class="btn bg-green txt-white" id="${_id}" data-title="accept">Solicitar viaje</button>
                                        `
                                        :
                                        `<button class="btn bg-green txt-white" id="${_id}" data-title="accept">Hechar ride</button>`
                                        }
                                        <span id="open-chat" style="display: none;" data-id-user="${driver._id}" data-id-ride="${_id}"><i class="fas fa-comment-dots fa-2x" ></i></span>
                                    </div>
                                </div>
                                <div class="chat-popup" id="chat" style="display: none">
                                    <div class="chat-container">
                                        <textarea disabled placeholder="No tienes ningùn mensaje" name="msg" required></textarea>
                                        <input type="text" class="px-1em mb-1em chat-message" placeholder="Mandale un mensaje a ${driver.name}"></input>
                                        <button type="submit" class="btn bg-green txt-white" id="send-message" data-id-user="${driver._id}" data-id-ride="${_id}">Enviar</button>
                                        <button type="button" class="btn bg-gray txt-black fw-bold" id="close-chat">Cerrar</button>
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>`
}

function listenersCommunity() {
    console.log(document.querySelectorAll('.text-box button'))
    for(let button of document.querySelectorAll('.text-box button')) {
        console.log(button)
        button.addEventListener('click', requestRide)
    }
}

// ================================= REQUEST CARDS =========================================== //

async function requestAcceptOrReject(e) {
    let accepted = (e.target.getAttribute('data-title') === 'accept') ? true : false,
        response = await sendHttpRequest(JSON.stringify({_id: e.target.id, accepted, reason: 'Probando el botón'}), '/user/rides/request', 'PUT');
    
    e.target.parentElement.parentElement.parentElement.parentElement.parentElement.remove()
    showToast(response.message, response.status)
}

function listenersRequest() {
    for(let button of document.querySelectorAll('.text-box button')) {
        button.addEventListener('click', requestAcceptOrReject)
    }
}

function htmlRequestCard ({_id, rider}) {
    return  `<div>
                <div class="p-1em flex-container card-position">
                    <div class="card p-1em">
                        <!--
                        <div class="card-item card-date flex-container">
                            <div class="icon-box flex-container">
                                <i class="far fa-calendar-alt"></i>
                            </div>
                            <div class="text-box">
                                <small class="txt-0-dot-5em">27 Noviembre 2019  - 12:45 pm</small>
                            </div>
                        </div>
                        -->
                        <div class="card-item card-name flex-container">
                            <div class="icon-box">
                                <img class="icon-profile" src="/assets/img/students/${rider.expedient}.png" alt="Imágen del conductor">
                            </div>
                            <div class="text-box flex-container">
                                <small class="user-text-name px-1em">${rider.name}</small>
                            </div>
                        </div>
                        <div class="card-item card-college flex-container">
                            <div class="icon-box">
                                <i class="fas fa-university"></i>
                            </div>
                            <div class="text-box">
                                <small>${rider.college}</small>
                            </div>
                        </div>
                        <div class="card-item card-career flex-container">
                            <div class="icon-box">
                                <i class="fas fa-graduation-cap"></i>
                            </div>
                            <div class="text-box">
                                <small>${rider.career}</small>
                            </div>
                        </div>
                        <div class="card-item card-button flex-container mt-1em">
                            <div class="text-box flex-container" style="width: 100%; justify-content: flex-start;">
                                <button class="btn bg-green txt-white" id="${_id}">Aceptar viaje</button>
                                <button class="btn ml-1em bg-gray txt-black fw-bold" id="${_id}">Rechazar viaje</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
}

// ================================= PENDING CARDS =========================================== //

function htmlPendingAndActiveCards ({_id, date, originName, destinyName, riders, driver, active}, {self}) {
    return  `<div">
                <div class="p-1em flex-container card-position">
                    <div class="card p-1em">
                        <div class="card-item card-date flex-container">
                            <div class="icon-box flex-container">
                                <i class="far fa-calendar-alt"></i>
                            </div>
                            <div class="text-box">
                                <small class="txt-0-dot-5em">${date}</small>
                            </div>
                        </div>
                        <div class="card-item card-name flex-container">
                                ${!!driver 
                                ? 
                                `<div class="icon-box">
                                    <img class="icon-profile" src="/assets/img/students/${driver.expedient}.png" alt="Imágen del conductor">
                                </div>
                                <div class="text-box flex-container">
                                    <small class="user-text-name px-1em">${driver.name}</small>
                                </div>` 
                                : 
                                
                                `<div class="icon-box"></div>
                                <div class="text-box flex-container">
                                    <small class="user-text-name px-1em">Sin conductor</small>
                                </div>`
                                }
                        </div>
                        <div class="card-item card-origin flex-container">
                            <div class="icon-box">
                                <i class="fas fa-map-marker-alt svg_card"></i>
                            </div>
                            <div class="text-box">
                                <small>${originName}</small>
                            </div>
                        </div>
                        <div class="card-item card-destiny flex-container">
                            <div class="icon-box">
                                <i class="fas fa-map-marker"></i>
                            </div>
                            <div class="text-box">
                                <small>${destinyName}</small>
                            </div>
                        </div>
                        <div class="card-item card-destiny flex-container">
                            <div class="icon-box">
                                <i class="fas fa-user-friends"></i>
                            </div>
                            <div class="text-box">
                                <small>${riders.length}</small>
                            </div>
                        </div>
                        <div class="card-item card-button flex-container mt-1em">
                            <div class="text-box flex-container" style="width: 100%; justify-content: space-between">
                                ${!!driver ? `${(self === driver._id) ? `<button class="btn bg-green txt-white" id="${_id}">${(active) ? 'Finalizar viaje' : 'Empezar viaje'}</button>` : ''}` : ''}            
                                <span id="open-chat" style="display: none;" data-id-user="${driver._id}" data-id-ride="${_id}"><i class="fas fa-comment-dots fa-2x" ></i></span>
                            </div>
                        </div>
                        <div class="chat-popup" id="chat" style="display: none">
                            <div class="chat-container">
                                <textarea disabled placeholder="No tienes ningùn mensaje" name="msg" required></textarea>
                                <input type="text" class="px-1em mb-1em chat-message" placeholder="Mandale un mensaje a ${driver.name}"></input>
                                <button type="submit" class="btn bg-green txt-white" id="send-message" data-id-user="${driver._id}">Enviar</button>
                                <button type="button" class="btn bg-gray txt-black fw-bold" id="close-chat">Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
}

async function startRide(e) {
    let response = await sendHttpRequest(JSON.stringify({_id: e.target.id}), '/user/rides/start', 'PUT'), // DESCOMENTAR AL FINALIZAR SOCKET
        data  = response.data;

    e.target.parentElement.parentElement.parentElement.parentElement.parentElement.remove()
    createRoom(data._id)

    localStorage.setItem('origin', JSON.stringify(data.originCoordinates))
    localStorage.setItem('destiny', JSON.stringify(data.destinyCoordinates))

    // location.replace('/user/map')
    console.log(response)
}

function listenersPending() {
    for(let button of document.querySelectorAll('.text-box button')) {
        button.addEventListener('click', startRide)
    }
}

// ================================= ACTIVE CARDS =========================================== //

async function endRide(e) {
    let response = await sendHttpRequest(JSON.stringify({_id: e.target.id}), '/user/rides/end', 'PUT');
    showToast(response.message)
    e.target.parentElement.parentElement.parentElement.parentElement.parentElement.remove()
}

function listenersActive() {
    for(let button of document.querySelectorAll('.text-box button')) {
        button.addEventListener('click', endRide)
    }
}

// ================================= END RIDES CARDS =========================================== //