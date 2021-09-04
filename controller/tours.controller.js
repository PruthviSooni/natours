
const fs = require('fs')
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../data/tours-simple.json`))
// GET All Tours
exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: true,
        results: tours.length,
        data: tours
    });
};

exports.checkId = (req, res, next, value) => {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: false,
            result: "Invalid Id"
        });
    }
    next();
}

exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: false,
            result: "name and price is required",
        })
    } 
        next()
};

// GET Single Tour
exports.getSingleTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(e => e.id === id);
    res.status(200).json({
        status: true,
        result: tour
    });
};

// ADD Tour
exports.addTour = (req, res) => {
    const _id = tours[tours.length - 1].id + 1
    const _newTour = Object.assign({ id: _id }, req.body)
    tours.push(_newTour)
    fs.writeFile(`${__dirname}/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: true,
            result: _newTour
        })
    })
};

// UPDATE Tour
exports.updateTour = (req, res) => {
    const id = req.params.id * 1;
    const _tour = tours.find(e => e.id === id);
    tours[id] = Object.assign({ id: id }, req.body)
    const updatedTour = tours.find(e => e.id === id)
    fs.writeFile(`${__dirname}/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(200).json({
            status: true,
            result: updatedTour
        })
    })
};

// DELETE Tour
exports.deleteTour = (req, res) => {
    const id = req.params.id * 1;
    var _tours = tours.filter(item => item.id != id)
    fs.writeFile(`${__dirname}/data/tours-simple.json`, JSON.stringify(_tours), err => {
        res.status(200).json({
            status: true,
            result: "success"
        })
    })
};