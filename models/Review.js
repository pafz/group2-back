const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const validPoints = [
    1,
    2,
    3,
    4,
    5    
  ];


const ReviewSchema = new mongoose.Schema(
  {
    title: String,
    body: String,    
    points: {
        type: String,        
        enum: validPoints, 
      },

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
