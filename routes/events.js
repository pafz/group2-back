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
router.get('/search', EventController.searchEvents);
router.get('/', EventController.getEventUserReview);

router.post(
  '/create',
  authentication,
  uploadEventImages.single('image'),
  EventController.create
);

router.put(
  '/id/:_id',
  authentication,
  isAdmin,
  uploadEventImages.single('image'),
  EventController.update
);
router.put('/like/:_id', authentication, EventController.like);
router.put('/dislike/:_id', authentication, EventController.dislike);
router.put('/register/:_id', authentication, EventController.register);
router.put('/unregister/:_id', authentication, EventController.unregister);

router.delete('/delete/:_id', authentication, isAdmin, EventController.delete);

module.exports = router;
