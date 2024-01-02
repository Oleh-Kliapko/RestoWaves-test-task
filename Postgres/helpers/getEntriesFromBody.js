module.exports = data => {
  const values = Object.values(data);

  const keys = Object.keys(data).join(', ');

  const points = Object.keys(data)
    .map((key, index) => `${key} = $${index + 1}`)
    .join(', ');

  const indexes = Object.keys(data)
    .map((_, index) => `$${index + 1}`)
    .join(', ');

  return { values, keys, points, indexes };
};
