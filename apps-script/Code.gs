/**
 * Virtual Lab Console - Google Sheet receiver
 *
 * Writes each student record sheet and each faculty session log sent by the console
 * into this spreadsheet, on two tabs: "Student records" and "Session log".
 *
 * Setup (once):
 * 1. Create a Google Sheet, e.g. "Virtual Lab register 2026-27" (department account).
 * 2. Extensions > Apps Script. Delete the sample code and paste this file. Save.
 * 3. Deploy > New deployment > type "Web app".
 *      Execute as: Me      Who has access: Anyone
 * 4. Copy the web-app URL (ends in /exec) into assets/js/vlab-config.js -> sheetEndpoint, and commit.
 * After editing this script, use Deploy > Manage deployments > Edit > New version.
 */

var TABS = {
  record: {
    name: 'Student records',
    cols: ['Received', 'Term', 'Semester', 'Enrolment no.', 'Name', 'Course', 'Lab', 'Code', 'Experiment',
           'Date / time', 'Minutes', 'Observations', 'Calculations', 'Result', 'Conclusion', 'Posttest',
           'Self-evaluation (1-5)', 'Link', 'Faculty rubric marks'],
    row: function (p) {
      return [new Date(), p.term, p.sem, "'" + p.enrolment, p.name, p.course, p.lab + ' ' + p.labName, p.code,
              p.experiment, p.date, p.minutes, p.observations, p.calculations, p.result, p.conclusion,
              p.posttest, p.selfScore, p.url, ''];
    }
  },
  session: {
    name: 'Session log',
    cols: ['Received', 'Date', 'Term', 'Class / batch', 'Course', 'Lab no. and experiment', 'Students', 'Faculty', 'Sign'],
    row: function (p) {
      return [new Date(), p.date, p.term, p.batch, p.course, p.experiment, p.students, p.faculty, ''];
    }
  }
};

function doPost(e) {
  var p = (e && e.parameter) || {};
  var t = TABS[p.kind];
  if (!t) return out('unknown kind');
  if (p.kind === 'record' && !/^\d{2}622[08]319\d{3}$/.test(p.enrolment || '')) return out('bad enrolment');

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(t.name);
    if (!sh) {
      sh = ss.insertSheet(t.name);
      sh.appendRow(t.cols);
      sh.setFrozenRows(1);
      sh.getRange(1, 1, 1, t.cols.length).setFontWeight('bold');
    }
    sh.appendRow(t.row(p).map(clip));
  } finally {
    lock.releaseLock();
  }
  return out('ok');
}

function doGet() { return out('Virtual Lab Console receiver is running.'); }

function clip(v) { v = v == null ? '' : v; return typeof v === 'string' ? v.slice(0, 5000) : v; }
function out(s) { return ContentService.createTextOutput(s); }
