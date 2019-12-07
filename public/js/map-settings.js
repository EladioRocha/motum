let map, routeControl, markers = {};

// This file include only instances of map and datepicker
(() => {
    //Inicializamos el mapa y le pasamos el id del contenedor html
    map = L.map('map').setView([0,0], 13);
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
    }

    //With this work the input
    
    map.addControl(control);
    
    // Air picker calendar settings
    // Initialization
    $('#datepicker').datepicker({
        language: 'es',
        minDate: new Date(),
        timepicker: true,
        timeFormat: 'hh:ii',
        minHours: 0,
        maxHours: 23,
        minutesStep: 5
    }).data('datepicker')

    collapsible()
    // Load data from localstorage and show information
})()