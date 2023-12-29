const { JWT } = require('google-auth-library');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const { googleConfig } = require('../config');
const { transformData } = require('../helpers');

module.exports = async () => {
  // Create a JWT instance for service account authentication
  const serviceAccountAuth = new JWT({
    email: googleConfig.serviceAccountKey.client_email,
    key: googleConfig.serviceAccountKey.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  // Create a new GoogleSpreadsheet instance with the provided Google Sheet ID and service account authentication
  const doc = new GoogleSpreadsheet(
    googleConfig.googleSheetId,
    serviceAccountAuth,
  );

  await doc.loadInfo(); // Load document properties and worksheets

  const sheetsData = {};

  // Iterate through all sheets in the document
  for (const sheet of doc.sheetsByIndex) {
    // Load all cells of the sheet
    await sheet.loadCells();

    const rowsData = [];

    // Iterate through all rows in the sheet
    for (let rowIndex = 0; rowIndex < sheet.rowCount; rowIndex++) {
      const row = {};

      // Iterate through all cells in the current row
      for (let colIndex = 0; colIndex < sheet.columnCount; colIndex++) {
        const cell = sheet.getCell(rowIndex, colIndex); // Get the value of the current cell

        // Check if the cell has a value and store it in the row object
        if (cell.value) {
          row[colIndex] = cell.value;
        }
      }

      // Check if the row is not empty
      const isRowEmpty = Object.values(row).every(value => !value);

      if (!isRowEmpty) {
        // If the row is not empty, check if it starts with specific strings or a numeric value
        const isValidRow =
          row[0] === 'Імя ' ||
          row[0] === 'Ціна' ||
          row[0] === 'Код товару' ||
          /^\d+$/.test(row[0]);

        if (isValidRow) {
          rowsData.push(row); // If the row is valid, add it to the array of rows for the current sheet
        }
      }
    }

    // Save the array of row data for the current sheet in the sheetsData object
    sheetsData[sheet.title] = rowsData;
  }

  // Transform the collected data using a helper function
  const res = transformData(sheetsData, null, 2);

  return res;
};
