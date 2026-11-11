# NourEldin Home Website

This is a static website. Open `index.html` in a browser to view it. No build step or package installation is required. Images and videos load when needed to improve initial loading; the supplied media resolution is preserved. For deployment, upload the contents of this folder to the hosting provider's website root, keeping the folders and file paths intact.

## Main files

- `index.html` contains the page structure and text.
- `style.css` contains the visual styles and responsive layouts.
- `config.js` contains settings for the contact integrations, welcome form, and product add tile.
- `products.js` contains product categories, filter options, and product data.
- `app.js` handles navigation, language switching, product search and filters, the contact form, and browser-saved additions.
- `projects.js` contains the project and wood-carpentry galleries.
- `images/` contains the site's photos, logos, product images, project images, and video.
- `google-apps-script.gs` and `GOOGLE_APPS_SCRIPT_SETUP.md` are for the optional Google Sheets form integration.

Keep the script order at the bottom of `index.html`: `config.js`, `products.js`, `app.js`, then `projects.js`.

## Site settings

Edit `config.js`:

- `sheetUrl` is the Google Apps Script Web App URL used by contact forms and site analytics. Leave it empty to disable sending data to Google Sheets.
- `whatsappNumber` is the WhatsApp number in international digits-only format.
- `showWelcomeGate` controls the welcome form that asks visitors for a name and phone number. It is currently `false`. Set it to `true` to enable it later.
- `showAddButton` controls the plus tile on the Collections page. It is currently `false`.
- `previewIds` can limit which products appear. An empty array shows all products.

## Common edits

- **Change page text:** edit the relevant element in `index.html`. For language switching, update both `data-en` and `data-ar` and the default text inside the element.
- **Add or edit a product:** update `window.PRODUCTS` in `products.js`. Use a unique `id`, a valid category/style/type, English and Arabic names, descriptions, and image paths under `images/products/`. The `w` field is the width used by the width sort option.
- **Replace a photo or logo:** keep the existing file path, or update the corresponding reference in the site files.
- **Change phone, address, or social links:** edit the contact section in `index.html` and the WhatsApp number in `config.js` as needed.
- **Connect contact requests to Google Sheets:** follow `GOOGLE_APPS_SCRIPT_SETUP.md`, then set `sheetUrl` in `config.js` to the deployed Apps Script Web App URL.
- **Add a page:** add a section with a `data-view` value, add that page name to the page-name list in `app.js`, and add navigation links using the matching hash.
- **Add or update project photos:** update the project entry in `projects.js` and put the media in the folder named by that entry's `assetFolder`. Keep the file numbering and extensions consistent with the entry.

## Product additions

The plus tile is disabled by default. If enabled, additions are stored in the browser where they were entered, not shared with visitors or other devices. Use the built-in download option to back them up. For permanent products visible to everyone, add them to `products.js` and upload their images under `images/products/`.

## GitHub upload parts

If uploading through GitHub's website, use the four batches in `NourEldin_GitHub_Parts/Updated_2026-11-12_Optimized` one at a time in the same repository. Preserve the paths inside each batch and upload its contents to the repository root; do not create `Part_01` through `Part_04` directories in the deployed site. See `UPLOAD_INSTRUCTIONS.txt` in that batch folder for steps.


