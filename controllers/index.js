const express = require('express');
const router = express.Router();
// import all user routes
const userRoutes = require('./userController');

router.get("/", (req, res) => {
    res.send("My Keebs")
});

// use all user routes
router.use("/api/users", userRoutes);

module.exports = router;