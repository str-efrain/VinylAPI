const Joi = require('joi');

function validateUserUpdate(user) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50),
    profile: Joi.object({
      displayName: Joi.string().max(50),
      bio: Joi.string().max(300),
      country: Joi.string().max(80)
    }),
    preferences: Joi.object({
      favoriteGenres: Joi.array().items(Joi.string().max(50)),
      favoriteFormats: Joi.array().items(
        Joi.string().valid('LP', 'EP', 'Single', 'Box Set')
      )
    })
  }).min(1);

  return schema.validate(user);
}

module.exports = {
  validateUserUpdate
};
