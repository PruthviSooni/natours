const AppError = require('../utils/appError');

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err,
    });
};
const sendErrorProd = (err, res) => {
    //Operational Error
    if (err.isOperational) {
        console.log(`Error 🔥 ${err}`)
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        console.log(`Error 🔥 ${err}`)
        // Programming of Fatal Error
        res.status(500).json({
            status: false,
            message: 'Something went wrong',
        });
    }
};
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path} : ${err.value}`;
    return new AppError(message, 404);
};

const handleDuplicatesFieldsErrorDB = (err) => {
    const message = `Duplicate field value: ${err.keyValue.name}, Please select another value!`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
    const errorMessages = Object.values(err.errors).map((e) => e.message);
    const message = `Invalid input data : ${errorMessages.join('. ')}`;
    return new AppError(message, 400);
};
const handleTokenError = () => new AppError("Invalid token. Please login again", 401);
const handleTokenExpireError = () => new AppError("Token expired. Please login again", 401);

// Global Error handler this will catch all of the express errors
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || false;
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err, name: err.name, message: err.message };
        // Checking for invalid id errors..
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        // Checking for duplicate fields errors..
        if (error.code === 11000) error = handleDuplicatesFieldsErrorDB(error);
        // Checking Validation errors
        if (error.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError')
            error = handleTokenError();
        if (error.name === 'TokenExpiredError')
            error = handleTokenExpireError();

        sendErrorProd(error, res);
    }
};
