const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;


const validCategories = [
  "Finanzas e inversión",
  "Gestión empresarial",
  "Habilidades directivas",
  "Marketing",
  "Tecnología",
  "Emprendimiento",
  "Sociedad",
];

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
    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: validCategories, 
    },
    time: {
      type: String,
      required: [true, "Time is required"],
      
    },    
    image: String,
    likes: [{ type: ObjectId, ref: "User" }],
    userId: { type: ObjectId, ref: "User" },
    reviewIds: [{ type: ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);

EventSchema.virtual("image_url").get(function () {
  if (this.image) {
    return `/assets/images/event/${this.image}`;
  }
  
  return "/assets/images/event/default-event.png"; 
});

EventSchema.methods.toJSON = function () {
  const event = this._doc;
  delete event.createdAt;
  delete event.updatedAt;  

  event.image_url = this.image_url;
  return event;
};

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
