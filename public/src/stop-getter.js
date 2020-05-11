let container = document.getElementById("main-container");

//build step and adds to HTML
function stepBuilder(stop) {
    //the step "container"
    let step = document.createElement("div");
    step.id = "departure";

    //build time element
    let time = document.createElement("div");
    time.id = "time-container";

    let timeP = document.createElement("p");
    timeP.innerText = convertTime(stop.startTime);

/*     let endTime = document.createElement("div");
    endTime.id = "time-container"; */

/*     let endTimeP = document.createElement("p");
    endTimeP.innerText = convertTime((stop.endTime)); */

    //add service provider icon
    let serviceProvider = document.createElement("div");
    serviceProvider.id = "serviceprovider-icon-container";
    if(stop.action != "") {
        let serviceProviderIcon = document.createElement("img");
        serviceProviderIcon.id = "serviceprovider-icon";
        serviceProviderIcon.src = "../VyAssets/vy.logo.final_primary.png"; //PLACEHOLDER
        serviceProvider.appendChild(serviceProviderIcon);
        if(stop.action != "Gå") {
            serviceProvider.innerText = stop.operatorName;
        }
        else {
            serviceProvider.innerText = stop.metres + " meter";
        }
    }

    //build node element
    let stopNode = document.createElement("div");
    stopNode.id = "node-container";

    let routeLine = document.createElement("div");
    routeLine.id = "route-line";
    if(stop.action == "Gå") {
        routeLine.style.background = "repeating-linear-gradient(to bottom, #FFFFFF, #FFFFFF 10px, #383e42 10px, #383e42 30px)";
    }

    let nodeImg = document.createElement("img");
    nodeImg.classList.add("Node");
    nodeImg.src = "../img/icons/node.png";
    nodeImg.alt = "";
    routeLine.appendChild(nodeImg);

    //build end node
    let endNode = document.createElement("div");
    endNode.id = "node-container";
    let endNodeImg = document.createElement("img");
    endNodeImg.classList.add("Node");
    endNodeImg.src = "../img/icons/node.png";
    endNodeImg.alt = "";
    endNodeImg.style.top = "calc(100% - 50px)";
    routeLine.appendChild(endNodeImg);

    //build name element
    let name = document.createElement("div");
    name.id = "name-container";

    let nameP = document.createElement("p");
    nameP.classList.add("Text-Name");
    nameP.innerText = stop.from.address;

/*     let endName = document.createElement("div");
    endName.id = "name-container";

    let endNameP = document.createElement("p");
    endNameP.classList.add("Text-name");
    endNameP.innerText = stop.to.address; */

    //build transport-medium information
    let transport = document.createElement("p");
    transport.classList.add("Text-Transport");
    if(stop.action != "Gå") {
        transport.innerHTML = stop.serviceName;
        if(stop.serviceName != stop.serviceNumber) {
            transport.innerHTML += " (" + stop.serviceNumber + ")";
        }

    }
    else{
        transport.innerHTML = stop.action;
    }


    if(stop.action != "") {
        var transportIcon = document.createElement("div");
        transportIcon.id = "transport-icon-container";

        var transportIconImg = document.createElement("img");
        transportIconImg.id = "transport-icon";
        transportIconImg.src = getImages(stop.action);
        transportIcon.appendChild(transportIconImg);
    }

    time.appendChild(timeP);
    time.appendChild(serviceProvider);
    stopNode.appendChild(routeLine);

    name.appendChild(nameP);
    name.appendChild(transport);
    if(stop.action != "") {
        name.appendChild(transportIcon);
    }

 /*    endTime.appendChild(endTimeP); */
/*     endName.appendChild(endNameP); */


    step.appendChild(time);
    step.appendChild(stopNode);
    step.appendChild(name);
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
    timeP.innerText = Math.floor((stopTime-startTime) / 60) + "min";

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

    let date = new Date(time*1000);
    let convertedTime = `${date.getHours()}:${('0'+date.getMinutes()).slice(-2)}`

    if(date.getHours() < 10) {
        convertedTime = '0' + `${date.getHours()}:${('0'+date.getMinutes()).slice(-2)}`
    }

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
            //transitionBuilder(step.startTime, step.endTime);
            continue;
        }
        stepBuilder(step);
    }
