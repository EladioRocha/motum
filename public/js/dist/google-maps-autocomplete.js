document.addEventListener('DOMContentLoaded', function () {
    try {
        let autocomplete = [],
            waypoints = [[],[]],
            inputIds = ['searchboxinput-origin', 'searchboxinput-destiny'];
        for(let i = 0; i < 2; i++) {
            autocomplete[i] = new google.maps.places.Autocomplete((document.getElementById(inputIds[i])), {
                types: ['geocode'],
                componentRestrictions: {
                country: "MX",
                }
            });

            google.maps.event.addListener(autocomplete[i], 'place_changed', function () {
                let near_place = autocomplete[i].getPlace();
                if(!!near_place.geometry) {
                    waypoints[i] = [near_place.geometry.location.lat(),near_place.geometry.location.lng()]
                    map.setView([near_place.geometry.location.lat(),near_place.geometry.location.lng()], 13)
    
                    if(waypoints[0].length === 2 && waypoints[1].length === 2) {
                        // The variable routeControl is in the file and too the variable map map.js
                        if(!!routeControl) {
                            routeControl.getPlan().setWaypoints({latLng: L.latLng([0, 0])})
                        }
                        document.querySelector('#searchboxinput-origin').setAttribute('data-lat', waypoints[0][0])
                        document.querySelector('#searchboxinput-origin').setAttribute('data-long', waypoints[0][1])
                        document.querySelector('#searchboxinput-destiny').setAttribute('data-lat', waypoints[1][0])
                        document.querySelector('#searchboxinput-destiny').setAttribute('data-long', waypoints[1][1])
    
                        routeControl = L.Routing.control({
                            waypoints: [
                                L.latLng(waypoints[0][0], waypoints[0][1]),
                                L.latLng(waypoints[1][0], waypoints[1][1])
                            ],
                            draggableWaypoints : false,//to set draggable option to false
                            addWaypoints : false //disable adding new waypoints to the existing path 
                        }).addTo(map);
                    }
                } else {
                    alert('El lugar especificado no existe')
                }
            });
        }        
    } catch (error) {
        console.log(error)
    }

});