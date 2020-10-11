const UserModel = require("../models/user");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  registerationValidator,
  validateSchema,
} = require("../utils/validationSchemas");
const ProfileModel = require("../models/profile");

const getUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find();
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      error,
      message: error.message,
    });
  }
};

const register = async (req, res) => {
  try {
    const { email, name, password, confirmPassword } = req.body;
    const existingUser = await UserModel.findOne({ email });
    // chech if email does exist
    if (existingUser) {
      return res.status(400).json({
        success: false,
        errors: "email is already in use",
      });
    }
    // check the validity of request body ;
    const validate =  validateSchema(req.body, registerationValidator);
    if (validate.error) {
      return res.status(400).json({
        success: false,
        error: validate.error.details[0].path[0],
        message: validate.error.details[0].message,
      });
    } else if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "passsword",
        message: "passwords must be identical",
      });
    }
    // register a new user ;
    const avatar = gravatar.url(email, {
      s: "200",
      r: "pg",
      d: "mm",
    });
    const salt = await bcrypt.genSalt(10);
    const userData = {
      password: await bcrypt.hash(password, salt),
      name,
      email,
      avatar,
    };
    // JWT TOKEN GENERATION
    const user = await UserModel.create(userData);
    const payload = {
      user: {
        id: user._id,
      },
    };
    const token = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: 3600000,
    });
    return res.status(201).json({
      success: true,
      token,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      err_message: error.message,
    });
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "account not found",
      });
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(401).json({
        success: false,
        message: "password  is not correct",
      });
    }
    const payload = {
      user: {
        id: user._id,
      },
    };
    const token = await jwt.sign(payload, process.env.JWT_SECRET);
    user.token = token;
    await user.save();
    return res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {}
};
 
module.exports = {
  getUsers,
  register,
  login,
};
