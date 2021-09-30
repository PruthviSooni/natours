const express = require('express');

const router = express.Router();
const userController = require('../controller/user.controller');

router.use(express.json());

router
  // GET ALL USERS
  .get('/', userController.getAllUsers);

module.exports = router;
