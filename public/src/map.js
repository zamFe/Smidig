const fullRoute = JSON.parse(localStorage.getItem("route"));
const index = new URLSearchParams(window.location.search).get("index");

/***** Color pallets *****/
const bussCol = "#c20303";
const trainCol = "#00957a";
const tramCol = "#08cdcd";
const ferryCol = "#0e5ce3";
const walkCol = "#828181";
const subwayCol = "#de5b04";

const routeArr = fullRoute[index].route;

let coordFrom = {
    lat: fullRoute[index].route[0].from.lat,
    lng: fullRoute[index].route[0].from.lng
}
let coordDest = {
    lat: routeArr[routeArr.length - 1].to.lat,
    lng: routeArr[routeArr.length - 1].to.lng
}

function initMap() { // Called on callback in mapping HTML file

    let map = new google.maps.Map(document.getElementById('map'), {
        center: coordFrom,
        zoom: 12
    });

    let bounds = new google.maps.LatLngBounds();

    const startMarker = new google.maps.Marker({
        position: coordFrom,
        map: map,
        icon: '../res/img/svg/map-start.svg'
    });
    const endMarker = new google.maps.Marker({
        position: coordDest,
        map: map,
        icon: '../res/img/svg/flag-icon.svg'
    });

    // Loop for checking and render each type of transportation type of this trip
    for (let i = 0; i < fullRoute[index].route.length; i++) {
        const routeType = fullRoute[index].route[i]; // Transportation type

        if(routeType.action === "Gå") { // If walk is action
            const start = {lat: routeType.from.lat, lng: routeType.from.lng};
            const end = {lat: routeType.to.lat, lng: routeType.to.lng};
            const coordinates = [start, end];

            const lineSymbol = { // Creates dotted line
                path: "M 0, -1 0, 1",
                strokeOpacity: 1,
                scale: 4
            };

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
            for (var j = 0; j < routeType.waypoints.shapes.length; j++) {

                if(!routeType.waypoints.shapes[j].travelled) {
                    continue; // Ignores routes not in the actual route
                }

                let shapeColor;
                let transportIcon = "../res/img/svg/";
                switch (routeType.action) {
                    case "Tog": shapeColor = trainCol; transportIcon += "train-label.svg"; break;
                    case "Buss": shapeColor = bussCol; transportIcon += "bus-label.svg"; break;
                    case "Trikk": shapeColor = tramCol; transportIcon += "tram-label.svg"; break;
                    case "Ferge": shapeColor = ferryCol; transportIcon += "ferry-label.svg"; break;
                    case "T-bane": shapeColor = subwayCol; transportIcon += "metro-label.svg"; break;
                    default: shapeColor = "#000000"; break;
                }

                let textSize = "14px"; // Default size for transportation service number
                if(routeType.serviceNumber.length >= 5) {
                    textSize = "10px";
                }

                const transportMarker = new google.maps.Marker({
                    icon: {
                        url: transportIcon,
                        labelOrigin: new google.maps.Point(20, 12)
                    },
                    position: {
                        lat: routeType.from.lat,
                        lng: routeType.from.lng
                    },
                    map: map,
                    label: {
                        text: routeType.serviceNumber,
                        color: "white",
                        fontSize: textSize,
                        fontWeight: "bold"
                    }
                });

                const shapes = google.maps.geometry.encoding.decodePath(routeType.waypoints.shapes[j].encodedWaypoints);
                // Default settings for the lines rendered in the map
                const cascadiaFault = new google.maps.Polyline({
                    strokeColor: shapeColor,
                    strokeOpacity: 1,
                    strokeWeight: 5,
                    path: shapes,
                    map: map
                });


                for (var a = 0; a < shapes.length; a++) {
                    bounds.extend(new google.maps.LatLng(shapes[a].lat(), shapes[a].lng()));
                }
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
        document.getElementById("googleMap").innerHTML = payload.body;
    } catch (e) {
        console.error(`Fetching map failed: ${e}`);
    }
}

fetchMap();
