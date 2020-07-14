import joi from "@hapi/joi";

export const registerValidation = (userInput) => {
  const schema = joi.object({
    name: joi.string().min(6).required(),
    email: joi.string().min(8).required().email(),
    password: joi.string().min(8).required(),
  });

  return schema.validate(userInput);
};

export const loginValidation = (userInput) => {
  const schema = joi.object({
    email: joi.string().min(8).required().email(),
    password: joi.string().min(8).required(),
  });

  return schema.validate(userInput);
};
