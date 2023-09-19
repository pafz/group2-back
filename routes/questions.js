const express = require("express");
const router = express.Router();


const QuestionController = require("../controllers/QuestionController");
const { authentication, isAdmin  } = require("../middlewares/authentication");

  

router.get("/getall", QuestionController.getAll)

router.post("/create", authentication, QuestionController.create);

router.put("/id/:_id", authentication,  QuestionController.update);

router.delete("/id/:_id", authentication, QuestionController.delete);

module.exports = router;