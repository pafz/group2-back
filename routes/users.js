const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const {
  authentication,
  isAuthorUser,
} = require('../middlewares/authentication');
const { uploadUserImages } = require('../middlewares/multer');

router.get('/confirm/:emailToken', UserController.userConfirm);
router.get(
  '/getuserconnected',
  authentication,
  UserController.getUserConnected
);
router.post(
  '/registeruser',
  uploadUserImages.single('avatar'),
  UserController.registerUser
);

router.post('/loginuser', UserController.loginUser);
router.post('/recoverpassword', UserController.recoverPassword);
router.put('/resetpassword', UserController.resetPassword);
router.put(
  '/updateuser',
  authentication,
  isAuthorUser,
  uploadUserImages.single('avatar'),
  UserController.update
);

router.post(
  '/registeruser',
  uploadUserImages.single('avatar'),
  UserController.registerUser
);

router.post('/loginuser', UserController.loginUser);

router.put('/followuser/:_id', authentication, UserController.followUser);
router.put('/unfollowuser/:_id', authentication, UserController.unfollowUser);

router.delete('/logout', authentication, UserController.logoutUser);

module.exports = router;
