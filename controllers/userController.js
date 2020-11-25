const express = require('express');
const router = express.Router();
const db = require('../models');

router.get("/", (req, res) => {
    db.User.findAll().then(dbUsers => {
        res.json(dbUsers)
    })
});

router.post("/", (req, res) => {
    db.User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }).then(newUser => {
        res.json(newUser)
    })
})

module.exports = router;