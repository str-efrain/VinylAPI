const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100
    },
    duration: {
      type: String,
      trim: true,
      maxlength: 10
    }
  },
  { _id: false } //Geen ID want embedded in Record
);

const pressingInfoSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    year: {
      type: Number,
      required: true,
      min: 1900,
      max: new Date().getFullYear()
    },
    color: {
      type: String,
      trim: true,
      maxlength: 50
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500
    }
  },
  { _id: false }
);

const recordSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100
    },
    artist: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100
    },
    label: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    genre: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    releaseYear: {
      type: Number,
      required: true,
      min: 1900,
      max: new Date().getFullYear()
    },
    format: {
      type: String,
      required: true,
      enum: ['LP', 'EP', 'Single', 'Box Set']
    },
    tracks: {
      type: [trackSchema],
      required: true,
      validate: {
        validator: (tracks) => tracks.length > 0,
        message: 'A record must have at least one track.'
      }
    },
    pressingInfo: {
      type: pressingInfoSchema,
      required: true
    }
  },
  {
    timestamps: true //Voor CreatedAt en UpdatedAt
  }
);

module.exports = mongoose.model('Record', recordSchema);
