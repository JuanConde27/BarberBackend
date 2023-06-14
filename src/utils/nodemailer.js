const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host:process.env.SMTP_HOST,
    port:process.env.SMTP_PORT,
    secure:process.env.SMTP_SECURE,
    auth:{
        user:process.env.SMTP_USER,
        pass:process.env.SMTP_PASS
    }
})

const sendMail = async ({ to, subject, text }) => {
    try {
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject,
            text
        })
        console.log('Email sent successfully')
    } catch (error) {
        console.log(error)
    }
}

module.exports = sendMail
