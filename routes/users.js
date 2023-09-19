const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { authentication } = require('../middlewares/authentication');
//TODO: authentication -> in logoutUser

router.get('/recoverPassword/:email', UserController.recoverPassword);
//router.post('/userConfirm/:emailToken', UserController.userConfirm);
router.post('/registerUser', UserController.registerUser);
router.post('/loginUser', UserController.loginUser);
router.put('/resetPassword/:recoverToken', UserController.resetPassword);
router.delete('/logout', authentication, UserController.logoutUser);

module.exports = router;
