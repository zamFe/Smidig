
function getTime() {
    const start = document.getElementById("start-time");
    const end = document.getElementById("end-time");
    const total = document.getElementById("total-time");
    start.innerHTML = fullRoute[0].startTime;
    end.innerHTML = fullRoute[0].endTime;
    total.innerHTML = fullRoute[0].totalTime;
}

function getPrice() {
    const price = document.getElementById("total-price");
    price.innerHTML = `kr ${fullRoute[0].cost},-`;
}

function getRouteDetails() {
    let routeSymbols = document.getElementById("routing-symbols");

    for(let i = 0; i < fullRoute[0].route.length; i++) {
        const div = document.createElement("div");
        div.setAttribute("class", `symbol`);

        /* type of transport of point */
        const type = document.createElement("div");
        type.setAttribute("class", "type");
        type.innerHTML = fullRoute[0].route[i].action;

        /* Time for travel of point */
        const time = document.createElement("div");
        time.setAttribute("class", "symbol-time");
        time.innerHTML = fullRoute[0].route[i].time;

        div.appendChild(type);
        div.appendChild(time);

        routeSymbols.appendChild(div);
    }


}

/* Runs functions to print out to routes.html */
getTime();
getPrice();
getRouteDetails();