const express = require("express");
const router = express.Router();
let Paintings = require('../models/Paintings');
const isLoggedIn = require('../middlewares/isLoggedIn');

router.get('/all', isLoggedIn, async (req, res) => {
    // Find the user
    let allPaintings = [];
    if (req.user === "62327cb541299b35f3736eeb") {
        allPaintings = await Paintings.find();
    } else {
        allPaintings = await Paintings.find({ user: req.user });
    }
    try {
        res.json({ allPaintings });
    } catch (error) {
        res.json("Internal Server Error");
    }
})

router.post('/new', isLoggedIn, async (req, res) => {
    let newPainting = new Paintings({
        user: req.user,
        image: req.body.image
    })
    let savedPainting = await newPainting.save();
    try {
        res.json(savedPainting);
    } catch (error) {
        res.json("Internal Server Error");
    }
})

router.delete('/delete/:id', isLoggedIn, async (req, res) => {
    try {
        let foundPainting = await Paintings.findById(req.params.id);
        if (!foundPainting) {
            return res.status(404).send("Not found");
        }

        if (foundPainting.user.toString() != req.user && req.user !== "62327cb541299b35f3736eeb") {
            return res.status(401).send("Not Allowed");
        }

        foundPainting = await Paintings.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Painting deleted successfully", foundPainting });
    } catch (error) {
        res.json("Internal Server Error");
    }
})

router.put('/edit/:id', isLoggedIn, async (req, res) => {
    try {
        let foundPainting = await Paintings.findById(req.params.id);
        if (!foundPainting) {
            return res.status(404).send("Not found");
        }

        if (foundPainting.user.toString() != req.user && req.user !== "62327cb541299b35f3736eeb") {
            return res.status(401).send("Not Allowed");
        }

        let updatedPainting = {
            image: req.body.image
        }

        foundPainting = await Paintings.findByIdAndUpdate(req.params.id, updatedPainting, { new: true });
        res.json({ "Success": "Painting updated successfully", foundPainting });
    } catch (error) {
        res.json("Internal Server Error");
    }
})

module.exports = router;