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
    db.Extras.findAll().then(data => {
        res.json(data)
    }).catch(err => {
        console.log(err)
        res.status(500).send("Unable to find Extras")
    })
});

router.get("/:id", (req, res) => {
    db.Extras.findOne({
        where: {
            id: req.params.id
        },
    }).then(keysetData => {
        res.json(keysetData)
    }).catch(err => {
        console.log(err)
        res.status(500).send("Unable to find keyset")
    })
})

router.post("/", (req, res) => {
    const loggedInUser = checkAuthStatus(req);
    if (!loggedInUser) {
        return res.status(401).send("Please log in first")
    }
    db.Extras.create({
        keyset: req.body.keyset,
        kits: req.body.kits,
        material: req.body.material,
        type: req.body.type,
        profile: req.body.profile,
        keysetImage: req.body.keysetImage,
        UserId: loggedInUser.id
    }).then(newExtras => {
        res.json(newExtras)
    }).catch(err => {
        console.log(err)
        res.status(500).send("Unable to create extra keysets")
    })
})

router.put("/:id", (req, res) => {
    const loggedInUser = checkAuthStatus(req);
    if (!loggedInUser) {
        return res.status(401).send("Please login first,")
    }
    db.Extras.findOne({
        where: {
            id: req.params.id
        }
    }).then(keyset => {
        if (loggedInUser.id === keyset.UserId) {
            db.Extras.update({
                keyset: req.body.keyset,
                kits: req.body.kits,
                material: req.body.material,
                type: req.body.type,
                profile: req.body.profile,
                keysetImage: req.body.keysetImage
            },
                {
                    where: {
                        id: keyset.id
                    }
                }).then(editKeyset => {
                    res.json(editKeyset)
                }).catch(err => {
                    console.log(err)
                    res.status(500).send("Unable to find keyset")
                })
        } else {
            return res.status(401).send("Not your keyset!")
        }
    })
})

router.delete("/:id", (req, res) => {
    const loggedInUser = checkAuthStatus(req);
    if (!loggedInUser) {
        return res.status(401).send("Please login first,")
    }
    db.Extras.findOne({
        where: {
            id: req.params.id
        }
    }).then(data => {
        if (loggedInUser.id === data.UserId) {
            db.Extras.destroy({
                where: {
                    id: data.id
                }
            }).then(extraDelete => {
                res.json(extraDelete)
            }).catch(err => {
                console.log(err)
                res.status(500).send("Unable to find keyset")
            })
        } else {
            return res.status(401).send("Not your profile!")
        }
    })
})
module.exports = router;