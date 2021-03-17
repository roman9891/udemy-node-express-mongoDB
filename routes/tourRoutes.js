const express = require('express')
const { aliasTopTours, getAllTours, checkBody, createTour, getTour, updateTour, deleteTour, checkID, getTourStats, getMonthlyPlan } = require('./../controllers/tourController')

const router = express.Router()

// router.param('id', checkID)

router.route('/top-5-cheap').get(aliasTopTours, getAllTours)
router.route('/tour-stats').get(getTourStats)
router.route('/monthly-plan/:year').get(getMonthlyPlan)

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