/* Virtual Lab Console (department website version).
   Logic from the stand-alone console; data in data/virtual-labs.js, settings in assets/js/vlab-config.js.
   No need to edit this file. */
(function(){
"use strict";
const CFG = window.VLAB_CONFIG || {};
const D = window.VLAB;
const framed = (()=>{try{return window.self!==window.top}catch(e){return true}})();
const $ = s=>document.querySelector(s);
const esc = s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

/* ---------- storage (best-effort) ---------- */
const store = {
  get(k,def){try{const v=localStorage.getItem("vlab."+k);return v?JSON.parse(v):def}catch(e){return def}},
  set(k,v){try{localStorage.setItem("vlab."+k,JSON.stringify(v))}catch(e){}}
};
let student = store.get("student",null);
let records = store.get("records",[]);
let sessions = store.get("sessions",[]);
let drafts = store.get("drafts",{});

/* ---------- data helpers ---------- */
const labById = Object.fromEntries(D.labs.map(l=>[l.id,l]));
const expUrl = (lab,path)=>/^https?:/.test(path)?path:lab.site+path;
const expCode = (lab,i)=>lab.id+"·E"+String(i+1).padStart(2,"0");
const totalExps = D.labs.filter(l=>l.id!=="SAR").reduce((a,l)=>a+l.exps.length,0);
const coursesForLab = id=>D.courses.filter(c=>c.labs.includes(id));

function currentTerm(d=new Date()){
  // GTU term code: YY + 1 (odd, Jul-Dec) or YY + 2 (even, Jan-Jun; YY = academic year start)
  const y=d.getFullYear(), m=d.getMonth()+1;
  return m>=7 ? String(y%100)+"1" : String((y-1)%100)+"2";
}
function suggestSem(enr,d=new Date()){
  const yy=+enr.slice(0,2), entry=2000+yy, c2d=enr.charAt(6)==="8";
  const y=d.getFullYear(), m=d.getMonth()+1;
  const acadStart = m>=7?y:y-1, odd = m>=7;
  let sem = 2*(acadStart-entry)+(odd?1:2) + (c2d?2:0);
  return Math.min(6,Math.max(1,sem));
}
const TERM = currentTerm();

/* ---------- banner stats (site page) ---------- */
const statBox=$("#vlab-stats");
if(statBox){
  const st=[[D.labs.filter(l=>l.id!=="SAR").length,"Virtual labs"],[totalExps,"Experiments"],[new Set(D.courses.map(c=>c.name)).size,"Courses mapped"],[D.checked,"Links checked"]];
  statBox.innerHTML=st.map(s=>`<div class="bg-surface-container-lowest/10 backdrop-blur-md rounded-xl p-space-md"><span class="block font-display text-stat-number-mobile md:text-stat-number text-on-primary">${esc(s[0])}</span><span class="block text-caption uppercase text-on-primary-container">${s[1]}</span></div>`).join("");
}
if(framed) document.querySelectorAll(".needs-top").forEach(b=>b.hidden=true);
/* keep the tab rail just below the fixed site header */
const setHdr=()=>{const h=document.querySelector("body>header");if(h)document.documentElement.style.setProperty("--hdr",h.offsetHeight+"px")};
setHdr(); window.addEventListener("resize",setHdr);
/* print area must sit directly in <body> */
if(!$("#printArea")){const pa=document.createElement("div");pa.id="printArea";document.body.appendChild(pa)}
const ROOT=$("#vlab")||document.body;

/* ---------- toast ---------- */
let tt;
function toast(msg){let t=ROOT.querySelector(".toast");if(!t){t=document.createElement("div");t.className="toast";t.setAttribute("role","status");ROOT.appendChild(t)}t.textContent=msg;t.hidden=false;clearTimeout(tt);tt=setTimeout(()=>t.hidden=true,2600)}
async function copyText(txt){
  try{await navigator.clipboard.writeText(txt);toast("Copied");}
  catch(e){const ta=document.createElement("textarea");ta.value=txt;document.body.appendChild(ta);ta.select();try{document.execCommand("copy");toast("Copied")}catch(_){toast("Select the text and copy it")}ta.remove()}
}

/* ---------- send to Google Sheet (optional) ---------- */
function sendToSheet(kind,obj){
  if(!CFG.sheetEndpoint) return Promise.resolve(false);
  const body=new URLSearchParams(Object.assign({kind},obj));
  return fetch(CFG.sheetEndpoint,{method:"POST",mode:"no-cors",body}).then(()=>true).catch(()=>false);
}

/* ---------- tabs ---------- */
const tabs=[...document.querySelectorAll("nav.tabs button")];
function showTab(name){
  tabs.forEach(b=>b.setAttribute("aria-selected",String(b.dataset.tab===name)));
  ["student","labs","records","faculty"].forEach(v=>$("#view-"+v).hidden = v!==name);
  store.set("tab",name);
  if(location.hash!=="#"+name) history.replaceState(null,"","#"+name);
}
const toTabs=()=>{const wrap=document.getElementById("vlab");if(!wrap)return;const hdr=parseInt(getComputedStyle(document.documentElement).getPropertyValue("--hdr"))||112;const top=wrap.getBoundingClientRect().top+window.scrollY-hdr;if(window.scrollY>top)window.scrollTo({top:top,behavior:"smooth"})};
tabs.forEach(b=>b.addEventListener("click",()=>{showTab(b.dataset.tab);toTabs()}));

/* ---------- STUDENT VIEW ---------- */
function recordFor(code){return records.filter(r=>r.enrolment===(student&&student.enrolment)&&r.code===code)}

function renderStudent(){
  const v=$("#view-student");
  if(!student){
    const semOpts=[1,2,3,4,5,6].map(s=>`<option value="${s}">Semester ${s}</option>`).join("");
    v.innerHTML=`
    <div class="signin">
      <div class="panel">
        <h2>Open your lab</h2>
        <p class="muted" style="margin:.3rem 0 16px">Enter your GTU enrolment number. Your semester is filled in from it; change it if it is wrong.</p>
        <form id="signForm" novalidate>
          <div class="field"><label for="enr">Enrolment no.</label><input id="enr" class="mono" inputmode="numeric" maxlength="12" placeholder="246220319021" autocomplete="off"><span class="hint">12 digits, as on your GTU hall ticket.</span></div>
          <div class="grid2">
            <div class="field"><label for="sname">Name <span class="muted">(for your record sheet)</span></label><input id="sname" autocomplete="name"></div>
            <div class="field"><label for="ssem">Semester</label><select id="ssem">${semOpts}</select></div>
          </div>
          <div class="err" id="signErr" aria-live="polite"></div>
          <div><button class="btn primary" type="submit">Open my lab</button></div>
        </form>
      </div>
      <div style="display:grid;gap:14px">
        <h3>How a virtual experiment works</h3>
        <ol class="how">
          <li><div><b>Prepare</b><span class="muted">Read the aim, theory and procedure on the lab page. Take the pretest.</span></div></li>
          <li><div><b>Run the simulator</b><span class="muted">Set the inputs, run it, and note every reading.</span></div></li>
          <li><div><b>Record</b><span class="muted">Write observations, calculations and the result in the record sheet here.</span></div></li>
          <li><div><b>Submit</b><span class="muted">Save it, print it for your lab file, and send it to your teacher.</span></div></li>
        </ol>
        <p class="muted" style="margin:0">Only want to look around? Open <a href="#labs" data-go="labs">All labs</a>.</p>
      </div>
    </div>`;
    const enr=$("#enr"), sem=$("#ssem");
    enr.addEventListener("input",()=>{enr.value=enr.value.replace(/\D/g,"");if(enr.value.length===12) sem.value=suggestSem(enr.value)});
    v.querySelector("[data-go]").addEventListener("click",e=>{e.preventDefault();showTab("labs")});
    $("#signForm").addEventListener("submit",e=>{
      e.preventDefault();
      const n=enr.value.trim(), re=new RegExp(CFG.enrolmentPattern||"^\\d{12}$");
      if(!re.test(n)){ $("#signErr").textContent = n.length!==12 ? "Enter all 12 digits of your enrolment number." : "This is not a Mechanical (GP Chhotaudepur) enrolment number. Check the digits."; enr.focus(); return; }
      student={enrolment:n,name:$("#sname").value.trim(),sem:+sem.value,c2d:n.charAt(6)==="8"};
      store.set("student",student); renderStudent(); renderRecords();
    });
    return;
  }
  const courses=D.courses.filter(c=>c.sem===student.sem);
  const mine=new Set(); courses.forEach(c=>c.labs.forEach(id=>labById[id].exps.forEach((_,i)=>mine.add(expCode(labById[id],i)))));
  const doneSet=new Set(records.filter(r=>r.enrolment===student.enrolment).map(r=>r.code));
  const done=[...mine].filter(c=>doneSet.has(c)).length;
  const pct=mine.size?Math.round(100*done/mine.size):0;
  v.innerHTML=`
  <div class="strip">
    <div class="kv"><span class="label">Enrolment</span><span>${esc(student.enrolment)}</span></div>
    ${student.name?`<div class="kv"><span class="label">Name</span><span style="font-family:var(--f-body)">${esc(student.name)}</span></div>`:""}
    <div class="kv"><span class="label">Semester</span><span>${student.sem}${student.c2d?" · C2D":""}</span></div>
    <div class="kv"><span class="label">Term</span><span>${TERM}</span></div>
    <div class="kv" style="min-width:150px"><span class="label">Done ${done} of ${mine.size}</span><div class="progress" aria-hidden="true"><i style="width:${pct}%"></i></div></div>
    <span class="spacer"></span>
    <label class="label" for="chgSem" style="align-self:center">Show sem</label><select id="chgSem" style="width:auto;padding:5px 8px">${[1,2,3,4,5,6].map(s=>`<option value="${s}"${s===student.sem?" selected":""}>${s}</option>`).join("")}</select>
    <button class="btn small ghost" id="signOut">Sign out</button>
  </div>
  ${courses.length?courses.map(c=>`
    <div class="course">
      <div class="course-head"><h3>${esc(c.name)}</h3>${c.support?'<span class="chip support">supporting lab</span>':""}${c.labs.map(id=>`<span class="chip lab">${id}</span>`).join("")}</div>
      ${c.note?`<div class="note">${esc(c.note)}</div>`:""}
      ${c.labs.map(id=>labBlock(labById[id],c.name,doneSet)).join("")}
    </div>`).join(""):`<div class="panel empty">No virtual lab is mapped to Semester ${student.sem} courses yet. Browse <a href="#labs">All labs</a> to practise.</div>`}
  `;
  $("#signOut").addEventListener("click",()=>{student=null;store.set("student",null);renderStudent();renderRecords()});
  $("#chgSem").addEventListener("change",ev=>{student.sem=+ev.target.value; store.set("student",student); renderStudent();});
  bindExpButtons(v,true);
}

function labBlock(lab,course,doneSet,openAll){
  const n=lab.exps.length, d=lab.exps.filter((_,i)=>doneSet&&doneSet.has(expCode(lab,i))).length;
  return `<details class="lab" data-id="${lab.id}"${openAll?" open":""}>
    <summary><span class="lid">${lab.id==="SAR"?"SAR":lab.id}</span>
      <span class="lname"><b>${esc(lab.name)}</b><small>${esc(D.hosts[lab.host]||lab.host)} · ${n} experiments${doneSet&&d?` · ${d} done`:""}</small></span>
      <span class="caret">›</span></summary>
    <ol class="exps">${lab.exps.map((e,i)=>{const code=expCode(lab,i);const dn=doneSet&&doneSet.has(code);
      return `<li><span class="code">${code}</span><span class="t">${esc(e[0])}</span><span class="acts">${dn?'<span class="chip done">done</span>':""}${doneSet?`<button class="btn small${dn?" ghost":" primary"}" data-lab="${lab.id}" data-i="${i}" data-course="${esc(course||"")}">${dn?"Redo":"Start"}</button>`:`<a class="btn small ghost" href="${esc(expUrl(lab,e[1]))}" target="_blank" rel="noopener">Open ↗</a>`}</span></li>`}).join("")}</ol>
  </details>`;
}
function bindExpButtons(root){root.querySelectorAll("button[data-lab]").forEach(b=>b.addEventListener("click",()=>openWorkspace(b.dataset.lab,+b.dataset.i,b.dataset.course)))}

/* ---------- WORKSPACE ---------- */
const SCALE=["1 · Could not run it","2 · Ran it with help","3 · Ran it, some doubts","4 · Ran it and understood","5 · Could explain it to others"];
let timerInt=null;
function openWorkspace(labId,i,course){
  const lab=labById[labId], e=lab.exps[i], code=expCode(lab,i), url=expUrl(lab,e[1]);
  const key=student.enrolment+"|"+code;
  const dr=Object.assign({checks:[],obs:"",calc:"",result:"",learn:"",post:"",self:0,startedAt:null,seconds:0},drafts[key]||{});
  const root=$("#wsRoot");
  root.innerHTML=`
  <div class="overlay" id="ov">
    <div class="ws" role="dialog" aria-modal="true" aria-labelledby="wsTitle">
      <div class="ws-head">
        <div><div class="label">${code} · ${esc(lab.name)} · ${esc(course||"")}</div><h2 id="wsTitle">${esc(e[0])}</h2></div>
        <button class="btn small ghost" id="wsClose" aria-label="Close">Close</button>
      </div>
      <div class="ws-body">
        <div class="step on"><span class="n">1</span><div class="body">
          <h3>Prepare</h3>
          <ul class="checks">${["Read the Aim and Theory on the lab page","Take the Pretest","Read the Procedure","Decide the input values you will try"].map((t,k)=>`<li><label><input type="checkbox" data-chk="${k}" ${dr.checks.includes(k)?"checked":""}> <span>${t}</span></label></li>`).join("")}</ul>
        </div></div>
        <div class="step"><span class="n">2</span><div class="body">
          <h3>Run the simulator</h3>
          <div class="row"><a class="btn primary" id="runLink" href="${esc(url)}" target="_blank" rel="noopener">Open experiment ↗</a><span class="timer" id="timer" aria-label="Time on experiment">00:00</span></div>
          <span class="muted" style="font-size:.85rem">Opens on vlabs.ac.in in a new tab. The timer runs while this sheet is open.</span>
        </div></div>
        <div class="step"><span class="n">3</span><div class="body">
          <h3>Record</h3>
          <div class="field"><label for="wObs">Observations</label><textarea id="wObs" placeholder="Reading no. | inputs | outputs&#10;1 | ... | ...">${esc(dr.obs)}</textarea><span class="hint">One line per reading. Keep units with every value.</span></div>
          <div class="field"><label for="wCalc">Calculations</label><textarea id="wCalc" placeholder="Formula used, one sample calculation">${esc(dr.calc)}</textarea></div>
          <div class="field"><label for="wRes">Result</label><textarea id="wRes" style="min-height:64px" placeholder="Final value(s) with units">${esc(dr.result)}</textarea></div>
          <div class="field"><label for="wLearn">Conclusion / what I learned</label><textarea id="wLearn" style="min-height:64px">${esc(dr.learn)}</textarea></div>
          <div class="grid2">
            <div class="field"><label for="wPost">Posttest score <span class="muted">(if taken)</span></label><input id="wPost" class="mono" placeholder="e.g. 4/5" value="${esc(dr.post)}"></div>
          </div>
          <div class="field"><label id="selfLbl">Self-evaluation</label><div class="scale" role="group" aria-labelledby="selfLbl">${SCALE.map((s,k)=>`<button type="button" data-self="${k+1}" aria-pressed="${dr.self===k+1}">${s}</button>`).join("")}</div></div>
        </div></div>
        <div class="step"><span class="n">4</span><div class="body">
          <h3>Save and submit</h3>
          <div class="err" id="wErr"></div>
          <div class="row">
            <button class="btn primary" id="wSave">Save record sheet</button>
            <button class="btn ghost needs-top" id="wPrint">Print record sheet</button>
            <button class="btn ghost" id="wCopy">Copy as text</button>
          </div>
          <span class="muted" style="font-size:.85rem">${CFG.sheetEndpoint?"Saving also sends the record to the department register.":"Saved on this device. Print it or copy it to your teacher."}</span>
        </div></div>
      </div>
    </div>
  </div>`;
  if(framed) root.querySelectorAll(".needs-top").forEach(b=>b.hidden=true);
  const ov=$("#ov");
  const saveDraft=()=>{drafts[key]=dr;store.set("drafts",drafts)};
  const fmt=s=>String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0");
  const tick=()=>{$("#timer").textContent=fmt(dr.seconds)};
  tick();
  clearInterval(timerInt); timerInt=setInterval(()=>{dr.seconds++;tick();if(dr.seconds%15===0)saveDraft()},1000);
  if(!dr.startedAt) dr.startedAt=new Date().toISOString();

  ov.querySelectorAll("[data-chk]").forEach(c=>c.addEventListener("change",()=>{const k=+c.dataset.chk;dr.checks=c.checked?[...new Set([...dr.checks,k])]:dr.checks.filter(x=>x!==k);saveDraft()}));
  [["#wObs","obs"],["#wCalc","calc"],["#wRes","result"],["#wLearn","learn"],["#wPost","post"]].forEach(([s,f])=>$(s).addEventListener("input",ev=>{dr[f]=ev.target.value;saveDraft()}));
  ov.querySelectorAll("[data-self]").forEach(b=>b.addEventListener("click",()=>{dr.self=+b.dataset.self;ov.querySelectorAll("[data-self]").forEach(x=>x.setAttribute("aria-pressed",String(x===b)));saveDraft()}));
  $("#runLink").addEventListener("click",()=>{ov.querySelectorAll(".step")[1].classList.add("on")});

  const build=()=>({id:Date.now().toString(36),enrolment:student.enrolment,name:student.name||"",sem:student.sem,term:TERM,course:course||"",lab:lab.id,labName:lab.name,code,experiment:e[0],url,
    date:new Date().toISOString(),minutes:Math.max(1,Math.round(dr.seconds/60)),observations:dr.obs.trim(),calculations:dr.calc.trim(),result:dr.result.trim(),conclusion:dr.learn.trim(),posttest:dr.post.trim(),selfScore:dr.self});
  const validate=()=>{if(!dr.obs.trim()){$("#wErr").textContent="Write your observations before saving.";$("#wObs").focus();return false}if(!dr.result.trim()){$("#wErr").textContent="Write the result before saving.";$("#wRes").focus();return false}if(!dr.self){$("#wErr").textContent="Pick a self-evaluation level.";return false}$("#wErr").textContent="";return true};
  $("#wSave").addEventListener("click",async()=>{
    if(!validate())return;
    const r=build(); records.unshift(r); store.set("records",records);
    delete drafts[key]; store.set("drafts",drafts);
    const sent=await sendToSheet("record",r);
    toast(sent?"Saved and sent to the department register":"Record sheet saved");
    closeWs(); renderStudent(); renderRecords();
  });
  $("#wPrint").addEventListener("click",()=>{if(!validate())return;printRecords([build()])});
  $("#wCopy").addEventListener("click",()=>{copyText(recordText(build()))});

  function closeWs(){clearInterval(timerInt);saveDraft&&drafts[key]&&saveDraft();root.innerHTML="";document.body.style.overflow=""}
  $("#wsClose").addEventListener("click",closeWs);
  ov.addEventListener("click",ev=>{if(ev.target===ov)closeWs()});
  document.addEventListener("keydown",function esc_(ev){if(ev.key==="Escape"){closeWs();document.removeEventListener("keydown",esc_)}});
  document.body.style.overflow="hidden";
  $("#wsClose").focus();
}

/* ---------- RECORDS ---------- */
const SELF = k=>k?SCALE[k-1]:"";
function recordText(r){
  return `VIRTUAL LAB RECORD SHEET - ${CFG.institute}, ${CFG.department}
Enrolment no. / name: ${r.enrolment}${r.name?" / "+r.name:""}
Term / semester: ${r.term} / Sem ${r.sem}
Course, lab no.: ${r.course} - ${r.lab} ${r.labName}
Experiment: ${r.code} ${r.experiment}
Link: ${r.url}
Date, time: ${new Date(r.date).toLocaleString("en-IN")} (${r.minutes} min)

Observations:
${r.observations}

Calculations:
${r.calculations||"-"}

Result:
${r.result}

Conclusion:
${r.conclusion||"-"}

Posttest: ${r.posttest||"-"}
Self-evaluation: ${SELF(r.selfScore)}
Faculty rubric marks: ________   Sign: ________`;
}
function printRecords(list){
  $("#printArea").innerHTML=list.map(r=>`<div class="pr">
    <div style="font-size:9pt">${esc(CFG.institute)} · ${esc(CFG.department)}</div>
    <h1>Virtual lab record sheet</h1>
    <table>
      <tr><th>Enrolment no. / name</th><td>${esc(r.enrolment)}${r.name?" / "+esc(r.name):""}</td></tr>
      <tr><th>Term / semester</th><td>${esc(r.term)} / Sem ${r.sem}</td></tr>
      <tr><th>Course, lab no.</th><td>${esc(r.course)} · ${esc(r.lab)} ${esc(r.labName)}</td></tr>
      <tr><th>Experiment</th><td>${esc(r.code)} ${esc(r.experiment)}<br><small>${esc(r.url)}</small></td></tr>
      <tr><th>Date, time</th><td>${new Date(r.date).toLocaleString("en-IN")} · ${r.minutes} min</td></tr>
      <tr><th>Observations</th><td style="white-space:pre-wrap">${esc(r.observations)}</td></tr>
      <tr><th>Calculations</th><td style="white-space:pre-wrap">${esc(r.calculations||"-")}</td></tr>
      <tr><th>Result</th><td style="white-space:pre-wrap">${esc(r.result)}</td></tr>
      <tr><th>Conclusion</th><td style="white-space:pre-wrap">${esc(r.conclusion||"-")}</td></tr>
      <tr><th>Posttest; self-evaluation</th><td>${esc(r.posttest||"-")}; ${esc(SELF(r.selfScore))}</td></tr>
      <tr><th>Faculty rubric marks</th><td style="height:40px"></td></tr>
    </table>
    <div class="sign"><span>Student sign</span><span>Faculty sign</span></div>
  </div>`).join("");
  window.print();
}
function myRecords(){return student?records.filter(r=>r.enrolment===student.enrolment):records}
function renderRecords(){
  const list=myRecords();
  $("#recCount").textContent=list.length;
  const el=$("#recList");
  if(!list.length){el.innerHTML=`<div class="panel empty">No record sheets yet. Open <b>My lab</b>, start an experiment and save the record sheet. It will show here.</div>`;return}
  el.innerHTML=`<div class="tablewrap"><table><thead><tr><th>Date</th><th>Code</th><th>Experiment</th><th>Course</th><th>Result</th><th>Self</th><th></th></tr></thead><tbody>${list.map(r=>`
    <tr><td class="num">${new Date(r.date).toLocaleDateString("en-IN")}</td><td class="num">${esc(r.code)}</td><td>${esc(r.experiment)}</td><td>${esc(r.course)}</td><td>${esc(r.result.slice(0,80))}</td><td class="num">${r.selfScore}/5</td>
    <td><div class="row" style="flex-wrap:nowrap;gap:6px"><button class="btn small ghost" data-copy="${r.id}">Copy</button>${framed?"":`<button class="btn small ghost" data-print="${r.id}">Print</button>`}<button class="btn small ghost" data-del="${r.id}" aria-label="Delete record">Delete</button></div></td></tr>`).join("")}</tbody></table></div>`;
  el.querySelectorAll("[data-copy]").forEach(b=>b.addEventListener("click",()=>copyText(recordText(records.find(r=>r.id===b.dataset.copy)))));
  el.querySelectorAll("[data-print]").forEach(b=>b.addEventListener("click",()=>printRecords([records.find(r=>r.id===b.dataset.print)])));
  el.querySelectorAll("[data-del]").forEach(b=>b.addEventListener("click",()=>{
    if(b.dataset.armed){records=records.filter(r=>r.id!==b.dataset.del);store.set("records",records);renderRecords();renderStudent();toast("Record deleted")}
    else{b.dataset.armed="1";b.textContent="Confirm";setTimeout(()=>{if(b.isConnected){delete b.dataset.armed;b.textContent="Delete"}},3000)}
  }));
}
$("#recCopy").addEventListener("click",()=>{
  const rows=myRecords().map(r=>[r.date.slice(0,10),r.term,r.sem,r.enrolment,r.course,r.code,r.experiment,r.minutes,r.result.replace(/\s+/g," "),r.selfScore].join("\t"));
  copyText(["Date\tTerm\tSem\tEnrolment\tCourse\tCode\tExperiment\tMinutes\tResult\tSelf"].concat(rows).join("\n"));
});
$("#recPrintAll").addEventListener("click",()=>{const l=myRecords();if(l.length)printRecords(l);else toast("No record sheets to print")});

/* ---------- CATALOGUE ---------- */
let semFilter=0;
$("#stats").innerHTML=`
  <div><span class="label">Confirmed labs</span><b>${D.labs.filter(l=>l.id!=="SAR").length}</b></div>
  <div><span class="label">Experiments</span><b>${totalExps}</b></div>
  <div><span class="label">Courses mapped</span><b>${new Set(D.courses.map(c=>c.name)).size}</b></div>
  <div><span class="label">Semesters</span><b>1–6</b></div>`;
$("#semSeg").innerHTML=[0,1,2,3,4,5,6].map(s=>`<button type="button" data-sem="${s}" aria-pressed="${s===0}">${s?"Sem "+s:"All"}</button>`).join("");
$("#semSeg").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{semFilter=+b.dataset.sem;$("#semSeg").querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",String(x===b)));renderCatalog()}));
$("#q").addEventListener("input",renderCatalog);
function renderCatalog(){
  const q=$("#q").value.trim().toLowerCase();
  const list=D.labs.filter(l=>{
    const cs=coursesForLab(l.id);
    if(semFilter&&!cs.some(c=>c.sem===semFilter))return false;
    if(!q)return true;
    return (l.id+" "+l.name+" "+l.keywords+" "+l.host+" "+cs.map(c=>c.name).join(" ")+" "+l.exps.map(e=>e[0]).join(" ")).toLowerCase().includes(q);
  });
  const el=$("#catalog");
  if(!list.length){el.innerHTML=`<div class="panel empty">No lab matches “${esc(q)}”. Try a shorter word, such as “pump” or “weld”.</div>`;return}
  el.innerHTML=list.map(l=>{
    const cs=coursesForLab(l.id);
    let html=labBlock(l,"",null,!!q);
    const meta=`<div class="meta">${cs.map(c=>`<span class="chip${c.support?" support":""}">S${c.sem} ${esc(c.name)}</span>`).join("")}<a class="chip" href="${esc(l.site)}" target="_blank" rel="noopener">${esc(l.site.replace(/^https:\/\//,"").replace(/\/$/,""))} ↗</a></div>`;
    return html.replace("</summary>","</summary>"+meta);
  }).join("");
  if(q){el.querySelectorAll("details.lab").forEach(d=>{const l=labById[d.dataset.id];const head=(l.id+" "+l.name+" "+l.keywords).toLowerCase();if(head.includes(q))return;const lis=[...d.querySelectorAll("ol.exps li")];const hit=lis.filter(li=>li.textContent.toLowerCase().includes(q));if(hit.length)lis.forEach(li=>li.hidden=!hit.includes(li));else d.open=false})}
}

/* ---------- FACULTY ---------- */
$("#sDate").value=new Date().toISOString().slice(0,10);
$("#sTerm").value=TERM;
$("#sSem").innerHTML=[1,2,3,4,5,6].map(s=>`<option value="${s}">Semester ${s}</option>`).join("");
$("#sDest").textContent=CFG.sheetEndpoint?"Also sent to the department Google Sheet.":"Saved in this browser. Copy or download to keep it.";
function fillCourse(){
  const s=+$("#sSem").value;
  $("#sCourse").innerHTML=D.courses.filter(c=>c.sem===s).map((c,k)=>`<option>${esc(c.name)}</option>`).join("")||"<option>No mapped course</option>";
  fillExp();
}
function fillExp(){
  const c=D.courses.find(c=>c.sem===+$("#sSem").value&&c.name===$("#sCourse").value);
  $("#sExp").innerHTML=c?c.labs.map(id=>{const l=labById[id];return `<optgroup label="${l.id} ${esc(l.name)}">${l.exps.map((e,i)=>`<option>${expCode(l,i)} ${esc(e[0])}</option>`).join("")}</optgroup>`}).join(""):"";
}
$("#sSem").value="3";fillCourse();
$("#sSem").addEventListener("change",fillCourse);
$("#sCourse").addEventListener("change",fillExp);
$("#sessForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const s={date:$("#sDate").value,term:$("#sTerm").value.trim(),batch:("Sem "+$("#sSem").value+($("#sBatch").value.trim()?" · "+$("#sBatch").value.trim():"")),course:$("#sCourse").value,experiment:$("#sExp").value,students:$("#sCount").value,faculty:$("#sFac").value.trim()};
  if(!s.date||!s.students||!s.faculty){$("#sErr").textContent="Fill the date, students present and faculty name.";return}
  $("#sErr").textContent="";
  sessions.push(s);store.set("sessions",sessions);renderSessions();
  const sent=await sendToSheet("session",s);
  toast(sent?"Session logged and sent":"Session logged");
  $("#sCount").value="";
});
function renderSessions(){
  const b=$("#sessBody");
  if(!sessions.length){b.innerHTML=`<tr><td colspan="9" class="empty">No sessions logged yet. Add the first one with the form above.</td></tr>`;return}
  b.innerHTML=sessions.map((s,i)=>`<tr><td class="num">${i+1}</td><td class="num">${esc(s.date)}</td><td class="num">${esc(s.term)}</td><td>${esc(s.batch)}</td><td>${esc(s.course)}</td><td>${esc(s.experiment)}</td><td class="num">${esc(s.students)}</td><td>${esc(s.faculty)}</td><td><button class="btn small ghost" data-sdel="${i}" aria-label="Remove row">Remove</button></td></tr>`).join("");
  b.querySelectorAll("[data-sdel]").forEach(x=>x.addEventListener("click",()=>{
    if(x.dataset.armed){sessions.splice(+x.dataset.sdel,1);store.set("sessions",sessions);renderSessions()}
    else{x.dataset.armed="1";x.textContent="Confirm";setTimeout(()=>{if(x.isConnected){delete x.dataset.armed;x.textContent="Remove"}},3000)}
  }));
}
const sessRows=sep=>[["Sr","Date","Term","Class / batch","Course","Lab no. and experiment","Students","Faculty","Sign"]].concat(sessions.map((s,i)=>[i+1,s.date,s.term,s.batch,s.course,s.experiment,s.students,s.faculty,""])).map(r=>r.map(c=>sep===","?'"'+String(c).replace(/"/g,'""')+'"':c).join(sep)).join("\n");
$("#sessCopy").addEventListener("click",()=>copyText(sessRows("\t")));
$("#sessCsv").addEventListener("click",()=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([sessRows(",")],{type:"text/csv"}));a.download="virtual-lab-session-log.csv";a.click()});
$("#gaps").innerHTML=D.gaps.map(g=>`<li>${esc(g)}</li>`).join("");
$("#tools").innerHTML=D.tools.map(t=>`<li><a href="${esc(t[2])}" target="_blank" rel="noopener">${esc(t[0])}</a> <span class="muted">· ${esc(t[1])}</span></li>`).join("");

/* ---------- boot ---------- */
renderStudent(); renderRecords(); renderCatalog(); renderSessions();
const h=location.hash.replace("#","");
showTab(["student","labs","records","faculty"].includes(h)?h:"student");
})();
