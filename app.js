const express = require('express');

const app = express();
const morgan = require('morgan');

const toursRoutes = require('./routes/tour.route');
const userRoutes = require('./routes/user.route');

// Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

// Tours Routes
app.use('/api/v1/tours', toursRoutes);
app.use('/api/v1/users', userRoutes);

module.exports = app;
