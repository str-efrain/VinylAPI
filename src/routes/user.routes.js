const express = require("express");
const User = require("../models/User");
const mongoose = require("mongoose");

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

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

// GET /api/users/:id - Get user by ID (admin only)
router.get("/:id", authMiddleware, adminMiddleware, async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
              return res.status(400).send("Invalid user ID.");
        }

        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        res.send(user);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
