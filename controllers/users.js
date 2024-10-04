// const express = require('express')
// const router = express.Router()

// // import UserModel and bcrypt
// const UserModel = require('../models/user')
// const bcrypt = require('bcrypt'); // hash our passwords!
// const jwt = require('jsonwebtoken')

// router.post('/signin', async function (req, res) {
//     try {
//         // search for the user
//         // assuming the user is logging in with a username
//         const user = await UserModel.findOne({ username: req.body.username })
//         // check the password
//         if (user && bcrypt.compareSync(req.body.password, user.hashedPassword)) {

//             const token = jwt.sign({ user }, process.env.JWT_SECRET)


//             res.status(200).json({ token })
//         } else {
//             res.status(401).json({ error: "Invalid username or password" })
//         }

//         // create the token

//         // send it back to the client

//     } catch (err) {
//         console.log(err)
//         res.status(400).json({ error: err.message })
//     }
// })


// router.post('/signup', async function (req, res) {
//     try {
//         // check if the username is already in the db
//         const isUserInDB = await UserModel.findOne({ username: req.body.username })
//         if (isUserInDB) {
//             return res.status(400).json({ error: "Username is already taken! Please try again" })
//         }
//         // if the user isn't in db make the user!
//         // hash our password, assuming req.body has password key
//         req.body.hashedPassword = bcrypt.hashSync(req.body.password, 10)

//         const userDoc = await UserModel.create(req.body)
//         console.log(userDoc, " <- User doc")


//         const token = jwt.sign({ user: userDoc }, process.env.JWT_SECRET)

//         // purpose of the signup is to send back the token to the client
//         // so that on every other requst they can send the token as identifier
//         res.status(201).json({ token })


//     } catch (err) {
//         console.log(err)
//         res.json({ error: 'user not created!' })
//     }
// })

// module.exports = router

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');


const SALT_LENGTH = 12;

router.post('/signup', async (req, res) => {
    try {
        // Check if the username is already taken
        const userInDatabase = await User.findOne({ username: req.body.username });
        if (userInDatabase) {
            return res.status(400).json({ error: 'Username already taken.' });
        }
        // Create a new user with hashed password
        const user = await User.create({
            username: req.body.username,
            hashedPassword: bcrypt.hashSync(req.body.password, SALT_LENGTH)
        })
        const token = jwt.sign({ username: user.username, _id: user._id }, process.env.JWT_SECRET);
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/signin', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user && bcrypt.compareSync(req.body.password, user.hashedPassword)) {
            const token = jwt.sign({ username: user.username, _id: user._id }, process.env.JWT_SECRET);
            res.status(200).json({ token });
        } else {
            res.status(401).json({ error: 'Invalid username or password.' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;