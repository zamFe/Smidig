let fullRoute;

let urlParams = new URLSearchParams(window.location.search);

let searchData = {
    from: urlParams.get('from'),
    to: urlParams.get('to'),
    currentTime: urlParams.get('datetime')
}

let rememberState = localStorage.getItem("rememberstate");

async function renderRoutes(priority) {

    if (!searchData.currentTime) {
        searchData.currentTime = Math.floor(new Date().getMilliseconds() / 1000)
    }

    if(rememberState) {
        fullRoute = JSON.parse(localStorage.getItem("route"))
        localStorage.removeItem("rememberstate")
        setUp();
        return;
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

    // Sorting
    fullRoute.sort((a, b) => (a.startTime > b.startTime) ? 1 : -1);

    setUp()
}