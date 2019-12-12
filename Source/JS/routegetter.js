const container = document.getElementById("routes-result-container");

function convertTime(time) {
    let date = new Date(time*1000);
    let convertedTime = `${date.getHours()}:${date.getMinutes()}`
    return convertedTime;
}

function setGridColom(routeLength) {
    
}

function setRoutings(oneRoute) {
    const div = document.createElement("div");
    div.setAttribute("id", "route-box");
    setGridColom(oneRoute.route.length);

    let routeLength = oneRoute.route.length;
    let number = 1;

    for(let i = 0;  i < routeLength; i++) {
        if(oneRoute.route[i].action === "Overgang") {

        } else {
            number += 1;
            const routeDetailDiv = document.createElement("div");
            routeDetailDiv.setAttribute("class", `route-detail-${number}`);

            const actionDiv = document.createElement("div");
            actionDiv.setAttribute("class", "action-div");
            actionDiv.innerHTML = oneRoute.route[i].action;
            routeDetailDiv.appendChild(actionDiv);

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

// Create dynamic route alternatives of search
for(let i = 0; i < fullRoute.length; i++) {
    let start = convertTime(fullRoute[i].startTime);
    let end = convertTime(fullRoute[i].endTime);

    const box = document.createElement("div");
    box.setAttribute("class", "routes-box-container");

    const startTime = document.createElement("div");
    startTime.setAttribute("id", "startTime");
    startTime.innerHTML = start;

    const endTime = document.createElement("div");
    endTime.setAttribute("id", "endTime");
    endTime.innerHTML = end;

    const routings = setRoutings(fullRoute[i]);

    const totalTime = document.createElement("div");
    totalTime.setAttribute("id", "total-time");
    totalTime.innerHTML = (fullRoute[i].endTime - fullRoute[i].startTime);

    const totalPrice = document.createElement("div");
    totalPrice.setAttribute("id", "total-price");
    totalPrice.innerHTML = `kr ${fullRoute[i].cost},-`;

    //Load to page
    container.appendChild(box);
    box.appendChild(startTime);
    box.appendChild(endTime);
    box.appendChild(routings);
    box.appendChild(totalTime);
    box.appendChild(totalPrice);
}