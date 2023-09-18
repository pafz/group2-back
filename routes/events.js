const express = require("express");
const router = express.Router();

const EventController = require("../controllers/EventController");
const { authentication, isAuthor } = require("../middlewares/authentication");
const { uploadEventImages } = require("../middlewares/multer");

router.get("/getall", EventController.getAll)
router.get("/id/:_id", EventController.getById);
router.get("/title/:title", EventController.getEventsByName);
router.get("/", EventController.getEventUserComment);

router.post("/create", authentication, uploadEventImages.single('image'), EventController.create);

router.put( "/id/:_id", authentication, isAuthor, uploadEventImages.single('image'), EventController.update);
router.put("/like/:_id", authentication, EventController.like);
router.put("/dislike/:_id", authentication, EventController.dislike);

router.delete("/delete/:_id", authentication, isAuthor, EventController.delete);

module.exports = router;
