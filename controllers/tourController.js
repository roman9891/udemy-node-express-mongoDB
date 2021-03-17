const fs = require('fs')
const Tour = require('./../models/tourModel')
const APIFeatures = require('../utils/apiFeatures')

// const tours = JSON.parse( // parse data first
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`) // use sync method outside of callbacks so it doesn't block event loop
// )

const aliasTopTours = (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
    next()
}

const getAllTours = async (req, res) => {
    try {
        // BUILD QUERY
        // let queryObj = {...req.query}
        // const excludeFields = ['page', 'sort', 'limit', 'fields']
        // excludeFields.forEach(field => delete queryObj[field])

        // let queryString = JSON.stringify(queryObj)
        // queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)
        // queryObj = JSON.parse(queryString)
        
        // console.log(queryObj)

        // let query = Tour.find(queryObj)

        // SORTING
        // if (req.query.sort) {
        //     const sortBy = req.query.sort.split(',').join(' ')
        //     query.sort(sortBy)
        // } else {
        //     query.sort('-createdAt')
        // }

        // FIELD LIMITING - select not working
        // if (req.query.fields) {
        //     const fields = req.query.fields.split(',').join(' ')
        //     query.select(fields);
        // } else {
        //     query.select('-__v')
        // }

        // PAGINATION
        // const page = req.query.page * 1 || 1
        // const limit = req.query.limit * 1 || 100
        // const skip = (page - 1) * limit

        // query.skip(skip).limit(limit)

        // if (req.query.page) {
        //     const numTours = await Tour.countDocuments()
        //     if (skip > numTours) throw new Error('This page does not exist')
        // }
        
        // EXECUTE QUERY
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate()
        const tours = await features.query

        // SEND RESP
        res.status(200).json({ // JSend format
            status: "success",
            requestedAt: req.requestTime,
            results: tours.length,
            data: {
                tours
            }
        })
    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
    
}

const formatTour = (tourBody) => {
    const newId = tours.length
    const newTour = {id: newId, ...tourBody}

    return newTour
}

const createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body)

        res.status(201).json({ // status = created
            status: 'success',
            data: {
                tour: newTour,
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

const getTour = async (req, res) => { // define param with '/:param' or optional with /:param?
    try {
        const tour = await Tour.findById(req.params.id)

        res.status(200).json({
            status: "success",
            data: {
                tour
            }
        })
    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

const updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            status: 'success',
            message: 'UPDATED',
            data: {
                tour
            }
        })
    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

const deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id)

        res.status(204).json({
            status: 'success',
            data: null
        })
    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

const getTourStats = async (req, res) => {
    try {
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
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}

const getMonthlyPlan = async (req, res) => {
    try {
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
    } catch(err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        })
    }
}

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