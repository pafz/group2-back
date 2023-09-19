const express = require('express');
const router = express.Router();

const EventController = require('../controllers/EventController');
const {
  authentication,
  isAuthor,
  isAdmin,
} = require('../middlewares/authentication');
const { uploadEventImages } = require('../middlewares/multer');

router.get('/getall', EventController.getAll);
router.get('/id/:_id', EventController.getById);
router.get('/title/:title', EventController.getEventsByName);
router.get('/', EventController.getEventUserReview);

router.put( "/id/:_id", authentication, isAdmin, uploadEventImages.single('image'), EventController.update);
router.put("/like/:_id", authentication, EventController.like);
router.put("/dislike/:_id", authentication, EventController.dislike);

router.delete("/delete/:_id", authentication, isAdmin, EventController.delete);

module.exports = router;
