# NourEldin Home website

Open `index.html` in a browser to run it. No build step needed. (Some features, like saving added pieces, work best when the site is served over http/https rather than opened as a file.)

## Files
```
index.html     all pages and texts
style.css      all styles (colors/fonts in :root, phone layout in MOBILE OPTIMIZATION / TOUCH TARGETS)
config.js      site settings: sheetUrl, showAddButton
products.js    CATEGORIES and PRODUCTS lists for the Collections page
app.js         behaviour: language switch, pages, menu, search / filter / sort, forms
images/ photo, logo, product, project, and video files
```
Keep the script order in `index.html` (config, products, app): `app.js` reads the other two. See IMAGE_UPLOAD_PARTS.md for the ZIP extraction and upload instructions.

## Common edits
- **Add a product:** copy a line in the `window.PRODUCTS` list in `products.js`, give it a new unique `id`, and set `cat` (room), `style` (`classic` / `modern`), `kind` (`set` / `corner` / `custom`), names (`en`/`ar`), `desc_en` / `desc_ar` (new lines are kept), `img` (use the matching `images/products/...` path) and `w` (main sofa width in cm, used by *Sort by width*). Styles and types are listed at the top of `products.js`; room chips and filters appear automatically for the values that are in use.
- **Text:** find the element in `index.html`. Each text has `data-en` (English) and `data-ar` (Arabic). Change both, and the visible text inside the tag.
- **Photo / logo:** replace files in `images/`, keeping the same paths (or change the names in `style.css`).
- **Social links, phone, address:** the footer and the `#contactblock` section in `index.html`.
- **Add a page:** add a `<section data-view="mypage">`, add `'mypage'` to the `names` list in `app.js`, and link to `#mypage`.
- **Contact form to Google Sheets:** paste the Apps Script URL into `sheetUrl` in `config.js`.

Pages use `#name` links, so the site works on any simple hosting (upload the whole folder).

## Mobile
The layout adapts to phones automatically (sections `MOBILE OPTIMIZATION` and `TOUCH TARGETS` in `style.css`). On phones the cover shows the whole photo uncropped, with a blurred extension of it filling the rest of the screen. Arabic fonts load only when Arabic is chosen. The product grid shows 24 items and a Show more button, so 1000+ products stay fast.

## Add pieces with the + tile
On the Collections page the first tile is a **+**. It opens a form (photos, English/Arabic name, category, description). Pieces are saved **in the browser used to add them** (not shared with visitors). Use *Download my added pieces* as a backup, and for permanent pieces add them to the `window.PRODUCTS` list in `products.js` (fields: `imgs`, `desc_en`, `desc_ar`). To hide the + tile, set `showAddButton: false` in `config.js`. Tapping any piece opens its details with all photos and the description.

## Ready to Deliver: search, filter, sort
The search box matches every word you type against the name and description (English and Arabic, ignoring accents and Arabic letter variants). Below it: Style chips, Type menu and Sort by menu. Product photos are in the `products` subfolder of images (`c01-c35` classic catalogue, `s01-s38` Soft Living 2027).

## Projects page
`projects.js` holds the project list (name and location in English/Arabic, number of photos and videos). Each project's media is in its `projects/pN/` folder inside one images (`01.webp`..., thumbnails `t01.webp`..., cover `c.webp`, videos `v1.mp4` with poster `v1.jpg`). Tapping a card opens a gallery with swipe / arrows, thumbnails and videos.
