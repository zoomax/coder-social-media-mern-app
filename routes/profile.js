const express = require("express");
const router = express.Router();
const {
  getMyProfile,
  createProfile,
  getProfileById,
  getProfiles,
  deleteProfile,
  addProfileExperience,
  removeProfileExperience,
  addProfileEducation,
  removeProfileEducation,
} = require("../controllers/profile");
const { authGuard } = require("../utils/authMiddleware");

//@route  GET api/profiles/me
//desc    get current user profile info
//@access private
router.get("/me", authGuard, getMyProfile);

//@route  POST api/profiles/me
//desc    create user profile
//@access private
router.post("/", authGuard, createProfile);

//@route  GET api/profiles/:id
//desc    get user profile by id
//@access Public
router.get("user/:userId", getProfileById);

//@route  GET api/profiles/
//desc    get profiles
//@access Public
router.get("/", getProfiles);

//@route  DELETE api/profiles/me
//desc    delete profile
//@access Private
router.delete("/me", authGuard, deleteProfile);

//@route  PUT api/profiles/me/experience
//desc    add profile experience
//@access Private
router.put("/me/experience", authGuard, addProfileExperience);

//@route  DELETE api/profiles/me/experience
//desc    delete profile experience
//@access Private
router.delete("/me/experience/:exp_id", authGuard, removeProfileExperience);

//@route  PUT api/profiles/me/education
//desc    add profile education
//@access Private
router.put("/me/education", authGuard, addProfileEducation);

//@route  DELETE api/profiles/me/education
//desc    delete profile education
//@access Private
router.delete("/me/education/:edu_id", authGuard, removeProfileEducation);

module.exports = router;
