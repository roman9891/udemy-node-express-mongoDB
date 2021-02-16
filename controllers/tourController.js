const fs = require('fs')
const Tour = require('./../models/tourModel')

// const tours = JSON.parse( // parse data first
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`) // use sync method outside of callbacks so it doesn't block event loop
// )

const getAllTours = async (req, res) => {
    try {
        // BUILD QUERY
        const queryObj = {...req.query}
        const excludeFields = ['page', 'sort', 'limit', 'fields']
        excludeFields.forEach(field => delete queryObj[field])

        const query = Tour.find(queryObj)
        
        const tours = await query

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

module.exports = {
    getAllTours,
    formatTour,
    createTour,
    getTour,
    updateTour,
    deleteTour,
}