/* ===================== Parent view (Mona) — matches the Figma parent screens ===================== */

function pShell(page, inner) {
  const nav = [
    ['overview', 'house', L('Overview', 'Übersicht')],
    ['progress', 'chart-column', L('Progress', 'Fortschritt')],
    ['messages', 'bell', L('Messages', 'Nachrichten')],
  ].map(([k, icon, label]) => {
    const on = page === k || (k === 'overview' && page === 'fractions') || (k === 'progress' && page === 'exam');
    return `<a href="#/parent/${k}" class="${on ? 'on' : ''}"><span class="circ">${ic(icon, 20)}</span>${label}${k === 'messages' ? '<span class="dot">1</span>' : ''}</a>`;
  }).join('');
  return `<div class="f-shell">
    <header class="f-top"><div class="me"><span class="mona">M</span>Mona · ${L('Omar’s parent', 'Omars Mutter')}</div><nav class="f-nav" style="margin:0 auto">${nav}${langToggle()}</nav><button class="f-logout" data-a="logout" title="${L('Log out', 'Abmelden')}">${ic('log-out', 18)}<span>${L('Log out', 'Abmelden')}</span></button></header>
    <main class="f-main">${inner}</main>
  </div>`;
}

const TREND = () => [['24 Sep', 55], ['8 Oct', 60], ['20 Oct', 64], ['29 Oct', 68], ['5 Nov', S.sent ? percent() : null]];

function topicScores() {
  const pct = (a, b) => Math.round((a / b) * 100);
  return [
    [L('Adding and shading fractions', 'Brüche addieren und anmalen'), pct(Number(S.marks[0]) + Number(S.marks[1]), 8), 'var(--green)'],
    [L('Word problems', 'Textaufgaben'), pct(Number(S.marks[4]), 4), 'var(--teal)'],
    [L('Comparing fractions', 'Brüche vergleichen'), pct(Number(S.marks[2]) + Number(S.marks[3]), 8), '#E8590C'],
  ];
}

function helpTips(n = 2) {
  const tips = [
    `🍕 ${L('Cut a paper circle into halves, thirds and quarters, and ask which piece is bigger.', 'Schneiden Sie einen Papierkreis in Halbe, Drittel und Viertel und fragen Sie, welches Stück größer ist.')}`,
    `✏️ ${L('Draw a number line together and place ½, ⅓ and ¼ on it.', 'Zeichnen Sie zusammen einen Zahlenstrahl und tragen Sie ½, ⅓ und ¼ ein.')}`,
    `🍫 ${L('Share a chocolate bar into equal pieces and compare.', 'Teilen Sie eine Tafel Schokolade in gleiche Stücke und vergleichen Sie.')}`,
  ];
  return tips.slice(0, n).map(t => `<div class="ptip">${t}</div>`).join('') + `<span class="muted" style="font-size:12px">${L('10 minutes, 3 times a week', '10 Minuten, 3-mal pro Woche')}</span>`;
}

/* ---------- Overview ---------- */
function pOverview() {
  const trend = TREND();
  const bars = trend.map(([d, v]) => `<div class="b"><em>${v === null ? '…' : v + '%'}</em><span style="height:${v === null ? 6 : v}%;${v === null ? 'background:var(--border)' : ''}"></span>${d}</div>`).join('');
  const wa = S.sent && S.sendMona ? `
    <div class="p-card" style="border:1px solid #B2F2BB"><div class="row" style="gap:8px;color:var(--green);font-weight:600">${ic('message-circle', 18)} ${L('New WhatsApp message from Ms. Rana', 'Neue WhatsApp-Nachricht von Frau Rana')}</div>
      <div class="ptip" style="background:#DCF8C6;display:flex;flex-direction:column;gap:6px">${MONA_DRAFTS.map(m => `<span>${esc(m[S.lang].replace('3 of 4', `${starsFromTotal(total())} of 4`).replace('3 von 4', `${starsFromTotal(total())} von 4`))}</span>`).join('')}</div></div>` : '';
  const grade = S.sent
    ? `<span style="font-size:34px;font-weight:600">${percent()}%</span><span class="muted" style="font-size:12px">${L('Math exam · Fractions', 'Mathe-Arbeit · Brüche')}</span><span class="reviewed">${L('Reviewed by Ms. Rana ✓', 'Von Frau Rana geprüft ✓')}</span>`
    : `<span style="font-size:34px;font-weight:600;color:var(--muted)">—</span><span class="muted" style="font-size:12px">${L('Math exam · 5 Nov', 'Mathe-Arbeit · 5. Nov')}</span><span class="waiting">${L('Waiting for teacher review', 'Wartet auf die Lehrerin')}</span>`;
  return pShell('overview', `
    <div class="f-title"><h1>${L('Hi Mona!', 'Hallo Mona!')} 👋</h1><p>${L('Omar’s Progress.', 'Omars Fortschritt.')}</p></div>
    ${wa}
    <div class="p-grid">
      <div class="p-card"><span class="capl">${L('Latest grade', 'Letzte Note')}</span>${grade}</div>
      <div class="p-card"><div class="row between"><span class="capl">${L('Trend (last 5 exams)', 'Verlauf (letzte 5 Arbeiten)')}</span>${S.sent ? `<span style="color:var(--green);font-size:12px;font-weight:600">${L('Improving ↑', 'Wird besser ↑')}</span>` : ''}</div><div class="vbars">${bars}</div></div>
      <div class="p-card"><span class="capl">${L('How Omar’s doing', 'Wie es Omar geht')}</span><span style="font-size:14px">${L('Could use a little extra help with:', 'Braucht ein bisschen Hilfe bei:')}</span><span class="fr-pill">${L('Fractions', 'Brüche')}</span><span class="pattern" style="align-self:flex-start">${L('Pattern – seen in 3 exams', 'Muster – in 3 Arbeiten')}</span><a class="back" style="font-size:13px" href="#/parent/fractions">${L('See details →', 'Details ansehen →')}</a></div>
    </div>
    <div class="p-grid2">
      <div class="p-card"><span class="capl">${L('How you can help at home', 'So können Sie zu Hause helfen')}</span>${helpTips(2)}</div>
      <div class="p-card"><span class="capl">${L('Need to talk to the teacher?', 'Mit der Lehrerin sprechen?')}</span>
        <p>${L('Have a question about fractions? Ask Ms. Rana for a short meeting.', 'Fragen zu Brüchen? Bitten Sie Frau Rana um ein kurzes Gespräch.')}</p>
        ${S.officeHours ? `<span class="reviewed" style="font-size:13px">📅 ${L('Requested', 'Angefragt')}: ${esc(S.officeHours)}</span>` : `<button class="tbtn" data-a="officeOpen">📅 ${L('Request office hours', 'Sprechstunde anfragen')}</button>`}
        <span class="muted" style="font-size:12px">${L('You’ll get her reply on WhatsApp.', 'Die Antwort kommt per WhatsApp.')}</span></div>
    </div>
  `);
}

/* ---------- Progress ---------- */
function lineChart() {
  const pts = TREND().filter(([, v]) => v !== null);
  const W = 260, H = 190, x0 = 30, y0 = 10, ys = v => y0 + (80 - v) / 30 * (H - 40);
  const xs = i => x0 + i * ((W - x0 - 10) / 4);
  const grid = [80, 70, 60, 50].map(v => `<line x1="${x0}" x2="${W}" y1="${ys(v)}" y2="${ys(v)}" stroke="#E9ECEF"/><text x="0" y="${ys(v) + 4}" font-size="9" fill="#868E96">${v}%</text>`).join('');
  const path = pts.map(([, v], i) => `${i ? 'L' : 'M'}${xs(i)},${ys(v)}`).join(' ');
  const dots = pts.map(([, v], i) => `<circle cx="${xs(i)}" cy="${ys(v)}" r="3" fill="#1A8CA8"/><text x="${xs(i) - 8}" y="${ys(v) - 8}" font-size="10" fill="#1A8CA8" font-weight="600">${v}%</text>`).join('');
  const labels = TREND().map(([d], i) => `<text x="${xs(i) - 12}" y="${H - 6}" font-size="9" fill="#868E96">${d}</text>`).join('');
  return `<svg viewBox="0 0 ${W + 10} ${H}" width="100%" role="img" aria-label="Math grade over time">${grid}<path d="${path}" fill="none" stroke="#1A8CA8" stroke-width="2"/>${dots}${labels}</svg>`;
}

function pProgress() {
  const rows = [];
  if (S.upload === 'sent') rows.push([L('Today', 'Heute'), L('Math', 'Mathe'), 'Ms. Rana', '—', `<span class="waiting">${L('Waiting for teacher review', 'Wartet auf die Lehrerin')}</span>`, '']);
  rows.push(S.sent
    ? ['5 Nov', L('Math', 'Mathe'), 'Ms. Rana', `${percent()}%`, `<span class="reviewed">${L('Reviewed ✓', 'Geprüft ✓')}</span> <span class="pattern">${L('Fractions', 'Brüche')}</span>`, `<a class="back" href="#/parent/exam">${L('View →', 'Ansehen →')}</a>`]
    : ['5 Nov', L('Math', 'Mathe'), 'Ms. Rana', '—', `<span class="waiting">${L('Waiting for teacher review', 'Wartet auf die Lehrerin')}</span>`, '']);
  rows.push(['1 Nov', L('English', 'Englisch'), 'Mr. Karim', '92%', `<span class="reviewed">${L('Reviewed ✓', 'Geprüft ✓')}</span>`, `<span class="back">${L('View →', 'Ansehen →')}</span>`]);
  rows.push(['27 Oct', L('Science', 'Sachkunde'), 'Ms. Heba', '80%', `<span class="reviewed">${L('Reviewed ✓', 'Geprüft ✓')}</span>`, `<span class="back">${L('View →', 'Ansehen →')}</span>`]);
  rows.push(['22 Oct', L('German', 'Deutsch'), 'Frau Schmidt', '75%', `<span class="reviewed">${L('Reviewed ✓', 'Geprüft ✓')}</span>`, `<span class="back">${L('View →', 'Ansehen →')}</span>`]);
  rows.push(['15 Oct', L('History', 'Geschichte'), 'Mr. Youssef', '58%', `<span class="reviewed">${L('Reviewed ✓', 'Geprüft ✓')}</span> <span class="pattern">${L('Ancient Egypt', 'Altes Ägypten')}</span>`, `<span class="back">${L('View →', 'Ansehen →')}</span>`]);
  const chips = [L('All', 'Alle'), L('Math', 'Mathe'), L('English', 'Englisch'), L('Science', 'Sachkunde'), L('History', 'Geschichte'), L('German', 'Deutsch')].map((c, i) => `<span class="fchip ${i === 0 ? 'on' : ''}">${c}</span>`).join('');
  return pShell('progress', `
    <h1 class="f-h1">${L('Omar’s Progress', 'Omars Fortschritt')}</h1>
    <div class="fchips">${chips}</div>
    <div class="p-stats">
      <div class="p-card"><span class="capl">${L('Average', 'Durchschnitt')}</span><b>${S.sent ? Math.round((92 + 80 + 75 + 58 + percent()) / 5) : 76}%</b></div>
      <div class="p-card"><span class="capl">${L('Strongest', 'Am stärksten')}</span><b>${L('English', 'Englisch')} ⭐</b></div>
      <div class="p-card"><span class="capl">${L('Math trend', 'Mathe-Verlauf')}</span><b style="color:var(--green);font-size:15px">${S.sent ? `+${percent() - 55} ${L('points since September ↑', 'Punkte seit September ↑')}` : `+13 ${L('points since September ↑', 'Punkte seit September ↑')}`}</b></div>
      <div class="p-card"><span class="capl">${L('Needs practice', 'Braucht Übung')}</span><b style="color:var(--amber);font-size:15px">${L('Fractions, Ancient Egypt', 'Brüche, Altes Ägypten')}</b></div>
    </div>
    <div class="row top" style="gap:20px">
      <div class="p-card" style="width:300px;flex-shrink:0"><span class="capl">${L('Math over time', 'Mathe im Verlauf')}</span>${lineChart()}<span class="muted" style="font-size:12px">${L('Math exam grade', 'Note der Mathe-Arbeiten')}</span></div>
      <div class="p-card grow"><span class="capl">${L('Recent exams', 'Letzte Arbeiten')}</span>
        <table class="pt"><thead><tr><th>${L('Date', 'Datum')}</th><th>${L('Subject', 'Fach')}</th><th>${L('Teacher', 'Lehrkraft')}</th><th>${L('Grade', 'Note')}</th><th>Status</th><th></th></tr></thead>
        <tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td class="${i === 5 ? 'v' : ''}">${c}</td>`).join('')}</tr>`).join('')}</tbody></table>
        <span class="muted" style="font-size:12px">${L('Grades appear here only after the teacher has reviewed them.', 'Noten erscheinen hier erst, wenn die Lehrkraft sie geprüft hat.')}</span></div>
    </div>
  `);
}

/* ---------- Exam detail ---------- */
function pExam() {
  if (!S.sent) return pShell('exam', `<a class="back" href="#/parent/progress">← ${L('Back to progress', 'Zurück zum Fortschritt')}</a><div class="p-card"><b>${L('Ms. Rana is still checking this exam.', 'Frau Rana prüft diese Arbeit noch.')}</b><span class="muted">${L('Grades appear here only after the teacher has reviewed them.', 'Noten erscheinen erst nach der Prüfung.')}</span></div>`);
  const t = total();
  const bars = topicScores().map(([n, p, c]) => `<div class="col" style="gap:6px"><div class="row between"><b style="font-size:15px">${n}</b><b style="color:${c}">${p}%</b></div><div class="track" style="height:6px"><span style="width:${p}%;background:${c}"></span></div></div>`).join('');
  return pShell('exam', `
    <a class="back" href="#/parent/progress">← ${L('Back to progress', 'Zurück zum Fortschritt')}</a>
    <div class="row between"><div class="row" style="gap:20px"><h1 class="f-h1" style="font-size:36px">${L('Math exam', 'Mathe-Arbeit')} · 5 Nov</h1><span class="reviewed">${L('Reviewed by Ms. Rana ✓', 'Von Frau Rana geprüft ✓')}</span></div><span style="font-size:44px;font-weight:600">${percent()}%</span></div>
    <div class="p-grid2">
      <div class="p-card"><span class="capl">${L('Score by topic', 'Ergebnis nach Thema')}</span>${bars}</div>
      <div class="p-card"><span class="capl">${L('Ms. Rana’s feedback', 'Feedback von Frau Rana')}</span><div class="quote">${L('Omar did really well on adding fractions and is starting on word problems. Comparing fractions still needs practice, especially thirds and quarters.', 'Omar hat Brüche addieren sehr gut gemacht und fängt mit Textaufgaben an. Brüche vergleichen braucht noch Übung, besonders Drittel und Viertel.')}</div></div>
      <div class="p-card"><span class="capl">${L('What to focus on', 'Worauf achten')}</span><div class="row between"><span class="pattern">${L('Fractions · Pattern – seen in 3 exams', 'Brüche · Muster – in 3 Arbeiten')}</span><a class="back" href="#/parent/fractions">${L('See details →', 'Details ansehen →')}</a></div></div>
      <div class="p-card"><span class="capl">${L('What Omar sees', 'Was Omar sieht')}</span><div class="ptip" style="background:#FFF8E7">${starsHTML(starsFromTotal(t), 4, 26)}<p style="font-weight:600;margin-top:6px">${L('You’re getting close with fractions! 🍕', 'Du bist bei Brüchen schon fast da! 🍕')}</p></div><span class="muted" style="font-size:12px">${L('Omar gets a simpler, encouraging version of the same feedback.', 'Omar bekommt eine einfachere, ermutigende Version desselben Feedbacks.')}</span></div>
    </div>
  `);
}

/* ---------- Fractions detail ---------- */
function pFractions() {
  return pShell('fractions', `
    <a class="back" href="#/parent/overview">← ${L('Back to overview', 'Zurück zur Übersicht')}</a>
    <div class="row" style="gap:16px"><h1 class="f-h1" style="font-size:36px">${L('Fractions', 'Brüche')}</h1><span class="pattern">${L('Pattern – seen in 3 exams', 'Muster – in 3 Arbeiten')}</span>${S.sent ? `<span class="reviewed">${L('Reviewed by Ms. Rana ✓', 'Von Frau Rana geprüft ✓')}</span>` : ''}</div>
    <div class="green-strip">${L('This is very common in Grade 3 and improves quickly with practice.', 'Das ist in Klasse 3 sehr häufig und wird mit Übung schnell besser.')}</div>
    <div class="p-grid2">
      <div class="col" style="gap:20px">
        <div class="p-card"><span class="capl">${L('What this means', 'Was das bedeutet')}</span><p>${L('Omar is still learning to compare fractions with different bottom numbers. For example, he thinks ¼ is bigger than ⅓ because 4 is bigger than 3.', 'Omar lernt noch, Brüche mit verschiedenen unteren Zahlen zu vergleichen. Zum Beispiel denkt er, ¼ ist größer als ⅓, weil 4 größer als 3 ist.')}</p></div>
        <div class="p-card"><span class="capl">${L('Ms. Rana’s note', 'Notiz von Frau Rana')}</span><div class="quote">${L('Omar understands halves really well. This week, let’s practise comparing thirds and quarters.', 'Omar versteht Halbe sehr gut. Diese Woche üben wir Drittel und Viertel zu vergleichen.')}</div></div>
      </div>
      <div class="col" style="gap:20px">
        <div class="p-card"><span class="capl">${L('Where it showed up', 'Wo es vorkam')}</span>${[['30 Sep', 3], ['22 Oct', 2], ['5 Nov', 3]].map(([d, q]) => `<div class="row" style="gap:12px;font-size:14px;border-bottom:1px solid #F1F3F5;padding-bottom:6px"><span style="color:var(--red)">✗</span>${L('Math exam', 'Mathe-Arbeit')} · ${d} · ${L('Question', 'Frage')} ${q}</div>`).join('')}</div>
        <div class="p-card"><span class="capl">${L('How you can help at home', 'So können Sie zu Hause helfen')}</span>${helpTips(3)}</div>
      </div>
    </div>
    <div class="row" style="gap:12px">${S.officeHours ? `<span class="reviewed" style="font-size:14px;padding:10px 14px">📅 ${L('Requested', 'Angefragt')}: ${esc(S.officeHours)}</span>` : `<button class="tbtn" data-a="officeOpen">📅 ${L('Request office hours', 'Sprechstunde anfragen')}</button>`}<a class="tbtn o" href="#/parent/messages">💬 ${L('Message Ms. Rana', 'Frau Rana schreiben')}</a></div>
  `);
}

/* ---------- Messages ---------- */
function pMessages() {
  const last = S.parentChat[S.parentChat.length - 1];
  const bubbles = S.parentChat.map(m => m.sys ? `<span class="sysline">${esc(m.text)}</span>` : m.me ? `<div class="tb">${esc(chatText(m))}</div>` : `<div class="gb">${esc(chatText(m))}</div>`).join('');
  return pShell('messages', `
    <h1 class="f-h1" style="font-size:36px">${L('Messages', 'Nachrichten')}</h1>
    <div class="sms"><div class="list">
        <div class="it on"><div class="grow"><b>Ms. Rana · ${L('Math', 'Mathe')}</b><p class="t">${esc(chatText(last)).slice(0, 60)}${chatText(last).length > 60 ? '…' : ''}</p></div></div>
        <div class="it" data-a="otherThread"><div class="grow"><b>Frau Schmidt · ${L('German', 'Deutsch')}</b><p class="t">${L('Omar did great on his German exam!', 'Omar war super im Deutsch-Test!')}</p><p class="t muted">${L('Yesterday', 'Gestern')}</p></div></div>
      </div>
      <div class="thread"><div class="thread-head row between"><b>Ms. Rana · ${L('Math teacher', 'Mathe-Lehrerin')}</b><span class="wa-toggle">${L('WhatsApp notifications: On', 'WhatsApp-Benachrichtigungen: An')} <span class="toggle on"></span></span></div>
        ${bubbles}
        <div class="composer2 rect"><input id="pchat-in" placeholder="${L('Type a message...', 'Nachricht schreiben...')}" aria-label="${L('Message', 'Nachricht')}"><button class="tbtn" style="height:40px;padding:0 22px" data-a="pchatSend">${L('Send', 'Senden')}</button></div>
      </div></div>
  `);
}

/* ---------- Office hours popup ---------- */
let SLOT = null;
function officeModal() {
  const slots = [L('Sun 15 Nov · 1:30 PM', 'So 15. Nov · 13:30'), L('Mon 16 Nov · 2:00 PM', 'Mo 16. Nov · 14:00'), L('Tue 17 Nov · 12:30 PM', 'Di 17. Nov · 12:30')];
  openModal(`
    <button class="xbtn" data-a="closeModal" aria-label="Close">${ic('x', 22)}</button>
    <h2>${L('Request office hours', 'Sprechstunde anfragen')}</h2>
    <p class="sub" style="font-size:14px;margin-top:-8px">${L('Meet Ms. Rana for a short 15-minute chat.', 'Ein kurzes 15-Minuten-Gespräch mit Frau Rana.')}</p>
    <span class="fr-pill" style="border-radius:6px">${L('About: Fractions', 'Zu: Brüche')}</span>
    <span class="capl">${L('Choose a time', 'Zeit wählen')}</span>
    <div class="col" style="gap:8px">${slots.map(s => `<button class="slot2 ${SLOT === s ? 'on' : ''}" data-a="slot" data-v="${s}">${s}</button>`).join('')}</div>
    <span class="capl">${L('How would you like to meet?', 'Wie möchten Sie sich treffen?')}</span>
    <div class="seg2"><button class="${S.meetMode === 'person' ? 'on' : ''}" data-a="meetMode" data-v="person">${L('In person', 'Persönlich')}</button><button class="${S.meetMode === 'phone' ? 'on' : ''}" data-a="meetMode" data-v="phone">${L('Phone call', 'Telefonat')}</button></div>
    <textarea id="oh-note" class="oh-note" placeholder="${L('Anything you’d like Ms. Rana to know? (optional)', 'Möchten Sie Frau Rana etwas sagen? (optional)')}"></textarea>
    <div class="row"><button class="rbtn-rect c" data-a="closeModal">${L('Cancel', 'Abbrechen')}</button><button class="rbtn-rect s ${SLOT ? '' : 'dis'}" data-a="officeSend">${L('Send request', 'Anfrage senden')}</button></div>
  `, { cls: 'wide' });
}

Object.assign(ACTIONS, {
  officeOpen() { SLOT = null; officeModal(); },
  slot(el) { SLOT = el.dataset.v; officeModal(); },
  meetMode(el) { S.meetMode = el.dataset.v; save(); officeModal(); },
  officeSend() {
    if (!SLOT) { toast(L('Choose a time first', 'Bitte zuerst eine Zeit wählen')); return; }
    const mode = S.meetMode === 'phone' ? L('Phone call', 'Telefonat') : L('In person', 'Persönlich');
    S.officeHours = `${SLOT} · ${mode}`;
    const day = SLOT.split(' ')[0];
    const time = SLOT.split('· ')[1];
    S.parentChat.push({ sys: true, text: `📅 ${L('Office hours requested', 'Sprechstunde angefragt')} · ${SLOT}` });
    S.parentChat.push({ me: false, text: `Perfect, see you on ${day} at ${time}!`, de: `Perfekt, bis ${day} um ${time}!` });
    save();
    openModal(`<div class="big-check" style="width:88px;height:88px;font-size:40px">✓</div><h2 style="font-size:30px">${L('Request sent!', 'Anfrage gesendet!')}</h2><p class="sub">${L('Ms. Rana will confirm your meeting on WhatsApp.', 'Frau Rana bestätigt den Termin per WhatsApp.')}</p><div class="ptip full" style="padding:20px">${esc(S.officeHours)} · ${L('About: Fractions', 'Zu: Brüche')}</div><button class="rbtn-rect s full" data-a="closeModal">${L('Done', 'Fertig')}</button>`, { cls: 'wide center' });
    render();
  },
  pchatSend() {
    const v = document.getElementById('pchat-in').value.trim();
    if (!v) return;
    S.parentChat.push({ me: true, text: v }); save(); render();
  },
});

const PARENT_VIEWS = { overview: pOverview, progress: pProgress, exam: pExam, fractions: pFractions, messages: pMessages };
