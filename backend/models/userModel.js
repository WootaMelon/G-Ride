//Mongoose Schema for a user

const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    avatar: {
      type: String,
    },
    City: {
      type: String,
    },
    subscribedRides: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "groupRide",
      },
    ],
    Garage: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "GarageItem",
      },
    ],
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("User", userSchema);
