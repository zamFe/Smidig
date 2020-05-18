let container = document.getElementById("main-container");

//build step and adds to HTML
function stepBuilder(stop) {



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

    var routeTemplate = `<div style="display: grid; grid-template-columns: 10% 90%">
                <div class="route-line">

                    <img class="node-icon" src="../res/img/icons/node.png">
                    <div class="line" style="height:105%; margin-top:.25em"></div>

                </div>
                <div class="route-details">
                    <span class="route-time">${convertTime(stop.startTime)}</span>
                    <span class="route-place">${stop.from.address}</span>
                    <div class="route-action">
                        <img class="action-img" src="${getImages(stop.action)}" alt="">
                        <span class="action-time">${serviceNr} <span class="action-extra">(${serviceP})</span></span>
                    </div>

                </div>

            </div>`

    //stepBlock.innerHTML = routeTemplate;
    //document.getElementById("main-container").appendChild(stepBlock)
    return routeTemplate;
}

function convertTime(time) {

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


function getLastNode (stop){
    return `<div style="display: grid; grid-template-columns: 10% 90%">
                <div class="route-line" style="grid-template-rows: auto">
                    <img class="node-icon" src="../res/img/icons/node.png">
                </div>
                <div class="route-details" style="grid-template-rows: auto">
                    <span class="route-time">${convertTime(stop.endTime)}</span>
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
console.log(fullRoute)


let current;



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
        stepBlock += drawWait(Math.ceil((step.startTime - last.endTime)/60));
        stepBlock += '<div class="detail-box">';
    }
    stepBlock += stepBuilder(step);

    last = step;
}
stepBlock += getLastNode(last)
stepBlock += '</div>'

/*
<div class="detail-box"><div style="display: grid;grid-template-columns: 40% 60%;">

                <div class="route-details">
                    <span class="route-time">15:42</span>
                    <span class="route-place">Skøyen stasjon</span>
                    <div class="route-action">
                        <img class="action-img" src="../res/img/icons/traing.png" alt="">
                        <span class="action-time">L2x <span class="action-extra">(Vy)</span></span>
                    </div>

                </div>
    <div style="
    background-color: #ffe400;
     height: 100%;
 width: 100%;
display: inline-block;
padding: 10px;
justify-content: center;
align-items: center;
"><div style="
width: 100%;
font-weight: bold;
font-size: 2.4vh;
">Instilt!</div><div style="
height: 2px;
width: 100%;
background-color: gray;
margin: 1px 0 9px 0;
"></div>
<div style="
font-size: 1.7vh;
">Toget er, grunnet arbeid på sporet, instilt. Loren ipsum dolor mit amet.</div></div>


</div></div>
*/


document.getElementById("route-container").innerHTML = stepBlock;

let travelTime = fullRoute[index].endTime-fullRoute[index].startTime;
document.getElementById("travel-time").innerText = `${Math.floor(travelTime/3600)}t ${Math.ceil((travelTime%3600)/60)} min`;
console.log(travelTime)
document.getElementById("arrival-time").innerText = `${convertTime(fullRoute[index].endTime)}`;