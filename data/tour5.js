const fs = require('fs');
const Tour = require('../models/tours.model');

/* eslint-disable */
const tour5 = {
  id: 5,
  name: "The Sports Lover",
  startLocation: "California, USA",
  nextStartDate: "July 2021",
  duration: 14,
  maxGroupSize: 8,
  difficulty: "difficult",
  avgRating: 4.7,
  numReviews: 23,
  regPrice: 2997,
  shortDescription:
    "Surfing, skating, parajumping, rock climbing and more, all in one tour",
  longDescription:
    "Nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\nVoluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur!",
};

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);
const _tours = [];
const importData = async () => {
  try {
    // console.log(tours);
    for (var i = 0; i < tours.length; i++) {
      delete tours[i].id
      var isoDateString = new Date().toISOString();
      tours[i].createdAt = isoDateString
    }
    fs.writeFileSync(`${__dirname}/newTours.json`, JSON.stringify(tours), 'utf-8')

    console.log("Data Imported..");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const clearDB = async () => {
  try {
    await Tour.deleteMany().then((_) => console.log("DB is cleared."));
    console.log("Clearing DB..");

    process.exit();
  } catch (error) { }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  clearDB();
}
