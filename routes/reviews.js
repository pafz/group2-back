const express = require("express");
const router = express.Router();


const ReviewController = require("../controllers/ReviewController");
const { authentication, isAuthor } = require("../middlewares/authentication");
const {  uploadReviewImages } = require("../middlewares/multer");
  

router.get("/id/:_id", authentication, ReviewController.getById);

router.post("/create", authentication, uploadReviewImages.single('image'),ReviewController.create);

router.put("/id/:_id", authentication, isAuthor,  uploadReviewImages.single('image'), ReviewController.update);
router.put("/like/:_id", authentication, ReviewController.like);
router.put("/like/:_id", authentication,ReviewController.like);
router.put("/dislike/:_id", authentication, ReviewController.dislike);

router.delete("/id/:_id", authentication, isAuthor, ReviewController.delete);

module.exports = router;
