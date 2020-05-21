let locationData = {
    from: null, 
    to: null
}

let inputDelay;

document.getElementById("dark-screen").addEventListener("click", (e) =>  {
    e.stopPropagation();
    document.getElementById("from-droplist").style.display = "none"; 
    document.getElementById("dark-screen").style.display = "none";
})

document.getElementById("dark-screen").addEventListener("click", (e) =>  {
   e.stopPropagation();
    document.getElementById("to-droplist").style.display = "none";
    document.getElementById("dark-screen").style.display = "none";
})

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

        console.log("Post");
    }, 600)
}

document.getElementById("swap-from-to").addEventListener("click", (e) => {
    let tempData = locationData.from;
    locationData.from = locationData.to;
    locationData.to = tempData;
    document.getElementById("from-input").value = locationData.from.address;
    document.getElementById("to-input").value = locationData.to.address;
})


function fromDropdownMenu(){
    document.getElementById("dark-screen").style.display = "block";
    document.getElementById("from-droplist").style.display = "block";
}


function toDropdownMenu(){
    document.getElementById("dark-screen").style.display = "block";
    document.getElementById("to-droplist").style.display = "block";
}


function getName(address, lat, lng, loc){

    console.log(address, lat, lng);
    locationData[loc] = {
        address, lat, lng
    };

    if(locationData.from && locationData.to){
        document.getElementById("swap-from-to").style.display = "inline-block";
        document.getElementById("route-button").style.opacity = "1";
        document.getElementById("route-button").style.pointerEvents = "auto";
    } else {
        document.getElementById("swap-from-to").style.display = "none";
        document.getElementById("route-button").style.opacity = ".3";
        document.getElementById("route-button").style.pointerEvents = "none";
    }

    document.getElementById(loc + "-input").value = address;
    document.getElementById(loc + "-droplist").style.display = "none";
    document.getElementById("dark-screen").style.display = "none";
}

function setup(){
    /* Welcome message */
    const elem = document.getElementById("hello-span");
    const user = JSON.parse(localStorage.getItem("user"));
    if(user){
        elem.innerText = `God reise, ${user.firstName} ${user.lastName}`
    } else {
        elem.innerText = `Ha en god tur!`
    }
}

function addToDropdown(features, loc) {
    
    // Creates an error message upon API Call failures
    console.log(features);

    let template = "";

    for(let i = 0; i < features.length; i++){
        template += `
            <div class="droplist-content" onclick="getName('${features[i].properties.label}', 
            '${features[i].geometry.coordinates[1]}',
            '${features[i].geometry.coordinates[0]}',
            '${loc}')">
                <span class="dropdown-span"> ${features[i].properties.label}</span>
            </div>
        `
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

        updateHistory(url, fromName, toName);

        window.location.href = url;
    }
    
}

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

setup(); //Sets the user's name in welcome message if they are logged in

generateSearchHistory(); //renders history from LocalStorage


/*
window.location.href='html/date-time.html?from=('+ locationData.from.lat + ',' + locationData.from.lng +')&to=('+ locationData.to.lat + ',' + locationData.to.lng +')&fromname=' + encodeURI(locationData.from.address) + '&toname=' + encodeURI(locationData.to.address)"
*/