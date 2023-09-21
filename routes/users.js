const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const {
  authentication,
  isAuthorUser,
} = require('../middlewares/authentication');
const { uploadUserImages } = require('../middlewares/multer');

router.post(
  '/registeruser',
  uploadUserImages.single('avatar'),
  UserController.registerUser
);

router.post('/loginuser', UserController.loginUser);
router.put(
  '/updateuser',
  authentication,
  isAuthorUser,
  uploadUserImages.single('avatar'),
  UserController.update
);

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
router.put(
  '/updateuser',
  authentication,
  isAuthorUser,
  uploadUserImages.single('avatar'),
  UserController.update
);

router.delete('/logout', authentication, UserController.logoutUser);

module.exports = router;
