const container = document.getElementById("page-container");
const mainContainer = document.getElementById("main-container");

let locationData = {
    from: null, 
    to: null
}

let currentlyViewing = null;

let inputDelay; //Value holds delay for when inputs are made in input field
function updateDropdown(loc) {
        if(inputDelay){
            clearTimeout(inputDelay);
        }

        inputDelay = setTimeout( async () => {
            const url = `${window.location.origin}/api/location?q=` + document.getElementById(loc + "-input").value

        let response;
        let payload;

        try {
            response = await fetch(url, {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            payload = await response.json();

        } catch (e) {
            console.log(e)
        }

        addToDropdown(JSON.parse(payload).features, loc)
    }, 200)
}

function setSelectedPlace(address, lat, lng, loc){
    console.log(address, lat, lng);
    locationData[loc] = {
        address, lat, lng
    };

    document.getElementById(loc + "-input").value = address;

    renderMainIndex(); //rerender
}

//This function will prevent any attempt to inject "tags" into an input string
const sanitizeHTML = (str) => {
    if(str.includes('<') || str.includes('>')) {
        return str.split('<').join("").split('>').join("");
    }
    return str;
}

function getCategorySVG(category) {
    const train = `<svg class="train-svg svg" data-name="Train Station" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 490.71 316.62"><path class="train action-icon" d="M477.28,252.19Q427.62,201.71,377.14,152c-25.54-25.17-56.68-37.24-92.47-37.26q-139.37-.06-278.75,0v66.74c11.11,0,21.89-.09,32.66,0,10,.11,17.11,7.13,17.15,17.16q.15,32.92,0,65.85c-.93,26.09-33,15.06-50,17.84v83.14c146-1.48,292.55,2.9,438.36-1.68C494.1,354.77,514.69,286.78,477.28,252.19ZM256.53,263.42c0,12-6.74,18.61-18.86,18.62q-65,0-130.09,0c-11.74,0-18.5-6.75-18.52-18.44q0-31.86,0-63.73c0-11.64,6.82-18.35,18.6-18.36q65.06,0,130.09,0c12.1,0,18.77,6.65,18.78,18.71Q256.58,231.81,256.53,263.42Zm178.6,8.35c-3,7.17-8.83,10.34-16.61,10.31-18.29-.09-36.58,0-54.87,0-18.46,0-36.93,0-55.4,0-11.68,0-18.4-6.79-18.41-18.55,3.46-79.59-18.62-84.33,55.83-82a32.43,32.43,0,0,1,23.94,9.87Q400.29,222,431,252.69C436.47,258.2,438.16,264.61,435.13,271.77Z" transform="translate(-5.77 -114.76)"/><path class="train action-icon" d="M289.83,387.06c15.91,65.6,99.47,52.38,100-4.87H190.49C189.77,441.07,280.08,450,289.83,387.06Z" transform="translate(-5.77 -114.76)"/><path class="train action-icon" d="M105.4,382.71H5.92C5.2,447.7,106.34,447.51,105.4,382.71Z" transform="translate(-5.77 -114.76)"/></svg>`;
    const bus = `<svg class="bus-svg svg" data-name="Bus Stop" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 484.99 246.28"><path class="bus action-icon" d="M7.68,174A117.33,117.33,0,0,1,10.21,153c2.89-14.6,12-23.21,27.23-24.9a184.3,184.3,0,0,1,20.06-1.23q176.43-.1,352.87,0c40.09,0,57.45,12,69.5,49.84,14.72,46.15,13.74,93.67,11,141.2-.62,10.64-7.32,15.84-18.16,15.89-10.56,0-21.14.49-31.67,0-7.69-.37-11.81,2-15.33,9.2-9.6,19.52-26.13,29.56-48.43,29.22-21.61-.32-37.83-10.1-46.95-29.27-3.49-7.32-7.83-9-15.38-9-39.85.35-79.7.48-119.54.06-8.83-.09-13.24,2.54-17.45,10.44-17.88,33.53-66.09,39.41-87.16,8.36-11.85-17.46-24.47-20-42.1-18.61a183.19,183.19,0,0,1-20.16,0C13,333.76,7.79,328.8,7.64,313.66c-.24-24-.06-48-.07-72C7.56,219.11,7.37,196.53,7.68,174Zm343.93,37.31c45.89,6.91,70.9,49,113.7,68.36,1.38-39.32,2-74.24-12.49-107.53-7-16.18-18.72-25-37.86-24.19-20.52.91-41.12.21-63.35.21ZM43.86,148.9c-4.47.19-11.74,6.49-12.38,10.75-2.17,14.28-2.33,28.91-2.2,43.39,0,2.46,5.26,6.93,8.16,7,26.75.54,53.51.32,81.3.32V148.4C93.42,148.4,68.6,147.85,43.86,148.9Zm283.75.27H247.39v60.17h80.22Zm-174.69-1c-2.81,0-5.61.35-9.55.6v60.75h79.51V148.12C198.79,148.12,175.86,148.1,152.92,148.14Zm7.84,171.77c-.25-16.18-14.33-29.61-30.52-29.1-15.64.48-29.09,13.84-29.38,29.18-.31,15.86,13.6,29.36,30.2,29.31C148.17,349.26,161,336.55,160.76,319.91Zm247.3-.45c-.57-15.39-14.32-28.58-29.87-28.67C362,290.7,347.87,304.6,348,320.47c.08,16.2,13.73,29.08,30.56,28.83S408.65,335.55,408.06,319.46Z" transform="translate(-7.5 -126.86)"/></svg>`;
    const metro = `<svg class="metro-svg svg" data-name="Metro Stop" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 443.39 443.46"><path class="metro action-icon" d="M248.88,36C128.32,36.73,27.62,137.6,28.46,256.75c.87,123.94,100.57,224.12,223,222.64,122.69-1.49,219.6-98.91,220.38-219.5C472.64,135.2,371.59,35.17,248.88,36Zm1.58,428.26c-116.7,0-206.61-91.83-206.77-211.28C43.55,143.28,137.54,51.37,249.91,51.3c115.72-.08,206.76,91.88,207,209.05C457.07,371.89,363.63,464.18,250.46,464.21Z" transform="translate(-28.45 -35.95)"/><path class="metro action-icon" d="M156.41,171.43h72.28V381H272V170.43h71.85V134.38H156.41Z" transform="translate(-28.45 -35.95)"/></svg>`;
    const tram = `<svg class="tram-svg svg" data-name="Tram Stop" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 462.06 384.91"><path class="tram action-icon" d="M480.86,276.24a72.35,72.35,0,0,0-2.5-18c-6.77-24.71-13.93-49.31-21-73.93-5.06-17.64-15.23-25.21-33.73-25.21H300.87c2.62-1.86,4-2.88,5.43-3.83,14.53-9.7,29.11-19.33,43.6-29.1,10.48-7.06,10.6-19.62.16-26.61Q304.73,69.16,259.25,39c-6.13-4.1-12.28-4.14-18.42,0C210.42,59.2,180,79.42,149.67,99.86a18.9,18.9,0,0,0-6.25,7.62c-3.07,6.84-.35,14,6.6,18.66q23.91,16,47.92,32c-.1.33-.19.66-.28,1h-5.23q-59.19,0-118.38,0c-15.41,0-26.62,8.5-30.87,23.29C36,207.68,28.65,232.9,21.69,258.22a70.55,70.55,0,0,0-2.54,17.51c-.29,22.29-.15,44.59-.1,66.88,0,18.85,13.24,32,32.2,32q198.74,0,397.47,0c19.18,0,32.23-13.15,32.25-32.42C481,320.18,481.15,298.21,480.86,276.24ZM95.72,282H49.17c.63-5.44.6-10.64,1.91-15.48,5.18-19.15,10.86-38.16,16.17-57.28.88-3.19,2.25-4.29,5.61-4.16,7.5.28,15,.08,22.86.08Zm92.43,0H127V205.33h61.13Zm-2.93-169.15c2.66-1.81,4.6-3.15,6.56-4.45C210,96.23,228.26,84,246.59,72c1.42-.93,4.21-1.62,5.35-.87,20.77,13.57,41.38,27.37,62.56,41.49-1.39,1.11-2.38,2-3.49,2.76-19.18,12.8-38.34,25.63-57.6,38.3-1.42.93-4.21,1.62-5.35.87C227.29,141,206.68,127.16,185.22,112.86ZM280.58,282H219.3V205.47h61.28ZM373,282h-61.1V205.32H373Zm77,.1H404.35V205.17c8.41,0,16.71-.08,25,.11a4,4,0,0,1,2.76,2.39c6,20.76,12.05,41.51,17.68,62.37C450.78,273.72,449.93,277.9,449.93,282.09Z" transform="translate(-18.97 -35.88)"/><path class="tram action-icon" d="M98,420.76c18.5-.69,37.3-14.71,40.7-30.34H53C58.45,408.59,77.77,421.52,98,420.76Z" transform="translate(-18.97 -35.88)"/><path class="tram action-icon" d="M188.63,420.79c19.17-.08,37.14-12.72,42.74-30.32h-86C151.11,408.27,169.22,420.87,188.63,420.79Z" transform="translate(-18.97 -35.88)"/><path class="tram action-icon" d="M311.35,420.79c19.41.08,37.46-12.45,43.27-30.33h-86C274.15,408,292.18,420.71,311.35,420.79Z" transform="translate(-18.97 -35.88)"/><path class="tram action-icon" d="M404.28,420.79c19.16-.08,37.15-12.74,42.72-30.31H361C366.76,408.29,384.86,420.87,404.28,420.79Z" transform="translate(-18.97 -35.88)"/></svg>`;
    const ferry = `<svg class="ferry-svg svg" data-name="Ferry" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 483.56 389.1"><path class="ferry action-icon" d="M487.8,215.08c-29.41,0-58.81-.1-88.22.1-4.31,0-6.94-1.36-9.51-4.73-18.63-24.43-37.47-48.71-56.23-73-7.95-10.31-18.21-15.78-31.44-15.71-24.44.13-48.88,0-73.32,0h-7V92.89c-10.8,0-20.86-.23-30.9.11-4.62.15-7.07-1.17-8.86-5.69-5.19-13.1-11.07-25.93-16.42-39-1.38-3.36-3.19-4.59-6.79-4.43-6.43.29-12.88.08-20.26.08,3,7.63,5.61,14.54,8.53,21.3,1.52,3.5,1.5,6.26-1,9.39a131.65,131.65,0,0,0-9.88,14C134.39,92.11,131.77,93,128,93c-28.26-.14-56.52-.08-84.78-.08H35.63v28.84H11.76v30.6H92v62.35H11.76V350.23a375.21,375.21,0,0,0,57.64,4.46c25.55-.05,50.38-5.19,75.37-9.53C178,339.4,211.16,333,244.61,329.05c16.43-1.93,33.57-.05,50.14,2.05a459.07,459.07,0,0,1,96,23c3.76,1.34,4.74-1,6.26-3.09q31.45-43.29,62.89-86.61,16-22,31.94-44c1-1.36,1.85-2.79,3.49-5.27Zm-264.89-.48H116.78V152.35H222.91Zm25.94.08V151.94c11.74,0,23,.09,34.17,0,12.39-.13,22.85,4.33,30.65,13.83,9.79,11.92,19,24.3,28.47,36.5,3,3.86,5.88,7.79,9.38,12.43Z" transform="translate(-11.76 -43.89)"/><path class="action-icon" d="M266.29,370.35c-25.87,3.12-51.59,7.88-77.19,12.89-40.74,8-81.55,14.26-123.25,11.11a354.94,354.94,0,0,1-54.09-8.65v37c26.4,6.11,53.06,10.47,80.43,10.25,28-.23,55.34-5.42,82.72-10.57s54.6-10.85,82.14-14.46c37.53-4.94,74.66-.4,111,9.64,6.78,1.88,10.22.59,13.72-5.16,4.93-8.1,10.73-15.66,16.5-23.95C354.64,374.73,311.34,364.92,266.29,370.35Z" transform="translate(-11.76 -43.89)"/></svg>`;
    const house = `<svg class="house-svg svg" data-name="Home Address" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 482.39 454.25"><path class="house action-icon" d="M311.45,477c0-34.4,0-67.4,0-100.4,0-14.79.13-29.59-.09-44.37-.16-11.41-2.83-13.93-14.14-13.95q-45.93-.09-91.85,0c-13.27,0-15.64,2.24-15.66,15.56q-.11,65,0,130v13.21H113.57c-9.29,0-18.58-.14-27.86,0-8.47.16-12.85-3.49-12.84-12.23,0-62.95-.1-125.91.25-188.86,0-4.24,2.5-9.47,5.54-12.54Q160.08,181.55,242,100.09c7.88-7.87,10.53-7.68,19.51,1.29,49.63,49.57,98.73,99.69,149.16,148.43,13.4,12.95,18.19,26,17.84,44.16-1.05,55.36-.37,110.76-.38,166.15,0,15.35-1.59,16.89-17.32,16.9C378.17,477,345.55,477,311.45,477ZM459.11,278.1c4,3.93,12.11,7.4,16.95,6.08,16.71-4.57,20-21.05,7.72-33.44-19.15-19.27-38.61-38.24-57.43-57.82l.48-98.61c-1-7.64-9.06-5.68-14.63-5.71-27.52-.13-55,.19-82.55-.3a21.51,21.51,0,0,1-13.3-5.39C298.2,65.57,280.66,47.6,262.82,30c-9.46-9.34-15.21-9.45-24.44-.23Q127.48,140.5,16.72,251.41c-10.88,10.89-10.52,16.06,1,27.38,9.17,9,15.12,8.8,25.11-1.18,69.7-69.74,138.26-137.74,207.58-208.42C319.9,139.89,388.89,208.45,459.11,278.1Z" transform="translate(-8.81 -22.87)"/></svg>`
    const plane = `<svg class="plane-svg svg" data-name="Airport" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 463.45 439.97"><path class="plane action-icon" d="M159.49,469.77l57.89-185h-3.81q-60.19,0-120.38-.05a5.87,5.87,0,0,0-5.33,2.65C77.63,301.16,67.24,314.84,57,328.62a5.23,5.23,0,0,1-4.77,2.44C41.84,331,31.45,331,20.57,331c.32-1.51.49-2.66.81-3.78,7.11-24.87,14.27-49.73,21.32-74.63a10,10,0,0,0,0-5.19c-7-24.9-14.2-49.76-21.32-74.63-.3-1.06-.51-2.16-.83-3.55,1.19-.11,2.15-.28,3.11-.28,9.49,0,19,.05,28.48-.06a5.21,5.21,0,0,1,4.78,2.41C67.24,185.17,77.69,199,88,212.82a5.3,5.3,0,0,0,4.73,2.52q60.53-.09,121.05-.05c1,0,2-.12,3.54-.22C198,153.42,178.86,92.13,159.52,30.36c1.31-.11,2.35-.28,3.4-.28,13.34,0,26.68.05,40-.07a4.75,4.75,0,0,1,4.58,2.64c36.34,58.17,72.84,116.25,109,174.55,3.76,6.07,7.51,8.39,14.81,8.31,39.11-.45,78.22-.25,117.33-.2,19.08,0,35.07,15.47,35.37,33.95.31,18.81-15.24,35-34.25,35.43-10.17.23-20.34.07-30.52.07-30.85,0-61.71.07-92.57-.09-3.57,0-5.57,1-7.51,4.09q-55.68,89.33-111.58,178.52a5,5,0,0,1-4.88,2.71c-13.22-.12-26.45-.06-39.67-.07C162,469.92,161,469.84,159.49,469.77Z" transform="translate(-20.55 -30.01)"/></svg>`
    const location = `<svg class="location-svg svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 375.01 470.94"><g id="Layer_1" data-name="Layer 1"><path class="action-icon" d="M237.15,14.49h25.76a32,32,0,0,0,4,.82,179.31,179.31,0,0,1,73.21,22.34C375.84,57.48,402.67,86,420,123.13c18.15,39,22.11,79.56,12.42,121.45-8.63,37.26-25.93,70.54-47.47,101.75C355,389.73,318.8,427.54,279,461.91c-9.36,8.08-19.12,15.7-28.69,23.52-1.85-1.28-3.25-2.19-4.6-3.19-44.68-33.13-84.73-71-118.55-115.31-24.64-32.27-44.58-67-55.91-106.24-8.22-28.45-11.14-57.4-6.53-86.81,5.95-37.94,21.92-71.15,48.12-99.3Q154.31,30,214.12,18.08C221.73,16.56,229.47,15.67,237.15,14.49ZM339.32,202a89.21,89.21,0,0,0-89-89.35c-49.3-.33-89.52,39.68-89.62,89.16a89.3,89.3,0,1,0,178.6.19Z" transform="translate(-62.49 -14.49)"/></g><g id="Layer_2" data-name="Layer 2"><path class="action-icon" d="M339.3,202a89.3,89.3,0,1,1-178.6-.19c.1-49.48,40.32-89.49,89.62-89.16A89.21,89.21,0,0,1,339.3,202Z" transform="translate(-62.49 -14.49)"/></g></svg>`
    switch(category) {
        case "metroStation": return metro;
        case "railStation": return train;
        case "busStation":
        case "onstreetBus": return bus;
        case "tramStation":
        case "onstreetTram": return tram;
        case "harbourPort":
        case "ferryPort":
        case "ferryStop": return ferry;
        case "vegadresse": return house;
        case "airport" : return plane;
        case "POI":
        case "Street":
        case "Street address": return location;
        default: return "";
    }
}

//Filter method for returning only unique values in an array
function onlyUnique(v, i, self) {
    return self.indexOf(v) === i;
}
function getFeatureCategories(categories) {
    let template = ``;

    categories = categories.filter(onlyUnique)

    let usedOptions = [];
    for(let category of categories) {
        const svg = getCategorySVG(category);
        if(usedOptions.includes(svg)) {
            continue;
        } else {
            usedOptions.push(svg)
        }
        template += svg;
    }

    return template;
}

function addToDropdown(features, loc) {
    let template = "";

    console.log(features)

    if(!features) {
        template = `<div class="droplist-content">Søk etter steder</div>`
    } else {
        for(let i = 0; i < features.length; i++){
            const label = features[i].properties.label;

            let placeName = label.lastIndexOf(',') > 0 ? label.substring(0,label.lastIndexOf(',')) : label;
            let areaName = label.lastIndexOf(',') > 0 ? label.substring(label.lastIndexOf(',')+1) : "";

            let countyDescriptor = areaName ? `${areaName.trim()}, ${features[i].properties.county}` : `${features[i].properties.county}`;

            template += `
            <div class="droplist-content" onclick="setSelectedPlace('${features[i].properties.label}', 
            '${features[i].geometry.coordinates[1]}',
            '${features[i].geometry.coordinates[0]}',
            '${loc}')">
                <div class="place-label">
                    <p class="place-name">${placeName}</p>
                    <p class="place-area">${countyDescriptor}</p>
                </div>
                <div class="place-options">
                    ${getFeatureCategories(features[i].properties.category)}
                </div>
            </div>
        `
        }
    }

    document.getElementById(loc + "-droplist").innerHTML = template;
}

function checkLocation(){
    if(locationData.from.address === locationData.to.address){
        alert("Samme lokasjoner støttes ikke!");
    } else {
        let fromLatLng = [locationData.from.lat, locationData.from.lng];
        let toLatLng = [locationData.to.lat, locationData.to.lng];
        let fromName = locationData.from.address;
        let toName = locationData.to.address;

        let url = `date-time.html?from=(${fromLatLng[0]},${fromLatLng[1]})&to=(${toLatLng[0]},${toLatLng[1]})&fromname=${encodeURI(fromName)}&toname=${encodeURI(toName)}`

        if(!(fromName === "Min Posisjon")) {
            updateHistory(url, fromName, toName);
        }

        window.location.href = url;
    }
    
}

/* SEARCH HISTORY */
function updateHistory(newSearch, from, to) {
    let history = JSON.parse(localStorage.getItem("history"));
    const historyLimit = 5; //Search history limit


    if(!history){
        history = []; //if empty, create new array
    }

    let entry = {
        url: newSearch,
        from: from,
        to: to
    }

    for(let route of history) { // Removes if already added
        if(route.from === entry.from && route.to === entry.to) {
            history.splice(history.indexOf(route), 1);
            break;
        }
    }

    if(history.length >= historyLimit) {
        history.splice(history.length-1, 1) //Remove oldest entry. Limits to 10 entries
    }

    let user = JSON.parse(localStorage.getItem("user"));
    if(user) {
        updateUser(user.email, user.password, {searchHistory: entry})
    }

    history.unshift(entry); // Adds to start of history array
    localStorage.setItem("history", JSON.stringify(history))
}
function generateSearchHistory() {
    const list = document.getElementById("generated-history");
    const history = JSON.parse(localStorage.getItem("history"));

    if(history){
        for(let item of history) {
            let listElement = document.createElement("div");

            let listTitle = document.createElement("p");
            listTitle.innerHTML = `<span>${item.from}</span> - <span>${item.to}</span>`
            listElement.appendChild(listTitle);

            listElement.addEventListener('click', () => {
                window.location.href = item.url; //Redirects to the route
            })

            list.appendChild(listElement);
        }
    } else {
        const historyContainer = document.getElementById("search-history")
        historyContainer.style.display = "none";
    }
}

/* PAGE RENDERING */
function renderMainIndex(){
    mainContainer.innerHTML =  "";

    /* Welcome message */
    let welcomeMessage;
    const user = JSON.parse(localStorage.getItem("user"));
    let fullName;
    if(user){
        fullName = sanitizeHTML(`${user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)} ${user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1)}`);
        welcomeMessage = `Velkommen ${fullName}!`
    } else {
        welcomeMessage = `Ha en god tur!`
    }

    const bothLocationsSet = locationData.from && locationData.to;

    const template = `
        <main id="page-container">
        
            <header id="header-container">
                <div id="logo-container">
                    <img id="logo" src="res/img/logos/vy_reiser_logo_transparent.png" alt="">
                </div><!--end logo-container-->
            </header>
            
            <div id="hello-container">
                <h4 id="hello-text">${welcomeMessage}</h4>
            </div> <!--end hello-container-->
            
            <div id="main-container">
                <div id="destination-container">
                    <div id="from-input-container" class="input-container front">
                        <input id="from-input" class="destination-input" value="${locationData.from ? locationData.from.address : ""}" type="text" name="from" placeholder="Reise fra..." onclick="renderIndexSearch('from');" oninput="updateDropdown('from')">
                    </div><!--end from-input-container-->
        
                    <div id="to-input-container" class="input-container front">
                        <input id="to-input" class="destination-input" value="${locationData.to ? locationData.to.address : ""}" type="text" name="to" placeholder="Reise til..." onclick="renderIndexSearch('to');" oninput="updateDropdown('to')">
                    </div><!--end to-input-container-->
        
                    <div id="route-button-container">
                        <button onclick="checkLocation()" id="route-button" class="route-button button ${bothLocationsSet ? "route-ready" : "route-unready"}">
                            Finn Rute
                            <svg class="route-pointer" data-name="Finn Rute Knapp" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 495.57 498.05"><path class="route-icon" d="M326.47,499,227,276.13,2.21,179.87,497.79,1Z" transform="translate(-0.85 -0.15)"/></svg>
                        </button>
                    </div>
                </div>
            
                <div id="search-history">
                    <h4>Søkehistorikk</h4>
                    <div id="generated-history">
                        <!-- Generate search history here -->
                    </div>
                </div>
                
                </main>
    `
    container.innerHTML = template;
    generateSearchHistory();
}

function clearInput(loc) {
    document.getElementById(loc + "-input").value = "";
}

function getCurrentLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setCurrentLocation);
    } else {
        alert("Nope!")
    }
}

function setCurrentLocation(position) {
    console.log(position)
    setSelectedPlace("Min Posisjon", position.coords.latitude, position.coords.longitude, currentlyViewing)
}

function renderIndexSearch(loc) {
    currentlyViewing = loc;

    const template = `
        <div id="${loc}-input-container" class="input-container search">
            <button id="back-arrow" class="search-icons" onclick="renderMainIndex()">
                <svg class="back-svg" data-name="Back to front page" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 359.66 500"><defs><style>.cls-1{fill:none;}</style></defs><path class="cls-1" d="M395.67,0" transform="translate(-55.2)"/><path class="back-icon" d="M414.86,0,199.52,252,414.86,500H271.52L55.2,252,271.52,0Z" transform="translate(-55.2)"/></svg>
            </button>
            <input id="${loc}-input" class="destination-input" type="text" name="${loc}" placeholder="Reise ${loc === "to" ? "til" : "fra"}..." autocomplete="off" oninput="updateDropdown('${loc}')">
            <button id="clear-x" class="search-icons" onclick="clearInput('${loc}')">
                <svg class="x-svg" data-name="Clear input" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430 430"><line class="x-icon" x1="35" y1="35" x2="395" y2="395"/><line class="x-icon" x1="395" y1="35" x2="35" y2="395"/></svg>
            </button>
        </div>
        <button class="my-location" onclick="getCurrentLocation('${loc}')">Søk fra Min Posisjon</button>
        <div>
            <div id="${loc}-droplist" class="droplist"></div>
        </div>
    `;

    container.innerHTML = template; //Render the search page

    document.getElementById(`${loc}-input`).focus();
}

// Cookie code

const acceptCookie = document.getElementsByClassName("accept-btn")[0].onclick = acceptedCookieData;
const settingsCookie = document.getElementsByClassName("settings-btn")[0];
const xCookie = document.getElementsByClassName("x-container")[0];
const cookie = document.getElementsByClassName("cookie-container")[0];

// Renders cookie depending on saved setting or not
function cookieRender() {
    const cookieStatus = localStorage.getItem("cookieAccepted");
    if(cookieStatus === "true") {
        cookie.style.display = "none";
    } else {
        cookie.style.display = "block";
    }
}

// Set cookie true on user
function acceptedCookieData() {
    cookie.style.display = "none";
    localStorage.setItem("cookieAccepted", "true");
}

renderMainIndex(); //Sets the user's name in welcome message if they are logged in
cookieRender();
/*
window.location.href='html/date-time.html?from=('+ locationData.from.lat + ',' + locationData.from.lng +')&to=('+ locationData.to.lat + ',' + locationData.to.lng +')&fromname=' + encodeURI(locationData.from.address) + '&toname=' + encodeURI(locationData.to.address)"
*/



