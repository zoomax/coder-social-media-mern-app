const express = require("express");
const router = express.Router();
//routes
const usersRouter = require("./users");
const profileRouter = require("./profile");
const postsRouter = require("./posts");
const authRouter = require("./auth");


// end-points
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "hello from main route",
  });
});
router.use("/users", usersRouter);
router.use("/auth", authRouter);
router.use("/profiles", profileRouter);
router.use("/posts", postsRouter);

// exports
module.exports = router ; 