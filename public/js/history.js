function startNow() {
    location.href = '/user/map'
}

function changeSelectedText(node) {
    node.classList.add('txt-selected')
    switch (node.innerText) {
        case 'Activos':
            node.nextElementSibling.classList.remove('txt-selected')
            node.nextElementSibling.nextElementSibling.classList.remove('txt-selected')
            changeTItleText(document.querySelector('#history-title'), 'Tus viajes activos')
            break;
        case 'Reservados':
            node.nextElementSibling.classList.remove('txt-selected')
            node.parentElement.firstElementChild.classList.remove('txt-selected')
            changeTItleText(document.querySelector('#history-title'), 'Tus viajes reservados')
            break;
        case 'Finalizados':
            node.parentElement.firstElementChild.classList.remove('txt-selected')
            node.parentElement.firstElementChild.nextElementSibling.classList.remove('txt-selected')
            changeTItleText(document.querySelector('#history-title'), 'Tus viajes finalizados')
            break;
    }
}

function changeTItleText(node, text) {
    node.innerText = text
}

function showCards() {

}

function getAllCards() {
    getData
}

function changeViewHistory(e) {
    changeSelectedText(e.target)
}

async function initiliziation() {
    for(let node of document.querySelectorAll('.history-navbar-text')) {
        node.addEventListener('click', changeViewHistory)
    }
    await getAllCards()
    document.querySelector('#start-now').addEventListener('click', startNow)
}

document.addEventListener('DOMContentLoaded', initiliziation)