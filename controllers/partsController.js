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

    const loggedInUser = jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
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
    db.Parts.findAll().then(parts => {
        res.json(parts)
    }).catch(err => {
        console.log(err)
        res.status(500).send("Unable to find keebs")
    })
});

router.get("/:id", (req, res) => {
    db.Parts.findOne({
        where: {
            id: req.params.id
        }
    }).then(dbPart => {
        res.json(dbPart)
    }).catch(err => {
        console.log(err)
        res.status(500).send("Unable to find keebs")
    })
})

router.post("/", (req, res) => {
    const loggedInUser = checkAuthStatus(req);
    if (!loggedInUser) {
        return res.status(401).send("Please login first,")
    }
    db.Parts.create({
        switches: req.body.switches,
        springWeight: req.body.springWeight,
        springLube: req.body.springLube,
        switchLube: req.body.switchLube,
        switchFilm: req.body.switchFilm,
        stabs: req.body.stabs,
        stabLube: req.body.stabLube,
        keyset: req.body.keyset,
        UserId: loggedInUser.id,
        KeebId: req.body.KeebId
    }).then(newKeeb => {
        res.json(newKeeb)
    }).catch(err => {
        console.log(err)
        res.status(500).send("Unable to find keebs")
    })
});

router.put("/:id", (req, res) => {
    const loggedInUser = checkAuthStatus(req);
    if (!loggedInUser) {
        return res.status(401).send("Please login first,")
    }
    db.Parts.findOne({
        where: {
            id: req.params.id
        }
    }).then(keeb => {
        if (loggedInUser.id === keeb.UserId) {
            db.Parts.update({
                switches: req.body.switches,
                springWeight: req.body.springWeight,
                springLube: req.body.springLube,
                switchLube: req.body.switchLube,
                switchFilm: req.body.switchFilm,
                stabs: req.body.stabs,
                stabLube: req.body.stabLube,
                keyset: req.body.keyset,
                KeebId: req.body.KeebId
            },
                {
                    where: {
                        id: keeb.id
                    }
                }).then(editKeeb => {
                    res.json(editKeeb)
                }).catch(err => {
                    console.log(err)
                    res.status(500).send("Unable to find keeb")
                })
        } else {
            return res.status(401).send("Not your keeb!")
        }
    })
})

router.delete("/:id", (req, res) => {
    const loggedInUser = checkAuthStatus(req);
    if (!loggedInUser) {
        return res.status(401).send("Please login first,")
    }
    db.Parts.findOne({
        where: {
            id: req.params.id
        }
    }).then(part => {
        if (loggedInUser.id === part.UserId) {
            db.Parts.destroy({
                where: {
                    id: part.id
                }
            }).then(delPart => {
                res.json(delPart)
            }).catch(err => {
                console.log(err)
                res.status(500).send("Unable to find keeb")
            })
        } else {
            return res.status(401).send("Not your keeb!")
        }
    })
})

module.exports = router;