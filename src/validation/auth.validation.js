const Joi = require('joi');

function validateRegister(user) { //Role zit er niet in omdat admin alleen via db kan en niet door user zelf!!!
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().min(8).max(255).required(),
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
  });

  return schema.validate(user);
}

function validateLogin(user) {
  const schema = Joi.object({
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().min(8).max(255).required()
  });

  return schema.validate(user);
}

module.exports = {
  validateRegister,
  validateLogin
};
