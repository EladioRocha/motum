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
        reserved: (document.querySelector('#reserve').checked) ? true: false
    }), '/user/ride');
    console.log(response)
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

async function initiliziation() {
    let {expedient, name, isDriver} = await getDataUser()
    setUserImage(`/assets/img/students/${expedient}.png`)
    setUserName(name)
    showMenuBottomIfIsDriver(isDriver)
    document.querySelector('#now').addEventListener('click', hideDateInput)
    document.querySelector('#reserve').addEventListener('click', showDateInput)
    document.querySelector('#searchboxride').addEventListener('click', takeAride)
}

document.addEventListener('DOMContentLoaded', initiliziation)