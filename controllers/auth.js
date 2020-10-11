const getUser = async (req, res) => {
  try {
    const user = {};
    res.status(200).json({
      success: true,
      data: user,
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
  getUser,
};
