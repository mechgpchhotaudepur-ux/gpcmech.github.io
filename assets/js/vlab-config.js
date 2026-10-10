/*
  Virtual Lab Console settings. Edit these values on GitHub (pencil icon) and commit.
*/
window.VLAB_CONFIG = {
  institute: "Government Polytechnic Chhotaudepur",
  department: "Mechanical Engineering Department",
  contactEmail: "mechgpchhotaudepur@gmail.com",

  /* Google Apps Script web-app URL that writes student records and faculty session logs
     to a Google Sheet. Leave "" to keep records only on the student's own device.
     Setup steps: README.md, section "Virtual lab records in a Google Sheet". */
  sheetEndpoint: "",

  /* Valid enrolment numbers: 12 digits, GTU diploma, institute 622, Mechanical (19).
     Regular: YY6220319NNN   C2D (lateral entry): YY6228319NNN */
  enrolmentPattern: "^\\d{2}622[08]319\\d{3}$"
};
