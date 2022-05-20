const express = require("express");
const router = express.Router();
const {
  getgroupRides,
  setgroupRide,
  updateGroupRide,
  updateGroupRideAvatar,
  deleteGroupRide,
} = require("../controllers/groupRideController");

//Routes related to actions on group rides

const { protect } = require("../middleware/authMiddleware");

// ========================================================================= //

router.get("/", protect, getgroupRides);

// ========================================================================= //

router.post("/", protect, setgroupRide);

// ========================================================================= //

router.put("/:id", protect, updateGroupRide);

// ========================================================================= //

router.put("/avatar/:id", protect, updateGroupRideAvatar);

// ========================================================================= //

router.delete("/:id", protect, deleteGroupRide);

module.exports = router;
