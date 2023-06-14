const { Schema, model } = require("mongoose")

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    booking: {
        type: [Schema.Types.ObjectId],
        ref: 'Booking'
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: ['ADMIN_ROLE', 'USER_ROLE', 'BARBER_ROLE']
    },
    session: {
        type: String
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
}, {
    versionKey: false,
    timestamps: true
})


module.exports = model('User', UserSchema)

