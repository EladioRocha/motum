function startNow() {
    location.href = '/user/map'
}

function configureView(node) {
    node.classList.add('txt-selected')
    switch (node.innerText) {
        case 'Comunidad':
            // NAVBAR MENU OPTIONS
            node.nextElementSibling.classList.remove('txt-selected')
            node.nextElementSibling.nextElementSibling.classList.remove('txt-selected')
            node.parentElement.lastElementChild.classList.remove('txt-selected')
            changeTItleText(document.querySelector('#history-title'), 'Viajes por salir de la comunidad')

            // LISTENERS
            listenerCommunity()
            break;
        case 'Activos':
            node.parentElement.firstElementChild.classList.remove('txt-selected')
            node.nextElementSibling.classList.remove('txt-selected')
            node.nextElementSibling.nextElementSibling.classList.remove('txt-selected')
            changeTItleText(document.querySelector('#history-title'), 'Tus viajes activos')
            break;
        case 'Reservados':
            node.nextElementSibling.classList.remove('txt-selected')
            node.parentElement.firstElementChild.classList.remove('txt-selected')
            node.parentElement.firstElementChild.nextElementSibling.classList.remove('txt-selected')
            changeTItleText(document.querySelector('#history-title'), 'Tus viajes reservados')
            break;
        case 'Finalizados':
            node.parentElement.firstElementChild.classList.remove('txt-selected')
            node.parentElement.firstElementChild.nextElementSibling.classList.remove('txt-selected')
            node.parentElement.firstElementChild.nextElementSibling.nextElementSibling.classList.remove('txt-selected')
            changeTItleText(document.querySelector('#history-title'), 'Tus viajes finalizados')
            break;
    }
}

function changeTItleText(node, text) {
    node.innerText = text
}

function showCards() {

}

async function initiliziation() {
    for(let node of document.querySelectorAll('.history-navbar-text')) {
        node.addEventListener('click', addSettings)
    }
    await getAllCOmmunityCards()
    listenerCommunity()
    // document.querySelector('#start-now').addEventListener('click', startNow)
}

function addSettings(e) {
    configureView(e.target)
}

function htmlCard ({_id}) {
    console.log(_id)
    return  `<div class="profile-description-container">
                <div class="grid-item-description">
                    <div class="card p-1em">
                        <div class="card-item card-date flex-container">
                            <div class="icon-box flex-container">
                                <i class="far fa-calendar-alt"></i>
                            </div>
                            <div class="text-box">
                                <small class="txt-0-dot-5em">27 Noviembre 2019  - 12:45 pm</small>
                            </div>
                        </div>
                        <div class="card-title flex-container mb-1em">
                            <div class="text-box">
                                <small class="txt-gray-dark fw-bold">Tu viaje con ........</small>
                            </div>
                        </div>
                        <div class="card-item card-origin flex-container">
                            <div class="icon-box">
                                <i class="fas fa-map-marker-alt svg_card"></i>
                            </div>
                            <div class="text-box">
                                <small>Av. de las Ciencias</small>
                            </div>
                        </div>
                        <div class="card-item card-destiny flex-container">
                            <div class="icon-box">
                                <i class="fas fa-map-marker"></i>
                            </div>
                            <div class="text-box">
                                <small>Circuito Universitario</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
}

document.addEventListener('DOMContentLoaded', initiliziation)

// ================================= COMMUNITY CARDS =========================================== //

async function getAllCOmmunityCards() {
    let response = await sendHttpRequest(null, '/user/rides/community/all', 'GET'),
        container = document.querySelector('#community-cards')
    for(let card of response.data) {
        container.innerHTML += htmlCommunityCards(card)
    }
    console.log(response)
}

async function requestRide(e) {
    console.log(e.target.id)
    sendHttpRequest(JSON.stringify({_id: e.target.id}), '/user/rides/request')
}

function htmlCommunityCards({_id, date, originName, destinyName, driver}) {
    return `<div class="profile-description-container">
                    <div class="grid-item-description">
                        <div class="card p-1em">
                            <div class="card-item card-name flex-container">
                                <div class="icon-box">
                                    <img class="icon-profile" src="/assets/img/students/${driver.expedient}.png" alt="Imágen del conductor">
                                </div>
                                <div class="text-box flex-container">
                                    <small class="user-text-name px-1em">${driver.name}</small>
                                </div>
                            </div>
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
                                <div class="text-box">
                                    <button class="btn bg-green txt-white" id="${_id}">Solicitar viaje</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`
}

function listenerCommunity() {
    console.log(document.querySelectorAll('.text-box button'))
    for(let button of document.querySelectorAll('.text-box button')) {
        button.addEventListener('click', requestRide)
    }
}