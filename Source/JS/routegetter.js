const container = document.getElementById("routes-result-container");

function displayDestinations() {

}

//Displays the route names in the route list
const fromElem = document.getElementById("from-dest");
const toElem = document.getElementById("to-dest");
fromElem.innerText = urlParams.get("fromname");
toElem.innerText = urlParams.get("toname");

//Swaps the route directions
const swapRouteButton = document.getElementById('switch-arrow');
swapRouteButton.addEventListener('click', e => {
    let from = urlParams.get('to');
    let fromName = urlParams.get('toname');
    let to = urlParams.get('from');
    let toName = urlParams.get('fromname');
    let datetime = urlParams.get('datetime');
    window.location = `/html/routes.html?from=${from}&fromname=${fromName}&to=${to}&toname=${toName}&datetime=${datetime}`;
})

// Convert from Seconds to real time
function convertTime(time) {
    let date = new Date(time*1000);
    let convertedTime = `${date.getHours()}:${date.getMinutes()}`
    return convertedTime;
}

// Sets grid styling
function setGridColom(routeLength, div) {
    const number = 100/routeLength+2;
    const value = `repeat(${number}%, ${(routeLength+2)})`;
    div.style.gridTemplateColumns = value;
}

// Displays correct route action image
function getImages(routeAction) {
    let image = "../img/icons/"; 
    switch(routeAction) {
        case "T-bane": image += "subway.png";
            break;
        case "Gå": image += "walk.png";
            break; 
        case "Tog": image += "traing.png";
            break;
        case "Buss": image += "bus.png";
            break; 
    }
    return image;
}

// Create route details inside route choice
function setRoutings(oneRoute) {
    const div = document.createElement("div");
    div.setAttribute("id", "route-box");
    setGridColom(oneRoute.route.length, div);
    
    let routeLength = oneRoute.route.length;
    let number = 1;

    for(let i = 0;  i < routeLength; i++) {
        if(oneRoute.route[i].action === "Overgang") {
            // Do nothing
        } else {
            number += 1;
            const routeDetailDiv = document.createElement("div");
            routeDetailDiv.setAttribute("class", `route-detail-${number} route-detail-spacing`);

            routeDetailDiv.style.gridColumn = number;

            // Gets correct action
            const actionImage = document.createElement("img");
            actionImage.setAttribute("class", "action-img");
            image = getImages(oneRoute.route[i].action);
            actionImage.setAttribute("src", image);
            routeDetailDiv.appendChild(actionImage);

            // Checks if action is not "Overgang"
            if(oneRoute.route[i].serviceNumber != undefined) {
                const serviceDiv = document.createElement("div");
                serviceDiv.setAttribute("class", "service-div");
                serviceDiv.innerHTML = oneRoute.route[i].serviceNumber;
                routeDetailDiv.appendChild(serviceDiv);
            }
            div.appendChild(routeDetailDiv);
        }
    }
    return div;
}

function secondsToTime(end, start) {
    let time = end - start;
    let hour = Math.floor(time / 3600);
    let min = Math.floor(time % 3600 / 60);
    let convTime;

    if (hour != 0) {
        convTime = `${hour}t `;
    } 
    convTime += min + "min";

    return convTime;
}


// Create dynamic route alternatives of search
function setUp() {
    for(let i = 0; i < fullRoute.length; i++) {
        let start = convertTime(fullRoute[i].startTime);
        let end = convertTime(fullRoute[i].endTime);
        // change this to more dynamic
        if(end.length == 4) { end = end + "0"; }
        if(start.length == 4) { start = "0" + start; }

        const box = document.createElement("div");
        box.setAttribute("class", "routes-box-container");
        box.addEventListener("click", () => {
            window.location.href = "routedetails.html" + window.location.search + "&index=" + i;
        })

        const startTime = document.createElement("div");
        startTime.setAttribute("id", "startTime");
        startTime.innerHTML = start;

        const endTime = document.createElement("div");
        endTime.setAttribute("id", "endTime");
        endTime.innerHTML = end;

        const firstDot = document.createElement("div");
        firstDot.setAttribute("id", "first-dot-routes");
        
        const lastDot = document.createElement("div");
        lastDot.setAttribute("id", "last-dot-routes");

        const routings = setRoutings(fullRoute[i]);

        const totalTime = document.createElement("div");
        totalTime.setAttribute("id", "total-time");
        let travelTime = secondsToTime(fullRoute[i].endTime, fullRoute[i].startTime);
        totalTime.innerHTML = travelTime;

        const totalPrice = document.createElement("div");
        totalPrice.setAttribute("id", "total-price");
        totalPrice.innerHTML = `kr ${fullRoute[i].cost},-`;

        const lineDiv = document.createElement("div");
        lineDiv.setAttribute("class", "border-line-2");

        //Load to page
        container.appendChild(box);
        box.appendChild(startTime);
        box.appendChild(endTime);
        box.appendChild(firstDot);
        box.appendChild(routings);
        box.appendChild(lastDot);
        box.appendChild(totalTime);
        box.appendChild(totalPrice);
        container.appendChild(lineDiv);
    }
}