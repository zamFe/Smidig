const fs = require("fs");
const crypto = require('crypto');

const salt = "OhOhStinky";

let sampleUser = {
    email: "ole-nordmann@yahoo.no",
    firstName: "Ole",
    lastName: "Nordmann",
    password: "løfreaglrkehtgaerfhgajkdfhgkjadfghdf",
    searchHistory: [
        // A location object
    ],
    favorites: [
        // Location object
    ]
}

function getUserPath (email) {
    return `src/server/db/Users/${hashString(email)}.json`;
}

function createUser(email, password, firstname, lastname) {

    if (!email || !password || !firstname || !lastname) {
        return {
            status: "Not all credentials are inserted!",
            statusCode: 400
        };
    }

    var path = getUserPath(email);
    console.log(path)
    if (fs.existsSync(path)) {
        // User already exists
        return {
            status: "Email is already in use!",
            statusCode: 401
        };
    }

    var user = {
        email: email,
        firstName: firstname,
        lastName: lastname,
        password: hashString(password + salt),
        searchHistory: [],
        favorites: []
    }

    saveUser(user);

    return {
        status: "User created successfully!",
        statusCode: 200
    };
}

function loginUser(email, password) {

    if (!email || !password) {
        return {
            status: "Not all credentials are inserted!",
            statusCode: 400
        };
    }

    var user = authenticateUser(email, password);
    if (user) {
        return {
            data: user,
            status: "Correct credentials, login in!",
            statusCode: 200
        }
    }

    return {
        status: "Incorrect email or password!",
        statusCode: 401
    };
}

function authenticateUser(email, password) {

    var path = `src/server/db/Users/${hashString(email)}.json`;
    console.log(path)
    if (fs.existsSync(path)) {
        // User exists

        var data = JSON.parse(fs.readFileSync(path, 'utf8'));

        if (data["password"] === hashString(password + salt)) {
            return data;
        }
    }

    return null;
}

function saveUser(user){
    fs.writeFileSync(getUserPath(user.email), JSON.stringify(user), 'utf8');
}

function updateUserData(email, password, searchHistory, favoriteSearches) {

    if (!email || !password) {
        return {
            status: "Not all credentials are inserted!",
            statusCode: 400
        };
    }

    var user = authenticateUser(email, password);
    if (user) {
        if (searchHistory) {
            user.searchHistory = searchHistory;
        }

        if (favoriteSearches) {
            user.favorites = favoriteSearches;
        }

        saveUser(user);

        return {
            data: user,
            status: "Successfully updated the data!",
            statusCode: 200
        };
    }
    return {
        status: "Could not update the data!",
        statusCode: 401
    };
}

function hashString(toHash) {
    var crypto = require('crypto');
    return crypto.createHash('sha256')
        .update(toHash)
        .digest('base64');
}

module.exports = {loginUser, createUser, updateUserData};