const express = require('express');

const router = express.Router();
const userController = require('../controller/user.controller');
const authController = require('../controller/auth.controller');

router.use(express.json());

router.post('/singUp', authController.signUp);
router.post('/login', authController.login);
router
  // GET ALL USERS
  .get('/', userController.getAllUsers);


module.exports = router;
