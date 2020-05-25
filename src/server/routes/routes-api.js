const express = require("express");
const api = require("../api-calls");
const users = require("../db/user-repo.js");
/*console.log(users.createUser("andreas@hotmail.com", "apeKatten", "andreas", "østby"));
console.log(users.loginUser("andreas@hotmail.com", "apeKatten"));

console.log(users.createUser("andreas@hotmail.com", "apeasKatten", "aasdndreas", "øby"));
console.log(users.loginUser("andreas@hotmail.com", "apeKattenen"));
*/
const router = express.Router();

router.post("/routes", (req, res) => {
    api.getRoute(req.query.from, req.query.to, req.query.datetime, res);
})

router.post("/location", (req, res) => {
    const payload = api.getLocation(req.query.q, res);
})

router.post("/log", (req, res) => {
    console.log(res.body()) //;
    console.log("WEBHOOK HOOKED");
});

router.get("/map", (req, res) => {
    api.getMap(res)
})

router.post("/db/createuser", (req, res) => {
    res.send(
        users.createUser(req.query.email, req.query.password, req.query.firstname, req.query.lastname)
    );
})

router.post("/db/loginuser", (req, res) => {
    res.send(
        users.loginUser(req.query.email, req.query.password)
    );
})

router.post("/db/updateuser", (req, res) => {
    res.send(
        users.updateUserData(req.query.email, req.query.password, req.body.searchHistory, req.body.favorites)
    );
})

module.exports = router;