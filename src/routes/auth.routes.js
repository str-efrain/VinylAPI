const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { validateRegister } = require('../validation/auth.validation');

const router = express.Router();

// POST /api/auth/register - Register a new user
router.post('/register', async (req, res, next) => {
  try {
    const { error } = validateRegister(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.status(400).send('User already registered.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      profile: req.body.profile,
      preferences: req.body.preferences
    });

    await user.save();

    res.status(201).send({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile,
      preferences: user.preferences
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
