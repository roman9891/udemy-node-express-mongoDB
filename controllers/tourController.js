const fs = require('fs')
const Tour = require('./../models/tourModel')
const APIFeatures = require('../utils/apiFeatures')
//wraps around controller methods and returns a function that catches errors and passes to error middleware
const catchAsync = require('./../utils/catchAsync')
const AppError = require('../utils/appError')

const aliasTopTours = (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
    next()
}

const getAllTours = catchAsync( async (req, res, next) => {
    const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate()
    const tours = await features.query

    res.status(200).json({
        status: "success",
        requestedAt: req.requestTime,
        results: tours.length,
        data: {
            tours
        }
    })
})

const formatTour = (tourBody) => {
    const newId = tours.length
    const newTour = {id: newId, ...tourBody}
    return newTour
}

const createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body)

    if (!tour) {
        console.log("here")
        return next(new AppError('No tour found with that ID', 404))
    }

    res.status(201).json({ // status = created
        status: 'success',
        data: {
            tour: newTour,
        }
    })
})

const getTour = catchAsync( async (req, res, next) => {
    const tour = await Tour.findById(req.params.id)

    if (!tour) {
        console.log("here")
        return next(new AppError('No tour found with that ID', 404))
    }

    res.status(200).json({
        status: "success",
        data: {
            tour
        }
    })
})

const updateTour = catchAsync( async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if (!tour) {
        console.log("here")
        return next(new AppError('No tour found with that ID', 404))
    }

    res.status(200).json({
        status: 'success',
        message: 'UPDATED',
        data: {
            tour
        }
    })
})

const deleteTour = catchAsync( async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id)

    if (!tour) {
        console.log("here")
        return next(new AppError('No tour found with that ID', 404))
    }

    res.status(204).json({
        status: 'success',
        data: null
    })
})

const getTourStats = catchAsync( async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: {$gte: 4.5} }
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty'},
                num: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity'},
                avgRating: { $avg: '$ratingsAverage'},
                avgPrice: { $avg: '$price'},
                minPrice: { $min: '$price'},
                maxPrice: { $max: '$price'}
            }
        },
        {
            $sort: { avgPrice: 1 }
        },
        {
            $match: { _id: { $ne: 'EASY'} }
        },
    ])
    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    })
})

const getMonthlyPlan = catchAsync( async (req, res, next) => {
    const year = req.params.year * 1
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates',
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                },
            },
        },
        {
            $group: {
                _id: { $month: '$startDates '},
                numTourStarts: { $sum: 1 },
                tours: { $push: '$name' },
            },
        },
        {
            $addFields: { month: '$_id'}
        },
        {
            $project: {
                _id: 0
            },
        },
        {
            $sort: { numTourStarts: -1 },
        },
        {
            $limit: 6,
        },
    ])

    res.status(200).json({
        status: 'success',
        data: {
            plan
        }
    })
})

module.exports = {
    getMonthlyPlan,
    getTourStats,
    aliasTopTours,
    getAllTours,
    formatTour,
    createTour,
    getTour,
    updateTour,
    deleteTour,
}