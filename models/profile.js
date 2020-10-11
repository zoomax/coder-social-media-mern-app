const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProfileSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  company: { type: String },
  location: {
    type: String,
  },
  website: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  bio: {
    type: String,
  },
  githubusername: {
    type: String,
  },
  experience: [
    {
      title: {
        type: String,
      },
      location: {
        type: String,
      },
      company: { type: String },
      from: {
        type: Date,
        required: true,
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
      },
    },
  ],
  education: [
    {
      school: {
        type: String,
      },
      degree: {
        type: String,
      },
      fieldofstudy: {
        type: String,
      },
      from: {
        type: Date,
        required: true,
      },
      to: {
        type: Date,
      },
      current: { type: String },
      description: { type: String },
    },
  ],
  social: {
    twitter: String,
    facebook: String,
    instagram: String,
    linkedin: String,
    youutube: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const ProfileModel = mongoose.model("profile", ProfileSchema);

module.exports = ProfileModel;
