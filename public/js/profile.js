class InputHandle {
    constructor(expedient = '', nip = '', name = '', email = '', driver = false) {
        this._expedient = expedient
        this._nip = nip
        this._name = name
        this._email = email
        this._driver = driver
    }

    get getExpedient() {
        return this._expedient
    }

    get getNip() {
        return this._nip
    }

    get getName() {
        return this._name
    }

    get getEmail() {
        return this._email
    }

    get getDriver() {
        return this._driver
    }

    set setExpedient(expedient) {
        this._expedient = expedient
    }

    set setNip(nip) {
        this._nip = nip
    }

    set setName(name) {
        this._name = name
    }

    set setEmail(email) {
        this._email = email
    }

    set setDriver(driver) {
        this._driver = driver
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
        this._inputs = document.querySelectorAll('input.input')
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

    async updateStatusDriver(e) {
        let isDriver = (e.target.checked) ? true : false
        await sendHttpRequest(JSON.stringify({isDriver}), '/user/updateStatusDriver', 'PUT')
    }

    checkInputIfIsDriver(isDriver) {
        if(isDriver) {
            document.querySelector('#driver').checked = true
        }
    }
}

async function initialization() {
    let handleScreen = new HandleScreen(),
        {expedient, nip, name, email, isDriver} = await getDataUser();
    handleScreen.insertValueInputs({expedient, nip, name, email})
    handleScreen.checkInputIfIsDriver(isDriver)
    document.querySelector('#driver').addEventListener('click', handleScreen.updateStatusDriver)
}

document.addEventListener('DOMContentLoaded', initialization)