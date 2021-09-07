const express = require('express')
const router = express.Router()
const tourController = require('../controller/tours.controller')

router.use(express.json())

/// Custom Middleware to check ID
router
    //GET
    .get('/getAllTours', tourController.getAllTours)
    //POST
    .post('/addTour', tourController.createTour)
router.route('/:id')
    //GET
    .get(tourController.getSingleTour)
    //PATCH 
    .patch(tourController.updateTour)
    //DELETE
    .delete(tourController.deleteTour)
module.exports = router