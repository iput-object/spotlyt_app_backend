const getMonth = (increment = 0) => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + increment, 1);
};

module.exports = {
  getMonth,
};
