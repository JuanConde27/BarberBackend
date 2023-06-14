const User = require("../models/User");
const bcrypt = require('bcrypt')

const getBarbers = async (req, res) => {
  try {

    const barbers = await User.find({role: 'BARBER_ROLE'}).select('name email role')

    res.status(200).json({
      message: "Barbers found successfully",
      barbers,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong, try again",
    });
  }
};

const getBarber = async (req, res) => {
  try {
    const { id } = req.params;

    const barber = await User.findById(id).select('name email role')

    res.status(200).json({
      message: "Barber found successfully",
      barber,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong, try again",
    });
  }
};

const deleteBarber = async (req, res) => {
  try {
    const { id } = req.params;

    const barber = await User.findByIdAndDelete(id)

    res.status(200).json({
      message: "Barber deleted successfully",
      barber,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong, try again",
    });
  }
};

const createBarber = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //encrypt password
    const salt = bcrypt.genSaltSync();
    const newPassword = bcrypt.hashSync(password, salt);
    const barber = await User.create({ name, email, password: newPassword, role: 'BARBER_ROLE' })

    res.status(200).json({
      message: "Barber created successfully",
      barber,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong, try again",
    });
  }
};


module.exports = {
    getBarbers,
    getBarber,
    deleteBarber,
    createBarber
}
