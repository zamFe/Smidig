async function getUser(email, password) { // Login
    const url = `${window.location.origin}/api/db/loginuser?email=${email}&password=${hash(password)}`

    var response = await getDbRequest(url);

    if (response.payload.statusCode === 200) {
        var modified = response.payload.data;
        modified.password = password;
        localStorage.setItem("user", JSON.stringify(modified));
    }

    return response.payload;
}

async function updateUser(email, password, packet) {
    const url = `${window.location.origin}/api/db/updateuser?email=${email}&password=${hash(password)}`

    var response = await getDbRequest(url, JSON.stringify(packet));

    if (response.payload.statusCode === 200) {
        var modified = response.payload.data;
        modified.password = password;
        localStorage.setItem("user", JSON.stringify(modified));
    }


    return response.payload;
}

async function createUser(email, password, firstname, lastname) {
    const url = `${window.location.origin}/api/db/createuser?email=${email}&password=${hash(password)}&firstname=${firstname}&lastname=${lastname}`

    console.log(url)
    var response = await getDbRequest(url);
    if (response.payload.statusCode === 200) {
        var modified = response.payload.data;
        modified.password = password;
        localStorage.setItem("user", JSON.stringify(modified));
    }

    return response.payload;
}

async function getDbRequest(url, body = null) {
    let response;
    let payload;

    try {
        response = await fetch(url, {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: body
        })

        payload = await response.json();
    } catch (e) {
        console.log(e);
    }
    return {response,payload};
}

function hash(password) {
    return sha256(password + "ohohStinky")
}