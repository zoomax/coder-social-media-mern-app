const types = require("mongoose").Types;
const PostModel = require("../models/post");
const UserModel = require("../models/user");
const getPosts = async (req, res) => {
  try {
    const { id } = req.user;
    const posts = await PostModel.find();
    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
      message: error.message,
    });
  }
};

const createPost = async (req, res) => {
  try {
    const { id } = req.user;
    const { text } = req.body;
    const user = await UserModel.findById(id);
    const post = {
      text,
      name: user.name,
      avatar: user.avatar,
      user: user._id,
    };
    const newPost = new PostModel(post);
    await newPost.save();
    return res.status(201).json({
      success: true,
      newPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getPost = async (req, res) => {
  try {
    const {postId} = req.params;
    const post = await PostModel.findById(postId).populate("user", "-password");
    if (!post)
      return res.status(404).json({
        success: true,
        message: "post is not found",
      });
    return res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
const deletePost = async (req, res) => {
  console.log(req.user.id, req.params.id);
  try {
    const {postId} = req.params;
    const userId = req.user.id;
    const post = await PostModel.findOne({ _id: postId });
    if (!post)
      return res.status(404).json({
        success: true,
        message: "post is not found",
      });
    console.log(userId, "    ", post.user);
    if (userId == post.user) {
      await post.remove();
      return res.status(200).json({
        success: true,
        message: "post was deleted successfully ",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "UNAUTHORIZED",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message + "from catch",
    });
  }
};
const updatePost = async (req, res) => {
  try {
    const {postId }= req.params.id;
    const userId = req.user.id;
    const body = req.body;
    const post = await PostModel.findById(postId);
    console.log(post.user);
    console.log(userId);
    if (!post)
      return res.status(404).json({
        success: true,
        message: "post is not found",
      });
    if (userId == post.user) {
      for (key in body) {
        post[key] = body[key];
      }
      await post.save();
      return res.status(200).json({
        success: true,
        post,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "UNAUTHORIZED",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const addLike = async (req, res) => {
  try {
    const{ postId} = req.params;
    const userId = req.user.id;
    const post = await PostModel.findById(postId).populate("user", "-password");
    console.log(findObjectIdinArray(post.likes, new types.ObjectId(userId)));
    let isExist = findObjectIdinArray(post.likes, new types.ObjectId(userId));
    if (!isExist.exist) post.likes.push({ user: userId });
    await post.save();
    return res.status(203).json({
      success: true,
      post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
const unlike = async (req, res) => {
  try {
    const {postId} = req.params;
    const userId = req.user.id;
    const post = await PostModel.findById(postId).populate("user", "-password");
    console.log(findObjectIdinArray(post.likes, new types.ObjectId(userId)));
    let isExist = findObjectIdinArray(post.likes, new types.ObjectId(userId));
    if (isExist.exist) {
      post.likes.splice(isExist.index, 1);
    }
    await post.save();
    return res.status(203).json({
      success: true,
      post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { id } = req.user;
    const {postId }= req.params;
    const post = await PostModel.findById(new types.ObjectId(postId));
    const { _id, name, avatar } = await UserModel.findById(
      new types.ObjectId(id)
    );
    const comment = {
      user: _id,
      text,
      avatar,
      name,
    };
    post.comments.push(comment);
    await post.save();
    return res.status(201).json({
      success: true,
      comment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
    });
  }
};
const removeComment = async (req, res) => {
  try {
    const commentInfo = {
      index: 0,
      exist: false,
    };
    const { id } = req.user;
    const { postId, commentId } = req.params;
    const post = await PostModel.findById(new types.ObjectId(postId));
    const user = await UserModel.findById(new types.ObjectId(id));
    const comment = post.comments.find((item, index) => {
      if (new types.ObjectId(commentId).equals(new types.ObjectId(item._id))) {
        commentInfo.index = index;
        commentInfo.exist = true;
        return true ; 
      }
    });
    console.log(commentInfo, "from delete comment");
    const isPostPublisher = new types.ObjectId(post.user).equals(
      new types.ObjectId(user._id)
    );
    const isCommentPublisher = new types.ObjectId(comment.user).equals(
      new types.ObjectId(user._id)
    );
    if (isCommentPublisher || isPostPublisher) post.comments.splice(commentInfo.index, 1);
    await post.save();
    return res.status(200).json({
      success: true,
      message: "comment deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
function findObjectIdinArray(array, obj) {
  for (let i = 0; i < array.length; i++) {
    if (obj.equals(new types.ObjectId(array[i].user)))
      return {
        exist: true,
        index: i,
      };
  }
  return {
    exist: false,
  };
}
module.exports = {
  getPosts,
  createPost,
  getPost,
  deletePost,
  updatePost,
  addLike,
  unlike,
  addComment,
  removeComment,
};
