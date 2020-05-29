const express = require("express");
const api = require("../api-calls");
const users = require("../db/user-repo.js");
const notif = require("../routeNotifications")

const router = express.Router();

router.post("/routes", (req, res) => {
    api.getRoute(req.query.from, req.query.to, req.query.datetime, req.query.priority, res);
})

router.post("/location", (req, res) => {
    api.getLocation(req.query.q, res);
})

router.post("/updatedtrip", (req, res) => {
    notif.notifyChange(res.body);
})

router.post("/log", (req, res) => {
    console.log(res.body);

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