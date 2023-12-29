module.exports = sheetsData => {
  // Use Object.entries to iterate over the properties
  return Object.entries(sheetsData).map(([key, value]) => {
    const data = [];

    // Iterate through the columns
    for (let i = 1; i < value.length; i++) {
      const item = {};

      // Get the name from the first row of the current column
      const name = value[0][i] && value[0][i].trim();

      if (name) {
        // Populate the item object with transformed data
        item.name = name;
        item.price = value[1][i];
        item.code = value[2][i].toString();
        item.sizes = value
          .slice(3)
          .filter(size => size[i] === '+')
          .map(size => parseInt(size[0]));

        // Add the item object to the data array
        data.push(item);
      }
    }

    // Return an object with the current key and the transformed data array
    return { [key]: data };
  });
};
