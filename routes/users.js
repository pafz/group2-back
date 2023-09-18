const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
// const { authentication } = require('../middleware/authentication');

router.post('/registerUser', UserController.registerUser);
router.post('/loginUser', UserController.loginUser);

module.exports = router;
