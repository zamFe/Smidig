
async function rerouteTrip(trip, stepIndex, priority) {

    console.log("route, stepIndex")
    console.log(trip, stepIndex)

    let cancelled = trip.route[stepIndex]

    let last = trip.route[trip.route.length-1]


    const url = `/api/routes?from=(${cancelled.from.lat},${cancelled.from.lng})&to=(${last.to.lat},${cancelled.to.lng})&priority=${priority}`

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

    console.log(payload.data)
}                           