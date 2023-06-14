const User = require('../models/User')
const bcrypt = require('bcrypt')
const { createJWT } = require('../utils/jwt')
const sendMail = require('../utils/nodemailer')
const crypto = require('crypto');
const nodemailer = require('nodemailer')

const register = async (req, res) => {
  try {
    // saca los datos del body
    const { email, password } = req.body
    console.log(req.body)

    // valida si el usuario existe
    let user = await User.findOne({ email })

    if (user) {
      return res.status(400).json({
        message: 'User already exist'
      })
    }

    // encripta la contraseña
    const saltRounds = 10
    const salt = bcrypt.genSaltSync(saltRounds)
    const hash = bcrypt.hashSync(password, salt)

    // TODO: guardar el usuario en la base de datos
    user = new User(req.body)
    user.password = hash
    await user.save()

    res.status(201).json({
      message: 'User created successfully'
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Something went wrong, try again'
    })
  }
}

const login = async (req, res) => {
  try {
    // TODO: validar si el usuario existe
    const { email } = req.body
    let user = await User.findOne({ email })
    console.log(user)

    if (!user) {
      return res.status(400).json({
        message: 'Email or password are incorrect'
      })
    }

    // valida si la contraseña es correcta
    const validatePassword = bcrypt.compareSync(req.body.password, user.password)

    if (!validatePassword) {
      return res.status(400).json({
        message: 'Email or password are incorrect'
      })
    }

    // saca la contraseña del usuario y devuelve el resto de datos
    const { password, ...data } = user._doc

    const token = createJWT(data._id)

    // mostrar el rol del usuario en la data del login
    data.role = user.role

    // guardar el token en la cookie del navegador
    res.cookie('x-auth-token', token, {
      httpOnly: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 3,
      secure: true
    })

    // se devuelve el estado 200 y el mensaje
    res.status(200).json({
      message: 'User logged successfully',
      token,
      role: data.role,
      id: data._id,
      name: data.name,
      email: data.email
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Something went wrong, try again'
    })
  }

}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({
        message: 'User not found'
      })
    }
    // Generar token de restablecimiento de contraseña
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Actualizar el token en la base de datos
    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = Date.now() + 3600000 // La hora de caducidad del token es en una hora
    await user.save()

    // Enviar correo electrónico con el enlace para restablecer la contraseña
    const resetUrl = `https://juanconde27.github.io/BarberFrontend/sections/resetpass.html?token=${resetToken}` // Reemplaza esta URL con la correspondiente a tu frontend
    await sendMail({
      to: user.email,
      subject: 'Restablecimiento de contraseña - [ BARBER SHOP ]',
      text: `Hola ${user.name}, para restablecer tu contraseña, sigue este enlace: ${resetUrl}\nSi no solicitaste este correo electrónico, simplemente ignóralo y tu contraseña seguirá siendo la misma.\n\n`
    })

    res.status(200).json({
      message: 'Email sent'
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Something went wrong, try again'
    })
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    // verifica si el token es válido
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid or expired token'
      });
    }

    // verifica si las contraseñas coinciden
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: 'Passwords do not match'
      });
    }

    // encripta la contraseña
    const saltRounds = 10
    const salt = bcrypt.genSaltSync(saltRounds)
    const hash = bcrypt.hashSync(password, salt)

    // actualiza la contraseña del usuario y elimina el token de reseteo
    user.password = hash;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

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
      to: user.email,
      from: 'Reset Password <juanmaconde27@gmail.com>',
      subject: 'Contraseña restablecida',
      text: `Hola ${user.name},\nEste es un mensaje de confirmación de que la contraseña de tu cuenta ${user.email} ha sido cambiada. Si no fuiste tu quien realizo esta accion ponte en contacto con nosotros.\n`
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.log(error);
      }
    });

    res.status(200).json({
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Something went wrong, try again'
    });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword
}
