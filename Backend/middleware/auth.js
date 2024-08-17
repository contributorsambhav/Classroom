// Create a new file named `auth.js` in the `middleware` folder
const dotenv = require("dotenv")
dotenv.config()

const secret = process.env.JWT_SECRET
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
        const decoded = jwt.verify(token, secret); // Replace with your actual secret key
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send('Invalid token.');
    }
}

module.exports = auth;
