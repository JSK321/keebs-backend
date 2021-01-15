const express = require('express');
const router = express.Router();
// import all user routes
const userRoutes = require('./userController');
const keebRoutes = require('./keebController');
const partsRoutes = require('./partsController');
const extrasRoutes = require('./extrasController');

router.get("/", (req, res) => {
    res.send("My Keebs")
});

// use all user routes
router.use("/api/users", userRoutes);
router.use("/api/keebs", keebRoutes);
router.use("/api/parts", partsRoutes);
router.use("/api/extras", extrasRoutes);

module.exports = router;