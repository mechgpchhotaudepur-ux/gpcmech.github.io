/* =====================================================================
   EDIT THIS FILE TO UPDATE THE WEBSITE
   ---------------------------------------------------------------------
   - NOTICES    -> Notice Board page + "Latest notices" on Home
   - ACTIVITIES -> Activity page + "Recent activities" on Home
   - DOWNLOADS  -> Download page + quick links on Home
   Newest items go at the TOP of each list. Keep the commas and quotes.
   ===================================================================== */

/* NOTICES FROM A GOOGLE SHEET
   Paste the sheet's "Publish to web" CSV link between the quotes below, e.g.
   "https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?gid=0&single=true&output=csv"
   Once it is set, notices come from the sheet and the NOTICES list below is only
   used as a backup if the sheet can't be reached. Leave it "" to use the list. */
window.NOTICES_SHEET_CSV = "";

/* Notice fields:
     date:     "2026-10-10" (YYYY-MM-DD) or "" if no date
     category: "Exam" | "Academic" | "Workshop" | "Admission" | "General"
     title, text: what students should know
     link:     URL of the PDF / Drive file, or "" if none            */
window.NOTICES = [
  {
    date: "",
    category: "Academic",
    title: "Class Coordinator List",
    text: "Class coordinators for each semester of the Mechanical Engineering diploma.",
    link: "https://drive.google.com/drive/folders/14TWtEp8hNYTEMF1RaG4pyEvvmJv26wYz?usp=sharing",
  },
];

/* Activity fields:
     youtube:  the video ID (the part after watch?v= in the YouTube link)
     category: "Project & Exhibition" | "Industrial Visit" | "Sports & Culture" | "Awareness"
     year:     "2025" or "" if not known
     title, text ("" is fine), link (optional extra link)          */
window.ACTIVITIES = [
  { youtube: "jBYtiCcspv0", category: "Sports & Culture", year: "2025",
    title: "Sports Week 2025", text: "", link: "" },
  { youtube: "IycKb1dhUdA", category: "Industrial Visit", year: "",
    title: "Industrial visit at SEKO Shivam Engitech Private Limited", text: "", link: "" },
  { youtube: "xe8e20yyZuc", category: "Awareness", year: "",
    title: "Vikas Saptah", text: "", link: "" },
  { youtube: "QVEnMTi5g2k", category: "Industrial Visit", year: "",
    title: "Visit to Siemens Centre of Excellence", text: "", link: "" },
  { youtube: "bjZFTeRDTug", category: "Project & Exhibition", year: "2024",
    title: "Project Fair 2024, Government Polytechnic Chhotaudepur", text: "", link: "" },
  { youtube: "ggZJIOchn10", category: "Project & Exhibition", year: "2024",
    title: "Model Presentation 2024", text: "", link: "" },
  { youtube: "emQEKTMBigI", category: "Project & Exhibition", year: "2024",
    title: "Project Fair 2024, Mechanical Department", text: "", link: "" },
  { youtube: "DLtYzkD5usc", category: "Industrial Visit", year: "",
    title: "Industrial visit at Shree Parantap Institute of CNC Programming (Mechanical Branch)", text: "", link: "" },
  { youtube: "dhS1A6qHRGw", category: "Industrial Visit", year: "",
    title: "Industrial visit at Shree Parantap Institute of CNC Programming", text: "",
    link: "http://parantapcnc.com/" },
  { youtube: "WoB2mxtSpw8", category: "Project & Exhibition", year: "",
    title: "Poster Presentation Event",
    text: "An academic gathering showcasing student research work and promoting knowledge exchange within mechanical engineering.", link: "" },
  { youtube: "sw0vlnMkjfI", category: "Sports & Culture", year: "2024",
    title: "Sports Week 2024", text: "", link: "" },
  { youtube: "NmMBPZTtD5U", category: "Awareness", year: "",
    title: "World Environment Day celebration",
    text: "A celebration highlighting environmental conservation and sustainability, and the role of mechanical engineering in addressing environmental challenges.", link: "" },
  { youtube: "CA3vbZK_nTY", category: "Project & Exhibition", year: "2023",
    title: "Project Fair 2023",
    text: "A showcase of the innovative and impactful projects undertaken by mechanical engineering students.", link: "" },
];

/* Download fields: title, text, icon (Material Symbols name), link */
window.DOWNLOADS = [
  { title: "Syllabus (New)", text: "Current GTU curriculum for all semesters", icon: "menu_book",
    link: "https://drive.google.com/drive/folders/1Ab-tlDQsAo4xB5qgpbzMoIwun-G7IsNj?usp=share_link" },
  { title: "Lab Manuals (New Syllabus)", text: "Practical manuals as per the new syllabus", icon: "science",
    link: "https://drive.google.com/drive/folders/1RmLWJbUnPERMb-mDbpRmbgB1lHmcWy8g?usp=share_link" },
  { title: "Class Coordinator List", text: "Coordinators for each semester", icon: "groups",
    link: "https://drive.google.com/drive/folders/14TWtEp8hNYTEMF1RaG4pyEvvmJv26wYz?usp=sharing" },
  { title: "Registration Form", text: "Student registration forms", icon: "assignment",
    link: "https://drive.google.com/drive/folders/1nckHvtN_qTqWdrHODoB9XGr3c4BR8mb-?usp=sharing" },
  { title: "Syllabus (Old)", text: "Previous curriculum, for backlog students", icon: "history_edu",
    link: "https://drive.google.com/drive/folders/1-Cshtw7Cb299ECrHz_BXtWiFJ-9QkX7d?usp=share_link" },
  { title: "Lab Manuals (Old Syllabus)", text: "Practical manuals as per the old syllabus", icon: "inventory_2",
    link: "https://drive.google.com/drive/folders/1pKQ_n2MduTtWDhCy5pOlbbPE42BVnEJU?usp=share_link" },
];


   /* VISITOR COUNTER (GoatCounter, free, no cookies) */
   window.VISIT_COUNTER_CODE = "gpcmech";
