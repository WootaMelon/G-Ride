//Mongoose Schema for a group ride 

const mongoose = require("mongoose");

const groupRideSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    rideName: {
      type: String,
      required: [true, "Please add a ride name"],
    },
    riderCreator: {
      type: String,
      required: [true, "Please add a rider creator"],
    },
    rideDescription: {
      type: String,
      required: [true, "Please add ride description"],
    },
    rideLocation: {
      type: String,
      required: [true, "Please add a ride location"],
    },
    riderProfile: {
      type: String,
    },
    rideCover: {
      type: String,
    },
    routeCoordinates: [
      {
        type: { latitude: { type: Number }, longitude: { type: Number } },
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("groupRide", groupRideSchema);
