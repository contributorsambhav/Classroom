// Create a new file named `auth.js` in the `middleware` folder
const dotenv = require("dotenv")
dotenv.config()

const secret = process.env.JWT_SECRET
const jwt = require('jsonwebtoken');


const { getUser } = require("../services/auth");

async function restrictToLoginUserOnly(req, res, next) {
    const userToken = req.cookies?.auth_token; // Assuming token is stored in cookies
    if (!userToken) {
        console.error("No token found in cookies");
        return res.redirect("/login");
    }
    const user = getUser(userToken); // Directly use getUser synchronously
    if (!user) {
        console.error("Invalid token or user not found");
    }

    req.user = user; // Set user information in req object
    next(); // Proceed to next middleware or route handler
}




module.exports = {restrictToLoginUserOnly};
