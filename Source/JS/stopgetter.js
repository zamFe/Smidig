var count = 0;

let container = document.getElementById("main-container");

//build step and adds to HTML
function stepBuilder(action, stepName, stepTime) {
    //the step "container"
    let step = document.createElement("div");
    step.id = "departure";

    //build time element
    let time = document.createElement("div");
    time.id = "time-container";

    let timeP = document.createElement("p");
    timeP.innerText = stepTime;

    //build node element
    let stopNode = document.createElement("div");
    stopNode.id = "node-container";

    if(count === 0) {
        let routeLine = document.createElement("div");
        routeLine.id = "route-line";
        stopNode.appendChild(routeLine);
    }

    let nodeImg = document.createElement("img");
    nodeImg.classList.add("Node");
    nodeImg.src = "../img/icons/node.png";
    nodeImg.alt = "";

    //build name element
    let name = document.createElement("div");
    name.id = "name-container";

    let nameP = document.createElement("p");
    if(action === "") {
        nameP.innerText = stepName;
    }
    else {
        nameP.innerText = stepName + " [" + action + "]";
    }

    time.appendChild(timeP);
    stopNode.appendChild(nodeImg);
    name.appendChild(nameP);

    step.appendChild(time);
    step.appendChild(stopNode);
    step.appendChild(name);

    container.appendChild(step);
    count++;

    let line = document.getElementById("route-line");
    line.style.height = (300 * (count - 1)) + "px";
}

function transitionBuilder(startTime, stopTime) {
    let step = document.createElement("div");
    step.id = "departure";

    let time = document.createElement("div");
    time.id = "time-container";

    let timeP = document.createElement("p");
    timeP.innerText = (stopTime-startTime) / 60 + "min";

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
    count++;

    let line = document.getElementById("route-line");
    line.style.height = 300 * count + "px";
}

function convertTime(time) {
    let date = new Date(time*1000);
    let convertedTime = `${date.getHours()}:${('0'+date.getMinutes()).slice(-2)}`
    return convertedTime;
}

//stepBuilder("T-Bane", "Ellingsrud", "10:00");
//stepBuilder("T-Bane", "Jernbanetorget", "10:30");

function setUp() {
    if(fullRoute.statusCode === 500) {
        alert("error!");
        return;
    }
    var index = (urlParams.get('index'))?urlParams.get('index'):0;
    console.log(urlParams.get('index'));
    for(let i = 0; i < fullRoute[index].route.length; i++) {
        let step = fullRoute[index].route[i];
        if (step.action === 'Overgang') {
            transitionBuilder(step.startTime, step.endTime);
            continue;
        }
        stepBuilder(step.action, step.from.address, convertTime(step.startTime));
        if(i === fullRoute[index].route.length - 1) {
            stepBuilder("", step.to.address, convertTime(step.endTime));
        }
        else {
            stepBuilder("", step.to.address, convertTime(step.endTime));
        }
    }
}
