# Connect site analytics and forms to Google Sheets

The site uses the Google Apps Script Web App URL in `config.js`. The included `google-apps-script.gs` saves quote requests and welcome form submissions, logs anonymous page views, and creates a `Dashboard` tab in the same spreadsheet.

## Deploy the updated Apps Script first

1. Open the spreadsheet and choose **Extensions → Apps Script**.
2. Replace the Apps Script code with the contents of `google-apps-script.gs` and save.
3. Choose **Deploy → Manage deployments**, edit the existing Web App deployment, select **New version**, and deploy it.
4. Keep the existing Web App URL in `config.js`.

Then upload the updated website files, including `app.js` and `index.html`. The website will start logging a page view when a visitor opens the site or changes sections.

## Tabs created in the spreadsheet

- **Dashboard**: KPI cards for unique browsers, sessions, page views, welcome submissions, quote requests, the last 30 days of views, views per session, welcome conversion, and quote conversion. It also includes a 30-day activity table, top-section table, language table, and three charts.
- **Site Analytics**: timestamp, event, anonymous browser ID, session ID, site section, and language. It does not store visitor names or phone numbers. The tab is formatted with a frozen header and filter.
- **Welcome Page**: welcome form submissions (date, name, phone, language, and page).
- **First existing tab**: quote requests, preserving the current request destination.

The dashboard and analytics tab appear after the first page view received by the updated Apps Script. Existing welcome and quote entries remain in their current tabs; the Apps Script also formats those tabs for easier filtering and review. Unique browsers and sessions are browser-based estimates, not verified people.
