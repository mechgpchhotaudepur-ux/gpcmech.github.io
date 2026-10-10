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

To preview the site, unzip it and double-click `index.html`.

## Updating notices, activities and downloads

You only need to edit one file: **`assets/js/content.js`**. It holds three lists:

- `NOTICES`: add a new notice at the top. Fill in a date (`"2026-11-02"`), a category
  (Exam / Academic / Workshop / Admission / General), a title, a short text, and a link to the PDF or Drive file.
- `ACTIVITIES`: add the YouTube video ID. For `https://www.youtube.com/watch?v=jBYtiCcspv0`,
  the ID is `jBYtiCcspv0`. Then add a title, category and year. Thumbnails appear automatically.
- `DOWNLOADS`: add a title and a Google Drive link.

Copy an existing entry, paste it at the top of the list, and change the text. Keep the
quotes and commas. The Home page picks up the newest items automatically.

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

## Before going live

- **Logo:** the header uses a placeholder gear-and-M mark. To use the official logo, put the
  image file in `assets/` and ask Claude to swap it in.
- **Photos:** the Home showcase uses the Project Fair 2024 video. A group photo of faculty
  and students can replace it.
