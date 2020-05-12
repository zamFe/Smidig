const express = require("express");
const api = require("../api-calls");

const router = express.Router();

router.post("/api/routes", (req, res) => {
    api.getRoute(req.query.from, req.query.to, req.query.datetime, res);
})

router.post("/api/location", (req, res) => {
    api.getLocation(req.query.q, res);
})

router.post("/api/db", (req, res) => {
    api.databaseHandling(req.query.action, req.query.user, res);
})

module.exports = router;