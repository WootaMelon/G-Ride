const asyncHandler = require("express-async-handler");
const GroupRide = require("../models/groupRideModel");
const User = require("../models/userModel");

//Fetching all group rides

const getgroupRides = asyncHandler(async (req, res) => {
  const groupRides = await GroupRide.find();
  res.json(groupRides);
});

// ========================================================================= //

//Creating a group ride

const setgroupRide = asyncHandler(async (req, res) => {
  if (
    !req.body.rideName ||
    !req.body.rideDescription ||
    !req.body.rideLocation ||
    !req.body.routeCoordinates
  ) {
    res.status(400);
    throw new Error("Please add all required fields");
  }


  const groupRide = await GroupRide.create({
    rideName: req.body.rideName,
    riderCreator: req.user.name,
    rideDescription: req.body.rideDescription,
    rideLocation: req.body.rideLocation,
    riderProfile: req.body.riderProfile,
    routeCoordinates: req.body.routeCoordinates,
    user: req.user.id,
  });

  res.json(groupRide);
});

// ========================================================================= //

//Updating a Group Ride based on ID

const updateGroupRide = asyncHandler(async (req, res) => {
  const groupRide = await GroupRide.findById(req.params.id);
  console.log("id from server" + req.params.id);
  if (!groupRide) {
    res.status(400);
    throw new Error("groupRide not found");
  }

  if (groupRide.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const updatedGroupRide = await GroupRide.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  res.json(updatedGroupRide);
});

// ========================================================================= //

//Updating the group ride avatar to match that of the current user

const updateGroupRideAvatar = asyncHandler(async (req, res) => {
  const groupRide = await GroupRide.find({ user: req.params.id });
  if (!groupRide) {
    res.status(400);
    throw new Error("groupRide not found");
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const updatedGroupRide = await GroupRide.updateMany(
    { user: req.params.id },
    req.body,
    {
      new: true,
    }
  );
  res.json(updatedGroupRide);
});

// ========================================================================= //

//Deleting a group ride by ID and removing it from user subscriptions 

const deleteGroupRide = asyncHandler(async (req, res) => {
  const groupRide = await GroupRide.findById(req.params.id);

  if (!groupRide) {
    res.status(400);
    console.log("hello");
    throw new Error("group ride not not found");
  }
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  if (groupRide.user.toString() !== user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  await GroupRide.deleteOne(groupRide);

  await User.updateMany(
    { subscribedRides: groupRide._id },
    { $pull: { subscribedRides: req.params.id } },
    { multi: true }
  );

  res.json(groupRide);
});
module.exports = {
  getgroupRides,
  setgroupRide,
  updateGroupRide,
  updateGroupRideAvatar,
  deleteGroupRide,
};
