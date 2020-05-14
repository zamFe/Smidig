let container = document.getElementById("main-container");

//build step and adds to HTML
function stepBuilder(stop) {

    let stepBlock = document.createElement("div");
    stepBlock.classList.add("detail-box");

    let serviceP = "";

    if (stop.action !== "Gå") {
        serviceP = stop.operatorName;
    } else {
        serviceP = stop.metres + " meter";
    }

    let serviceNr = "";

    if (stop.action !== "Gå"){
        serviceNr = stop.serviceName;
    } else {
        serviceNr = `Gå ${Math.floor((stop.endTime - stop.startTime)/60)} min`;
    }

    var template = `<div class="route-line">

                    <img class="node-icon" src="../res/img/icons/node.png">
                    <div class="line"></div>
                    <img class="node-icon" src="../res/img/icons/node.png">

                </div>
                <div class="route-details">
                    <span class="route-time">${convertTime(stop.startTime)}</span>
                    <span class="route-place">${stop.from.address}</span>
                    <div class="route-action">
                        <img class="action-img" src="${getImages(stop.action)}" alt="">
                        <span class="action-time">${serviceNr} <span class="action-extra">(${serviceP})</span></span>
                    </div>
                    <span class="route-time">${convertTime(stop.endTime)}</span>
                    <span class="route-place">${stop.to.address}</span>
                </div>`

    stepBlock.innerHTML = template;
    document.getElementById("main-container").appendChild(stepBlock)
    return;


    //the step "container"
    let step = document.createElement("div");
    step.id = "departure";

    //build time element
    let time = document.createElement("div");
    time.id = "time-container";

    let timeP = document.createElement("div");
    timeP.style.marginTop = ".5em";
    timeP.innerText = convertTime(stop.startTime);

    //add service provider icon
    let serviceProvider = document.createElement("div");
    serviceProvider.id = "serviceprovider-icon";
    if (stop.action != "") {
        let serviceProviderIcon = document.createElement("img");
        serviceProviderIcon.id = "serviceprovider-icon";
        serviceProviderIcon.src = "../res/vy.logo.final_primary.png"; //PLACEHOLDER
        serviceProvider.appendChild(serviceProviderIcon);
        if (stop.action != "Gå") {
            serviceProvider.innerText = stop.operatorName;
        } else {
            serviceProvider.innerText = stop.metres + " meter";
        }
    }

    //build node element
    let stopNode = document.createElement("div");
    stopNode.id = "node-container";

    let routeLine;
    routeLine = document.createElement("div");
    if (stop.to) {
    routeLine.id = "route-line";
        if (stop.action === "Gå") {
            routeLine.style.background = "repeating-linear-gradient(to bottom, #FFFFFF, #FFFFFF 10px, #383e42 10px, #383e42 30px)";
        }
    } else {
        routeLine.style.top = "2.1em";
        routeLine.style.position = "relative";
        routeLine.style.width = ".4em";
        routeLine.style.height = "8em";
    }

    let nodeImg = document.createElement("img");
    nodeImg.classList.add("node");
    nodeImg.src = "../res/img/icons/node.png";
    nodeImg.alt = "";

    //if (stop.to)
    routeLine.appendChild(nodeImg);

    //build end node
    let endNode = document.createElement("div");
    endNode.id = "node-container";
    /*
    let endNodeImg = document.createElement("img");
    endNodeImg.classList.add("Node");
    endNodeImg.src = "../res/img/icons/node.png";
    endNodeImg.alt = "";
    endNodeImg.style.top = "calc(100% - 50px)";
    routeLine.appendChild(endNodeImg);
    */

    //build name element
    let name = document.createElement("div");
    name.id = "name-container";

    let nameP = document.createElement("p");
    nameP.classList.add("text-Name");
    nameP.innerText = stop.from.address;

    // TODO: Sjekk over denne om den brukes/er nødvendig
    /*     let endName = document.createElement("div");
        endName.id = "name-container";

        let endNameP = document.createElement("p");
        endNameP.classList.add("text-name");
        endNameP.innerText = stop.to.address; */

    //build transport-medium information
    let transport = document.createElement("p");
    transport.classList.add("text-Transport");
    if (stop.action != "Gå") {
        transport.innerHTML = stop.serviceName;
        if (stop.serviceName != stop.serviceNumber) {
            transport.innerHTML += " (" + stop.serviceNumber + ")";
        }

    } else {
        transport.innerHTML = stop.action;
    }


    if (stop.action != "") {
        var transportIcon = document.createElement("div");
        transportIcon.id = "transport-icon-container";

        var transportIconImg = document.createElement("img");
        transportIconImg.id = "transport-icon";
        transportIconImg.src = getImages(stop.action);
        transportIcon.appendChild(transportIconImg);
    }

    time.appendChild(timeP);
    time.appendChild(serviceProvider);
    /*if(stop.to) */
    stopNode.appendChild(routeLine);

    name.appendChild(nameP);
    if (stop.action != "") {
        name.appendChild(transport);
        name.appendChild(transportIcon);
    }

    // TODO: Sjekk over
    /*    endTime.appendChild(endTimeP); */
    /*     endName.appendChild(endNameP); */


    step.appendChild(time);
    step.appendChild(stopNode);
    step.appendChild(name);

    // TODO: Sjekk over
    //  step.appendChild(endTime);
    // step.appendChild(document.createElement("br"));
    // step.appendChild(endName);

    container.appendChild(step);
}

function transitionBuilder(startTime, stopTime, stopName) {
    let step = document.createElement("div");
    step.id = "departure";

    let time = document.createElement("div");
    time.id = "time-container";

    let timeP = document.createElement("p");
    timeP.innerText = Math.floor((stopTime - startTime) / 60) + "min";

    let stopNode = document.createElement("div");
    stopNode.id = "node-container";

    let name = document.createElement("div");
    name.id = "name-container";
    let nameP = document.createElement("p");
    nameP.innerText = "overgang";


    time.appendChild(timeP);
    name.appendChild(nameP);

    step.appendChild(time);
    step.appendChild(stopNode);

    step.appendChild(name);

    container.appendChild(step);
}


function convertTime(time) {
    /*let date = new Date(time*1000);
    let convertedTime = `${date.getHours()}:${('0'+date.getMinutes()).slice(-2)}`
    return convertedTime;*/

    let date = new Date(time * 1000);
    let convertedTime = `${date.getHours()}:${('0' + date.getMinutes()).slice(-2)}`

    if (date.getHours() < 10) {
        convertedTime = '0' + `${date.getHours()}:${('0' + date.getMinutes()).slice(-2)}`
    }

    return convertedTime;


}

function getImages(routeAction) {
    let image = "../res/img/icons/";
    switch (routeAction) {
        case "T-bane":
            image += "subway.png";
            break;
        case "Gå":
            image += "walk.png";
            break;
        case "Tog":
            image += "traing.png";
            break;
        case "Buss":
            image += "bus.png";
            break;
    }
    return image;
}

// TODO: Sjekk over
/*
stepBuilder("Gå", "Ellingsrudåsen", "10:00", "T-Bane");
stepBuilder("", "Jernbanetorget", "10:30", "");
transitionBuilder(1030, 4243);
stepBuilder("Buss", "Jernbanetorget", "10:35", "VY");
stepBuilder("", "Lilletorget", "10:45", "");
*/

let fullRoute = JSON.parse(localStorage.getItem("route"));
urlParams = new URLSearchParams(window.location.search);

var index = (urlParams.get('index')) ? urlParams.get('index') : 0;
//console.log(urlParams.get('index'));
console.log(fullRoute)
let i;
for (i = 0; i < fullRoute[index].route.length; i++) {
    let step = fullRoute[index].route[i];
    if (step.action === 'Overgang') {
        //transitionBuilder(step.startTime, step.endTime);
        continue;
    }
    stepBuilder(step);
}

let step = fullRoute[index].route[i - 1]
console.log(step)
/*
stepBuilder({
    action: "",
    from: {
        address: step.to.address,
        lat: step.to.lat,
        lng: step.to.lng,
        name: step.to.name
    },
    startTime: step.endTime
});
*/