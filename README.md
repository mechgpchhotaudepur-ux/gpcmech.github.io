# Department data pages: how to put them on the website

What is in this folder
- `staff.html`, `student-performance.html`, `faculty-training.html`, `projects.html`, `labs.html`, `vision-mission.html`, `nptel.html`, `student-achievements.html`, `index.html` (link cards)
- `assets/img/` (NPTEL star certificate and the student achievement poster, resized for the web)
- `assets/dept-data.css` (colours are variables at the top), `assets/dept-data.js` (small helpers)
- `data/*.json`: the data (edit these to change what the pages show)

Easiest way to upload (GitHub website, no tools needed)
1. Open your repository on github.com, go to the folder where your site's pages are (the root, or `docs/`).
2. Click **Add file > Upload files**. Drag in the whole contents of this folder (the HTML files, `assets`, `data`). GitHub keeps the folders.
3. Write a commit message such as "Add department data pages" and click **Commit changes**.
4. Wait 1 to 2 minutes (GitHub Pages rebuilds). Open `https://<your-site>/staff.html` to check.
5. Add links to the new pages in your menu (copy the `<nav>` line from any page, or the cards in `index.html`). If your site already has an `index.html`, do NOT overwrite it: skip this file and copy the cards.

Test on your computer first (optional)
- Open a terminal in this folder and run `python3 -m http.server 8000`, then open http://localhost:8000/staff.html. (Opening the file by double-click will not load the data: browsers block it.)

To change the data later
- Edit the JSON file in GitHub (pencil icon) and commit, or ask Claude to regenerate it. Keep student names (except the achievement poster, shown with consent), enrolment numbers and phone numbers out of public files.

To match your site's design
- Open `PROMPT_for_Claude.txt`, paste it into the Claude session that built your site, and add the folder. It will restyle the pages with your header, footer and menu.

Check before publishing
- `student-performance.html` shows real results (on-time graduation is about 30 percent). Decide whether you want to publish it, or delete that page and its link.
