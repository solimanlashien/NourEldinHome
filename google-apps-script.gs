// Paste this into Google Sheets > Extensions > Apps Script, then Deploy as a Web App.
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var d = JSON.parse(e.postData.contents);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Date', 'Name', 'Phone', 'Project type', 'Message', 'Language', 'Page']);
  }
  sheet.appendRow([new Date(), d.name, d.phone, d.type, d.message, d.lang, d.page]);
  return ContentService.createTextOutput('ok');
}
