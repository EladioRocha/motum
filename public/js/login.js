class Login {
    constructor(e) {
        this._button = e.target
        e.preventDefault()
    }

    getTextInput(selector = 'input') {
        let str = {}
        document.querySelectorAll(selector).forEach((el) => str[el.id] = el.value)
        return JSON.stringify(str)
    }

    redirect() {
        location.href = '/user/map'
    }

    disableButton() {
        this._button.disabled = true
    }

    enableButton() {
        this._button.disabled = false
    }
}

async function main(e) {
    let login = new Login(e)
    if(!existSessionActie()) {
        login.disableButton()
        console.log(login.getTextInput())
        let {user, token} = await sendHttpRequest(login.getTextInput(), '/user/login', 'POST')
        login.enableButton()
        login.redirect()
    }
}

function existSessionActie() {
    return (getCookie('token') !== '') ? true : false 
}

document.querySelector('#btn-login').addEventListener('click', main)
document.addEventListener('DOMContentLoaded', e => {
    if(existSessionActie()) {
        let login = new Login(e)
        login.redirect()
    }
})