const express = require('express');
const router = express.Router();

const ReviewController = require('../controllers/ReviewController');
const { authentication, isAuthor } = require('../middlewares/authentication');


router.get('/id/:_id', authentication, ReviewController.getById);

router.post(  '/create',  authentication,   ReviewController.create);

router.put('/id/:_id',  authentication,   ReviewController.update);
router.put('/like/:_id', authentication, ReviewController.like);
router.put('/dislike/:_id', authentication, ReviewController.dislike);

router.delete('/id/:_id', authentication, ReviewController.delete);

module.exports = router;
