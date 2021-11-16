const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/users.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError')

// creating JWT Token
const signToken = id => jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY
})

exports.signUp = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        changePasswordAt: req.body.changePasswordAt,
    });
    const token = signToken(newUser._id);
    res.status(201).json({
        status: true,
        token: token,
        data: newUser
    });
});






exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError("Please provide email and password", 400));
    }
    const user = await User.findOne({ email }).select('+password');

    // check if user or password is incorrect 
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }
    const token = signToken(user._id);
    res.status(200).json({
        status: true,
        token: token,
    })
});

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    // check the token if it exist's or not
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError("Unauthorized credentials", 401))
    }
    // token verification 
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decoded);

    // check user exist
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user does not exist!', 401));
    }
    // check if user changed password after token was issued..
    const checkUserPasswordStatus = currentUser.changePasswordAfter(decoded.iat);
    if (checkUserPasswordStatus) {
        return next(new AppError("User recently changed password! Please login again.", 401))
    }
    // after granted 
    req.user = currentUser;
    next();
})