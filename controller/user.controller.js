
const User = require('../models/users.model')
const catchAsync = require('../utils/catchAsync')


exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  /// Response
  res.status(200).json({
    status: true,
    result: users.length,
    data: users,
  });
});
