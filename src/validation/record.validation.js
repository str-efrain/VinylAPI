const Joi = require('joi');

const currentYear = new Date().getFullYear();

const trackSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  duration: Joi.string().max(10)
});

const pressingInfoSchema = Joi.object({
  country: Joi.string().max(80).required(),
  year: Joi.number().integer().min(1900).max(currentYear).required(),
  color: Joi.string().max(50),
  notes: Joi.string().max(500)
});

function validateRecord(record) {
  const schema = Joi.object({
    title: Joi.string().min(1).max(100).required(),
    artist: Joi.string().min(1).max(100).required(),
    label: Joi.string().max(100).required(),
    genre: Joi.string().max(50).required(),
    releaseYear: Joi.number().integer().min(1900).max(currentYear).required(),
    format: Joi.string().valid('LP', 'EP', 'Single', 'Box Set').required(),
    tracks: Joi.array().items(trackSchema).min(1).required(),
    pressingInfo: pressingInfoSchema.required()
  });

  return schema.validate(record);
}

function validateRecordUpdate(record) {
  const schema = Joi.object({
    title: Joi.string().min(1).max(100),
    artist: Joi.string().min(1).max(100),
    label: Joi.string().max(100),
    genre: Joi.string().max(50),
    releaseYear: Joi.number().integer().min(1900).max(currentYear),
    format: Joi.string().valid('LP', 'EP', 'Single', 'Box Set'),
    tracks: Joi.array().items(trackSchema).min(1),
    pressingInfo: pressingInfoSchema
  }).min(1);

  return schema.validate(record);
}

module.exports = {
  validateRecord,
  validateRecordUpdate
};
