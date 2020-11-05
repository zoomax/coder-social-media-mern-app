const express = require("express");
const router = express.Router();
const { authGuard } = require("../utils/authMiddleware");
const {
  getPosts,
  createPost,
  deletePost,
  getPost,
  updatePost,
  addLike,
  unlike , 
  addComment , 
  removeComment 
} = require("../controllers/posts");
// @route get api/posts
// @desc  Get Posts
// @access PRIVATE
router.get("/", authGuard, getPosts);

//@route POST api/posts
//@desc create post
//@access PRIVATE
router.post("/", authGuard, createPost);

// @route get api/posts/:id
// @desc  Get pst by id
// @access PRIVATE
router.get("/:postId", authGuard, getPost);

// @route DELETE api/posts/:postId
// @desc  delete post by postId
// @access PRIVATE
router.delete("/:postId", authGuard, deletePost);
// @route PUT  api/posts/:postId
// @desc  update post by postId
// @access PRIVATE
router.put("/:postId", authGuard, updatePost);
// @route PUT  api/posts/:postId.likes
// @desc  add likes to post 
// @access PRIVATE
router.put("/:postId/likes", authGuard, addLike);
// @route delete  api/posts/:postId.likes
// @desc   unlikes to post 
// @access PRIVATE
router.delete("/:postId/likes", authGuard, unlike);
router.put("/:postId", authGuard, updatePost);
// @route PUT  api/posts/:postId.likes
// @desc  add likes to post
// @access PRIVATE
router.put("/:postId/comments", authGuard, addComment);
// @route delete  api/posts/:postId.likes
// @desc   unlikes to post
// @access PRIVATE
router.delete("/:postId/comments/:commentId", authGuard, removeComment);
module.exports = router;
