const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.send("My Keebs")
});

module.exports = router;