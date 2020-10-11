const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

const authGuard = async function (req, res, next) {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({
        access: "denied",
        message: "UNAUTHORIZED ACCESS",
      });
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload) {
      const authUser = await UserModel.findOne({ _id: payload.user.id });
      if (!authUser) {
        return res.status(401).json({
          access: "denied",
          message: "UNAUTHORIZED ACCESS",
        });
      } else {
        console.log("access granted")  
        req.user  = authUser
        return next();
      }
    }
    return res.status(401).json({
      access: "denied",
      message: "UNAUTHORIZED ACCESS",
    });
  } catch (error) {
    return res.status(401).json({
      access: "denied",
      message: "UNAUTHORIZED ACCESS",
    });
  }
};

module.exports = {
  authGuard,
};
