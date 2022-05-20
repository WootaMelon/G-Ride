//Mongoose Schema for a garage item 

const mongoose = require("mongoose");

const garageItemSchema = mongoose.Schema(
  {
    Itemtype: {
      type: String,
      required: [true, "Please add a item type"],
    },
    image: {
      type: String,
      required: [true, "Please add an image for the item"],
    },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("GarageItem", garageItemSchema);
