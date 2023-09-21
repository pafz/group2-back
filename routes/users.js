const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const {
  authentication,
  isAuthor,
  isAuthorUser,
} = require('../middlewares/authentication');
const { uploadUserImages } = require('../middlewares/multer');

// router.get('/recoverPassword/:email', UserController.recoverPassword);
router.post('/userconfirm/:token', UserController.userConfirm);

router.post('/registeruser', UserController.registerUser);
router.post('/loginuser', UserController.loginUser);
router.put('/registeruser', UserController.registerUser);
router.put(
  '/update',
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
router.delete('/logout', authentication, UserController.logoutUser);

module.exports = router;
