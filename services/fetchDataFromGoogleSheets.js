const { JWT } = require('google-auth-library');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const { googleConfig } = require('../config');
const { transformData } = require('../helpers');

module.exports = async () => {
  const serviceAccountAuth = new JWT({
    email: googleConfig.serviceAccountKey.client_email,
    key: googleConfig.serviceAccountKey.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const doc = new GoogleSpreadsheet(
    googleConfig.googleSheetId,
    serviceAccountAuth,
  );

  await doc.loadInfo(); // loads document properties and worksheets

  const sheetsData = {};

  // Проходження всіх листів
  for (const sheet of doc.sheetsByIndex) {
    await sheet.loadCells(); // Завантаження всіх комірок листа

    const rowsData = [];

    // Проходження всіх рядків
    for (let rowIndex = 0; rowIndex < sheet.rowCount; rowIndex++) {
      const row = {};

      // Проходження всіх комірок у рядку
      for (let colIndex = 0; colIndex < sheet.columnCount; colIndex++) {
        const cell = sheet.getCell(rowIndex, colIndex);
        if (cell.value) {
          row[colIndex] = cell.value;
        }
      }

      // Перевірка, чи рядок не є пустим
      const isRowEmpty = Object.values(row).every(value => !value);

      if (!isRowEmpty) {
        // Перевірка, чи рядок починається на "Імя", "Ціна", "Код товару" або розмір моделі
        const isValidRow =
          row[0] === 'Імя ' ||
          row[0] === 'Ціна' ||
          row[0] === 'Код товару' ||
          /^\d+$/.test(row[0]);

        if (isValidRow) {
          rowsData.push(row);
        }
      }
    }

    // Збереження даних листа у об'єкт
    sheetsData[sheet.title] = rowsData;
  }

  const res = transformData(sheetsData, null, 2);

  return res;
};
