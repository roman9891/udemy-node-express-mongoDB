const express = require('express')
const { getAllTours, checkBody, createTour, getTour, updateTour, deleteTour, checkID } = require('./../controllers/tourController')

const router = express.Router()

// router.param('id', checkID)

router
    .route('/') // .route can be used in place app.method() to chain methods
    .get(getAllTours)
    .post(createTour)

router
    .route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour)

module.exports = router