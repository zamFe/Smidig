
// Other global variables of elements
const container = document.getElementById("routes-result-container");
const favStar = document.getElementById("favourite-star");

// Displays the route names in the route list
const fromElem = document.getElementById("from-dest");
const toElem = document.getElementById("to-dest");
fromElem.innerText = urlParams.get("fromname");
toElem.innerText = urlParams.get("toname");

// Swaps the route directions
const swapRouteButton = document.getElementById('switch-arrow');
swapRouteButton.addEventListener('click', e => {
    let from = urlParams.get('to');
    let fromName = urlParams.get('toname');
    let to = urlParams.get('from');
    let toName = urlParams.get('fromname');
    let datetime = urlParams.get('datetime');
    window.location = `../routes.html?from=${from}&to=${to}&fromname=${fromName}&toname=${toName}&datetime${datetime}`;
});

// Retrieves user information from Localstorage
function retrieveUser() {
    return JSON.parse(localStorage.getItem("user"));
}

// Renders star in if user is logged in for adding a favorite route
function checkUserAndStarData() {
    const user = retrieveUser();
    console.log(user);

    if(user) {
        favStar.style.visibility = "visible";
        checkIfRouteInFavorite(user);
    } else {
        favStar.style.visibility = "hidden";
    }
}


function checkIfRouteInFavorite(user) {
    const newRoute = getCurrentRoute();

    if(user.favorites.length !== 0) {
        user.favorites.forEach(favRoute => {
            if(favRoute.from === newRoute.from && favRoute.to === newRoute.to) {
                favStar.alt = "true";
            } else {
                favStar.alt = "false";
                console.log("Something went from, check objects under:")
                console.log(favRoute);
                console.log(newRoute);
            }
        });
    } else {
        favStar.alt = "false";
    }

}

// Fetches URL params and creates route object for user
function getCurrentRoute() {
    const url = window.location.search;

    const newRoute = {
        from: urlParams.get("fromname"),
        to: urlParams.get("toname"),
        url: `date-time.html${url}`
    };
    return newRoute;
}

// Check whether to add or remove from favorite list on user
favStar.addEventListener("click", event => {
    const user = retrieveUser();
    let status = event.target.alt; // Retrieve the current status of the star
    const newRoute = getCurrentRoute();

    // User HAS this route in favorite
    if(status === "true") {
        favStar.alt = "false";
        console.log(1);
        user.favorites.forEach(favRoute => {
            if(favRoute.from === newRoute.from && favRoute.to === newRoute.to) {
                user.favorites.splice(user.favorites.indexOf(favRoute), 1);
            } else {
                console.log("Something went from, check objects under:")
                console.log(favRoute);
                console.log(newRoute);
            }
        });
        updateUser(user.email, user.password, {favorites: user.favorites});
    }

    // User does NOT have this in favorite
    if(status === "false") {
        favStar.alt = "true";
        console.log(2);
        user.favorites.push(newRoute);
        updateUser(user.email, user.password, {favorites: user.favorites});
    }
    console.log(user);
});

 
// Convert from Seconds to real time
function convertTime(time) {
    let date = new Date(time*1000);
    let convertedTime = `${date.getHours()}:${('0'+date.getMinutes()).slice(-2)}`

    if(date.getHours() < 10) {
        convertedTime = '0' + `${date.getHours()}:${('0'+date.getMinutes()).slice(-2)}`
    }
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
    let image = "../res/img/icons/"; 
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
    let number = 0;

    for(let i = 0;  i < routeLength; i++) {
        if(oneRoute.route[i].action === "Overgang") {
            // Overgang is not accounted for in this overview for travel
            } else {
                number += 1;
                const routeDetailDiv = document.createElement("div");
                routeDetailDiv.setAttribute("class", `route-detail-spacing routes-row`);
                routeDetailDiv.style.gridColumn = number;

                // Gets correct action
                const actionImage = document.createElement("img");
                actionImage.setAttribute("class", "action-img");
                image = getImages(oneRoute.route[i].action);
                actionImage.setAttribute("src", image);
                routeDetailDiv.appendChild(actionImage);
                
                // Checks if action is not empty
                if(oneRoute.route[i].serviceNumber != undefined) {
                    const serviceDiv = document.createElement("div");
                    serviceDiv.setAttribute("class", "service-div");
                    serviceDiv.innerHTML = oneRoute.route[i].serviceNumber;
                    routeDetailDiv.appendChild(serviceDiv);
                }
                div.appendChild(routeDetailDiv);
                
                if(i < routeLength-1) {
                    const lineDiv = document.createElement("div");
                    lineDiv.setAttribute("class", "line-routes-div")
                    lineDiv.style.gridColumn = `${number+1}`;
                    div.appendChild(lineDiv);
                    number += 1;
                    
                    const line = document.createElement("div");
                    line.setAttribute("class", "line-routes routes-row");
                    lineDiv.appendChild(line);
                }

            }
    }

    return div;
}

// Time converter
function secondsToTime(end, start) {
    let time = end - start;
    let hour = Math.floor(time / 3600);
    let min = Math.ceil(time % 3600 / 60);
    let convTime = "";

    if (hour != 0) {
        convTime += `${hour}t `;
    }
    convTime += min + "min";
    return convTime;
}

// Create dynamic route alternatives of search
function setUp() {
    localStorage.setItem("route", JSON.stringify(fullRoute));
    for(let i = 0; i < fullRoute.length; i++) {
        let start = convertTime(fullRoute[i].startTime);
        let end = convertTime(fullRoute[i].endTime);

        const box = document.createElement("div");
        box.setAttribute("class", "routes-box-container");
        box.addEventListener("click", () => {
            window.location.href = "route-details.html" + window.location.search + "&index=" + i;
        })

        const startTime = document.createElement("div");
        startTime.setAttribute("id", "startTime");
        startTime.setAttribute("class", "time-font");
        startTime.innerHTML = start;

        const endTime = document.createElement("div");
        endTime.setAttribute("id", "endTime");
        endTime.setAttribute("class", "time-font");
        endTime.innerHTML = end;

        const firstDot = document.createElement("div");
        firstDot.setAttribute("id", "first-dot-routes");
        firstDot.setAttribute("class", "round");
        
        const lastDot = document.createElement("div");
        lastDot.setAttribute("id", "last-dot-routes");
        lastDot.setAttribute("class", "round");

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

// Function calls
checkUserAndStarData(); // Loads star if user logged in
