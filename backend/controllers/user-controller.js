const getUsers = async (req, res) => {
  return res.status(200).json({ message: "Get Users" });
};

module.exports = {
  getUsers,
};
