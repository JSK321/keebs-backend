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
    db.Keebs.findAll({
        include: [db.Parts, db.KeebPhotos]
    }).then(keebs => {
        res.json(keebs)
    }).catch(err => {
        console.log(err)
        res.status(500).send("Unable to find keebs")
    })
});

router.get("/:id", (req, res) => {
    db.Keebs.findOne({
        where: {
            id: req.params.id
        },
        include: [db.Parts]
    }).then(dbKeeb => {
        res.json(dbKeeb)
    }).catch(err => {
        console.log(err)
        res.status(500).send("Unable to find keebs")
    })
})

router.get("/keeb/:name", (req, res) => {
    db.Keebs.findOne({
        where: {
            name: req.params.name
        },
        include: [db.Parts]
    }).then(keeb => {
        res.json(keeb)
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
    db.Keebs.create({
        name: req.body.name,
        maker: req.body.maker,
        case: req.body.case,
        color: req.body.color,
        angle: req.body.angle,
        plate: req.body.plate,
        keebImage: req.body.keebImage,
        UserId: loggedInUser.id
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
    db.Keebs.findOne({
        where: {
            id: req.params.id
        }
    }).then(keeb => {
        if (loggedInUser.id === keeb.UserId) {
            db.Keebs.update({
                name: req.body.name,
                maker: req.body.maker,
                case: req.body.case,
                color: req.body.color,
                plate: req.body.plate,
                angle: req.body.angle,
                keebImage: req.body.keebImage,
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

router.put('/sound/:id', (req, res) => {
    const loggedInUser = checkAuthStatus(req);
    if (!loggedInUser) {
        return res.status(401).send("Please login first,")
    }
    db.Keebs.findOne({
        where: {
            id: req.params.id
        }
    }).then(keeb => {
        if (loggedInUser.id === keeb.UserId) {
            db.Keebs.update({
                keebSoundTest: req.body.keebSoundTest
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

router.post('/upload', async (req, res) => {
    try {
        const fileStr = req.body.data
        const uploadedImage = await cloudinary.uploader.upload(fileStr, {
            upload_preset: 'keebs_setups'
        })
        console.log(uploadedImage)
        res.json({ msg: "HURRAY!" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ err: 'Something went wrong' })
    }
})

router.delete("/:id", (req, res) => {
    const loggedInUser = checkAuthStatus(req);
    if (!loggedInUser) {
        return res.status(401).send("Please login first,")
    }
    db.Keebs.findOne({
        where: {
            id: req.params.id
        }
    }).then(keeb => {
        if (loggedInUser.id === keeb.UserId) {
            db.Keebs.destroy({
                where: {
                    id: keeb.id
                }
            }).then(delKeeb => {
                res.json(delKeeb)
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