const Tour = require('../models/tours.model');
const APIFeatures = require('../utils/apiFeatures.js');

// GET Top Tours
exports.getTopTours = async (req, res, next) => {
    req.query.sort = '-ratingsAverage,price';
    req.query.limit = '5';
    req.query.fields = 'name,price,ratingsAverage,description';
    next();
};

// GET All Tours
exports.getAllTours = async (req, res) => {
    try {
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
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: false,
            result: 'Something went wrong',
        });
    }
};

// GET Single Tour
exports.getSingleTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: true,
            data: tour,
        });
    } catch (error) {
        res.status(400).json({
            status: false,
            result: error,
        });
    }
};

// ADD Tour
exports.createTour = async (req, res) => {
    try {
        const tour = await Tour.create(req.body);
        res.status(201).json({
            status: true,
            data: tour,
        });
    } catch (e) {
        res.status(400).json({
            status: false,
            result: e,
        });
    }
};

// UPDATE Tour
exports.updateTour = async (req, res) => {
    try {
        // eslint-disable-next-line max-len
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({
            status: true,
            data: tour,
        });
    } catch (error) {
        res.status(400).json({
            status: false,
            result: 'Error while updating!',
        });
    }
};

// DELETE Tour
exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: true,
            result: 'success',
        });
    } catch (error) {
        res.status(400).json({
            status: false,
            result: 'Unable to delete data',
        });
    }
};

exports.getToursStats = async (req, res) => {
    try {
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
                stats: stats,
            }
        });
    } catch (error) {
        res.status(400).json({
            status: false,
            result: error,
        });
    }
};


exports.getMonthlyPlan = async (req, res) => {
    try {
        const year = req.params.year * 1;
        console.log(new Date(`${year}-12-31`));

        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    }
                },
            },

        ]);

        res.status(200).json({
            status: true,
            data: {
                plan,
            }
        });

    } catch (error) {
        res.status(400).json({
            status: false,
            result: error,
        });
    }
}