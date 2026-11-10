// Paste into the spreadsheet's Apps Script project, then deploy as a Web App.
function doPost(e) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var data = JSON.parse(e.postData.contents);

  if (data.type === 'Site analytics') {
    var analytics = getOrCreateSheet(spreadsheet, 'Site Analytics',
      ['Date', 'Event', 'Visitor ID', 'Session ID', 'Page', 'Language']);
    analytics.appendRow([new Date(), data.event || 'Page view', data.visitorId || '',
      data.sessionId || '', data.page || '', data.lang || '']);
    styleDataSheet(analytics, [170, 130, 260, 260, 190, 110]);
    updateDashboard(spreadsheet);
    return ContentService.createTextOutput('ok');
  }

  var isWelcome = data.type === 'Website welcome';
  var sheet = isWelcome
    ? getOrCreateSheet(spreadsheet, 'Welcome Page', ['Date', 'Name', 'Phone', 'Language', 'Page'])
    : spreadsheet.getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Date', 'Name', 'Phone', 'Project type', 'Message', 'Language', 'Page']);
  }

  var row = isWelcome
    ? [new Date(), data.name, data.phone, data.lang, data.page]
    : [new Date(), data.name, data.phone, data.type, data.message, data.lang, data.page];
  sheet.appendRow(row);
  if (isWelcome) styleDataSheet(sheet, [170, 190, 150, 110, 320]);
  else styleDataSheet(sheet, [170, 190, 150, 190, 340, 110, 320]);
  updateDashboard(spreadsheet);
  return ContentService.createTextOutput('ok');
}

function getOrCreateSheet(spreadsheet, name, headers) {
  var sheet = spreadsheet.getSheetByName(name);
  if (!sheet) sheet = spreadsheet.insertSheet(name);
  if (sheet.getLastRow() === 0) sheet.appendRow(headers);
  return sheet;
}

function styleDataSheet(sheet, widths) {
  var lastRow = Math.max(1, sheet.getLastRow());
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, widths.length)
    .setBackground('#17332c').setFontColor('#ffffff').setFontWeight('bold');
  sheet.getRange(1, 1, lastRow, widths.length).setVerticalAlignment('middle');
  sheet.setRowHeight(1, 34);
  sheet.getRange(2, 1, Math.max(1, lastRow - 1), 1).setNumberFormat('dd mmm yyyy, hh:mm');
  widths.forEach(function(width, index) { sheet.setColumnWidth(index + 1, width); });
  var filter = sheet.getFilter();
  if (!filter && lastRow > 1) sheet.getRange(1, 1, lastRow, widths.length).createFilter();
  else if (filter) filter.setRange(sheet.getRange(1, 1, lastRow, widths.length));
}

function updateDashboard(spreadsheet) {
  var dashboard = spreadsheet.getSheetByName('Dashboard');
  if (dashboard && String(dashboard.getRange('A1').getValue()).indexOf('EXECUTIVE LEADS') > -1) {
    // Live formula-driven Executive Dashboard is active; formulas and charts self-update automatically.
    SpreadsheetApp.flush();
    return;
  }
  dashboard = getOrCreateSheet(spreadsheet, 'Dashboard', ['NourEldin Home — Site Dashboard']);
  var analytics = spreadsheet.getSheetByName('Site Analytics');
  var welcome = spreadsheet.getSheetByName('Welcome Page');
  var requestSheet = spreadsheet.getSheets()[0];
  var timezone = spreadsheet.getSpreadsheetTimeZone();
  var analyticsRows = analytics && analytics.getLastRow() > 1
    ? analytics.getRange(2, 1, analytics.getLastRow() - 1, 6).getValues() : [];
  var welcomeRows = welcome && welcome.getLastRow() > 1
    ? welcome.getRange(2, 1, welcome.getLastRow() - 1, 5).getValues() : [];
  var requestRows = requestSheet && requestSheet.getLastRow() > 1
    ? requestSheet.getRange(2, 1, requestSheet.getLastRow() - 1, Math.min(7, requestSheet.getLastColumn())).getValues() : [];

  dashboard.getRange('A1:O70').breakApart();
  dashboard.getRange('A3:O70').clear();

  var visitors = {}, sessions = {}, pages = {}, pageVisitors = {}, languages = {};
  var dayStats = {}, pageViews = 0, recentViews = 0;
  var today = new Date();
  today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  var startDay = new Date(today.getTime() - 29 * 86400000);
  var todayKey = Utilities.formatDate(today, timezone, 'yyyy-MM-dd');
  var startKey = Utilities.formatDate(startDay, timezone, 'yyyy-MM-dd');

  function dayKey(value) {
    return value instanceof Date && !isNaN(value.getTime())
      ? Utilities.formatDate(value, timezone, 'yyyy-MM-dd') : '';
  }
  function ensureDay(key, date) {
    if (!dayStats[key]) dayStats[key] = {date: date, views: 0, visitors: {}, welcome: 0, requests: 0};
    return dayStats[key];
  }

  for (var d = 0; d < 30; d++) {
    var day = new Date(startDay.getTime() + d * 86400000);
    ensureDay(Utilities.formatDate(day, timezone, 'yyyy-MM-dd'), day);
  }

  analyticsRows.forEach(function(row) {
    var date = row[0], event = row[1], visitor = String(row[2] || ''), session = String(row[3] || '');
    var page = String(row[4] || 'Unknown'), language = String(row[5] || 'Unknown');
    if (event !== 'Page view') return;
    pageViews++;
    pages[page] = (pages[page] || 0) + 1;
    pageVisitors[page] = pageVisitors[page] || {};
    if (visitor) { visitors[visitor] = true; pageVisitors[page][visitor] = true; }
    if (session) sessions[session] = true;
    languages[language] = (languages[language] || 0) + 1;
    var key = dayKey(date);
    if (key && key >= startKey && key <= todayKey) {
      recentViews++;
      var stats = ensureDay(key, date);
      stats.views++;
      if (visitor) stats.visitors[visitor] = true;
    }
  });

  welcomeRows.forEach(function(row) {
    var key = dayKey(row[0]);
    if (key && dayStats[key]) dayStats[key].welcome++;
  });
  requestRows.forEach(function(row) {
    var key = dayKey(row[0]);
    if (key && dayStats[key]) dayStats[key].requests++;
  });

  var uniqueVisitors = Object.keys(visitors).length;
  var sessionCount = Object.keys(sessions).length;
  var welcomeCount = welcomeRows.length;
  var requestCount = requestRows.length;
  var avgViews = sessionCount ? pageViews / sessionCount : 0;
  var welcomeRate = uniqueVisitors ? welcomeCount / uniqueVisitors : 0;
  var requestRate = uniqueVisitors ? requestCount / uniqueVisitors : 0;

  dashboard.setHiddenGridlines(true);
  mergeIfNeeded(dashboard, 'A1:H1');
  mergeIfNeeded(dashboard, 'A2:H2');
  dashboard.getRange('A1').setValue('NOURELDIN HOME  |  WEBSITE PERFORMANCE');
  dashboard.getRange('A2').setValue('Anonymous site activity and form performance  •  Updated ' + Utilities.formatDate(new Date(), timezone, 'dd MMM yyyy, hh:mm'));
  dashboard.getRange('A1:H2').setBackground('#17332c').setFontColor('#ffffff');
  dashboard.getRange('A1').setFontSize(16).setFontWeight('bold');
  dashboard.getRange('A2').setFontSize(9).setFontColor('#d8cba8');
  dashboard.setRowHeight(1, 38);
  dashboard.setRowHeight(2, 26);

  var cards = [
    {label: 'UNIQUE BROWSERS', value: uniqueVisitors, labelRange: 'A4:B4', valueRange: 'A5:B6', format: '#,##0'},
    {label: 'SESSIONS', value: sessionCount, labelRange: 'C4:D4', valueRange: 'C5:D6', format: '#,##0'},
    {label: 'PAGE VIEWS', value: pageViews, labelRange: 'E4:F4', valueRange: 'E5:F6', format: '#,##0'},
    {label: 'WELCOME SUBMISSIONS', value: welcomeCount, labelRange: 'G4:H4', valueRange: 'G5:H6', format: '#,##0'},
    {label: 'QUOTE REQUESTS', value: requestCount, labelRange: 'A8:B8', valueRange: 'A9:B10', format: '#,##0'},
    {label: 'VIEWS · LAST 30 DAYS', value: recentViews, labelRange: 'C8:D8', valueRange: 'C9:D10', format: '#,##0'},
    {label: 'VIEWS PER SESSION', value: avgViews, labelRange: 'E8:F8', valueRange: 'E9:F10', format: '0.0'},
    {label: 'WELCOME / BROWSER', value: welcomeRate, labelRange: 'G8:H8', valueRange: 'G9:H10', format: '0.0%'}
  ];
  cards.forEach(function(card) {
    mergeIfNeeded(dashboard, card.labelRange);
    mergeIfNeeded(dashboard, card.valueRange);
    dashboard.getRange(card.labelRange).setValue(card.label)
      .setBackground('#e8e3d8').setFontColor('#47564e').setFontSize(9).setFontWeight('bold');
    dashboard.getRange(card.valueRange).setValue(card.value)
      .setBackground('#f5f3ed').setFontColor('#17332c').setFontSize(22).setFontWeight('bold')
      .setNumberFormat(card.format).setVerticalAlignment('middle');
    dashboard.getRange(card.labelRange).setHorizontalAlignment('center').setVerticalAlignment('middle');
    dashboard.getRange(card.valueRange).setHorizontalAlignment('center');
  });
  mergeIfNeeded(dashboard, 'A11:D11');
  mergeIfNeeded(dashboard, 'E11:H11');
  dashboard.getRange('A11:D11').setValue('QUOTE REQUEST / BROWSER')
    .setBackground('#e8e3d8').setFontColor('#47564e').setFontSize(9).setFontWeight('bold')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  dashboard.getRange('E11:H11').setValue(requestRate)
    .setBackground('#f5f3ed').setFontColor('#17332c').setFontSize(16).setFontWeight('bold')
    .setNumberFormat('0.0%').setHorizontalAlignment('center').setVerticalAlignment('middle');
  dashboard.setRowHeight(11, 29);
  dashboard.setRowHeights(4, 1, 24);
  dashboard.setRowHeights(5, 2, 28);
  dashboard.setRowHeights(8, 1, 24);
  dashboard.setRowHeights(9, 2, 28);

  dashboard.getRange('A13:E13').setValues([['Date', 'Page views', 'Unique browsers', 'Welcome entries', 'Quote requests']]);
  var dailyRows = [];
  for (var offset = 0; offset < 30; offset++) {
    var current = new Date(startDay.getTime() + offset * 86400000);
    var key = Utilities.formatDate(current, timezone, 'yyyy-MM-dd');
    var stats = dayStats[key] || {date: current, views: 0, visitors: {}, welcome: 0, requests: 0};
    dailyRows.push([stats.date, stats.views, Object.keys(stats.visitors).length, stats.welcome, stats.requests]);
  }
  dashboard.getRange(14, 1, dailyRows.length, 5).setValues(dailyRows);
  dashboard.getRange('A13:E13').setBackground('#17332c').setFontColor('#ffffff').setFontWeight('bold');
  dashboard.getRange('A14:A43').setNumberFormat('dd mmm');
  dashboard.getRange('B14:E43').setNumberFormat('#,##0');

  dashboard.getRange('A46:C46').setValues([['TOP SITE SECTIONS', 'VIEWS', 'UNIQUE BROWSERS']]);
  var sortedPages = Object.keys(pages).map(function(page) {
    return [page, pages[page], Object.keys(pageVisitors[page] || {}).length];
  }).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 10);
  var pageRows = [];
  for (var pi = 0; pi < 10; pi++) pageRows.push(sortedPages[pi] || ['', '', '']);
  dashboard.getRange(47, 1, pageRows.length, 3).setValues(pageRows);
  dashboard.getRange('A46:C46').setBackground('#17332c').setFontColor('#ffffff').setFontWeight('bold');
  dashboard.getRange('E46:F46').setValues([['LANGUAGE', 'PAGE VIEWS']]);
  dashboard.getRange('E47:F49').setValues([
    ['English', languages.en || 0], ['Arabic', languages.ar || 0],
    ['Other / unset', Object.keys(languages).reduce(function(total, key) { return key === 'en' || key === 'ar' ? total : total + languages[key]; }, 0)]
  ]);
  dashboard.getRange('E46:F46').setBackground('#17332c').setFontColor('#ffffff').setFontWeight('bold');
  dashboard.getRange('B47:C56').setNumberFormat('#,##0');
  dashboard.getRange('F47:F49').setNumberFormat('#,##0');
  dashboard.getRange('A:A').setColumnWidth(155);
  dashboard.getRange('B:E').setColumnWidths(2, 4, 125);
  dashboard.getRange('F:F').setColumnWidth(125);
  dashboard.getRange('G:H').setColumnWidths(7, 2, 110);
  dashboard.setFrozenRows(2);

  if (dashboard.getCharts().length !== 3) {
    dashboard.getCharts().forEach(function(chart) { dashboard.removeChart(chart); });
    dashboard.insertChart(dashboard.newChart()
      .setChartType(Charts.ChartType.LINE)
      .addRange(dashboard.getRange('A13:C43'))
      .setPosition(13, 7, 0, 0)
      .setOption('title', 'Daily views and browsers · 30 days')
      .setOption('legend', {position: 'bottom'})
      .setOption('colors', ['#17332c', '#c8a96a'])
      .setOption('width', 660).setOption('height', 290)
      .build());
    dashboard.insertChart(dashboard.newChart()
      .setChartType(Charts.ChartType.BAR)
      .addRange(dashboard.getRange('A46:B56'))
      .setPosition(31, 7, 0, 0)
      .setOption('title', 'Most viewed site sections')
      .setOption('legend', {position: 'none'})
      .setOption('colors', ['#17332c'])
      .setOption('width', 660).setOption('height', 290)
      .build());
    dashboard.insertChart(dashboard.newChart()
      .setChartType(Charts.ChartType.PIE)
      .addRange(dashboard.getRange('E46:F49'))
      .setPosition(49, 7, 0, 0)
      .setOption('title', 'Visitor language')
      .setOption('pieHole', 0.55)
      .setOption('colors', ['#17332c', '#c8a96a', '#aeb7ae'])
      .setOption('width', 660).setOption('height', 290)
      .build());
  }
}

function mergeIfNeeded(sheet, a1) {
  var range = sheet.getRange(a1);
  var merged = range.getMergedRanges();
  var isMerged = merged.some(function(item) { return item.getA1Notation() === a1; });
  if (!isMerged) range.merge();
}
