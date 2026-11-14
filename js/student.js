/* ===================== Student view (Omar, age 8) — matches the Figma student screens ===================== */

let PHOTO = null; // the exam photo stays in memory only

function langToggle() {
  return `<span class="lang"><button class="${S.lang === 'en' ? 'on' : ''}" data-a="setLang" data-v="en">EN</button><i>|</i><button class="${S.lang === 'de' ? 'on' : ''}" data-a="setLang" data-v="de">DE</button></span>`;
}
const chatText = m => (S.lang === 'de' && m.de ? m.de : m.text);

function sShell(page, inner) {
  const unread = S.sent && !S.resultsSeen;
  const nav = [
    ['home', 'house', L('Home', 'Start')],
    ['grades', 'trophy', L('My Grades', 'Meine Noten')],
    ['messages', 'bell', L('Messages', 'Nachrichten')],
  ].map(([k, icon, label]) => {
    const on = page === k || (k === 'grades' && ['results', 'question'].includes(page));
    return `<a href="#/student/${k}" class="${on ? 'on' : ''}"><span class="circ">${ic(icon, 20)}</span>${label}${k === 'messages' ? `<span class="dot">${unread ? 1 : 1}</span>` : ''}</a>`;
  }).join('');
  return `<div class="f-shell">
    <header class="f-top"><div class="me"><span class="smiley">🙂</span>Omar · ${L('Grade 3', 'Klasse 3')}</div><nav class="f-nav" style="margin:0 auto">${nav}${langToggle()}</nav><button class="f-logout" data-a="logout" title="${L('Log out', 'Abmelden')}">${ic('log-out', 18)}<span>${L('Log out', 'Abmelden')}</span></button></header>
    <main class="f-main">${inner}</main>
  </div>`;
}

/* ---------- Home ---------- */
function sHome() {
  const banner = S.sent
    ? `<a class="banner-row ready" href="#/student/results">🎉 ${L('Your Math results are ready! See them →', 'Deine Mathe-Ergebnisse sind da! Ansehen →')}</a>`
    : `<div class="banner-row wait">${ic('clock', 18)} ${L('Your Math exam is with Ms. Rana. She’s checking it! ⏳', 'Deine Mathe-Arbeit ist bei Frau Rana. Sie schaut sie gerade an! ⏳')}</div>`;
  return sShell('home', `
    <div class="f-title"><h1>${L('Hi Omar!', 'Hallo Omar!')} 👋</h1><p>${L('What would you like to do today?', 'Was möchtest du heute machen?')}</p></div>
    <div class="tiles">
      <a class="tile primary" href="#/student/upload">${ic('camera', 36)}${L('Upload my exam', 'Arbeit hochladen')}</a>
      <a class="tile" href="#/student/grades">${ic('star', 36)}${L('My grades', 'Meine Noten')}</a>
      <a class="tile" href="#/student/messages"><span class="new">${L('1 new', '1 neu')}</span>${ic('bell', 36)}${L('Messages', 'Nachrichten')}</a>
    </div>
    ${banner}
    <div class="weekcard"><span class="sunny">🌞</span><div class="col" style="gap:4px"><span class="muted" style="font-size:12px">${L('This week', 'Diese Woche')}</span><b style="font-size:17px">${L('You’re doing great this week!', 'Du machst das super diese Woche!')}</b>${starsHTML(3, 4, 22)}<a class="back" href="#/student/grades">${L('See my progress →', 'Meinen Fortschritt ansehen →')}</a></div></div>
  `);
}

/* ---------- Upload flow ---------- */
const SAMPLE_PHOTO = 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400"><rect width="300" height="400" fill="#f8f9fa"/><rect x="0" y="0" width="14" height="400" fill="#adb5bd"/><g font-family="sans-serif" fill="#495057" font-size="11"><text x="80" y="30">GRADE 3 · MATH EXAM</text><text x="30" y="70">1. 1/5 + 2/5 =</text><text x="30" y="120">2. Shade 3/8 of the shape</text><text x="30" y="170">3. Which is bigger? 1/3 __ 1/4</text><text x="30" y="220">4. Order: 1/2, 1/4, 3/4</text><text x="30" y="270">5. Mona cut a pizza into 4…</text></g><g font-family="cursive" fill="#1C3D8A" font-size="18"><text x="120" y="72">3/5</text><text x="200" y="172">1/3 &lt; 1/4</text><text x="150" y="222">1/4, 1/2, 3/4</text><text x="150" y="300">3 + 4 = 7</text></g></svg>`);

function steps(cur) {
  const items = [L('Take a photo', 'Foto machen'), L('Check it', 'Prüfen'), L('Send to teacher', 'An Lehrerin senden')];
  return `<div class="steps">${items.map((t, i) => {
    const st = i < cur ? 'done' : i === cur ? 'cur' : '';
    return `<span class="s ${st}"><span class="n">${i < cur ? '✓' : i + 1}</span>${t}</span>${i < 2 ? '<span class="arrow">→</span>' : ''}`;
  }).join('')}</div>`;
}

function sUpload() {
  if (S.upload === 'check') return sShell('upload', `
    <a class="back" href="#/student/upload" data-a="retake">← ${L('Back', 'Zurück')}</a>
    ${steps(1)}
    <div class="f-title"><h1>${L('Does it look clear?', 'Ist es gut zu lesen?')} 🔎</h1><p style="font-size:16px">${L('Make sure you can read all your answers.', 'Schau, ob man alle deine Antworten lesen kann.')}</p></div>
    <div class="photo-card"><span class="page-tag">${L('Page 1 of 2', 'Seite 1 von 2')}</span><img src="${PHOTO || SAMPLE_PHOTO}" alt="${L('Your exam photo', 'Dein Foto')}"></div>
    <div class="thumbs"><span class="thumb"><div><b>✓</b></div>${L('Page 1', 'Seite 1')}</span><span class="thumb"><div><b>✓</b></div>${L('Page 2', 'Seite 2')}</span><label class="thumb add"><div>＋</div>${L('Add page', 'Seite dazu')}<input type="file" accept="image/*" hidden data-in="photo"></label></div>
    <div class="center" style="gap:10px"><button class="pbtn" data-a="sendExam">✓ ${L('Yes send it', 'Ja, abschicken')}</button><button class="pbtn sm-o" style="min-width:250px" data-a="retake">↺ ${L('Take it again', 'Nochmal machen')}</button></div>
    <p class="tipline">💡 ${L('Blurry? It’s okay to take it again!', 'Unscharf? Du kannst es nochmal machen!')}</p>
  `);
  if (S.upload === 'sent') return sShell('upload', `
    <a class="back" href="#/student/home">← ${L('Back', 'Zurück')}</a>
    ${steps(3)}
    <div class="circle-illu" style="background:var(--mint-bg);width:220px;height:220px;font-size:96px">✈️</div>
    <div class="f-title"><h1>${L('Sent to Ms. Rana!', 'An Frau Rana geschickt!')} 🎉</h1><p style="font-size:16px">${L('She’ll check it soon.', 'Sie schaut es sich bald an.')}<br>${L('We’ll tell you when your results are ready.', 'Wir sagen dir, wenn deine Ergebnisse da sind.')}</p></div>
    <div class="center"><a class="pbtn" style="height:52px;font-size:17px" href="#/student/home">🏠 ${L('Back Home', 'Zurück zum Start')}</a><button class="back" style="text-decoration:underline" data-a="uploadAnother">${L('Upload another exam', 'Noch eine Arbeit hochladen')}</button></div>
  `);
  return sShell('upload', `
    <a class="back" href="#/student/home">← ${L('Back home', 'Zurück zum Start')}</a>
    ${steps(0)}
    <div class="center" style="gap:8px"><h1 class="f-h1">${L('Let’s upload your exam!', 'Lade deine Arbeit hoch!')} 📄</h1><span class="fr-pill" style="align-self:center">${ic('book-open', 14)} ${L('Math exam · Ms. Rana', 'Mathe-Arbeit · Frau Rana')}</span></div>
    <label class="frame-box"><span class="page-tag">${L('Page 1 of 2', 'Seite 1 von 2')}</span><div class="corners"><span></span><div class="paper"><i style="width:30%;background:var(--sun);height:8px;border-radius:50%"></i><i></i><i style="width:70%"></i><i></i><i style="width:60%"></i></div></div><span class="sub">${L('Put your paper inside the frame', 'Leg dein Blatt in den Rahmen')}</span><input type="file" accept="image/*" capture="environment" hidden data-in="photo"></label>
    <div class="center" style="gap:10px">
      <label class="pbtn" style="height:52px;font-size:17px;cursor:pointer">📷 ${L('Take a photo', 'Foto machen')}<input type="file" accept="image/*" capture="environment" hidden data-in="photo"></label>
      <label class="pbtn sm-o" style="min-width:250px;cursor:pointer">🖼️ ${L('Pick a picture instead', 'Lieber ein Bild auswählen')}<input type="file" accept="image/*" hidden data-in="photo"></label>
    </div>
    <p class="tipline">💡 ${L('Find a bright spot and hold steady. You’ve got this!', 'Such einen hellen Platz und halt still. Du schaffst das!')}</p>
    <p class="tipline"><button class="muted" style="text-decoration:underline" data-a="samplePhoto">${L('Demo: use a sample photo', 'Demo: Beispielfoto nehmen')}</button></p>
  `);
}

/* ---------- My Grades ---------- */
function sGrades() {
  const t = total();
  const checked = (n) => `<div class="stack">${starsHTML(n, 4, 18)}${pill(L('Checked ✓', 'Geprüft ✓'), 'mint', '').replace('pill ', 'pill ')}</div>`;
  const rows = [];
  if (S.upload === 'sent') rows.push({ subj: 'math', icon: 'calculator', title: `${L('Math exam', 'Mathe-Arbeit')} · ${L('Today', 'Heute')}`, who: 'Ms. Rana', right: `<span style="color:var(--amber);font-size:13px;font-weight:600">${ic('clock', 14)} ${L('Ms. Rana is checking', 'Frau Rana prüft')} ⏳</span>` });
  rows.push(S.sent
    ? { subj: 'math', icon: 'calculator', title: `${L('Math exam', 'Mathe-Arbeit')} · 5 Nov ${!S.resultsSeen ? `<span class="newtag">${L('New!', 'Neu!')}</span>` : ''}`, who: 'Ms. Rana', right: checked(starsFromTotal(t)), href: '#/student/results' }
    : { subj: 'math', icon: 'calculator', title: `${L('Math exam', 'Mathe-Arbeit')} · 5 Nov`, who: 'Ms. Rana', right: `<span style="color:var(--amber);font-size:13px;font-weight:600">${ic('clock', 14)} ${L('Ms. Rana is checking', 'Frau Rana prüft')} ⏳</span>` });
  rows.push({ subj: 'english', icon: 'book-open', title: `${L('English exam', 'Englisch-Arbeit')} · 1 Nov`, who: 'Mr. Karim', right: checked(4) });
  rows.push({ subj: 'science', icon: 'flask-conical', title: `${L('Science exam', 'Sachkunde-Arbeit')} · 27 Oct`, who: 'Ms. Heba', right: checked(3) });
  rows.push({ subj: 'german', icon: 'languages', title: `${L('German exam', 'Deutsch-Arbeit')} · 22 Oct`, who: 'Frau Schmidt', right: checked(3) });
  rows.push({ subj: 'history', icon: 'landmark', title: `${L('History exam', 'Geschichts-Arbeit')} · 15 Oct`, who: 'Mr. Youssef', right: checked(2) });
  const f = S.gradeFilter || 'all';
  const list = rows.filter(r => f === 'all' || r.subj === f).map(r => {
    const inner = `<span class="eic">${ic(r.icon, 18)}</span><div class="grow"><b style="font-size:15px">${r.title}</b><p class="muted" style="font-size:13px">${r.who}</p></div>${r.right}<span class="muted">${ic('chevron-right', 18)}</span>`;
    return r.href ? `<a class="exam-card" href="${r.href}">${inner}</a>` : `<div class="exam-card">${inner}</div>`;
  }).join('');
  const chips = [['all', L('All', 'Alle')], ['math', L('Math', 'Mathe')], ['english', L('English', 'Englisch')], ['science', L('Science', 'Sachkunde')], ['history', L('History', 'Geschichte')], ['german', L('German', 'Deutsch')]]
    .map(([k, l]) => `<button class="fchip ${f === k ? 'on' : ''}" data-a="gradeFilter" data-v="${k}">${l}</button>`).join('');
  const grow = [
    [L('Multiplication', 'Mal-Rechnen'), L('Math', 'Mathe'), 90, 'var(--mint)', `<span style="color:var(--mint-text)">${L('Super strong', 'Super stark')} 💪</span>`],
    [L('Reading stories', 'Geschichten lesen'), L('English', 'Englisch'), 85, 'var(--mint)', `<span style="color:var(--mint-text)">${L('Super strong', 'Super stark')} 💪</span>`],
    [L('Plants', 'Pflanzen'), L('Science', 'Sachkunde'), 75, 'var(--mint)', `<span style="color:var(--mint-text)">${L('Doing great!', 'Läuft super!')}</span>`],
    [L('Fractions', 'Brüche'), L('Math', 'Mathe'), S.fractionsProgress, '#F59F00', `<span style="color:var(--amber)">${L('Getting better ↗', 'Wird besser ↗')}${S.practiceDone ? ' ' + L('Practiced 3 times', '3-mal geübt') : ''}</span>`],
    [L('Ancient Egypt', 'Altes Ägypten'), L('History', 'Geschichte'), 45, '#F59F00', `<span style="color:var(--amber)">${L('Let’s practice together', 'Lass uns zusammen üben')}</span>`],
  ].map(([n, s, p, c, lab]) => `<div class="grow-item"><div class="row between"><b style="font-size:15px">${n}</b><span class="muted" style="font-size:13px">${s}</span></div><div class="track"><span style="width:${p}%;background:${c}"></span></div><span style="font-size:13px">${lab}</span></div>`).join('');
  return sShell('grades', `
    <div><h1 class="f-h1">${L('My Grades', 'Meine Noten')} ⭐</h1><p class="sub">${L('Look how much you’re learning!', 'Schau, wie viel du lernst!')}</p></div>
    <div class="fchips">${chips}</div>
    <div class="cols">
      <div class="main-col" style="gap:10px"><h3 style="font-size:20px;font-weight:600">${L('My exams', 'Meine Arbeiten')}</h3>${list}<p class="muted">♡ ${L('Mom can see your grades too.', 'Mama kann deine Noten auch sehen.')}</p></div>
      <div class="side-col" style="width:320px"><div class="kcard" style="gap:14px"><h3 style="font-size:20px;font-weight:600">${L('How I’m growing', 'So wachse ich')} 🌱</h3>${grow}<a class="pbtn" style="min-width:0" href="#/student/practice">${L('Practice now →', 'Jetzt üben →')}</a></div></div>
    </div>
  `);
}

/* ---------- Results ---------- */
function notReady() {
  return sShell('results', `<div class="circle-illu" style="background:var(--amber-bg)">⏳</div><div class="f-title"><h1>${L('Not ready yet', 'Noch nicht fertig')}</h1><p>${L('Ms. Rana is still checking your exam.', 'Frau Rana schaut deine Arbeit noch an.')}</p></div><div class="center"><a class="pbtn" href="#/student/home">🏠 ${L('Back home', 'Zurück zum Start')}</a></div>`);
}

function sResults() {
  if (!S.sent) return notReady();
  if (!S.resultsSeen) { S.resultsSeen = true; save(); }
  const t = total();
  const chips = [0, 1, 2, 3, 4].map(k => Number(S.marks[k]) >= 3
    ? `<span class="achip">Q${k + 1} ${ic('check', 16)}</span>`
    : `<a class="achip look" href="#/student/question/${k + 1}">Q${k + 1} ${L('Look again', 'Nochmal ansehen')} 👁</a>`).join('');
  return sShell('results', `
    <a class="back" href="#/student/grades">← ${L('Back to my grades', 'Zurück zu meinen Noten')}</a>
    <div class="center" style="gap:10px"><h1 class="f-h1">${L('Your Math exam', 'Deine Mathe-Arbeit')} 🎉</h1>${pill(`${ic('circle-check', 14)} ${L('Checked by Ms. Rana', 'Von Frau Rana geprüft')}`, 'mint')}${starsHTML(starsFromTotal(t), 4, 48)}</div>
    <div class="p-grid2" style="max-width:740px;margin:0 auto;width:100%">
      <div class="kcard"><h3 style="font-size:18px;font-weight:600">${L('What you did great', 'Das hast du super gemacht')} ⭐</h3>
        <div class="ok-list"><div>${ic('circle-check', 18)}<span>${esc(omarText(0, S.lang))}</span></div><div>${ic('circle-check', 18)}<span>${L('Shading fractions — all correct!', 'Brüche anmalen — alles richtig!')}</span></div></div></div>
      <div class="practice-card"><h3>${L('Let’s practice', 'Lass uns üben')} 💪</h3><span class="lead">${L('You’re getting close with fractions!', 'Du bist bei Brüchen schon fast da!')}</span>
        <div class="row" style="gap:40px">${pizzaLabeled(3)}${pizzaLabeled(4)}</div>
        <span style="color:var(--amber);font-weight:500">${L('When the bottom number is bigger, the pieces are smaller!', 'Wenn die untere Zahl größer ist, sind die Stücke kleiner!')}</span>
        <a class="obtn" href="#/student/practice">${L('Lets practice fractions →', 'Brüche üben →')}</a></div>
    </div>
    <div class="center" style="gap:10px"><b style="font-size:18px">${L('Your answers', 'Deine Antworten')}</b><div class="row wrap" style="justify-content:center;gap:8px">${chips}</div><span class="muted">${L('Tap a question to see more', 'Tippe auf eine Frage für mehr')}</span></div>
  `);
}
const pizzaLabeled = n => `<div class="center" style="gap:4px">${pizza(n, 1, 76)}<b style="color:var(--amber)">1/${n}</b></div>`;

/* ---------- Question detail ---------- */
function sQuestion() {
  if (!S.sent) return notReady();
  const n = Number(route().param) === 5 ? 5 : 3;
  const q3 = n === 3;
  const chips = [1, 2, 3, 4, 5].map(k => k === n ? `<span class="achip cur">Q${k}</span>`
    : Number(S.marks[k - 1]) >= 3 ? `<span class="achip" style="border:1px solid var(--border)">Q${k} ${ic('check', 14)}</span>` : `<a class="achip look" href="#/student/question/${k}">Q${k}</a>`).join('');
  const left = q3 ? `
    <div class="wcard"><span class="cap">${L('The Question', 'Die Frage')}</span><p style="font-size:20px">${L('Which is bigger? Write < or >', 'Was ist größer? Schreib < oder >')}</p><p style="font-size:20px;font-weight:700">1/3 &nbsp;<span style="display:inline-block;width:18px;height:18px;border:2px solid var(--text);vertical-align:middle"></span>&nbsp; 1/4</p></div>
    <div class="wcard"><span class="cap">${L('Your answer', 'Deine Antwort')}</span><div class="hand" style="text-align:center;color:var(--text)">${esc(S.ocrAnswers[2])}</div><span class="cap">${L('You wrote', 'Du hast geschrieben')} ${esc(S.ocrAnswers[2])}</span></div>`
    : `
    <div class="wcard"><span class="cap">${L('The Question', 'Die Frage')}</span><p style="font-size:18px">${L('Mona cut a pizza into 4 pieces. Omar ate 3. What fraction did he eat?', 'Mona schneidet eine Pizza in 4 Stücke. Omar isst 3. Welchen Bruch hat er gegessen?')}</p></div>
    <div class="wcard"><span class="cap">${L('Your answer', 'Deine Antwort')}</span><div class="hand" style="text-align:center;color:var(--text)">${esc(S.ocrAnswers[4])}</div><span class="cap">${L('You wrote', 'Du hast geschrieben')} ${esc(S.ocrAnswers[4])}</span></div>`;
  const right = q3 ? `
    <div class="figure-card"><h3>${L('Let’s figure it out', 'Lass es uns herausfinden')} 💡</h3>
      <div class="row" style="justify-content:center;gap:40px">${pizzaLabeled(3)}${pizzaLabeled(4)}</div>
      <ol style="margin:0;padding-left:22px;display:flex;flex-direction:column;gap:4px">
        <li>${L('Look at the bottom numbers : 3 and 4', 'Schau auf die unteren Zahlen: 3 und 4')}</li>
        <li>${L('A bigger bottom number means smaller pieces', 'Eine größere untere Zahl heißt kleinere Stücke')}</li>
        <li>${L('So 1/3 is the bigger slice!', 'Also ist 1/3 das größere Stück!')}</li></ol>
      <div class="right-ans" style="font-size:14px">✓ ${L('The right answer is', 'Die richtige Antwort ist')} 1/3 > 1/4</div></div>`
    : `
    <div class="figure-card"><h3>${L('Let’s figure it out', 'Lass es uns herausfinden')} 💡</h3>
      <div class="center">${pizza(4, 3, 96)}<b style="color:var(--amber)">3/4</b></div>
      <ol style="margin:0;padding-left:22px;display:flex;flex-direction:column;gap:4px">
        <li>${L('Draw the pizza: 4 pieces', 'Mal die Pizza: 4 Stücke')}</li>
        <li>${L('Color the pieces Omar ate: 3', 'Mal die Stücke an, die Omar isst: 3')}</li>
        <li>${L('3 out of 4 pieces is 3/4!', '3 von 4 Stücken ist 3/4!')}</li></ol>
      <div class="right-ans" style="font-size:14px">✓ ${L('The right answer is', 'Die richtige Antwort ist')} 3/4</div></div>`;
  const prev = n === 3 ? 2 : 4, next = n === 3 ? 4 : null;
  return sShell('question', `
    <a class="back" href="#/student/results">← ${L('Back to my exams', 'Zurück zu meinen Arbeiten')}</a>
    <div class="row between wrap"><h1 class="f-h1">${L('Question', 'Frage')} ${n} · ${q3 ? L('Fractions', 'Brüche') + ' 🍕' : L('Word problems', 'Textaufgaben') + ' ✏️'}</h1><div class="row wrap" style="gap:8px">${chips}</div></div>
    <div class="p-grid2">
      <div class="col" style="gap:10px">${left}
        <div class="note-card"><div class="head"><span class="r">R</span>${L('Note from Ms. Rana', 'Notiz von Frau Rana')}</div><p style="font-size:15px">“${esc(omarText(q3 ? 1 : 2, S.lang))}”</p></div></div>
      <div class="col">${right}</div>
    </div>
    <div class="row between"><a class="back" href="#/student/results">← Q${prev}</a><button class="pbtn sm-o" style="min-width:210px" data-a="askOpen" data-v="exam">💬 ${L('Ask Ms. Rana', 'Frau Rana fragen')}</button>${next ? `<a class="back" href="#/student/results">Q${next} →</a>` : '<span></span>'}</div>
  `);
}

/* ---------- Practice ---------- */
function sPractice() {
  const p = S.practice, q = PRACTICE[p.i];
  const dots = PRACTICE.map((_, k) => `<span class="${k < p.i ? 'done' : k === p.i ? 'cur' : ''}"></span>`).join('');
  const correct = p.picked === q.ans;
  const btns = ['>', '<', '='].map(s => {
    let cls = '';
    if (p.picked === s) cls = correct ? 'on' : 'try';
    return `<button class="sq-btn ${cls}" data-a="pick" data-v="${s}" aria-label="${s}">${esc(s)}</button>`;
  }).join('');
  let fb = '';
  if (p.picked && correct) {
    const msg = q.ans === '='
      ? L('You got it! They’re the same size!', 'Richtig! Sie sind gleich groß!')
      : L(`You got it! 1/${q.a} is bigger, because ${q.a} is smaller than ${q.b}!`, `Richtig! 1/${q.a} ist größer, weil ${q.a} kleiner als ${q.b} ist!`);
    fb = `<div class="center" style="gap:12px"><span class="okmsg">🎉 ${msg}</span><button class="pbtn" data-a="nextQ">${p.i < PRACTICE.length - 1 ? L('Next Question →', 'Nächste Frage →') : L('Finish 🎉', 'Fertig 🎉')}</button></div>`;
  } else if (p.picked) fb = `<div class="center"><span class="trymsg">🤔 ${L('Not quite! Look at the pizzas again.', 'Noch nicht ganz! Schau dir die Pizzas nochmal an.')}</span></div>`;
  return sShell('practice', `
    <div class="row between"><a class="back" style="font-size:15px" href="#/student/results">✕ ${L('Stop practicing', 'Aufhören')}</a><span class="sub">${L('Fractions practice', 'Brüche üben')}</span></div>
    <div class="row" style="justify-content:center;gap:12px"><div class="pdots">${dots}</div><span class="sub">${L('Question', 'Frage')} ${p.i + 1} ${L('of', 'von')} 3</span></div>
    <h1 class="f-h1" style="text-align:center">${L('Which pizza slice is bigger?', 'Welches Pizzastück ist größer?')} 🍕</h1>
    <div class="pcard"><div>${pizza(q.a, 1, 96)}<div class="frac">1/${q.a}</div></div><div class="qbox">${p.picked && correct ? esc(q.ans) : '?'}</div><div>${pizza(q.b, 1, 96)}<div class="frac">1/${q.b}</div></div></div>
    <div class="row" style="justify-content:center;gap:12px">${btns}</div>
    ${fb}
    ${p.picked && correct ? '' : `<div class="row" style="justify-content:center;gap:12px"><button class="pbtn sm-o" data-a="hint">💡 ${L('Give me a hint', 'Gib mir einen Tipp')}</button><button class="pbtn sm-o" data-a="askOpen" data-v="practice">🙋 ${L('I’m stuck', 'Ich komme nicht weiter')}</button></div>`}
  `);
}

function sDone() {
  const r = S.practice.right;
  return sShell('done', `
    <div class="pdots"><span class="done" style="width:10px;height:10px"></span><span class="done" style="width:10px;height:10px"></span><span class="done" style="width:10px;height:10px"></span></div>
    <div class="circle-illu" style="background:var(--hint-bg);width:120px;height:120px;font-size:56px">💡</div>
    <div class="center" style="gap:6px"><h1 class="f-h1">${L('Amazing work, Omar!', 'Super gemacht, Omar!')} 🎉</h1>${starsHTML(Math.max(r, 1), 3, 18)}<p class="sub">${L(`You got ${r} out of 3 right!`, `Du hattest ${r} von 3 richtig!`)}</p></div>
    <div class="kcard" style="max-width:300px;margin:0 auto;width:100%;gap:8px;padding:16px 20px;border-radius:14px"><div class="row between"><b>${L('Fractions', 'Brüche')}</b><span style="color:var(--amber);font-weight:600;font-size:14px">${L('Getting better ↗', 'Wird besser ↗')}</span></div><div class="track"><span style="width:${S.fractionsProgress}%;background:#F59F00"></span></div></div>
    <p class="tipline">${L('Ms. Rana will see that you practiced', 'Frau Rana sieht, dass du geübt hast')} 💚</p>
    <div class="row" style="justify-content:center;gap:12px"><button class="pbtn sm-o" style="height:52px;min-width:170px" data-a="practiceAgain">↺ ${L('Practice again', 'Nochmal üben')}</button><a class="pbtn" style="height:52px;min-width:170px" href="#/student/home">🏠 ${L('Back home', 'Zurück zum Start')}</a></div>
  `);
}

/* ---------- Messages ---------- */
function sMessages() {
  const last = S.studentChat[S.studentChat.length - 1];
  const inbox = [
    ['R', 'var(--teal)', 'Ms. Rana', L('Math', 'Mathe'), chatText(last), true],
    ['K', 'var(--violet-2)', 'Mr. Karim', L('English', 'Englisch'), L('Great job on your English exam ⭐', 'Toll gemacht in Englisch ⭐')],
    ['S', 'var(--green)', 'Frau Schmidt', 'Deutsch', 'Super gemacht, Omar! 🇩🇪'],
    ['H', '#F76707', 'Ms. Heba', L('Science', 'Sachkunde'), L('Don’t forget your plant project 🌱', 'Denk an dein Pflanzen-Projekt 🌱')],
  ].map(([l, c, n, s, t, on]) => `<div class="it ${on ? 'on' : ''}" ${on ? '' : 'data-a="otherThread"'}><span class="avatar" style="background:${c}">${l}</span><div class="grow"><b>${n}</b> <span class="muted">· ${s}</span><p class="t">${esc(t)}</p></div>${on && S.sent && !S.resultsSeen ? '<span class="unread"></span>' : ''}</div>`).join('');
  const bubbles = S.studentChat.map(m => m.me
    ? `<div class="tb">${esc(chatText(m))}</div>`
    : `<div class="gb"><span>${esc(chatText(m))}</span>${m.link ? `<a class="pbtn" style="height:34px;min-width:0;font-size:13px;align-self:flex-start" href="#/student/results">${L('See my results →', 'Meine Ergebnisse →')}</a>` : ''}</div>`).join('');
  return sShell('messages', `
    <h1 class="f-h1">${L('My Messages', 'Meine Nachrichten')} 💌</h1>
    <div class="sms"><div class="list">${inbox}</div>
      <div class="thread"><div class="thread-head row" style="gap:10px"><span class="avatar" style="background:var(--teal)">R</span><div><b>Ms. Rana</b><p class="muted" style="font-size:12px">${L('Math teacher', 'Mathe-Lehrerin')}</p></div></div>
        ${bubbles}
        ${S.asked ? `<span class="sent-note">${L('Sent ✓ · She usually answers within a day', 'Gesendet ✓ · Sie antwortet meist innerhalb eines Tages')}</span>` : ''}
        <div class="composer2"><input id="chat-in" placeholder="${L('Write a message...', 'Schreib eine Nachricht...')}" aria-label="${L('Message', 'Nachricht')}"><button class="rbtn o" data-a="mic" aria-label="${L('Voice message', 'Sprachnachricht')}">${ic('mic', 18)}</button><button class="rbtn t" data-a="chatSend" aria-label="${L('Send', 'Senden')}">${ic('send-horizontal', 18)}</button></div>
      </div></div>
  `);
}

/* ---------- Popups ---------- */
function askModal(from) {
  openModal(`
    <button class="xbtn" data-a="closeModal" aria-label="${L('Close', 'Schließen')}">X</button>
    <div class="row" style="gap:10px"><span class="avatar" style="background:var(--teal)">R</span><h2>${L('Ask Ms Rana', 'Frau Rana fragen')} 💬</h2></div>
    <span class="fr-pill">${from === 'practice' ? L('About : Fractions practice 🍕', 'Zu: Brüche üben 🍕') : L('About : Fractions 🍕', 'Zu: Brüche 🍕')}</span>
    <div class="row wrap" style="gap:8px"><button class="akchip" data-a="fillAsk">${L('I don’t understand 🤔', 'Ich verstehe das nicht 🤔')}</button><button class="akchip" data-a="fillAsk">${L('Can you explain again?', 'Kannst du es nochmal erklären?')}</button></div>
    <input id="ask-text" class="ask-input" value="${L('Why is 1/3 bigger than 1/4?', 'Warum ist 1/3 größer als 1/4?')}" aria-label="${L('Your question', 'Deine Frage')}">
    <div class="row"><button class="rbtn o" style="width:46px;height:46px" data-a="mic" aria-label="${L('Voice message', 'Sprachnachricht')}">${ic('mic', 20)}</button><button class="pbtn grow" style="min-width:0" data-a="askSend">${L('Send', 'Senden')} ➤</button></div>
  `, { cls: 'kid wide' });
}

function hintModal() {
  openModal(`
    <button class="xbtn" data-a="closeModal" aria-label="${L('Close', 'Schließen')}">X</button>
    <div class="bulb">💡</div>
    <h2>${L('Here’s a hint!', 'Hier ist ein Tipp!')}</h2>
    <div class="hintbox">${L('Remember: a bigger bottom number means smaller pieces', 'Denk dran: Eine größere untere Zahl heißt kleinere Stücke')} 🍕</div>
    <div class="row" style="gap:48px"><div class="center" style="gap:4px">${pizza(2, 1, 72)}<span class="muted" style="font-size:12px">1/2 · ${L('2 pieces', '2 Stücke')}</span></div><div class="center" style="gap:4px">${pizza(6, 1, 72)}<span class="muted" style="font-size:12px">1/6 · ${L('6 pieces', '6 Stücke')}</span></div></div>
    <p class="sub">${L('Which pizza is cut into fewer pieces? 🤔', 'Welche Pizza hat weniger Stücke? 🤔')}</p>
    <button class="pbtn full" data-a="closeModal">${L('Okay, got it! 👍', 'Okay, verstanden! 👍')}</button>
  `, { cls: 'kid center' });
}

/* ---------- Actions ---------- */
Object.assign(ACTIONS, {
  setLang(el) { S.lang = el.dataset.v; save(); render(); },
  samplePhoto() { PHOTO = null; S.upload = 'check'; save(); render(); },
  retake(el, e) { if (e) e.preventDefault(); PHOTO = null; S.upload = 'none'; save(); render(); },
  sendExam() { S.upload = 'sent'; save(); render(); },
  uploadAnother() { PHOTO = null; S.upload = 'none'; save(); render(); },
  gradeFilter(el) { S.gradeFilter = el.dataset.v; save(); render(); },
  pick(el) {
    const p = S.practice;
    if (p.picked === PRACTICE[p.i].ans) return;
    if (!p.picked && el.dataset.v === PRACTICE[p.i].ans) p.right++;
    p.picked = el.dataset.v; save(); render();
  },
  nextQ() {
    const p = S.practice;
    if (p.i < PRACTICE.length - 1) { p.i++; p.picked = null; save(); render(); }
    else { S.practiceDone = true; S.fractionsProgress = 65; save(); go('#/student/done'); }
  },
  practiceAgain() { S.practice = { i: 0, picked: null, right: 0 }; save(); go('#/student/practice'); },
  hint() { hintModal(); },
  askOpen(el) { askModal(el.dataset.v); },
  fillAsk(el) { document.getElementById('ask-text').value = el.textContent; },
  mic() { toast(L('Recording… (demo)', 'Aufnahme… (Demo)')); },
  otherThread() { toast(L('Only Ms. Rana’s chat is in this demo', 'In der Demo gibt es nur den Chat mit Frau Rana')); },
  askSend() {
    const text = document.getElementById('ask-text').value.trim();
    if (!text) { toast(L('Write your question first', 'Schreib zuerst deine Frage')); return; }
    S.asked = true; S.askedText = text; S.studentChat.push({ me: true, text }); save();
    openModal(`<div class="bulb" style="background:var(--mint-bg)">✉️</div><h2>${L('Sent to Ms. Rana!', 'An Frau Rana geschickt!')} 💚</h2><p class="sub">${L('She usually answers within a day.', 'Sie antwortet meistens innerhalb eines Tages.')}</p><button class="pbtn full" data-a="closeModal">${L('Okay 👍', 'Okay 👍')}</button>`, { cls: 'kid center' });
  },
  chatSend() {
    const v = document.getElementById('chat-in').value.trim();
    if (!v) return;
    S.studentChat.push({ me: true, text: v }); S.asked = true; S.askedText = v; save(); render();
  },
});

Object.assign(INPUTS, {
  photo(el, type) {
    if (type !== 'change' || !el.files || !el.files[0]) return;
    PHOTO = URL.createObjectURL(el.files[0]);
    S.upload = 'check'; save(); render();
  },
});

const STUDENT_VIEWS = { home: sHome, upload: sUpload, grades: sGrades, results: sResults, question: sQuestion, practice: sPractice, done: sDone, messages: sMessages };
