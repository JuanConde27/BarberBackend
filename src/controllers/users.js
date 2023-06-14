const User = require("../models/User");
const bcrypt = require('bcrypt')

const getUsers = async (req, res) => {
  try {

    //encontrar los usuarios que tengan el rol de user
    const users = await User.find({ role: "USER_ROLE" });

    res.status(200).json({
      message: "Users found successfully",
      users,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong, try again",
    });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    //solo los usuarios con el rol de user
    const user = await User.findById(id).where({ role: "USER_ROLE" });
    res.status(200).json({
      message: "User found successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong, try again",
    });
  }
};

const uptadeUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    //solo los usuarios con el rol de user

    // //encriptar la contraseña
    // const salt = bcrypt.genSaltSync();
    // const newPassword = bcrypt.hashSync(password, salt);

    const user = await User.findByIdAndUpdate(
      id,
      {
        name,
        email
        // password: newPassword,
      },
      { new: true }
    ).where({ role: "USER_ROLE" });

    res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong, try again",
    });
  }
};

const uptadePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    //encriptar la contraseña
    const salt = bcrypt.genSaltSync();
    const newPassword = bcrypt.hashSync(password, salt);

    const user = await User.findByIdAndUpdate(
      id,
      {
        password: newPassword,
      },
      { new: true }
    ).where({ role: "USER_ROLE" });

    res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong, try again",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    //solo los usuarios con el rol de user
    const user = await User.findByIdAndDelete(id).where({ role: "USER_ROLE" });

    res.status(200).json({
      message: "User deleted successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong, try again",
    });
  }
};

module.exports = {
  getUsers,
  getUser,
  uptadeUser,
  uptadePassword,
  deleteUser,
};
