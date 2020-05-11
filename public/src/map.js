var fullRoute = JSON.parse(localStorage.getItem("route"));
let index = new URLSearchParams(window.location.search).get("index");
var map;

let coordFrom = {
    lat: fullRoute[index].route[0].from.lat,
    lng: fullRoute[index].route[0].from.lng
}

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: coordFrom,
        zoom: 12
    });

    let bounds = new google.maps.LatLngBounds();

    for (var i = 0; i < fullRoute[index].route.length; i++) {

        for (var j = 0; j < fullRoute[index].route[i].waypoints.shapes.length; j++) {
           
            /*
            if(fullRoute[index].route[i].waypoints.shapes[j].travelled) {
                continue;
            }
            */

            let shapes = google.maps.geometry.encoding.decodePath(fullRoute[index].route[i].waypoints.shapes[j].encodedWaypoints)
            
            var cascadiaFault = new google.maps.Polyline({
                strokeColor: '#' + fullRoute[index].route[i].waypoints.color.red.toString(16) + fullRoute[index].route[i].waypoints.color.green.toString(16) + fullRoute[index].route[i].waypoints.color.blue.toString(16),
                strokeOpacity: 1,
                strokeWeight: 10,
                path: shapes
            });

            for (var a = 0; a < shapes.length; a++) {


                bounds.extend(new google.maps.LatLng(shapes[a].lat(), shapes[a].lng()));     

            }

            cascadiaFault.setMap(map);
        }
    }

    map.fitBounds(bounds);
    map.panToBounds(bounds);  

}

fetch(`${window.location.origin}?action=getmap`)
    .then(function(response) {
        return response.text();
    }).then(function(text) {
        console.log(JSON.parse(text));
        document.getElementById("googleMap").innerHTML = JSON.parse(text).response.body;
    })