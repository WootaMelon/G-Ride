const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const GroupRide = require("../models/groupRideModel");
const GarageItem = require("../models/garageModel");

//User REST API BELOW

//Registering a user, each user has a unique name so no two users must have the same name

const registerUser = asyncHandler(async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }
  const userExists = await User.findOne({ name });
  if (userExists) {
    res.status(400);
    throw new Error("User Already Exists");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    password: hashedPassword,
    avatar: "",
    City: "Beirut",
    subscribedRides: [],
    Garage: [],
  });
  if (user)
    res.status(201).json({
      _id: user.id,
      name: user.name,
      token: generateToken(user._id),
      avatar: user.avatar,
      City: user.City,
      subscribedRides: user.subscribedRides,
      Garage: user.Garage,
    });
  else {
    res.status(400);
    throw new Error("Invalid user Data");
  }
});

// ========================================================================= //

//Logging a user in using name and hashed password

const loginUser = asyncHandler(async (req, res) => {
  const { name, password } = req.body;
  const user = await User.findOne({ name });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      token: generateToken(user._id),
      avatar: user.avatar,
      City: user.City,
      subscribedRides: user.subscribedRides,
      Garage: user.Garage,
    });
  } else {
    res.status(400);
    throw new Error("Invalid Credential");
  }
});

// ========================================================================= //

//Getting the current logged in user

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// ========================================================================= //

//Getting all users registered in the app

const getAllUsers = asyncHandler(async (req, res) => {
  const user = await User.find({}, { _id: 1, name: 1, avatar: 1, City: 1 });
  res.status(200).json(user);
});

// ========================================================================= //

//getting a user through ID

const getUserByID = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id, {
    _id: 1,
    name: 1,
    avatar: 1,
    City: 1,
  });
  res.status(200).json(user);
});

// ========================================================================= //

//getting a user garage by ID

const getGarageByID = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  const garageItemIDs = user.Garage;
  let garageItems = [];


  garageItems = await GarageItem.find({_id: { $in: garageItemIDs }});


  res.status(200).json(garageItems);
});

// ========================================================================= //


const deleteGarageItemByID = asyncHandler(async (req, res) => {
  const item = await GarageItem.findById(req.params.id);
  console.log("ITEM",item);

  if (!item) {
    res.status(400);
    throw new Error("Item not found");
  }
  // const user = await User.findById(req.user.id);

  // if (!user) {
  //   res.status(401);
  //   throw new Error("User not found");
  // }


  await GarageItem.deleteOne(item);

  await User.updateOne(
    { _id: req.user._id },
    { $pull: { Garage: req.params.id } },
  );

  res.json(groupRide);
});

// ========================================================================= //

//Subscribing to a group ride which will update the subscribed user's ride 
//by inserting the specific ride to their subscriptions

const subscribeToRide = asyncHandler(async (req, res) => {
  const groupRide = await GroupRide.find(
    { rideName: req.body.rideName },
    {
      _id: 1,
    }
  );

  if (!groupRide) {
    res.status(400);
    throw new Error("No such ride exists");
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      $push: { subscribedRides: groupRide },
    },
    {
      new: true,
    }
  );
  res.status(200).json(user);
});

// ========================================================================= //

//Unsubscribing to a group ride which will update the subscribed user's ride 
//by deleting the specific ride from their subscription

const unsubscribeToRide = asyncHandler(async (req, res) => {
  const groupRide = await GroupRide.find(
    { rideName: req.body.rideName },
    { _id: 1 }
  );

  if (!groupRide) {
    res.status(400);
    throw new Error("No such ride exists");
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      $pull: {
        subscribedRides: {
          $in: groupRide,
        },
      },
    },
    {
      new: true,
    }
  );
  if (!user) {
    res.status(400);
    throw new Error("Removal Failure");
  }
  res.status(200).json(user);
});

// ========================================================================= //

//Get all participating users of a group ride

const getParticipatingUsers = asyncHandler(async (req, res) => {
  const user = await User.find(
    { subscribedRides: req.params.id },
    { _id: 0, name: 1, avatar: 1 }
  );

  if (!user) {
    res.status(400);
    throw new Error("No participants.");
  }

  res.status(200).json(user);
});

// ========================================================================= //

//Get the current logged in user's subscriptions to be viewed in their profile

const getMySubscriptions = asyncHandler(async (req, res) => {
  const userRides = await User.find(
    { _id: req.params.id },
    { _id: 0, subscribedRides: 1 }
  );
  if (!userRides) {
    res.status(400);
    throw new Error("No such user exists");
  }
  const x = userRides[0].subscribedRides;

  const subscriptions = await GroupRide.find({ _id: { $in: x } });

  res.status(200).json(subscriptions);
});

// ========================================================================= //

//change the current user's city 

const changeCity = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, {
    City: req.body.City,
  });
  if (!user) {
    res.status(400);
    throw new Error("No such user exists");
  }
  const updateUser = await User.findById(req.params.id);
  res.status(201).json(updateUser);
});

// ========================================================================= //

//get users who are in the same city of the current logged in user

const getNearbyUsers = asyncHandler(async (req, res) => {
  const user = await User.find(
    { City: req.body.City },
    { _id: 1, name: 1, avatar: 1, City: 1 }
  );
  res.status(200).json(user);
});

// ========================================================================= //

//generating a json web token for the logged in user which expires after 30d

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getAllUsers,
  getUserByID,
  subscribeToRide,
  unsubscribeToRide,
  getParticipatingUsers,
  getMySubscriptions,
  changeCity,
  getNearbyUsers,
  getGarageByID,
  deleteGarageItemByID
};
