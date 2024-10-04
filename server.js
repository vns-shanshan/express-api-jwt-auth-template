const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');

const testJWTRouter = require("./controllers/test-jwt");
const userRouter = require("./controllers/users");
const profileRouter = require("./controllers/profiles");

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.json());

// Routes go here
app.use("/test-jwt", testJWTRouter);
app.use("/users", userRouter);
app.use("/profiles", profileRouter);

app.listen(3000, () => {
    console.log('The express app is ready!');
});
