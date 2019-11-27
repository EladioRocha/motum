document.addEventListener('click', (e) => {
    if(e.target.id === 'close-session') {
        closeSession()
    }
})

class InputHandle {
    constructor(expedient = '', nip = '', name = '', email = '') {
        this._expedient = expedient
        this._nip = nip
        this._name = name
        this._email = email
    }

    get getExpedient() {
        this._expedient = expedient
    }

    get getNip() {
        this._nip = nip
    }

    get getName() {
        this._name = name
    }

    get getEmail() {
        this._email = email
    }

    set setExpedient(expedient) {
        return this._expedient
    }

    set setNip(nip) {
        return this._nip
    }

    set setName(name) {
        return this._name
    }

    set setEmail(email) {
        return this._email
    }
}

class Profile extends InputHandle {
    constructor(expedient, nip, name, email) {
        super(expedient, nip, name, email)
    }
}

class HandleScreen extends InputHandle {
    constructor() {
        super()
        this._inputs = document.querySelectorAll('.input')
    }

    insertValueInputs(data) {
        this._expedient = data.expedient
        this._nip = data.nip
        this._name = data.name
        this._email = data.email
        let i = 0;
        for(let values of Object.entries(data)) {
            if(this._inputs[i].id === `profile-${values[0]}`) {
                this._inputs[i].parentNode.children[0].innerHTML = ''
                this._inputs[i].value = values[1]
                this._inputs[i].readOnly = true
            }

            i++
        }
    }

    disableInput() {

    }

    enableInput() {

    }
}

document.addEventListener('DOMContentLoaded', async () => {
    if(location.pathname === '/user/profile') {
        handleScreen = new HandleScreen()
        let data = await sendHttpRequest(null, `/user/profile?token=${getCookie('token')}`, 'GET')
        handleScreen.insertValueInputs(data)
    }
})