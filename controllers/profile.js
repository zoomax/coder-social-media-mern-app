const ProfileModel = require("../models/profile");
const UserModel = require("../models/user");
const { fromStringToArray } = require("../utils/utils");
const {
  validateSchema,
  profileValidator,
  experienceValidator,
  educationValidator,
} = require("../utils/validationSchemas");

const getMyProfile = async (req, res) => {
  const user = req.user;
  try {
    const profile = await ProfileModel.findOne({
      user: user.id,
    }).populate("user", ["avatar", "name"]);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "there is no such a profile",
      });
    }
    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
      message: error.message,
    });
  }
};
const createProfile = async (req, res, next) => {
  const { id } = req.user;
  let {
    company,
    location,
    website,
    status,
    skills,
    bio,
    githubusername,
    youtube,
    twitter,
    instagram,
    linkedin,
    facebook,
  } = req.body;
  skills = fromStringToArray(skills);
  let profilePayload = {
    user: id,
    social: {},
  };
  if (website) profilePayload.website = website;
  if (company) profilePayload.company = company;
  if (bio) profilePayload.bio = bio;
  if (githubusername) profilePayload.githubusername = githubusername;
  if (status) profilePayload.status = status;
  if (location) profilePayload.location = location;
  if (skills.length > 0) profilePayload.skills = skills;
  if (youtube) profilePayload.social.youtube = youtube;
  if (linkedin) profilePayload.social.linkedin = linkedin;
  if (facebook) profilePayload.social.facebook = facebook;
  if (instagram) profilePayload.social.instagram = instagram;
  if (twitter) profilePayload.social.twitter = twitter;
  const validate = validateSchema(profilePayload, profileValidator);
  if (validate.error) {
    return res.status(400).json({
      success: false,
      error: validate.error.details[0].path[0],
      message: validate.error.details[0].message,
    });
  }
  try {
    console.log(id);
    const hasProfile = await ProfileModel.findOne({ user: id });
    console.log(hasProfile);
    if (!hasProfile) {
      const profile = new ProfileModel(profilePayload);
      await profile.save();
      return res.status(201).json({
        success: true,
        message: "profile created successfuly !",
      });
    }
    profile = await ProfileModel.findOneAndUpdate(
      { user: id },
      { $set: profilePayload },
      { new: true }
    );
    return res.status(201).json({
      success: true,
      message: "profile updated successfuly !",
      profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
      message: error.message,
    });
  }
};

const getProfiles = async (req, res) => {
  const query = req.query;
  try {
    const profiles = await ProfileModel.find(query).populate("user", [
      "name",
      "avatar",
    ]);
    if (!profiles) {
      return res.status(500).json({
        success: false,
        message: "unable to featch data!",
      });
    }
    return res.status(200).json({
      success: true,
      profiles,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
      message: error.message,
    });
  }
};

const getProfileById = async (req, res) => {
  let { userId } = req.params;
  try {
    const profile = await ProfileModel.findOne({
      user: userId,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "profile not found",
      });
    }
    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "profile not found",
      });
    }
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error,
      errMessage: error.message,
    });
  }
};

const deleteProfile = async (req, res) => {
  const { id } = req.user;
  try {
    //@todo => remove posts
    // remove profile
    await ProfileModel.findOneAndDelete({ user: id });
    //remove user account
    await UserModel.findOneAndDelete({ _id: id });
    return res.status(200).json({
      success: true,
      message: "profile has been deleted successfully",
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};

const addProfileExperience = async (req, res) => {
  const { title, location, company, from, to, current, description } = req.body;
  const newExperience = {};

  if (title) newExperience.title = title;
  if (description) newExperience.description = description;
  if (to) newExperience.to = to;
  if (company) newExperience.company = company;
  if (from) newExperience.from = from;
  if (location) newExperience.location = location;
  if (current) newExperience.current = current;

  const { id } = req.user;
  const validate = validateSchema(newExperience, experienceValidator);
  if (validate.error) {
    return res.status(400).json({
      success: false,
      error: validate.error.details[0].path[0],
      message: validate.error.details[0].message,
    });
  }
  try {
    const profile = await ProfileModel.findOne({ user: id });
    profile.experience.unshift(newExperience);
    await profile.save();
    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

const removeProfileExperience = async (req, res) => {
  const { exp_id } = req.params;
  console.log("exp_id :", exp_id);
  const { id } = req.user;
  try {
    const profile = await ProfileModel.findOne({ user: id });
    profile.experience = profile.experience.filter((exp) => {
      return exp.id !== exp_id;
    });
    console.log(profile.experience);
    await profile.save();
    return res.status(200).json({
      success: true,
      message: "experience deleted successfully!",
      profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};
const addProfileEducation = async (req, res) => {
  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description,
  } = req.body;
  console.log(fieldofstudy) ; 
  console.log(req.body) ; 
  const newEducation = {};

  if (school) newEducation.school = school;
  if (description) newEducation.description = description;
  if (to) newEducation.to = to;
  if (degree) newEducation.degree = degree;
  if (from) newEducation.from = from;
  if (fieldofstudy) newEducation.fieldofstudy = fieldofstudy;
  if (current) newEducation.current = current;

  const { id } = req.user;
  console.log(newEducation) ; 
  const validate = validateSchema(newEducation, educationValidator);
  if (validate.error) {
    return res.status(400).json({
      success: false,
      error: validate.error.details[0].path[0],
      message: validate.error.details[0].message,
    });
  }
  try {
    const profile = await ProfileModel.findOne({ user: id });
    profile.education.unshift(newEducation);
    await profile.save();
    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

const removeProfileEducation = async (req, res) => {
  const { edu_id } = req.params;
  console.log("edu_id :", edu_id);
  const { id } = req.user;
  try {
    const profile = await ProfileModel.findOne({ user: id });
    profile.education = profile.education.filter((edu) => {
      return edu.id !== edu_id;
    });
    console.log(profile.education);
    await profile.save();
    return res.status(200).json({
      success: true,
      message: "education deleted successfully!",
      profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};
module.exports = {
  getMyProfile,
  createProfile,
  getProfiles,
  getProfileById,
  deleteProfile,
  addProfileExperience,
  addProfileEducation,
  removeProfileExperience,
  removeProfileEducation,
};
