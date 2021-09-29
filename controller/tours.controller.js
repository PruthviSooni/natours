const Tour = require('../models/tours.model');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
// GET Top Tours
exports.getTopTours = async (req, res, next) => {
    req.query.sort = '-ratingsAverage,price';
    req.query.limit = '5';
    req.query.fields = 'name,price,ratingsAverage,description';
    next();
};

// GET All Tours
exports.getAllTours = catchAsync(async (req, res, next) => {
    // API Features
    const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .pagination();
    const tours = await features.query;
    /// Response
    res.status(200).json({
        status: true,
        result: tours.length,
        data: tours,
    });
});

// GET Single Tour
exports.getSingleTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
        return next(new AppError('Tour Not found on given id!', 404));
    }
    res.status(200).json({
        status: true,
        data: tour,
    });
});

// ADD Tour
exports.createTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.create(req.body);
    res.status(201).json({
        status: true,
        data: tour,
    });
});

// UPDATE Tour
exports.updateTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!tour) {
        return next(new AppError('Tour Not found on given id!', 404));
    }
    res.status(200).json({
        status: true,
        data: tour,
    });
});

// DELETE Tour
exports.deleteTour = catchAsync(async (req, res, next) => {
   const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) {
        return next(new AppError('Tour Not found on given id!', 404));
    }

    res.status(204).json({
        status: true,
        result: 'success',
    });
});

exports.getToursStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: {
                ratingsAverage: { $gte: 4.5 }
            }
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                totalTours: { $sum: 1 },
                totalRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            },
        },
        //SORT
        {
            $sort:
                { totalRatings: 1 }
        }
    ]);
    res.status(200).json({
        status: true,
        data: {
            stats,
        }
    });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;
    console.log(new Date(`${year}-01-01`));

    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },

    ]);

    res.status(200).json({
        status: 'success',
        data: {
            plan
        }
    });

    res.status(200).json({
        status: true,
        data: {
            plan,
        }
    });
});
