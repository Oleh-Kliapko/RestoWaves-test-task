const { HttpError } = require('../helpers');

const isNumeric = value => /^[0-9]+$/.test(value);

module.exports = (req, _, next) => {
  const { page, limit } = req.query;

  if (page === undefined && limit === undefined) return next();

  if (!isNumeric(page) || !isNumeric(limit)) {
    throw HttpError(400, 'Page and limit must be numbers');
  }

  next();
};
