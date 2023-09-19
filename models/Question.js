const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const QuestionSchema = new mongoose.Schema(
  {
    title: String,
    body: String,        

    userId: { type: ObjectId, ref: "User" },
    eventId: { type: ObjectId, ref: "Event" },
    
  },
  { timestamps: true }
);

QuestionSchema.methods.toJSON = function () {
  const question = this._doc;  
  delete question.createdAt;
  delete question.updatedAt;  
  delete question.__v;
  return question;
};

const Question = mongoose.model("Question", QuestionSchema);
module.exports = Question;
