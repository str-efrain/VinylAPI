const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {
  validateRegister,
  validateLogin
} = require('../validation/auth.validation');

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

// POST /api/auth/login - Login an existing user
router.post('/login', async (req, res, next) => {
  try {
    const { error } = validateLogin(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    //Check of user bestaat
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send('Email does not exist.');
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) {
      return res.status(400).send('Invalid password.');
    }


    //JWT genereren
    const token = jwt.sign(
      {
        _id: user._id,
        role: user.role //Rol er in zodat rol makkelijk kan worden gecheckt
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN
      }
    );

    res.send({
      token,
      expiresIn: process.env.JWT_EXPIRES_IN //Zodat gebruiker ook kan zien hoelang token geldig is
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
