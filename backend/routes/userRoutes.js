const express = require(“express”);
const router = express.Router();

const {
getProfile,
getAllUsers,
updateProfile,
deleteProfile
} = require(”../controllers/userController”);

const { protect } = require(”../middleware/auth”);

// Get logged-in user’s profile
router.get(”/profile”, protect, getProfile);

// Get all users
router.get(”/”, protect, getAllUsers);

// Update profile
router.put(”/profile”, protect, updateProfile);

// Delete account
router.delete(”/profile”, protect, deleteProfile);

module.exports = router;