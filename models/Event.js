const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "El titulo es necesario"],
    },
    body: {
      type: String,
      required: [true, "Descripcion es necesaria"],
    },
    price: {
      type: Number,
      required: [true, "Precio requerido"],
    },
    date: {
      type: Date,
      required: [true, "Fecha requerida"],
    },
    place: {
      type: String,
      required: [true, "Lugar requerido"],
    },
    speaker: {
      type: String,
      required: [true, "Ponente requerido"],
    },
    categories: {
      type: String,
      required: [true, "Ponente requerido"],
    },

    
    image:String,
    likes: [{ type: ObjectId, ref: "User" }],
    userId: { type: ObjectId, ref: "User" },
    commentIds: [{ type: ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

EventSchema.methods.toJSON = function () {
  const event = this._doc;  
  delete eventatedAt;
  delete eventatedAt;    
  return event
}

const Event = mongoose.model("Event", EventSchema);


module.exports = Event
