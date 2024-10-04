const express = require("express");
const router = express.Router();

// import json token package
const jwt = require("jsonwebtoken");

// login, signup
router.get("/sign-token", function (req, res) {

    // Simulating signing a jwt token
    // 1. The payload to be included in the JWT (payload = what you want to store in the JWT)
    // 2. Secret key to sign the JWT (stored in .env)
    // 3. Optional: options object (when does the token expire)

    // payload
    const user = {
        _id: 1,
        username: "Lindsey"
    };

    // create token
    const token = jwt.sign({ user }, process.env.JWT_SECRET);

    res.json({ token });
});

// We would do this on every single request coming into the server after the user logs in or signup
router.post("/verify-token", function (req, res) {
    try {
        // use.split() to get back just the token
        const token = req.headers.authorization.split(' ')[1];
        console.log(token, "<- token in the headers!");

        // decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ decoded });
    } catch (error) {
        res.status(401).json({ error: "invalid token" });
    }

});

module.exports = router;