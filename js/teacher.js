/* ===================== Teacher view (Ms. Rana) ===================== */

const T_NAV = [
  ['dashboard', 'Dashboard', 'layout-dashboard'],
  ['queue', 'Exams', 'square-pen'],
  ['insights', 'Insights', 'chart-column-increasing'],
  ['profile', 'Students', 'users'],
  ['messages', 'Messages', 'message-square-text'],
];
const T_ACTIVE = { dashboard: 'dashboard', queue: 'queue', ocr: 'queue', grading: 'queue', feedback: 'queue', insights: 'insights', profile: 'profile', messages: 'messages' };

function teacherInbox() {
  const items = [];
  if (S.asked) items.push({ who: 'Omar K. · Student', l: 'O', col: 'var(--teal)', text: `“${S.askedText || 'Why is 1/3 bigger than 1/4?'}”`, chip: ['About: Math exam · Q3', 'blue'], time: 'Just now' });
  if (S.officeHours) items.push({ who: 'Mona · Omar’s parent', l: 'M', col: 'var(--green)', text: `Requested office hours: ${S.officeHours}`, chip: ['Office hours', 'green'], time: 'Just now' });
  items.push({ who: 'Lara S. · Student', l: 'L', col: 'var(--indigo-2)', text: 'Frau Rana, ich habe das Foto geschickt!', chip: ['DE', 'blue'], time: 'Yesterday' });
  return items;
}

function tShell(page, inner) {
  const unread = (S.asked ? 1 : 0) + (S.officeHours ? 1 : 0);
  const nav = T_NAV.map(([k, label, icon]) =>
    `<a href="#/teacher/${k}" class="${T_ACTIVE[page] === k ? 'on' : ''}">${ic(icon)}<span>${label}</span>${k === 'messages' && unread ? `<span class="badge">${unread}</span>` : ''}</a>`).join('');
  return `<div class="t-shell">
    <aside class="t-side">
      <div class="t-logo">Assess</div>
      <div class="t-profile"><span class="avatar">R</span><div><b>Ms. Rana</b><span>Grade 3 · Math</span></div></div>
      <nav class="t-nav">${nav}</nav>
      <button class="t-logout" data-a="logout">${ic('log-out', 18)}<span>Log out</span></button>
    </aside>
    <main class="t-main">${inner}</main>
  </div>`;
}

const tHead = (crumb, title, sub, right = '') => `
  <div class="crumb">${crumb}</div>
  <div class="t-head"><div><h1>${title}</h1><p class="sub">${sub}</p></div>${right}</div>`;

/* ---------- Omar's status in the queue ---------- */
function omarStatus() {
  if (S.sent) return { key: 'graded', html: pill('Graded ✓', 'green'), score: `<b style="color:var(--text)">${total()} / 20</b>` };
  if (S.ocrConfirmed.every(Boolean)) return { key: 'verify', html: pill('Ready to grade', 'indigo'), score: pill(`AI ${aiTotal()}/20`, 'ai') };
  return { key: 'verify', html: pill('Needs verification', 'amber'), score: pill(`AI ${aiTotal()}/20`, 'ai') };
}

/* ===================== T1 Dashboard ===================== */
function tDashboard() {
  const graded = 15 + (S.sent ? 1 : 0);
  const verify = 6 - (S.sent ? 1 : 0);
  const msgs = teacherInbox().slice(0, 2).map(m => `
    <div class="msg-item">
      <span class="avatar" style="background:${m.col}">${m.l}</span>
      <div class="grow col" style="gap:6px">
        <b>${m.who}</b><p>${esc(m.text)}</p>
        <div class="row" style="gap:8px">${pill(m.chip[0], m.chip[1])}<span class="muted">${m.time}</span></div>
      </div>
      <a class="link" href="#/teacher/messages">Reply</a>
    </div>`).join('<hr class="divider">');
  return tShell('dashboard', `
    ${tHead('Dashboard', 'Good morning, Ms. Rana', 'Thursday 12 Nov · Grade 3 · Math')}
    <div class="stats">
      <div class="card stat"><span class="label">Submitted</span><span class="num">24 / 28</span><span class="sub" style="font-size:14px">4 not submitted yet</span></div>
      <div class="card stat"><span class="label">Need verification</span><span class="num" style="color:var(--amber)">${verify}</span><span class="sub" style="font-size:14px">AI-read answers to check</span></div>
      <div class="card stat"><span class="label">Flagged</span><span class="num" style="color:var(--red)">3</span><span class="sub" style="font-size:14px">Red flags to review</span></div>
      <div class="card stat"><span class="label">Graded</span><span class="num" style="color:var(--green)">${graded}</span><span class="sub" style="font-size:14px">Recorded in gradebook</span></div>
    </div>
    <div class="cols">
      <div class="main-col">
        <div class="card">
          <div class="row between"><div class="row" style="gap:10px">${ic('file-text', 22, '')}<h3>Grade 3 Math exam · 5 Nov</h3></div>${pill('In progress', 'amber')}</div>
          <p class="sub" style="font-size:14px">${graded} of 28 graded · ${verify} need verification · 3 flagged</p>
          <div class="track"><span style="width:${Math.round(graded / 28 * 100)}%;background:var(--indigo)"></span></div>
          <div class="row"><a class="btn btn-primary" href="#/teacher/ocr">Start reviewing →</a><a class="btn btn-secondary" href="#/teacher/queue">Open class queue</a></div>
        </div>
        <div class="card" style="gap:16px">
          <div class="row between"><h3>Messages</h3><a class="link" href="#/teacher/messages">See all</a></div>
          ${msgs}
        </div>
      </div>
      <div class="side-col">
        <div class="card ai">
          ${pill('✨ AI insight', 'white')}
          <b>11 of 28 students missed fractions · comparing on the 5 Nov exam.</b>
          <p class="sub" style="font-size:14px">7 of them also missed it in October.</p>
          <a class="btn btn-secondary btn-block" href="#/teacher/insights">View class insights</a>
        </div>
        <div class="card" style="gap:14px">
          <h3>Follow-ups</h3>
          <div class="row top">${ic('clock', 20)}<div><p>Check fractions on the next exam</p><span class="muted">11 students</span></div></div>
          <div class="row top">${ic('square-check', 20)}<div><p>Fractions practice</p><span class="muted">${S.practiceDone ? '9' : '8'} of 11 done</span></div></div>
          <div class="row top">${ic('bell', 20)}<div><p>Remind students who haven’t submitted</p><span class="muted">4 students</span></div></div>
        </div>
      </div>
    </div>`);
}

/* ===================== T2 Class queue ===================== */
function tQueue() {
  const o = omarStatus();
  const rows = [
    { l: 'O', n: 'Omar K.', col: 'var(--indigo)', exam: 'Math exam · 5 Nov', score: o.score, status: o.html, key: o.key, act: S.sent ? ['View', '#/teacher/grading'] : ['Open →', '#/teacher/ocr'] },
    { l: 'L', n: 'Lara S.', col: 'var(--indigo-2)', extra: pill('DE', 'blue'), exam: 'Math exam (German) · 5 Nov', score: pill('AI 14/20', 'ai'), status: pill('Needs verification', 'amber'), key: 'verify', act: ['Open →'] },
    { l: 'K', n: 'Karim F.', col: 'var(--indigo)', exam: 'Math exam · 5 Nov', score: pill('AI 6/20', 'ai'), status: pill('Needs verification', 'amber') + ' ' + pill('✨ Unusual score', 'ai'), key: 'verify', act: ['Open →'] },
    { l: 'S', n: 'Sara H.', col: 'var(--indigo-2)', exam: 'Math exam · 5 Nov', score: pill('AI 9/20', 'ai'), status: pill('Flagged: Word problems', 'red'), key: 'flagged', act: ['Open →'] },
    { l: 'Y', n: 'Yara M.', col: 'var(--indigo)', exam: 'Math exam · 5 Nov', score: '<b style="color:var(--text)">18 / 20</b>', status: pill('Graded ✓', 'green'), key: 'graded', act: ['View'] },
    { l: 'A', n: 'Adam T.', col: 'var(--indigo-2)', exam: 'Math exam · 5 Nov', score: '<b style="color:var(--text)">17 / 20</b>', status: pill('Graded ✓', 'green'), key: 'graded', act: ['View'] },
    { l: 'N', n: 'Nour A.', col: '#ADB5BD', exam: '—', score: '—', status: pill('Not submitted', 'grey'), key: 'missing', act: ['Remind', null, 'remind'] },
  ];
  const f = S.queueFilter;
  const shown = rows.filter(r => f === 'all' || r.key === f);
  const verifyCount = 6 - (S.sent ? 1 : 0), graded = 15 + (S.sent ? 1 : 0);
  const chips = [['all', 'All (28)'], ['verify', `Needs verification (${verifyCount})`], ['flagged', 'Flagged (3)'], ['graded', `Graded (${graded})`], ['missing', 'Not submitted (4)']]
    .map(([k, label]) => `<button class="chip ${f === k ? 'on' : ''}" data-a="filter" data-v="${k}">${label}</button>`).join('');
  const body = shown.map(r => `<tr>
      <td class="name"><div class="row" style="gap:10px"><span class="avatar" style="width:32px;height:32px;background:${r.col}">${r.l}</span>${r.n}${r.extra || ''}</div></td>
      <td>${r.exam}</td><td>${r.score}</td><td>${r.status}</td>
      <td>${r.act[2] ? `<button class="link" data-a="${r.act[2]}" data-v="${r.n}">${r.act[0]}</button>` : r.act[1] ? `<a class="link" href="${r.act[1]}">${r.act[0]}</a>` : `<button class="link" data-a="demoOnly">${r.act[0]}</button>`}</td>
    </tr>`).join('');
  return tShell('queue', `
    ${tHead('Exams › Grade 3 Math exam', 'Grade 3 Math exam', '5 Nov · 28 students · 24 submitted', `<button class="btn btn-secondary" data-a="export">${ic('download', 18)}Export grades</button>`)}
    <div class="row between wrap"><div class="filters">${chips}</div><label class="search">${ic('search', 16, '')}<input placeholder="Search students" aria-label="Search students" data-in="search"></label></div>
    <div class="card" style="padding:12px 24px 20px">
      <table class="q"><thead><tr><th style="width:24%">Student</th><th style="width:22%">Exam</th><th style="width:12%">AI score</th><th>Status</th><th style="width:80px"></th></tr></thead>
      <tbody>${body || '<tr><td colspan="5" class="muted">No students in this group.</td></tr>'}</tbody></table>
      <p class="muted" style="padding-top:12px">Showing ${shown.length} of 28 · Graded scores are recorded in the gradebook automatically.</p>
    </div>`);
}

/* ===================== T3 OCR verification ===================== */
function tOcr() {
  const i = S.ocrCurrent, q = QUESTIONS[i];
  const done = S.ocrConfirmed.filter(Boolean).length;
  const strip = QUESTIONS.map((_, k) => {
    const cls = k === i ? 'on' : S.ocrConfirmed[k] ? 'done' : '';
    return `<button class="chip ${cls}" data-a="ocrGo" data-v="${k}">Q${k + 1}${S.ocrConfirmed[k] && k !== i ? ' ✓' : ''}</button>`;
  }).join('');
  let hand = esc(q.hand);
  if (q.lowConf) hand = esc(q.hand).replace(esc(q.lowConf), `<span class="low-conf">${esc(q.lowConf)}</span>`);
  const answer = S.ocrAnswers[i];
  return tShell('ocr', `
    ${tHead('Exams › Grade 3 Math exam › Omar K. › Check answers', 'Check AI-read answers · Omar K.', 'Every answer is shown. Words the AI wasn’t sure about are highlighted.', pill(`${done} of 5 confirmed`, 'green'))}
    <div class="qstrip"><span class="muted" style="font-weight:600">Answers</span>${strip}</div>
    <div class="cols">
      <div class="main-col"><div class="card">
        <div class="row between"><b>Scanned answer · Question ${i + 1}</b>
          <div class="row zoom" style="gap:4px"><button data-a="zoom" data-v="-1" aria-label="Zoom out">${ic('zoom-out', 16)}</button><span class="pill pill-grey" id="zoomv">100%</span><button data-a="zoom" data-v="1" aria-label="Zoom in">${ic('zoom-in', 16)}</button></div>
        </div>
        <div class="scan"><div id="scan-inner" style="display:flex;flex-direction:column;gap:18px">
          <p class="printed">${i + 1}. ${esc(q.q.replace('   1/3 __ 1/4', ''))}</p>
          <div class="hand">${hand}</div>
          <hr class="divider" style="background:var(--border)">
          ${i < 4 ? `<p class="printed" style="opacity:.6">${i + 2}. ${esc(QUESTIONS[i + 1].q.replace('   1/3 __ 1/4', ''))}</p><div class="hand" style="opacity:.6;font-size:36px">${esc(QUESTIONS[i + 1].hand)}</div>` : ''}
        </div></div>
        <p class="muted">Scan · page ${i < 3 ? 1 : 2} of 2 · uploaded by Omar on 5 Nov</p>
      </div></div>
      <div class="side-col" style="width:400px"><div class="card">
        <div class="row between"><b>What the AI read</b>${pill(q.lowConf ? '✨ 92% confidence' : '✨ 99% confidence', 'ai')}</div>
        <span class="label">Question</span>
        <div class="field">${esc(q.q)}</div>
        <div class="row between"><span class="label">Omar’s answer</span><span class="link">${ic('pencil', 14)} Edit</span></div>
        <label class="answer-input"><input value="${esc(answer)}" data-in="ocrAnswer" aria-label="Omar's answer as read by the AI"></label>
        ${q.lowConf && answer === q.read ? `<div class="warn">${ic('circle-alert', 18)}<span>The AI isn’t sure about “${esc(q.lowConf)}”. Compare it with the scan and edit if needed.</span></div>` : ''}
        ${answer !== q.read ? `<div class="warn" style="background:var(--indigo-bg);color:var(--indigo)">${ic('pencil', 18)}<span>You edited this answer. The AI will re-mark it.</span></div>` : ''}
        <div class="row" style="gap:8px">${pill(`AI ${S.ai[i]}/4`, 'ai')}<span class="muted">Suggested mark · you decide on the next screen</span></div>
        <hr class="divider">
        <div class="row"><button class="btn btn-secondary grow" data-a="ocrPrev">← Previous</button><button class="btn btn-primary grow" data-a="ocrConfirm">${S.ocrConfirmed.filter(Boolean).length >= 4 && !S.ocrConfirmed[i] ? 'Confirm and grade →' : 'Confirm and next →'}</button></div>
      </div></div>
    </div>`);
}

/* ===================== T4 Grading review ===================== */
function markBox(k, extra = '') {
  const changed = Number(S.marks[k]) !== S.ai[k];
  return `<span class="mark ${changed ? 'changed' : ''}"><input type="number" min="0" max="4" value="${S.marks[k]}" data-in="mark" data-v="${k}" aria-label="Mark for question ${k + 1}"> / 4</span>${extra}`;
}
function tGrading() {
  const qs = QUESTIONS;
  const okIcon = k => Number(S.marks[k]) >= 3 ? `<span style="color:var(--green)">${ic('circle-check', 20)}</span>` : `<span style="color:var(--amber)">${ic('circle-alert', 20)}</span>`;
  const row = k => `<div class="qrow"><b>Q${k + 1}</b><span class="qtext">${esc(qs[k].q.replace('   1/3 __ 1/4', ' 1/3 __ 1/4'))}</span>${pill(`AI ${S.ai[k]}/4`, 'ai', k === 3 && S.altMethod ? 'strike' : '')}${markBox(k)}${okIcon(k)}</div>`;
  const flagCard = S.flag === 'pending'
    ? `<div class="row" style="gap:8px"><button class="btn btn-danger grow" style="height:40px" data-a="flag" data-v="confirmed">Confirm flag</button><button class="btn btn-secondary grow" style="height:40px" data-a="flag" data-v="dismissed">Dismiss</button></div>`
    : S.flag === 'confirmed' ? `${pill('✓ Flag confirmed', 'green')}` : `${pill('Flag dismissed', 'grey')} <button class="link" data-a="flag" data-v="pending">Undo</button>`;
  const t = total();
  return tShell('grading', `
    ${tHead('Exams › Grade 3 Math exam › Omar K.', 'Review grading · Omar K.', `Math exam · 5 Nov · 5 questions · OCR checked <span style="color:var(--green)">${ic('check', 16)}</span>`,
      `<div class="row" style="gap:8px;font-size:14px"><button class="link" data-a="demoOnly">‹ Lara S.</button><span class="muted">· 3 of 28 ·</span><button class="link" data-a="demoOnly">Yara M. ›</button></div>`)}
    <div class="cols">
      <div class="main-col"><div class="card" style="gap:0;padding:24px">
        <div class="row between" style="padding-bottom:6px"><b>Questions</b><span class="muted">AI mark → your mark</span></div>
        ${row(0)}${row(1)}
        <div class="q3box">${row(2).replace('class="qrow"', 'class="qrow" style="border:none;padding:0"')}
          <span style="font-size:14px">Omar wrote: <b>${esc(S.ocrAnswers[2])}</b></span>
          <div class="ainote">${pill('✨ AI draft · editable', 'ai', '')}<div contenteditable="true" data-in="aiNote">${esc(S.aiNoteQ3)}</div></div>
        </div>
        ${row(3)}
        <div class="alt-row" data-a="altMethod"><span class="toggle ${S.altMethod ? 'on' : ''}"></span>Accept alternative method <span class="muted">(used a number line, reasoning correct)</span></div>
        ${row(4)}
      </div></div>
      <div class="side-col">
        <div class="card">
          <span class="label">Score</span>
          <div class="row between">${pill(`AI suggested ${aiTotal()}/20`, 'ai')}<b style="font-size:24px">${t} / 20</b></div>
          <div class="row between"><span class="sub" style="font-size:14px">Omar sees</span>${starsHTML(starsFromTotal(t), 4, 22)}</div>
        </div>
        <div class="card flag">
          <div class="row between"><b style="color:var(--red)">${ic('flag', 18)} Red flag</b>${pill('Needs support', 'red')}</div>
          <p class="sub" style="font-size:14px">Fractions · comparing: wrong on 3 exams in a row (Sep, Oct, Nov)</p>
          <div>${flagCard}</div>
        </div>
        <div class="card">
          <span class="label">Learning gaps</span>
          <div class="row between"><span>Fractions · comparing</span>${pill('Recurring', 'amber')}</div>
          <div class="row between"><span>Word problems · setup</span>${pill('New', 'blue')}</div>
        </div>
        <a class="btn btn-primary btn-block" href="#/teacher/feedback">Next: write feedback →</a>
      </div>
    </div>`);
}

/* ===================== T5 Feedback (translation panel) ===================== */
function tFeedback() {
  const tab = S.fbTab, lang = S.fbLang;
  const t = total();
  const tabs = [['you', `<span style="color:var(--violet-2)">${ic('sparkles', 16)}</span> For you`], ['omar', 'For Omar'], ['mona', 'For Mona']]
    .map(([k, label]) => `<button class="${tab === k ? 'on' : ''}" data-a="fbTab" data-v="${k}">${label}</button>`).join('');
  const langSeg = `<span class="seg"><button class="${lang === 'en' ? 'on' : ''}" data-a="fbLang" data-v="en">EN</button><i>|</i><button class="${lang === 'de' ? 'on' : ''}" data-a="fbLang" data-v="de">DE</button></span>`;
  let controls = '', items = '';
  if (tab === 'omar') {
    controls = `<span class="ctl">Reading level: <b>Grade 3 (age 8)</b> ${ic('chevron-down', 16)}</span>${langSeg}<button class="pill pill-ai" style="height:36px;padding:0 14px" data-a="regen">${ic('refresh-cw', 16)} Regenerate</button>`;
    items = OMAR_DRAFTS.map((d, i) => {
      const ed = S.omar[i].edited;
      return `<div class="fb-item ${ed ? 'edited' : ''}"><div class="row between"><span class="muted">${d.label}</span>${ed ? pill(`${ic('pencil', 12)} Edited by you`, 'indigo') : pill('✨ AI draft', 'ai')}</div>
        <div class="fb-preview omar" contenteditable="true" data-in="omarText" data-v="${i}">${esc(omarText(i, lang))}</div></div>`;
    }).join('');
  } else if (tab === 'you') {
    controls = `<button class="pill pill-ai" style="height:36px;padding:0 14px" data-a="demoOnly">${ic('refresh-cw', 16)} Regenerate</button>`;
    items = TEACHER_NOTES.map(n => `<div class="fb-item"><div class="row between"><span class="muted">${n.label}</span>${pill('✨ AI analysis', 'ai')}</div><div class="fb-preview you">${n.text}</div></div>`).join('');
  } else {
    controls = `${langSeg}<button class="pill pill-ai" style="height:36px;padding:0 14px" data-a="demoOnly">${ic('refresh-cw', 16)} Regenerate</button>`;
    items = `<div class="row" style="gap:6px;color:var(--green);font-weight:600;font-size:14px">${ic('message-circle', 16)} WhatsApp preview</div>` +
      MONA_DRAFTS.map(m => `<div class="fb-item"><div class="row between"><span class="muted">${m.label}</span>${pill('✨ AI draft', 'ai')}</div><div class="fb-preview mona">${m[lang].replace('3 of 4', `${starsFromTotal(t)} of 4`).replace('3 von 4', `${starsFromTotal(t)} von 4`)}</div></div>`).join('');
  }
  const sentBlock = S.sent
    ? `<div class="send-row"><span>${pill('✓ Sent to Omar and Mona', 'green')}</span><a class="btn btn-secondary" href="#/teacher/queue">Back to queue</a></div>`
    : `<div class="send-row">
        <div class="row" style="gap:16px;font-size:14px"><span class="sub">Send to</span>
          <label class="check"><input type="checkbox" ${S.sendOmar ? 'checked' : ''} data-a="chk" data-v="sendOmar">Omar (app)</label>
          <label class="check"><input type="checkbox" ${S.sendMona ? 'checked' : ''} data-a="chk" data-v="sendMona">Mona (WhatsApp)</label></div>
        <div class="row" style="gap:8px"><button class="btn btn-secondary" data-a="saveDraft">Save draft</button><button class="btn btn-primary" data-a="send">Approve and send</button></div>
      </div>`;
  return tShell('feedback', `
    ${tHead('Exams › Grade 3 Math exam › Omar K. › Feedback', 'Feedback for Omar', 'Review what each person will see before you send it.')}
    <div class="cols">
      <div class="side-col" style="width:300px">
        <div class="card"><span class="label">Final score</span><b style="font-size:24px">${t} / 20</b>${starsHTML(starsFromTotal(t), 4, 22)}</div>
        <div class="card"><span class="label">Red flag</span>${S.flag === 'confirmed' ? pill('✓ Flag confirmed', 'green') : S.flag === 'dismissed' ? pill('Flag dismissed', 'grey') : pill('Not reviewed yet', 'amber')}</div>
        <div class="card"><span class="label">Gaps</span><div class="row between"><span style="font-size:14px">Fractions · comparing</span>${pill('Recurring', 'amber')}</div><div class="row between"><span style="font-size:14px">Word problems · setup</span>${pill('New', 'blue')}</div></div>
        <a class="link" href="#/teacher/grading">‹ Back to grading</a>
      </div>
      <div class="main-col"><div class="card panel">
        <div class="tabs">${tabs}</div>
        <div class="panel-body">
          <div class="row wrap" style="gap:8px">${controls}</div>
          ${items}
          <label class="check" style="font-size:14px"><input type="checkbox" ${S.assignPractice ? 'checked' : ''} data-a="chk" data-v="assignPractice"><span><b>Assign practice:</b> Fractions · comparing (3 questions)</span></label>
          ${sentBlock}
        </div>
      </div></div>
    </div>`);
}

/* ===================== T7 Class insights ===================== */
function tInsights() {
  const topics = [['Addition and subtraction', 88, 'var(--green)'], ['Shapes', 81, 'var(--green)'], ['Fractions · adding', 76, 'var(--indigo)'], ['Word problems · setup', 58, '#F76707', ['New', 'blue']], ['Fractions · comparing', 44, '#F76707', ['Recurring', 'amber']]];
  const bars = topics.map(([n, p, c, pl]) => `<div class="topic"><div class="row between"><div class="row" style="gap:8px">${n}${pl ? pill(pl[0], pl[1]) : ''}</div><b style="color:${p < 60 ? 'var(--amber)' : 'var(--text)'}">${p}%</b></div><div class="track"><span style="width:${p}%;background:${c}"></span></div></div>`).join('');
  const av = (l, c) => `<span class="avatar" style="background:${c}">${l}</span>`;
  const plus = n => `<span class="avatar" style="background:var(--border);color:var(--text-2);font-size:12px">+${n}</span>`;
  return tShell('insights', `
    ${tHead('Insights › Grade 3 › Math exam · 5 Nov', 'Class insights', 'Grade 3 · 28 students · compared with the last 3 exams', `<span class="ctl"><b>Math exam · 5 Nov</b>${ic('chevron-down', 16)}</span>`)}
    <div class="cols">
      <div class="main-col"><div class="card" style="gap:18px;padding:24px">
        <div class="row between"><h3>Results by topic</h3><span class="muted">Class average</span></div>
        ${bars}
        <p class="muted">Compared with the Sep and Oct exams · topics under 60% are highlighted</p>
      </div></div>
      <div class="side-col" style="width:380px">
        <div class="card ai">
          ${pill('✨ AI insight', 'white')}
          <b>11 of 28 students missed fractions · comparing. 7 of them also missed it in October.</b>
          <p class="sub" style="font-size:14px">Suggestion: re-explain with pizza or paper-circle models before the next exam.</p>
          <div class="row"><button class="btn btn-secondary" data-a="planReexplain">Plan re-explanation</button><button class="muted" style="font-weight:600" data-a="demoOnly">Dismiss</button></div>
        </div>
        <div class="card" style="gap:14px">
          <div><div class="row" style="gap:8px"><span style="color:var(--indigo)">${ic('users', 20)}</span><h3>Focus groups</h3></div><span class="muted">Grouped automatically by weak topic</span></div>
          <div class="col" style="gap:10px">
            <div class="row between"><b>Fractions · comparing</b>${pill('11 students', 'amber')}</div>
            <div class="avatars"><a href="#/teacher/profile" title="Omar K.">${av('O', 'var(--indigo)')}</a>${av('L', 'var(--indigo-2)')}${av('Y', 'var(--indigo)')}${av('K', 'var(--indigo-2)')}${plus(7)}</div>
            ${S.groupAssigned ? `<div class="row between">${pill('✓ Practice assigned · due Mon 16 Nov', 'green')}</div>` : `<button class="btn btn-primary btn-block" data-a="assignOpen">Assign practice to group</button>`}
          </div>
          <hr class="divider">
          <div class="col" style="gap:10px">
            <div class="row between"><b>Word problems · setup</b>${pill('6 students', 'blue')}</div>
            <div class="avatars"><a href="#/teacher/profile" title="Omar K.">${av('O', 'var(--indigo)')}</a>${av('S', 'var(--indigo-2)')}${plus(4)}</div>
            <button class="btn btn-secondary btn-block" data-a="assignOpen">Assign practice to group</button>
          </div>
        </div>
      </div>
    </div>`);
}

function assignModal() {
  openModal(`
    <div class="row between top"><div><h2>Assign practice</h2><p class="sub" style="font-size:14px">Fractions · comparing · 11 students</p></div><button data-a="closeModal" aria-label="Close">${ic('x', 24)}</button></div>
    <span class="label muted" style="font-weight:600">Questions</span>
    <div class="col" style="background:var(--page);border-radius:12px;padding:16px;gap:10px">
      <label class="check"><input type="checkbox" checked>Which is bigger? 1/3 or 1/4</label>
      <label class="check"><input type="checkbox" checked>Which is bigger? 1/2 or 1/2</label>
      <label class="check"><input type="checkbox" checked>Which is bigger? 1/2 or 1/6</label>
    </div>
    <span>${pill('✨ Picked by AI from the class’s mistakes', 'ai')}</span>
    <div class="row"><span class="muted" style="font-weight:600">Due</span><span class="ctl">${ic('calendar', 18)} Mon 16 Nov</span></div>
    <div class="col" style="gap:10px">
      <label class="check"><input type="checkbox" checked>Notify students in the app</label>
      <label class="check"><input type="checkbox" checked>Notify parents on WhatsApp</label>
      <label class="check"><input type="checkbox" checked>Check this topic again on the next exam</label>
    </div>
    <div class="row" style="justify-content:flex-end"><button class="btn btn-secondary" data-a="closeModal">Cancel</button><button class="btn btn-primary" data-a="assignDo">Assign to 11 students</button></div>`, { cls: 'wide' });
}

/* ===================== T8 Student profile ===================== */
function tProfile() {
  const t = total();
  const practice = S.practiceDone ? pill(`Completed ✓ · ${S.practice.right} of 3 right first try`, 'green')
    : (S.sent && S.assignPractice) || S.groupAssigned ? pill('Assigned · not started yet', 'amber') : pill('Not assigned yet', 'grey');
  const exams = [
    ['5 Nov · Math exam', S.sent ? `${t} / 20` : 'Being graded', S.sent ? starsHTML(starsFromTotal(t), 4, 18) : '', [['Fractions · comparing: missed', 'amber'], ['Word problems · setup: new', 'blue']], true],
    ['22 Oct · Math quiz', '13 / 20', '', [['Fractions · comparing: missed', 'amber'], ['Fractions · adding: correct', 'green']]],
    ['30 Sep · Math quiz', '12 / 20', '', [['Fractions · comparing: missed', 'amber']]],
  ];
  const tl = exams.map(([title, score, st, pills, latest], i) => `
    <div class="tl-item"><div class="tl-rail"><span class="dot ${latest ? 'on' : ''}"></span>${i < 2 ? '<span class="line"></span>' : ''}</div>
      <div class="tl-body"><div class="row between"><b>${title}</b><div class="row" style="gap:8px"><b>${score}</b>${st}</div></div>
        <div class="row wrap" style="gap:8px">${pills.map(p => pill(p[0], p[1])).join('')}</div>
        ${latest ? `<a class="link" href="#/teacher/grading">Open exam ›</a>` : ''}</div></div>`).join('');
  return tShell('profile', `
    <div class="crumb">Students › Grade 3 › Omar K.</div>
    <div class="t-head" style="align-items:center"><div class="row" style="gap:16px"><span class="avatar" style="width:56px;height:56px;font-size:22px;background:var(--indigo)">O</span><div><h1>Omar K.</h1><p class="sub">Grade 3 · age 8 · Parent: Mona</p></div></div>
      <div class="row" style="gap:8px"><a class="btn btn-secondary" href="#/teacher/messages">${ic('message-square', 18)}Message Omar</a><a class="btn btn-secondary" href="#/teacher/messages">${ic('message-square', 18)}Message Mona</a></div></div>
    <div class="cols">
      <div class="main-col"><div class="card" style="padding:24px;gap:16px"><h3>Last 3 exams</h3><div>${tl}</div></div>
        <div class="card"><span class="label">Last message</span><p>${S.officeHours ? `Mona asked for office hours: ${esc(S.officeHours)}` : S.asked ? `Omar asked: “${esc(S.askedText)}”` : 'No new messages from Omar or Mona.'}</p><a class="link" href="#/teacher/messages">Open messages ›</a></div>
      </div>
      <div class="side-col">
        <div class="card"><h3 style="font-size:16px">Patterns</h3>
          <div class="row between"><span style="font-size:14px">Fractions · comparing</span>${pill('Recurring · 3 exams', 'amber')}</div>
          <div class="row between"><span style="font-size:14px">Word problems · setup</span>${pill('New', 'blue')}</div>
          <div style="background:var(--violet-bg);color:var(--violet);border-radius:8px;padding:8px 10px;font-size:14px">✨ Mixes up the size of the bottom number with the size of the piece.</div>
        </div>
        <div class="card"><h3 style="font-size:16px">Practice</h3><span style="font-size:14px">Fractions · comparing · 3 questions</span><span>${practice}</span>${S.practiceDone ? '<span class="muted">Assigned 5 Nov · done just now</span>' : ''}</div>
        <div class="card"><h3 style="font-size:16px">Follow-up</h3>
          <div class="row" style="cursor:pointer" data-a="followUp"><span class="toggle ${S.followUp ? 'on' : ''}"></span><span style="font-size:14px">Check fractions · comparing on the next exam</span></div>
          <label class="check" style="font-size:14px"><input type="checkbox" checked>In the Fractions focus group</label>
        </div>
      </div>
    </div>`);
}

/* ===================== Messages ===================== */
function tMessages() {
  const list = teacherInbox().map(m => `<div class="msg-item"><span class="avatar" style="background:${m.col}">${m.l}</span><div class="grow col" style="gap:6px"><b>${m.who}</b><p>${esc(m.text)}</p><div class="row" style="gap:8px">${pill(m.chip[0], m.chip[1])}<span class="muted">${m.time}</span></div></div><button class="btn btn-secondary btn-sm" data-a="reply" data-v="${m.l}">Reply</button></div>`).join('<hr class="divider">');
  return tShell('messages', `
    ${tHead('Messages', 'Messages', 'Questions from students and parents')}
    <div class="card" style="gap:16px;max-width:760px">${list}</div>`);
}

function sentModal() {
  openModal(`<div class="big-check">${ic('check', 32)}</div><h2>Feedback sent</h2>
    <p class="sub">${[S.sendOmar && 'Omar', S.sendMona && 'Mona'].filter(Boolean).join(' and ') || 'Nobody'} ${S.sendOmar && S.sendMona ? 'have' : 'has'} been notified. The grade is recorded in your gradebook.</p>
    <div class="row" style="width:100%"><a class="btn btn-secondary grow" href="#/teacher/queue" data-a="closeModal">Back to queue</a><a class="btn btn-primary grow" href="#/student/home" data-a="closeModal">See it as Omar →</a></div>`, { cls: 'center' });
}

const TEACHER_VIEWS = { dashboard: tDashboard, queue: tQueue, ocr: tOcr, grading: tGrading, feedback: tFeedback, insights: tInsights, profile: tProfile, messages: tMessages };
