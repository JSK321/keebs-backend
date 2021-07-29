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
// Get all keeb phots by keeb id
router.get("/:KeebId", (req, res) => {
    db.KeebPhotos.findAll({
        where: {
            KeebId: req.params.KeebId
        }
    }).then(pics => {
        res.json(pics)
    }).catch(err => {
        console.log(err)
        res.status(500).send("Unable to find keebs")
    })
})
// Upload photos
router.post('/', (req, res) => {
    const loggedInUser = checkAuthStatus(req)
    if (!loggedInUser) {
        return res.status(401).send("Please login first,")
    }
    db.KeebPhotos.create({
        userId: loggedInUser.id,
        keebImage: req.body.image,
        KeebId: req.body.KeebId
    }).then(pics => {
        res.json(pics)
    }).catch(err => {
        console.log(err)
        res.status(500).send("Unable to find keeb photos")
    })
})
// Remove photos
router.delete('/:id', (req, res) => {
    const loggedInUser = checkAuthStatus(req)
    if (!loggedInUser) {
        return res.status(401).send("Please login first,")
    }
    db.KeebPhotos.findOne({
        where: {
            id: req.params.id
        }
    }).then(pic => {
        if (loggedInUser.id === parseInt(pic.userId)) {
            db.KeebPhotos.destroy({
                where: {
                    id: pic.id
                }
            }).then(delPic => {
                res.json(delPic)
            }).catch(err => {
                console.log(err)
                res.status(500).send("Unable to find keeb photo")
            })
        } else {
            return res.status(401).send("Not your photo!")
        }
    })
})

module.exports = router;