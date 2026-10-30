# NourEldin Home website

Open `index.html` in a browser to run it. No build step needed.

## Files
- `index.html`  : all pages and texts (cover, home with About Us, services, collections, projects, contact, footer)
- `css/style.css` : design. Colors and fonts are the variables at the top (`:root`)
- `js/main.js`  : language switch, page navigation, side menu, contact form
- `js/products.js` : the product list (Collections page). Add, edit or remove pieces here
- `js/config.js` : settings (Google Sheet link for contact requests)
- `images/` : photo and logo files

## Common edits
- **Add a product:** copy a line in `js/products.js`, give it a new `id`, set `cat`, names (`en`/`ar`) and `img` (e.g. `images/products/sofa.jpg`). Visitors can tap the heart to save pieces; saved pieces appear on the Favorites page (heart icon in the header).
- **Text:** find the element in `index.html`. Each text has `data-en` (English) and `data-ar` (Arabic). Change both, and the visible text inside the tag.
- **Photo / logo:** replace the files in `images/` keeping the same names (or change the names in `css/style.css`).
- **Social links, phone, address:** the footer and the `#contactblock` section in `index.html`.
- **Add a page:** add a `<section data-view="mypage">`, add `'mypage'` to the `names` list in `js/main.js`, and link to `#mypage`.
- **Contact form to Google Sheets:** paste the Apps Script URL into `sheetUrl` in `js/config.js`.

Pages use `#name` links, so the site works on any simple hosting (upload the whole folder).

## Mobile
The layout adapts to phones automatically (section `MOBILE OPTIMIZATION` at the end of `css/style.css`). On phones the cover shows the whole photo (`images/living-room.jpg`) uncropped, with a blurred extension of it filling the rest of the screen. Arabic fonts load only when Arabic is chosen. The product grid shows 24 items and a Show more button, so 1000+ products stay fast.

## Add pieces with the + tile
On the Collections page the first tile is a **+**. It opens a form (photos, English/Arabic name, category, description). Pieces are saved **in the browser used to add them** (not shared with visitors). Use *Download my added pieces* as a backup, and for permanent pieces add them to `js/products.js` (fields: `imgs`, `desc_en`, `desc_ar`). To hide the + tile, set `showAddButton: false` in `js/config.js`. Tapping any piece opens its details with all photos and the description.
