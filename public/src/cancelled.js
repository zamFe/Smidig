
async function rerouteTrip(trip, tripIndex, stepIndex, priority) {

    let cancelled = trip[tripIndex].route[stepIndex]
    let last = trip[tripIndex].route[trip[tripIndex].route.length-1]

    const url = `/api/routes?from=(${cancelled.from.lat},${cancelled.from.lng})&to=(${last.to.lat},${last.to.lng})&datetime=${cancelled.startTime}&priority=${priority}`

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

    let data = payload.data
    data = data.filter(a => a.startTime > cancelled.startTime);
    data.sort((a, b) => (a.startTime > b.startTime) ? 1 : -1);
    if (data.length === 0) return;

    let newRoute = data[0].route
    let route = JSON.parse(localStorage.getItem("route"));

    route[tripIndex].route = route[tripIndex].route.slice(0, stepIndex+1).concat(newRoute);
    route[tripIndex].endTime = route[tripIndex].route[route[tripIndex].route.length-1].endTime;

    localStorage.setItem("route", JSON.stringify(route))


    fullRoute = route;
    setUp()
}