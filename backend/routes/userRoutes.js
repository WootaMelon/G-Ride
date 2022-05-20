const express = require("express");
const multer = require("multer");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const GarageItem = require("../models/garageModel");
const sharp = require("sharp");
const { uuid } = require("uuidv4");
const cloudinary = require("../helper/imageUpload");
const router = express.Router();
const {
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
  deleteGarageItemByID,
} = require("../controllers/userController");

//Configuring Multer for Image Uploads

const storage = multer.diskStorage({
  // destination: (req, file, cb) => {
  //   cb(null, "/Users/mohamadalawieh/Desktop/Capstone/backend/public");
  // },
  // filename: (req, file, cb) => {
  //   cb(null, new Date().toISOString() + file.originalname);
  // },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const uploads = multer({ storage, fileFilter });

// ========================================================================= //

const { protect } = require("../middleware/authMiddleware");

// ========================================================================= //

router.post("/", registerUser);

// ========================================================================= //

router.put("/updateAvatar/:id", uploads.single("avatar"), async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: `${user._id}_profile`,
      width: 500,
      height: 500,
      crop: "fill",
      folder: "avatars",
    });
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { avatar: result.secure_url },
      {
        new: true,
      }
    );
    res.status(201).json(updatedUser);
  } catch (error) {
    res.status(500).json("Derp");
  }
});

// ========================================================================= //

router.put(
  "/updateGarage/:id",
  uploads.single("GarageItem"),
  async (req, res) => {
    // const user = await User.findById(req.params.id);
    // console.log(user);
    // if (!user) {
    //   res.status(401);
    //   throw new Error("User not found");
    // }

    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        public_id: `${req.params.id}_${req.body.Itemtype}_${uuid()}`,
        width: 500,
        height: 500,
        crop: "fill",
        folder: `${req.params.id}_Garage`,
      });
      const itemToAdd = {
        Itemtype: req.body.Itemtype,
        image: result.secure_url,
      };
      console.log(itemToAdd);

      try {
        const createGarageItem = await GarageItem.create(itemToAdd);
        const updatedUserGarage = await User.findByIdAndUpdate(
          req.params.id,
          {
            $push: {
              Garage: createGarageItem._id,
            },
          },
          {
            new: true,
          }
        );
      } catch (err) {
        console.trace(err);
      }
      console.log(updatedUserGarage);
      res.status(201).json(updatedUserGarage);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// ========================================================================= //

router.put("/changeCity/:id", protect, changeCity);

// ========================================================================= //

router.post("/login", loginUser);

// ========================================================================= //

router.get("/me", protect, getMe);

// ========================================================================= //

router.get("/all", protect, getAllUsers);

// ========================================================================= //

router.post("/nearby", protect, getNearbyUsers);

// ========================================================================= //

router.post("/subscribeToRide/:id", protect, subscribeToRide);

// ========================================================================= //

router.post("/unsubscribeToRide/:id", protect, unsubscribeToRide);

// ========================================================================= //

router.get("/getParticipatingUsers/:id", protect, getParticipatingUsers);

// ========================================================================= //

router.get("/getMySubscriptions/:id", protect, getMySubscriptions);

// ========================================================================= //

router.get("/getUserByID/:id", protect, getUserByID);

// ========================================================================= //

router.get("/getGarageItems/:id", protect, getGarageByID);

// ========================================================================= //

router.delete("/deleteGarageItem/:id", protect, deleteGarageItemByID);

module.exports = router;
