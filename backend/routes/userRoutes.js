const express = require('express');
const router = express.Router();

const {
  getProfile,
  getAllUsers,
  updateProfile,
  deleteProfile,
} = require('../controllers/userController');

const { protect } = require('../middleware/auth');

// Get logged-in user's profile
router.get('/profile', protect, getProfile);

// Get all users
router.get('/', protect, getAllUsers);

// Update profile
router.put('/profile', protect, updateProfile);

// Delete account
router.delete('/profile', protect, deleteProfile);

module.exports = router;
const express = require("express");
const router = express.Router();

const {
    getProfile,
    getUsers,
    updateUser,
    deleteUser
} = require("../controllers/userController");

const { protect, admin } = require("../middleware/auth");

router.get("/profile", protect, getProfile);

router.get("/", protect, admin, getUsers);

router.put("/:id", protect, updateUser);

router.delete("/:id", protect, admin, deleteUser);

module.exports = router;