const { Schema, model } = require("mongoose");

const BookingSchema = new Schema({
    client: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    barber: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    service: {
        type: String,
        required: true,
    },
    comments: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        default: 'PENDING',
    },
}, {
    versionKey: false,
    timestamps: true
})

module.exports = model('Booking', BookingSchema)