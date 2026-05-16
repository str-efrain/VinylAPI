const express = require("express");
const User = require("../models/User");
const mongoose = require("mongoose");

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");
const {
  validateUserUpdate,
  validateRoleUpdate,
} = require("../validation/user.validation");

const router = express.Router();

// GET /api/users - Get all users (admin only)
router.get("/", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort("name");
    res.send(users);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/users/:id/role - Update user role (admin only)
router.patch("/:id/role", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid user ID.");
    }

    const { error } = validateRoleUpdate(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: { role: req.body.role },
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    if (!user) {
      return res.status(404).send("User not found.");
    }

    res.send(user);
  } catch (error) {
    next(error);
  }
});

// GET /api/users/:id - Get user by ID (admin only)
router.get("/:id", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid user ID.");
    }

    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).send("User not found.");
    }

    res.send(user);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/users/:id - Update user profile/preferences (admin only)
router.patch("/:id", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid user ID.");
    }

    const { error } = validateUserUpdate(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    if (!user) {
      return res.status(404).send("User not found.");
    }

    res.send(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
