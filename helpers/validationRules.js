module.exports = key => {
  const commonRules = {
    'any.required': `Field "${key}" is required`,
    'any.empty': `Field "${key}" can NOT be empty`,
  };

  const textRules = {
    'string.empty': `Field "${key}" can NOT be empty`,
    'string.min': `${key} must have {#limit} and more characters`,
    'string.max': `${key} must have {#limit} and less characters`,
    'string.length': `${key} must have {#limit} characters`,
  };

  const numberRules = {
    'number.base': `Invalid type for the field "${key}", it must be a number`,
    'number.min': `${key} must be ≥ {#limit}`,
    'number.max': `${key} must be ≤ {#limit}`,
    'number.positive': `${key} must be a positive number`,
  };

  const booleanRules = {
    'boolean.base': `${key} must be a boolean`,
  };

  return { textRules, numberRules, booleanRules, commonRules };
};
