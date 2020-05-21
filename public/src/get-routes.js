let fullRoute;

let urlParams = new URLSearchParams(window.location.search);

let searchData = {
    from: urlParams.get('from'),
    to: urlParams.get('to'),
    currentTime: urlParams.get('datetime')
}

console.log(searchData);


async function renderRoutes() {

    if (!searchData.currentTime) {
        searchData.currentTime = Math.floor(new Date().getMilliseconds() / 1000)
    }

    const url = `${window.location.origin}/api/routes?from=${searchData.from}&to=${searchData.to}&datetime=${searchData.currentTime}`

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
        console.log(e);
    }

    fullRoute = payload.data;

    // Creates an error message upon API Call failures
    console.log(fullRoute);

    //Error handler
    /*
    let container = document.getElementById('error-container');
    if (typeof (fullRoute) !== 'object') {
        container.innerHTML = "";
        if (fullRoute.substring(0, 6) == 'Error:') {
            let errorBox = document.createElement('div');
            errorBox.style.position = 'absolute';
            errorBox.style.width = '100%';
            errorBox.style.height = '5vh';
            errorBox.style.zIndex = '100';
            errorBox.style.margin = '0 0 auto 0';
            errorBox.style.top = '0px';
            errorBox.style.fontSize = '1rem';
            errorBox.style.backgroundColor = 'rgba(200,100,100,0.9)';
            errorBox.style.color = '#ffffff';
            errorBox.style.textAlign = 'center';
            let errorTextElem = document.createElement('p');
            errorTextElem.innerText = "API Call Error - Fallback Data Displayed";
            errorBox.appendChild(errorTextElem);
            container.appendChild(errorBox);

            fullRoute = fallbackData.routeList; //Sets route-list
        }
    } else {
        container.innerHTML = "";
    }
    */

    // Sorting
    fullRoute.sort((a, b) => (a.startTime > b.startTime) ? 1 : -1);

    setUp()
}

async function fetchReroute(from, to, time) {
    const url = `${window.location.origin}/api/routes?from=${from}&to=${to}&datetime=${time}`;

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
        console.log(e);
    }

    return payload.data;
}

renderRoutes();
//from: (59.9233,10.79249)
//to: (60.7945331,11.067997699999978)