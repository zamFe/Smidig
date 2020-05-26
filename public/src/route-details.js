let container = document.getElementById("main-container");
let delayTime = 0;

//build step and adds to HTML
function stepBuilder(stop, delay) {
    delay = (delay === undefined) ? false : delay;


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
        serviceNr = `Gå ${Math.ceil((stop.endTime - stop.startTime)/60)} min`;
    }

    /*var routeTemplate = `<div class="route-line">

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
                </div>`;*/

    let delayedHTML = "";
    let cancelledHTML = "";
    if(stop.hasWarning) { // Only a delay
        if(delay.cancelled) { // Transport led is cancelled
            // Call new function to render the new route for customer
            cancelledTransport(stop);
            cancelledHTML = `
                <div class="cancelled-container">
                    <div class="cancelled-title">Innstilt!</div>
                    <div class="grey-line"></div>
                    <div class="cancelled-message">
                        Toget er innstilt grunnet arbeid på sporet.
                    </div>
                </div>
       `;
        } else {
            const delayedIcon = "<svg class=\"warning-svg\" data-name=\"Warning icon\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 486.27 486.27\"><path class=\"warn-icon\" d=\"M250,6.86C115.72,6.86,6.86,115.72,6.86,250S115.72,493.14,250,493.14,493.14,384.28,493.14,250,384.28,6.86,250,6.86ZM222.24,78.67h55.52V300.32H222.24ZM250,409.77a41.68,41.68,0,1,1,41.68-41.68A41.68,41.68,0,0,1,250,409.77Z\" transform=\"translate(-6.86 -6.86)\"/></svg>";
            delayedHTML = `
                <div class="delay-message">
                    ${delayedIcon}
                    <span class="delay-message">${delay.statusMessage} </span>
                    <span class="delay-time"> (${delay.duration} min)</span>
                </div>
            `;
            delayTime = delay.duration * 60;
        }
    }

    // Returns true and is used for deciding template rendering elements
    const routeIsCancelled = (delay.cancelled && stop.hasWarning);
    const gridTemp = (routeIsCancelled) ? "50% 50%" : "10% 90%";

    const lineTemplate =  (!routeIsCancelled) ?
        `<div class="route-line">
            <img class="node-icon" src="../res/img/icons/node.png">
            <div class="line" style="height:105%; margin-top:.25em"></div>
        </div>`
        :
        "";

    const routeTemplate = `
        <div style="display: grid; grid-template-columns: ${gridTemp}">
            ${lineTemplate}
            <div class="route-details">
                <span class="time-container">
                    ${convertTime(stop.startTime, delayTime)}
                </span>
                <span class="route-place">${stop.from.address}</span>
                ${delayedHTML}
                <div class="route-action">
                    <img class="action-img" src="${getImages(stop.action)}" alt="">
                    <span class="action-time">${serviceNr} <span class="action-extra">(${serviceP})</span></span>
                </div>
            </div>
            ${cancelledHTML}
        </div>`

    //stepBlock.innerHTML = routeTemplate;
    //document.getElementById("main-container").appendChild(stepBlock)
    return routeTemplate;
}

function cancelledTransport(route) {
    console.log(route);
}


function convertTime(time, delay) {
    let delayFormat = "";
    let lineOver = "";

    if(delay !== 0) {
        const newTime = new Date((time + delayTime) * 1000);
        delayFormat = `<span class="new-time">${convertToHours(newTime)}</span>`;
        lineOver = "line-over";
    }

    let date = new Date(time * 1000);
    let convertedTime = `<span class="current-time ${lineOver}">${convertToHours(date)}</span>`;
    let html = convertedTime + delayFormat;
    return html;
}

function convertToHours(date) {
    let formattedDate;
    if(date.getHours() < 10) {
        formattedDate = '0' + `${date.getHours()}:${('0' + date.getMinutes()).slice(-2)}`;
    } else {
     formattedDate = `${date.getHours()}:${('0' + date.getMinutes()).slice(-2)}`
    }
    return formattedDate;
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


function getLastNode (stop){
    return `<div style="display: grid; grid-template-columns: 10% 90%">
                <div class="route-line" style="grid-template-rows: auto">
                    <img class="node-icon" src="../res/img/icons/node.png">
                </div>
                <div class="route-details" style="grid-template-rows: auto">
                    <span>
                        ${convertTime(stop.endTime, delayTime)}
                    </span>
                    <span class="route-place">${stop.to.address}</span>
                </div>
            </div>`
}

function drawWait (minutes){
    let waitTemplate = `
              <div class="wait-div">
                <div class="dotted-line" style="width:0em; height: 1em; border: .25em dotted #898989; border-style: none dotted none none;"></div>
                <span style="margin: .3em 0 .3em 0;">Vent ${minutes} min</span>
                <div class="dotted-line" style="margin: .3em 0 .3em 0;width:0em; height: 1em; border: .25em dotted #898989; border-style: none dotted none none;"></div>
              </div>`;

    return waitTemplate;
  /*  let stepBlock = document.createElement("div");
    stepBlock.classList.add("wait-div");

    stepBlock.innerHTML = waitTemplate;
    document.getElementById("main-container").appendChild(stepBlock)
*/
}

let fullRoute = JSON.parse(localStorage.getItem("route"));
urlParams = new URLSearchParams(window.location.search);

var index = (urlParams.get('index')) ? urlParams.get('index') : 0;
console.log(fullRoute[index])


let last = null;
let i;
/*let stepBlock = document.createElement("div");
stepBlock.classList.add("detail-box");*/
let stepBlock = `<div class="detail-box">`
for (i = 0; i < fullRoute[index].route.length; i++) {
    let step = fullRoute[index].route[i];
    if (step.action === 'Overgang') {
        //transitionBuilder(step.startTime, step.endTime);
        continue;
    }

    if (last && last.endTime !== step.startTime) {
        console.log(step)
        stepBlock += getLastNode(last)
        stepBlock += "</div>"
        stepBlock += drawWait(Math.ceil((step.startTime - last.endTime - delayTime)/60));
        delayTime = 0;
        stepBlock += '<div class="detail-box">';
    }
    const stepHTML = stepBuilder(step, fullRoute[index].delay);
    stepBlock += stepHTML;

    last = step;
}
stepBlock += getLastNode(last)
stepBlock += '</div>'

document.getElementById("route-container").innerHTML = stepBlock;

let travelTime = fullRoute[index].endTime-fullRoute[index].startTime;
const hours = (Math.floor(travelTime/3600) <= 0) ? "" : Math.floor(travelTime/3600)+"t";
document.getElementById("travel-time").innerText = `${hours} ${Math.ceil((travelTime%3600)/60)} min`;
console.log(travelTime)
document.getElementById("arrival-time").innerHTML = `${convertTime(fullRoute[index].endTime, delayTime)}`;