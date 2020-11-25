const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcrypt');

router.get("/", (req, res) => {
    db.User.findAll().then(dbUsers => {
        res.json(dbUsers)
    }).catch(err => {
        console.log(err)
        res.status(500).end()
    })
});

router.post("/", (req, res) => {
    db.User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }).then(newUser => {
        res.json(newUser)
    }).catch(err => {
        console.log(err)
        res.status(500).end()
    })
})

router.post("/login", (req,res) => {
    db.User.findOne({
        where: {
            email: req.body.email,
        }
    }).then(foundUser => {
        if(!foundUser){
            return res.status(404).send("User not found")
        }
        if(bcrypt.compareSync(req.body.password, foundUser.password)) {
            return res.status(200).send("login successful")
        } else {
            return res.status(403).send("incorrect password")
        }
    })
})

module.exports = router;