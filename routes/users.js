const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const { authentication, isAuthorUser } = require("../middlewares/authentication");
const { uploadUserImages } = require("../middlewares/multer");
//TODO: authentication -> in logoutUser

<<<<<<< HEAD
// router.get("/recoverPassword/:email", UserController.recoverPassword);
=======
//router.get("/recoverPassword/:email", UserController.recoverPassword);
>>>>>>> 7436da8c88d4f3f41e95edce19fedb8e8ee2a9d8
//router.post('/userConfirm/:emailToken', UserController.userConfirm);
router.get("/getuserconnected",authentication, UserController.getUserConnected);
router.post("/registeruser",uploadUserImages.single("avatar"), UserController.registerUser);

router.post("/loginuser", UserController.loginUser);
<<<<<<< HEAD
// router.put("/resetPassword/:recoverToken", UserController.resetPassword);
=======
//router.put("/resetPassword/:recoverToken", UserController.resetPassword);
>>>>>>> 7436da8c88d4f3f41e95edce19fedb8e8ee2a9d8
router.put("/updateuser", authentication, isAuthorUser, uploadUserImages.single("avatar"), UserController.update)

router.delete("/logout", authentication, UserController.logoutUser);

module.exports = router;
