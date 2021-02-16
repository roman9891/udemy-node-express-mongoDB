const mongoose = require('mongoose')

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'tour must have name'],
        unique: true,
        trim: true
    },
    duration: {
        type: Number,
        required: [true, 'tour must have duration']
    },
    rating: {
        type: Number,
        default: 4.5
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'tour must have a difficulty']
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'tour must have price']
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'tour must have description']
    },
    imageCover: {
        type: String,
        required: [true, 'must have cover image']
    },
    images: {
        type: [String],
        createdAt: {
            type: Date,
            default: Date.now()
        },
        startDates: [Date]
    }
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour