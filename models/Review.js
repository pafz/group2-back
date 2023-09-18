const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const ReviewSchema = new mongoose.Schema(
  {
    title: String,
    body: String,    
    image:String,

    userId: { type: ObjectId, ref: "User" },
    eventId: { type: ObjectId, ref: "Event" },
    likes: [{ type: ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

ReviewSchema.methods.toJSON = function () {
  const review = this._doc;  
  delete review.createdAt;
  delete review.updatedAt;  
  delete review.__v;
  return review;
};

const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;
