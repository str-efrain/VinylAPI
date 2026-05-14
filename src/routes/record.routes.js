const express = require('express');
const mongoose = require('mongoose');
const Record = require('../models/Record');
const {
  validateRecord,
  validateRecordUpdate
} = require('../validation/record.validation');

const router = express.Router();

// GET /api/records - Get all records
router.get('/', async (req, res) => {
  const records = await Record.find().sort('artist title');
  res.send(records);
});

// GET /api/records/:id - Get record by ID
router.get('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send('Invalid record ID.');
  }

  const record = await Record.findById(req.params.id);

  if (!record) {
    return res.status(404).send('Record not found.');
  }

  res.send(record);
});

// POST /api/records - Create a new record
router.post('/', async (req, res) => {
  const { error } = validateRecord(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const record = new Record({
    title: req.body.title,
    artist: req.body.artist,
    label: req.body.label,
    genre: req.body.genre,
    releaseYear: req.body.releaseYear,
    format: req.body.format,
    tracks: req.body.tracks,
    pressingInfo: req.body.pressingInfo
  });

  await record.save();
  res.status(201).send(record);
});

// PATCH /api/records/:id - Update a record
router.patch('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send('Invalid record ID.');
  }

  const { error } = validateRecordUpdate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const record = await Record.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!record) {
    return res.status(404).send('Record not found.');
  }

  res.send(record);
});

// DELETE /api/records/:id - Delete a record
router.delete('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send('Invalid record ID.');
  }

  const record = await Record.findByIdAndDelete(req.params.id);

  if (!record) {
    return res.status(404).send('Record not found.');
  }

  res.send(record);
});

module.exports = router;
