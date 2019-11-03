async function main(e) {
    e.preventDefault()
    let {user, token} = await sendHttpRequest(getInputText(), '/user/login', 'POST')
    saveDataInLocalStorage(user, token)
    location.href = '/user/map'
}

function saveDataInLocalStorage(user, token) {
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', token)
}

function getInputText(selector = 'input') {
    let str = {}
    document.querySelectorAll(selector).forEach((el) => str[el.id] = el.value)
    return JSON.stringify(str)
}

document.querySelector('#btn-login').addEventListener('click', main)