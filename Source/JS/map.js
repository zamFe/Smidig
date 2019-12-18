var fullRoute = JSON.parse(localStorage.getItem("route"));
var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 63.1143, lng: 7.7343 },
        zoom: 8
    });

    let index = new URLSearchParams(window.location.search).get("index");

    for (var i = 0; i < fullRoute[index].route.length; i++) {
        //console.log(fullRoute[index].route[i])

        for (var j = 0; j < fullRoute[index].route[i].waypoints.shapes.length; j++) {


            console.log(fullRoute[index].route[i].waypoints.color.red, fullRoute[index].route[i].waypoints.color.green, fullRoute[index].route[i].waypoints.color.blue)
            //console.log('#' + fullRoute[index].route[i].waypoints.color.red.toString(16) + fullRoute[index].route[i].waypoints.color.green.toString(16) + fullRoute[index].route[i].waypoints.color.blue.toString(16))

            var cascadiaFault = new google.maps.Polyline({
                strokeColor: '#' + fullRoute[index].route[i].waypoints.color.red.toString(16) + fullRoute[index].route[i].waypoints.color.green.toString(16) + fullRoute[index].route[i].waypoints.color.blue.toString(16),
                strokeOpacity: 1,
                strokeWeight: 100,
                path: google.maps.geometry.encoding.decodePath(fullRoute[index].route[i].waypoints.shapes[j].encodedWaypoints)
            });

            cascadiaFault.setMap(map);
        }
    }

}

fetch(`${window.location.origin}?action=getmap`)
    .then(function(response) {
        return response.text();
    }).then(function(text) {
        console.log(JSON.parse(text));
        document.getElementById("googleMap").innerHTML = JSON.parse(text).response.body;
    })