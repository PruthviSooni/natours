const express = require('express');

const app = express();
const morgan = require('morgan');

const AppError = require('./utils/appError');
const errorHandler = require('./controller/error.controller');
const toursRoutes = require('./routes/tour.route');
const userRoutes = require('./routes/user.route');
// Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.headers);
  next();
});
// Tours Routes
app.use('/api/v1/tours', toursRoutes);
app.use('/api/v1/users', userRoutes);


// Error Tracker
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

// Error Handler
app.use(errorHandler);
module.exports = app;
