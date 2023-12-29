module.exports = inputJson => {
  return Object.entries(inputJson).map(([key, value]) => {
    const data = [];

    for (let i = 1; i < value.length; i++) {
      const item = {};
      const name = value[0][i] && value[0][i].trim();

      if (name) {
        item.name = name;
        item.price = value[1][i];
        item.code = value[2][i].toString();
        item.sizes = value
          .slice(3)
          .filter(size => size[i] === '+')
          .map(size => parseInt(size[0]));
        data.push(item);
      }
    }

    return { [key]: data };
  });
};
