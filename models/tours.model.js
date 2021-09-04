const mongoose = require("mongoose")

const toursSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
    },
    rating: {
        type: Number,
        default: 0.0,
    },
    price: {
        type: Number,
        required: [true, 'A tour must have price'],
    },
});

module.exports = mongoose.model('Tours', toursSchema)