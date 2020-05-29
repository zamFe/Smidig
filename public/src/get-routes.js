let fullRoute;

let urlParams = new URLSearchParams(window.location.search);

let searchData = {
    from: urlParams.get('from'),
    to: urlParams.get('to'),
    currentTime: urlParams.get('datetime')
}

console.log(searchData);


async function renderRoutes(priority) {

    if (!searchData.currentTime) {
        searchData.currentTime = Math.floor(new Date().getMilliseconds() / 1000)
    }

    const url = `${window.location.origin}/api/routes?from=${searchData.from}&to=${searchData.to}&datetime=${searchData.currentTime}&priority=${priority}`

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

    // Sorting
    fullRoute.sort((a, b) => (a.startTime > b.startTime) ? 1 : -1);

    setUp()
}
/*
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
}*/

renderRoutes("(0.1, 0.1 ,0.1 ,2.0)"); //Default priority Convenience
//from: (59.9233,10.79249)
//to: (60.7945331,11.067997699999978)