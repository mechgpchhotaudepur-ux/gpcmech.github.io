# Mechanical Engineering Department website, GP Chhotaudepur

The department website, built from the Google Stitch design, using the content from
https://sites.google.com/view/gpchhotaudepurmech/

| Page | File |
|---|---|
| Home | `index.html` |
| Vision, Mission, PEOs & PSOs | `vision-mission.html` |
| Download | `download.html` |
| Notice Board | `notice-board.html` |
| Activity | `activity.html` |
| Rules & Regulation | `rules-regulation.html` |
| Faculty & Staff | `staff.html` |
| Faculty Training | `faculty-training.html` |
| Laboratories | `labs.html` |
| Student Projects | `projects.html` |
| Student Performance | `student-performance.html` |
| NPTEL | `nptel.html` |
| Student Achievements | `student-achievements.html` |
| Virtual Labs | `virtual-lab.html` |
| Training & Placement | `placement.html` |
| Faculty Corner (faculty login) | `faculty.html` |

**Previewing on your computer:** most pages open with a double-click. The data pages
(Vision & PEOs, Staff, Training, Laboratories, Projects, Performance, NPTEL, Achievements) load their numbers from the `data`
folder, which browsers block on double-click. They work once the site is online. To preview
them locally, open a terminal in this folder, run `python3 -m http.server 8000`, then go to
http://localhost:8000.

## Virtual Labs page (Virtual Lab Console)

`virtual-lab.html` is the full Virtual Lab Console inside the department website. Students sign in with their
GTU enrolment number, see the labs for their semester, open experiments on vlabs.ac.in, and fill a record sheet
they can save, print or copy. Faculty use the **Faculty** tab for the session log (SAR 2.2.3 B).

| File | What it is | Edit it when |
|---|---|---|
| `data/virtual-labs.js` | 16 labs (156 experiments) plus the 3 SAR experiments, course-to-lab mapping, notes, free tools | A lab, experiment or course mapping changes |
| `assets/js/vlab-config.js` | Contact email, Google Sheet link (`sheetEndpoint`), enrolment-number rule | Once, at setup |
| `assets/js/vlab-console.js`, `assets/css/vlab.css` | The console itself | Never |
| `apps-script/Code.gs` | Google Apps Script that writes records into a Google Sheet | Only for setup |
| `scripts/check-links.mjs`, `.github/workflows/link-check.yml` | Checks every lab link each Monday and writes `LINK-REPORT.md` | Never |

**Editing labs:** open `data/virtual-labs.js` on GitHub, click the pencil, edit, commit. To add an experiment,
add `["Title", "exp/slug/"],` at the **end** of that lab's `exps` list (codes such as `L9·E04` follow the order).

**Virtual lab records in a Google Sheet (optional, recommended).** Without this, records stay in each student's
browser and students print or copy them for you.
1. Create a Google Sheet with the department account.
2. **Extensions → Apps Script**, paste `apps-script/Code.gs`, save.
3. **Deploy → New deployment → Web app**, Execute as *Me*, Who has access *Anyone*. Authorise.
4. Copy the URL ending in `/exec` into `assets/js/vlab-config.js` as `sheetEndpoint: "https://script.google.com/macros/s/.../exec"`. Commit.

Each saved record sheet then appears on the **Student records** tab, and each faculty entry on the **Session log** tab.

**Weekly link check.** In the repository: **Settings → Actions → General → Workflow permissions → Read and write**,
save. Then run it once from **Actions → Weekly link check → Run workflow**. It writes `LINK-REPORT.md` every Monday.
The `.github` folder starts with a dot: on a Mac press Cmd+Shift+. in Finder to see it before dragging it into GitHub.

## Visitor counter (GoatCounter, free, no cookies)

1. Go to https://www.goatcounter.com and sign up with **mechgpchhotaudepur@gmail.com**. Choose a code,
   e.g. `gpcmech`. Your statistics dashboard will be at `https://gpcmech.goatcounter.com`.
2. In GoatCounter: **Settings** → tick **"Allow adding visitor counts on your website"** → Save.
3. In GitHub, open `assets/js/content.js` and put the code between the quotes:
   `window.VISIT_COUNTER_CODE = "gpcmech";`. Commit.

Every page then records its visits, and the footer shows **Visitors: N**. The total can lag by up to a
few hours, because GoatCounter caches it. The dashboard shows full details (pages, dates, devices,
countries). Until a code is set, nothing is counted and no counter is shown.

## Faculty Corner (faculty login through Google)

`faculty.html` (Department menu → *Faculty Corner (login)*, and the footer) collects the department's
internal records: NBA/SAR evidence for criteria 1 to 9, minutes and circulars, student records and results,
and timetables and lab records. The page only lists links. The files stay in Google Drive, and **Google
does the login**: a folder opens only for the Gmail IDs it is shared with. The page is hidden from Google search.

**One-time setup (department account):**
1. Sign in to Google Drive as **mechgpchhotaudepur@gmail.com**. Create a folder `Mechanical Faculty Corner`
   with sub-folders: `NBA SAR Evidence` (inside it `C1` … `C9`), `Meetings & Circulars`,
   `Student Records & Results`, `Timetables & Lab Records`.
2. Right-click `Mechanical Faculty Corner` → **Share** → add each faculty member's Gmail ID
   (Viewer, or Editor for those who upload). Sub-folders inherit this, so you share only once.
3. In the same window, check that **General access** says **Restricted**. Never "Anyone with the link":
   the links on this page are public, so the sharing setting is the only lock.
4. Open each folder, copy its address from the browser, and paste it as `link` in the matching line of
   `window.FACULTY_LINKS` in `assets/js/content.js`. Commit.

Cards without a link show "Not linked yet". To add a card, copy a line in `FACULTY_LINKS` and change it.
When a faculty member leaves, remove their Gmail ID from the folder's sharing. Their access ends at once,
and nothing changes on the website. If someone opens a folder they are not on the list for, Google shows
*Request access*, and the department account gets an email to approve or ignore it.

## Microsoft Clarity: heatmaps and session recordings (free)

Clarity shows where visitors click, how far they scroll, and anonymous replays of real visits. Use it to
see whether students find the downloads, notices and Virtual Labs. It is free with no traffic limit, and
recordings are kept for about 30 days.

1. Go to https://clarity.microsoft.com and sign in with **mechgpchhotaudepur@gmail.com**
   (use "Sign in with Google").
2. **Add new project**: name `Mechanical Department`, website URL = your GitHub Pages address.
3. In the project, open **Settings → Overview** and copy the **Project ID** (about 10 letters and numbers).
4. In GitHub, open `assets/js/content.js` and paste it: `window.CLARITY_PROJECT_ID = "q1w2e3r4t5";`. Commit.

Data appears in the Clarity dashboard within about 2 hours. A one-line note in the footer then tells
visitors the site uses Clarity and GoatCounter. The whole Virtual Lab console is masked, so names and
enrolment numbers typed there are never recorded. To switch Clarity off, set the ID back to `""`.

## Google Search Console: how people find you on Google (free)

This shows the Google searches that bring visitors to the site and whether every page is indexed.
No code change is needed.

1. Go to https://search.google.com/search-console and sign in with **mechgpchhotaudepur@gmail.com**.
2. **Add property → URL prefix** and enter the full website address (e.g. `https://<user>.github.io/<repo>/`).
3. Choose the **HTML file** verification method and download the file (named like `google1a2b3c4d.html`).
4. Upload that file to the repository's main folder on GitHub (next to `index.html`), commit, wait a minute,
   then click **Verify**. Do not delete the file later.
5. In **URL inspection**, enter the home page address and click **Request indexing**.

Search data starts appearing after a few days.

## Notices from a Google Sheet

1. Sign in to Google Drive as **mechgpchhotaudepur@gmail.com** and upload `Mechanical_Notices.xlsx`.
   Open it, then choose **File → Save as Google Sheets**. Use the new Google Sheet from now on.
2. In the Google Sheet: **File → Share → Publish to web**. Under *Link*, choose the **Notices** tab
   (not "Entire document") and **Comma-separated values (.csv)**, then click **Publish** and copy the link.
3. In GitHub, open `assets/js/content.js`, click the pencil icon, and paste the link between the quotes in
   `window.NOTICES_SHEET_CSV = "";`. Commit.

From then on, add a row to the sheet (Date, Category, Title, Details, Link, Show) and it appears on the
Notice Board and the Home page within about 5 minutes. Set **Show** to "No" to hide a notice without deleting it.
If the sheet ever can't be reached, the website shows the `NOTICES` list in `content.js` instead.

## Updating notices, activities and downloads

You only need to edit one file: **`assets/js/content.js`**. It holds three lists:

- `NOTICES`: add a new notice at the top. Fill in a date (`"2026-11-02"`), a category
  (Exam / Academic / Workshop / Admission / General), a title, a short text, and a link to the PDF or Drive file.
- `ACTIVITIES`: add the YouTube video ID. For `https://www.youtube.com/watch?v=jBYtiCcspv0`,
  the ID is `jBYtiCcspv0`. Then add a title, category and year. Thumbnails appear automatically.
- `DOWNLOADS`: add a title and a Google Drive link.

Copy an existing entry, paste it at the top of the list, and change the text. Keep the
quotes and commas. The Home page picks up the newest items automatically.

## Message from the Head of Department (Home page)

Open `assets/js/content.js` and fill in `window.HOD`: the HOD's `name` and `message`. To start a new
paragraph, type `\n\n` inside the message. For a photo, upload it as `assets/img/hod.jpg` and set
`photo: "assets/img/hod.jpg"`. Without a photo, the HOD's initials are shown. While `message` is `""`,
the section stays hidden.

## Updating staff, labs, training, projects and results

Edit the files in the **`data`** folder (on GitHub: open the file and click the pencil icon):

| File | Shown on |
|---|---|
| `data/staff.json` | Faculty & Staff (and the faculty count on Home) |
| `data/labs.json` | Laboratories |
| `data/training.json` | Faculty Training |
| `data/projects.json` | Student Projects |
| `data/performance.json` | Student Performance (charts and tables) |
| `data/vision_mission.json` | Vision, Mission, PEOs & PSOs page (`psos` list) and the Home page |
| `data/nptel.json` | NPTEL: courses, and the Discipline Stars (`stars` list; upload each certificate image to `assets/img/` and put its path in `image`) |
| `data/achievements.json` | Student Achievements (poster in `assets/img/`) |
| `data/placement.json` | Training & Placement: `coordinator` (name, email, phone), `recruiters` (e.g. `["ABC Ltd", "XYZ Pvt Ltd"]`), `industry_connect`, `alumni_form` (Google Form link) |
| `data/coordinators.json` | Faculty & Staff → Department Coordinators, e.g. `{ "role": "NBA / SAR Coordinator", "name": "Shri A. B. Patel" }` |

The placement numbers on the Training & Placement page come from the `placement` list in
`data/performance.json`, so you only enter them once. Empty lists in `placement.json` and
`coordinators.json` stay hidden on the website.

Copy an existing entry, paste it, and change the values. Keep the quotes, commas and brackets
exactly as they are. Never put student names, enrolment numbers or phone numbers in these files
(the only exception is an achievement shown with the student's consent).

The Vision, Mission, PEO and PSO text must match the official statements in your SAR word for word.

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

## Gujarati / English button

The **ગુજરાતી** button at the top (on phones, **ગુ** next to the menu) translates the whole website into
Gujarati using Google Translate, and **English** switches it back. The choice carries over to every page.
Nothing to set up and nothing to maintain: new notices, data and pages are translated automatically.
It is machine translation, so technical terms and names may read oddly in places. Icons, and anything
marked `translate="no"`, are left untranslated.

## Text size buttons

The A− / 100% / A+ buttons at the top right (tablets and computers) make the text smaller or larger.
Each visitor's choice is remembered on their device. Nothing to set up.

## Logos and photos

- Department logo: `assets/img/dept-logo.png` (header, footer), `dept-logo-512.png` (phone home-screen
  and share preview) and `favicon.png` (browser tab).

To change a logo, replace the file and keep the same name. A PNG with a transparent background looks best.


The Home page group photo is `assets/img/department-group-1600.jpg` (plus an 800px version
for phones). To change it, replace both files and keep the same names.
