(() => {
    //Inicializamos el mapa y le pasamos el id del contenedor html
    let map = L.map('map').setView([51.505, -0.09], 13);

    //Mandamos a llamar el mapa y le pasamos una configuración por defecto, incluyendo el token
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZWxhZGlvcm9jaGEiLCJhIjoiY2syOTd6NjlhMThtMDNncWhjb3FvazBicyJ9.7zHOqJy7Oc4yOnFrXqDi1Q', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiZWxhZGlvcm9jaGEiLCJhIjoiY2syOTd6NjlhMThtMDNncWhjb3FvazBicyJ9.7zHOqJy7Oc4yOnFrXqDi1Q'
    }).addTo(map)
    
    map.zoomControl.setPosition('bottomright')
    
    //Aquí empieza el plugin para agregar la barra de buscador, Inicializamos la variable searchboxControl llamado al método
    let searchboxControl = createSearchboxControl();

    //Instanciamos un objeto de la clase searchboxControl y le tenemos que pasar por parametro el sideBarTitleText
    let control = new searchboxControl({
        sidebarTitleText: 'Header'
    });

    // Nos retornara los valores buscados
    control._searchfunctionCallBack = function (searchkeywords) {
        if (!searchkeywords) {
            searchkeywords = "The search call back is clicked !!"
        }
        alert(searchkeywords);
    }
    map.addControl(control);

    //Buscador de lugares
    let countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central Arfrican Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cuba","Curacao","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauro","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","North Korea","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];

    autocomplete(countries)
    collapsible()

    // Air picker calendar settings
    // Initialization
    let datepicker = $('#datepicker').datepicker({
        language: 'es',
        minDate: new Date(),
        timepicker: true,
        timeFormat: 'hh:ii',
        minHours: 0,
        maxHours: 23,
        minutesStep: 5
    }).data('datepicker')

    // Load data from localstorage and show information
    let user = JSON.parse(localStorage.getItem('user'))
    document.querySelector('#user-name').innerText = user.name
    document.querySelector('#user-img').src = user.profilePictureUaq

})()

