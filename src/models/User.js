const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      trim: true,
      maxlength: 50
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 300
    },
    country: {
      type: String,
      trim: true,
      maxlength: 80
    }
  },
  { _id: false }
);

const preferencesSchema = new mongoose.Schema(
  {
    favoriteGenres: {
      type: [String],
      default: []
    },
    favoriteFormats: {
      type: [String],
      enum: ['LP', 'EP', 'Single', 'Box Set'],
      default: []
    }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 5,
      maxlength: 255
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 1024
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    profile: {
      type: profileSchema,
      default: {}
    },
    preferences: {
      type: preferencesSchema,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
