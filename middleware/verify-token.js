const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    try {
        // verify the token, open it up, and then assign the paylod (who the user is) to req.user, so out controller function know who is making the request
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // assign the payload (decoded token) to req.user
        req.user = decoded.user;
        // proceed to the controller function
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({ error: "Invalid token, please log in" });
    }
}

module.exports = verifyToken;