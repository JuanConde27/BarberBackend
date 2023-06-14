const Booking = require("../models/Booking");
const mongo = require("mongodb");
const User = require("../models/User");
const nodemailer = require('nodemailer')

const createBooking = async (req, res) => {
  try {
    const { name, date, time, barber, service, comments } = req.body;

    //verificar que el usuario no tenga una reserva en la misma fecha y hora
    const bookingExist = await Booking.findOne({ date, time, barber });
    if (bookingExist) {
      return res.status(400).json({
        message: "You already have a booking at this time",
      });
    }

    if (date < new Date()) {
      return res.status(400).json({
        message: "You can't book a date in the past",
      });
    }

    //que haya un intervalo de 1 hora entre la fecha actual y la fecha de la reserva
    const dateNow = new Date();
    const dateBooking = new Date(date);
    const diff = dateBooking - dateNow;
    const hours = diff / (1000 * 60 * 60);
    if (hours < 1) {
      return res.status(405).json({
        message: "You can't book a date less than 1 hour",
      });
    }

    if (!name || !date || !time || !barber || !service) {
      return res.status(400).json({
        message: "Missing fields",
      });
    }

    console.log({ barber })

    const idUser = new mongo.ObjectId(req.userId);
    const idBarber = new mongo.ObjectId(barber);

    const booking = new Booking({
      client: idUser,
      name,
      date,
      time,
      barber: idBarber,
      service,
      comments,
    });

    await booking.save();

    await User.findByIdAndUpdate(idBarber, {
      $push: { booking: booking._id },
    });

    const barberData = await User.findById(idBarber)
    //enviar correo al barbero
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      to: barberData.email,
      subject: 'New Booking',
      text: `You have a new booking with ${name} at ${date} ${time}`
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.status(500).json({
          message: "Something went wrong, try again",
        });
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    const clientData = await User.findById(idUser)
    //enviar correo al cliente
    const transporter2 = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }

    });

    const mailOptions2 = {
      to: clientData.email,
      subject: 'New Booking',
      text: `You have a new booking with ${barberData.name} at ${date} ${time}`
    }

    transporter2.sendMail(mailOptions2, function (error, info) {
      if (error) {
        console.log(error);
        return res.status(500).json({
          message: "Something went wrong, try again",
        });
      } else {
        console.log('Email sent: ' + info.response);
        
      }
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });

  } catch (error) {
    // console.log(error);
    res.status(500).json({
      message: "Something went wrong, try again",
    });
  }
};

const getBookings = async (req, res) => {
  try {
    const userId = req.userId;

    const bookings = await Booking.find({
      $or: [{ client: userId }, { barber: userId }],
    })
      .populate("client", "name")
      .populate("barber", "name");

    res.status(200).json({
      message: "Bookings found successfully",
      bookings,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong, try again",
    });
  }
};

const getBooking = async (req, res) => {
  try {
    const { idBooking } = req.params;

    const booking = await Booking.findById(idBooking)
      .populate("client", "name")
      .populate("barber", "name");

    res.status(200).json({
      message: "Booking found successfully",
      booking,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong, try again",
    });
  }
};


const deleteBooking = async (req, res) => {
  try {
    const { idBooking } = req.params;

    const bookign = await Booking.findByIdAndDelete(idBooking);

    res.status(200).json({
      message: "Booking deleted successfully",
      bookign,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong, try again",
    });
  }
};

const getBookingsByBarber = async (req, res) => {
  try {
    const { idBarber } = req.params;

    const bookings = await Booking.find({ barber: idBarber })
      .populate("client", "name")
      .populate("barber", "name");

    res.status(200).json({
      message: "Bookings found successfully",
      bookings,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong, try again",
    });
  }
};

const getBookingsByClient = async (req, res) => {
  try {
    const { idClient } = req.params;

    const bookings = await Booking.find({ client: idClient })
      .populate("client", "name")
      .populate("barber", "name");

    res.status(200).json({
      message: "Bookings found successfully",
      bookings,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong, try again",
    });
  }
};

const updateBooking = async (req, res) => {
  try{
    const { idBooking } = req.params;
    const { service, comments } = req.body;

    const bookign = await Booking.findByIdAndUpdate(idBooking, {
      service,
      comments
    });

    res.status(200).json({
      message: "Booking updated successfully",
      bookign,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong, try again",
    });
  }
}

const uptadeBookingStatus = async (req, res) => {
  try{
    const { idBooking } = req.params;
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(idBooking, {
      status: status
    });

    res.status(200).json({
      message: "Booking updated successfully",
      booking,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong, try again",
    });
  }
}

module.exports = {
  getBooking,
  createBooking,
  getBookings,
  deleteBooking,
  getBookingsByBarber,
  getBookingsByClient,
  updateBooking,
  uptadeBookingStatus
};


