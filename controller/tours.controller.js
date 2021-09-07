const Tour = require('../models/tours.model')
// GET All Tours
exports.getAllTours = async (req, res) => {
    try {
        const query = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete query[el])
        console.log(excludedFields);
        console.log(query)
        const tours = await Tour.find(query)
        res.status(200).json({
            status: true,
            result: tours.length,
            data: tours
        });
    } catch (error) {
        res.status(400).json({
            status: false,
            result: "Something went wrong"
        })
    }
};



// GET Single Tour
exports.getSingleTour = async (req, res) => {
    try {
        const _tour = await Tour.findById(req.params.id)
        res.status(200).json({
            status: true,
            data: _tour
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
            data: tour
        })
    } catch (e) {
        res.status(400).json({
            status: false,
            result: "Invalid data send!"
        })
    }
};

// UPDATE Tour
exports.updateTour = async (req, res) => {
    try {

        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({
            status: true,
            data: tour
        })
    } catch (error) {
        res.status(400).json({
            status: false,
            result: 'Error while updating!'
        })
    }
};

// DELETE Tour
exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status: true,
            result: "success"
        })
    } catch (error) {
        res.status(400).json({
            status: false,
            result: 'Unable to delete data'
        })
    }
};