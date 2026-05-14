const express = require('express');
const mongoose = require('mongoose');
const Record = require('../models/Record');
const {
  validateRecord,
  validateRecordUpdate
} = require('../validation/record.validation');

const router = express.Router();

router.get('/', async (req, res) => {
  const records = await Record.find().sort('artist title');
  res.send(records);
});

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

module.exports = router;
