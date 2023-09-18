const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    body: {
      type: String,
      required: [true, "Body is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    place: {
      type: String,
      required: [true, "Place is required"],
    },
    
    image:String,
    likes: [{ type: ObjectId, ref: "User" }],
    userId: { type: ObjectId, ref: "User" },
    reviewIds: [{ type: ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);

EventSchema.methods.toJSON = function () {
  const event = this._doc;  
  delete eventatedAt;
  delete eventatedAt;  
  delete event;
  return event
}

const Event = mongoose.model("Event", EventSchema);


module.exports = Event
