const express = require("express");
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

// router.get('/new', (req, res) => {
//     ============== Create a new User==============
//     Encrypting password
//     const salt = bcrypt.genSaltSync(10);
//     const hash = bcrypt.hashSync("Admin@123", salt);
//     const newUser = new User({
//         name: "Admin",
//         username: "admin",
//         password: hash
//     });

//     newUser.save();
//     res.json("Successfully Added");
// })

router.post('/login', [
    // Checking if its a valid username
    body('username').exists().withMessage("Please enter a valid Username"),
    // Checking if its a valid password
    body('password').isLength({ min: 3 }).withMessage("Please enter a valid Password")
],
    async (req, res) => {
        const jwtSecret = process.env.JWT_SECRET;
        // Check whether there are any errors in the input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Check whether a user already exists with the entered email
        let user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(400).json({ error: "Please enter valid credentials." });
        }

        // Compare Passwords
        const pass = bcrypt.compareSync(req.body.password, user.password);
        if (!pass) {
            return res.status(400).json({ error: "Please enter valid credentials." });
        }
        try {
            // Signing JWT Token and giving back to User
            const token = jwt.sign({ id: user._id }, jwtSecret);
            res.json({ token, name: user.name });
        } catch (error) {
            res.json("Internal Server Error");
        }
    })

module.exports = router;