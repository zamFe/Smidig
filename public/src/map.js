var fullRoute = JSON.parse(localStorage.getItem("route"));
let index = new URLSearchParams(window.location.search).get("index");
var map;

/***** Color pallets *****/
const bussCol = "#c20303";
const trainCol = "#00957a";
const tramCol = "#08cdcd";
const ferryCol = "#0e5ce3";
const walkCol = "#828181";
const subwayCol = "#de5b04";


let coordFrom = {
    lat: fullRoute[index].route[0].from.lat,
    lng: fullRoute[index].route[0].from.lng
}

function initMap() { // Called on callback in mapping HTML file

    map = new google.maps.Map(document.getElementById('map'), {
        center: coordFrom,
        zoom: 12
    });

    let bounds = new google.maps.LatLngBounds();

    console.log(fullRoute[index]);

    for (var i = 0; i < fullRoute[index].route.length; i++) {
        const route = fullRoute[index].route[i];
        let startIcon = false;
        let endIcon = false;

        if(i === 0) {

        }

        if(route === fullRoute[index].route.length-1) {
            // set icon at end
        }


        if(route.action === "Gå") { // If walk is action
            const start = {lat: route.from.lat, lng: route.from.lng};
            const end = {lat: route.to.lat, lng: route.to.lng};
            const coordinates = [start, end];

            const lineSymbol = { // Creates dotted line
                path: "M 0, -1 0, 1",
                strokeOpacity: 1,
                scale: 4
            };

            let iconArray = [{icon: lineSymbol, offset: "0", repeat: "20px"}];
            if(startIcon) {
                iconArray.push(startIcon);
            }

            // Creates walk path with dotted lines as display
            const walkpath = new google.maps.Polyline({
               strokeColor: walkCol,
               strokeOpacity: 0,
               icons: [
                   {
                       icon: lineSymbol,
                       offset: "0",
                       repeat: "20px"
                   }, {
                    icon: null
                   }
               ],
               path: coordinates
            });

            walkpath.setMap(map);
            continue;

        } else {

            // When action is something else than "Gå"/"Walk"
            for (var j = 0; j < route.waypoints.shapes.length; j++) {

                if(!route.waypoints.shapes[j].travelled) {
                    continue; // Ignores routes not in the actual route
                }

                let shapes = google.maps.geometry.encoding.decodePath(route.waypoints.shapes[j].encodedWaypoints)

                let shapeColor;
                switch (route.action) {
                    case "Tog": shapeColor = trainCol; break;
                    case "Buss": shapeColor = bussCol; break;
                    case "Trikk": shapeColor = tramCol; break;
                    case "Ferje": shapeColor = ferryCol; break;
                    case "T-Bane": shapeColor = subwayCol; break;
                    default: shapeColor = "#000000"; break;
                }
                console.log(shapeColor)

                let start = (startIcon) ? startIcon : "";
                let end = (endIcon) ? endIcon : "";

                var cascadiaFault = new google.maps.Polyline({
                    strokeColor: shapeColor,
                    strokeOpacity: 1,
                    strokeWeight: 5,
                    path: shapes,
                    icon:
                        [
                            {start},
                            {end}
                        ]
                });

                for (var a = 0; a < shapes.length; a++) {
                    bounds.extend(new google.maps.LatLng(shapes[a].lat(), shapes[a].lng()));
                }

                cascadiaFault.setMap(map);
            }
        }
    }





    map.fitBounds(bounds);
    map.panToBounds(bounds);
}

async function fetchMap() {
    const url = `${window.location.origin}/api/map`

    let response;
    let payload;
    try {
        response = await fetch(url, {method: "get"})
        payload = await response.json();

        console.log(payload)

        document.getElementById("googleMap").innerHTML = payload.body;
    } catch (e) {
        console.error(e);
    }
}


fetchMap();