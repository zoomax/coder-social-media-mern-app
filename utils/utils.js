const fromStringToArray = (str) => {
  return str.split(",").map((item) => item.trim());
};

module.exports = {
  fromStringToArray,
};
