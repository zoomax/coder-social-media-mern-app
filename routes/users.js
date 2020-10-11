const express = require("express");
const { getUsers, register , login } = require("../controllers/users");
const router = express.Router();

// @route GET api/users
// @desc get users
// @access  Public
router.get("/", getUsers);

// @route POST api/register
// @desc register user
// @access  Public
router.post("/register", register);

// @route POST api/login
// @desc login user
// @access  Public
router.post("/login", login);
// exports
module.exports = router;
