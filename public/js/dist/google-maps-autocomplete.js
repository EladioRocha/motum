document.addEventListener('DOMContentLoaded', function () {
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
            waypoints[i] = [near_place.geometry.location.lat(),near_place.geometry.location.lng()]
            map.setView([near_place.geometry.location.lat(),near_place.geometry.location.lng()], 13)
            if(waypoints[0].length === 2 && waypoints[1].length === 2) {
                // The variable routeControl is in the file and too the variable map map.js
                if(!!routeControl) {
                    routeControl.getPlan().setWaypoints({latLng: L.latLng([0, 0])})
                }
                routeControl = L.Routing.control({
                    waypoints: [
                        L.latLng(waypoints[0][0], waypoints[0][1]),
                        L.latLng(waypoints[1][0], waypoints[1][1])
                    ],
                    draggableWaypoints : false,//to set draggable option to false
                    addWaypoints : false //disable adding new waypoints to the existing path 
                }).addTo(map);
            }
        });
    }
});