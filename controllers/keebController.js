const express = require('express');
const router = express.Router();
const db = require('../models');
const jwt = require('jsonwebtoken');

const checkAuthStatus = request => {
    if (!request.headers.authorization) {
        return false
    }
    // splits the Bearer token into an array, get token by getting index of 1
    const token = request.headers.authorization.split(" ")[1]

    const loggedInUser = jwt.verify(token, 'secretString', (err, data) => {
        if (err) {
            return false
        } else {
            return data
        }
    });
    console.log(loggedInUser)
    return loggedInUser
}

router.get("/", (req, res) => {
    db.Keebs.findAll().then(keebs => {
        res.json(keebs)
    }).catch(err => {
        console.log(err)
        res.status(500).send("Unable to find keebs")
    })
});

router.post("/", (req, res) => {
    const loggedInUser = checkAuthStatus(req);
    if(!loggedInUser) {
        return res.status(401).send("Please login first,")
    }
    db.Keebs.create({
        name: req.body.name,
        size: req.body.size,
        maker: req.body.maker,
        case: req.body.case,
        color: req.body.color,
        plate: req.body.plate,
        UserId: loggedInUser.id
    }).then(newKeeb => {
        res.json(newKeeb)
    }).catch(err => {
        console.log(err)
        res.status(500).send("Unable to find keebs")
    })
});

module.exports = router;