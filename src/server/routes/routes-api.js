const express = require("express");
const apiCalls = require("../api-calls");

const router = express.Router();

router.post("/api/routes", (req, res) => {
    api.getLocation(req.query.q, res);
})

module.exports = router;