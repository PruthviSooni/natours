const express = require('express');

const router = express.Router();
const tourController = require('../controller/tours.controller');
const authController = require('../controller/auth.controller')

router.use(express.json());

// Custom Middleware to check ID
router
  // GET
  .get('/getAllTours', authController.protect, tourController.getAllTours)
  // POST
  .post('/addTour', tourController.createTour);

// GET Top 5 Tours middle ware
router
  .route('/top-five-tours')
  .get(tourController.getTopTours, tourController.getAllTours);

// GET Tours stats
router.route('/tour-stats').get(tourController.getToursStats);

// GET Monthly Plan
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/:id')
  // GET
  .get(tourController.getSingleTour)
  // PATCH
  .patch(tourController.updateTour)
  // DELETE
  .delete(tourController.deleteTour);
module.exports = router;
