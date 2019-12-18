let container = document.getElementById("main-container");

//build step and adds to HTML
function stepBuilder(action, stepName, stepTime, provider) {
    //the step "container"
    let step = document.createElement("div");
    step.id = "departure";

    //build time element
    let time = document.createElement("div");
    time.id = "time-container";

    let timeP = document.createElement("p");
    timeP.innerText = stepTime;

    //add service provider icon
    let serviceProvider = document.createElement("div");
    serviceProvider.id = "serviceprovider-icon-container";
    if(action != "") {
        let serviceProviderIcon = document.createElement("img");
        serviceProviderIcon.id = "serviceprovider-icon";
        serviceProviderIcon.src = "../VyAssets/vy.logo.final_primary.png"; //PLACEHOLDER
        serviceProvider.appendChild(serviceProviderIcon);
        if(action != "Gå") {
            serviceProvider.innerText = provider;
        }
    }

    //build node element
    let stopNode = document.createElement("div");
    stopNode.id = "node-container";

    let routeLine = document.createElement("div");
    routeLine.id = "route-line";

    let nodeImg = document.createElement("img");
    nodeImg.classList.add("Node");
    nodeImg.src = "../img/icons/node.png";
    nodeImg.alt = "";
    routeLine.appendChild(nodeImg);

    //build name element
    let name = document.createElement("div");
    name.id = "name-container";

    let nameP = document.createElement("p");
    nameP.classList.add("Text-Name");
    nameP.innerText = stepName;

    //build transport-medium information
    let transport = document.createElement("p");
    transport.classList.add("Text-Transport");
    transport.innerHTML = action;

    if(action != "") {
        var transportIcon = document.createElement("div");
        transportIcon.id = "transport-icon-container";

        var transportIconImg = document.createElement("img");
        transportIconImg.id = "transport-icon";
        transportIconImg.src = getImages(action);
        transportIcon.appendChild(transportIconImg);

    }

    time.appendChild(timeP);
    time.appendChild(serviceProvider);
    stopNode.appendChild(routeLine);

    name.appendChild(nameP);
    name.appendChild(transport);
    if(action != "") {
        name.appendChild(transportIcon);
    }


    step.appendChild(time);
    step.appendChild(stopNode);
    step.appendChild(name);

    container.appendChild(step);
}

function transitionBuilder(startTime, stopTime) {
    let step = document.createElement("div");
    step.id = "departure";

    let time = document.createElement("div");
    time.id = "time-container";

    let timeP = document.createElement("p");
    timeP.innerText = Math.floor((stopTime-startTime) / 60) + "min";

    let stopNode = document.createElement("div");
    stopNode.id = "node-container";

    let routeLine = document.createElement("div");
    routeLine.id = "route-line";
    routeLine.style.background = "repeating-linear-gradient(to bottom, #FFFFFF, #FFFFFF 10px, #383e42 10px, #383e42 30px)";

    let name = document.createElement("div");
    name.id = "name-container";
    let nameP = document.createElement("p");
    nameP.innerText = "overgang";

    time.appendChild(timeP);
    name.appendChild(nameP);
    stopNode.appendChild(routeLine);

    step.appendChild(time);
    step.appendChild(stopNode);
    step.appendChild(name);

    container.appendChild(step);
}



function convertTime(time) {
    let date = new Date(time*1000);
    let convertedTime = `${date.getHours()}:${('0'+date.getMinutes()).slice(-2)}`
    return convertedTime;
}

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

/*
stepBuilder("Gå", "Ellingsrudåsen", "10:00", "T-Bane");
stepBuilder("", "Jernbanetorget", "10:30", "");
transitionBuilder(1030, 4243);
stepBuilder("Buss", "Jernbanetorget", "10:35", "VY");
stepBuilder("", "Lilletorget", "10:45", "");
*/

let fullRoute = JSON.parse(localStorage.getItem("route"));
urlParams = new URLSearchParams(window.location.search);

    var index = (urlParams.get('index'))?urlParams.get('index'):0;
    console.log(urlParams.get('index'));
    for(let i = 0; i < fullRoute[index].route.length; i++) {
        let step = fullRoute[index].route[i];
        if (step.action === 'Overgang') {
            transitionBuilder(step.startTime, step.endTime);
            continue;
        }
        stepBuilder(step.action, step.from.address, convertTime(step.startTime), step.operatorName);
        if (i === fullRoute[index].route.length - 1) {
            stepBuilder("", step.to.address, convertTime(step.endTime), step.operatorName);
        } else {
            stepBuilder("", step.to.address, convertTime(step.endTime), step.operatorName);
        }
    }
