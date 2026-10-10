# Mechanical Engineering Department website, GP Chhotaudepur

A six-page website built from the Google Stitch design, using the content from
https://sites.google.com/view/gpchhotaudepurmech/

| Page | File |
|---|---|
| Home | `index.html` |
| About Institute | `about-institute.html` |
| Download | `download.html` |
| Notice Board | `notice-board.html` |
| Activity | `activity.html` |
| Rules & Regulation | `rules-regulation.html` |
| Faculty & Staff | `staff.html` |
| Faculty Training | `faculty-training.html` |
| Laboratories | `labs.html` |
| Student Projects | `projects.html` |
| Student Performance | `student-performance.html` |

**Previewing on your computer:** most pages open with a double-click. The five data pages
(Staff, Training, Laboratories, Projects, Performance) load their numbers from the `data`
folder, which browsers block on double-click. They work once the site is online. To preview
them locally, open a terminal in this folder, run `python3 -m http.server 8000`, then go to
http://localhost:8000.

## Updating notices, activities and downloads

You only need to edit one file: **`assets/js/content.js`**. It holds three lists:

- `NOTICES`: add a new notice at the top. Fill in a date (`"2026-11-02"`), a category
  (Exam / Academic / Workshop / Admission / General), a title, a short text, and a link to the PDF or Drive file.
- `ACTIVITIES`: add the YouTube video ID. For `https://www.youtube.com/watch?v=jBYtiCcspv0`,
  the ID is `jBYtiCcspv0`. Then add a title, category and year. Thumbnails appear automatically.
- `DOWNLOADS`: add a title and a Google Drive link.

Copy an existing entry, paste it at the top of the list, and change the text. Keep the
quotes and commas. The Home page picks up the newest items automatically.

## Updating staff, labs, training, projects and results

Edit the files in the **`data`** folder (on GitHub: open the file and click the pencil icon):

| File | Shown on |
|---|---|
| `data/staff.json` | Faculty & Staff (and the faculty count on Home) |
| `data/labs.json` | Laboratories |
| `data/training.json` | Faculty Training |
| `data/projects.json` | Student Projects |
| `data/performance.json` | Student Performance (charts and tables) |

Copy an existing entry, paste it, and change the values. Keep the quotes, commas and brackets
exactly as they are. Never put student names, enrolment numbers or phone numbers in these files.

## Putting it online (free, with GitHub Pages)

1. Create a free account at github.com, then create a new **public** repository,
   for example `gpc-mechanical`.
2. Choose **Add file → Upload files**, drag in everything from this folder
   (the `.html` files and the `assets` folder), and commit.
3. Go to **Settings → Pages**. Under *Source*, choose **Deploy from a branch**, select `main`
   and `/ (root)`, then click Save.
4. After about a minute the site is live at `https://<your-username>.github.io/gpc-mechanical/`.

Later edits, such as changing `content.js`, can be made from GitHub's web editor
(use the pencil icon). The site updates within a minute.

**Keeping the old address working.** Leave the Google Site published, but replace its
Home page content with a short "This site has moved" note and a button linking to the
new address. That way old links shared with students still lead somewhere.

## Logos and photos

- Department logo: `assets/img/dept-logo.png` (header, footer), `dept-logo-512.png` (phone home-screen
  and share preview) and `favicon.png` (browser tab).
- Institute logo: `assets/img/logo.png` (footer, About Institute page).

To change a logo, replace the file and keep the same name. A PNG with a transparent background looks best.


The Home page group photo is `assets/img/department-group-1600.jpg` (plus an 800px version
for phones). To change it, replace both files and keep the same names.
