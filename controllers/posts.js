const getPosts = async (req, res) => {
  try {
    const posts = [];
    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
      message: error.message,
    });
  }
};

module.exports = {
  getPosts,
};
