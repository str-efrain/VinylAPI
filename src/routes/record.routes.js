const express = require('express');
const Record = require('../models/Record');
const validateRecord = require('../validation/record.validation');

const router = express.Router();

router.get('/', async (req, res) => {
  const records = await Record.find().sort('artist title');
  res.send(records);
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

module.exports = router;
