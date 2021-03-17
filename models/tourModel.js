const mongoose = require('mongoose')
const slugify = require('slugify')
const validator = require('validator')

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'tour must have name'],
        unique: true,
        trim: true,
        maxLength: [40, 'tour name cannot have more than 40 characters'],
        minLength: [5, 'tour name must have more than 5 characters'],
        validate: [validator.isAlpha, 'tour name must only contain alphanumeric characters']
    },
    duration: {
        type: Number,
        required: [true, 'tour must have duration']
    },
    slug: String,
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
        required: [true, 'tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either easy, medium, or difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'rating must be above 1.0'],
        max: [5, 'rating must be below 5.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'tour must have price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function(value){
                // only works (only has access to this) in save and not on update
                return value < this.price
            },
            message: 'Discount price ({VALUE}) should be less than price'
        }
    },
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
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

tourSchema.virtual('durationWeeks').get(function(){ // arrow functions cannot use THIS keyword
    return this.duration / 7
})

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function(next){
    this.slug = slugify(this.name, {lower: true})
    next()
})

// tourSchema.post('save', function(doc, next){
//     next()
// })

//QUERY MIDDLEWARE
tourSchema.pre(/^find/, function(next){ // regex: all commands that start with 'find'
    this.find({ secretTour: { $ne: true } })
    next()
})

// tourSchema.pre('findOne', function(next){
//     this.find({ secretTour: { $ne: true } })
//     next()
// })

tourSchema.post(/^find/, function(docs, next){
    console.log("hello from post middleware")
    next()
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour