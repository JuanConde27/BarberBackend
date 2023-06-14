const User = require("../models/User");

const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "ADMIN_ROLE" });

    res.status(200).json({
      message: "Admins found successfully",
      admins,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong, try again",
    });
  }
}

const getAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await User.findOne({ _id: id, role: "ADMIN_ROLE" });

    res.status(200).json({
      message: "Admin found successfully",
      admin,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong, try again",
    });
  }
}

module.exports = {
  getAdmins,
  getAdmin
}
