/* ===================== Router, demo bar, events ===================== */

function route() {
  const parts = (location.hash || '#/').replace(/^#\/?/, '').split('/').filter(Boolean);
  return { role: parts[0] || '', page: parts[1] || '', param: parts[2] || '' };
}

function demoBar(role) {
  const link = (r, label, href) => `<a href="${href}" class="${role === r ? 'on' : ''}">${label}</a>`;
  return `<div class="demo-inner">
    <a class="brand" href="#/" style="color:#fff">Assess · prototype</a>
    <a href="#/" class="${role === '' ? 'on' : ''}">Login</a><span style="color:#868E96">View as</span>
    ${link('student', 'Omar (student)', '#/student/home')}
    ${link('teacher', 'Ms. Rana (teacher)', '#/teacher/dashboard')}
    ${link('parent', 'Mona (parent)', '#/parent/overview')}
    <span class="spacer"></span>
    <button data-a="reset">Reset demo</button>
  </div>`;
}

/* ===================== Login ===================== */
const LOGIN = {
  student: {
    accent: 'var(--teal)', home: '#/student/home', icon: 'backpack', label: 'Student',
    title: 'Hi there! 👋', sub: 'Log in to see your exams and stars.',
    f1: ['Your username', 'omar.k', 'user'], f2: ['Your secret word', 'pizza123', 'key-round'],
    btn: 'Let’s go! →', help: 'Forgot your secret word? Ask your teacher.',
  },
  teacher: {
    accent: 'var(--indigo)', home: '#/teacher/dashboard', icon: 'presentation', label: 'Teacher',
    title: 'Welcome back', sub: 'Log in to grade, review and send feedback.',
    f1: ['School email', 'rana@school.edu.eg', 'mail'], f2: ['Password', 'password', 'lock'],
    btn: 'Log in', help: 'Forgot password?',
  },
  parent: {
    accent: 'var(--teal)', home: '#/parent/overview', icon: 'heart-handshake', label: 'Parent',
    title: 'Welcome, parent', sub: 'Log in to follow your child’s progress.',
    f1: ['Email or phone number', 'mona@email.com', 'phone'], f2: ['Password', 'password', 'lock'],
    btn: 'Log in', help: 'Forgot password? We’ll send a code on WhatsApp.',
  },
};

function landing() {
  const r = S.loginRole || 'student', c = LOGIN[r];
  const toggle = Object.entries(LOGIN).map(([k, v]) =>
    `<button class="${k === r ? 'on' : ''}" style="${k === r ? `background:${v.accent}` : ''}" data-a="loginRole" data-v="${k}" role="tab" aria-selected="${k === r}">${ic(v.icon, 18)}${v.label}</button>`).join('');
  return `<div class="login">
    <section class="login-brand" style="background:${c.accent}">
      <div class="login-logo">Assess</div>
      <h1>Exam feedback every child can understand.</h1>
      <p>AI reads and grades the exam. The teacher checks every step. Students and parents get feedback written for them.</p>
      <div class="login-art" aria-hidden="true"><span>⭐</span><span>🍕</span><span>📝</span></div>
    </section>
    <section class="login-panel">
      <form class="login-card ${r}" data-a="noop" onsubmit="return false">
        <div class="login-toggle" role="tablist" aria-label="Log in as">${toggle}</div>
        <div><h2>${c.title}</h2><p class="sub">${c.sub}</p></div>
        <label class="login-field"><span>${c.f1[0]}</span><div>${ic(c.f1[2], 18)}<input id="login-1" value="${c.f1[1]}" autocomplete="username"></div></label>
        <label class="login-field"><span>${c.f2[0]}</span><div>${ic(c.f2[2], 18)}<input id="login-2" type="password" value="${c.f2[1]}" autocomplete="current-password"></div></label>
        ${r === 'teacher' ? `<label class="check" style="font-size:14px"><input type="checkbox" checked> Keep me logged in on this computer</label>` : ''}
        <button class="login-btn" style="background:${c.accent}" data-a="login">${c.btn}</button>
        <p class="muted" style="text-align:center">${c.help}</p>
        <div class="row" style="justify-content:center;gap:6px;font-size:13px"><span class="muted">Language:</span><button class="link" style="color:${c.accent}" data-a="setLang" data-v="en">English</button><span class="muted">·</span><button class="link" style="color:${c.accent}" data-a="setLang" data-v="de">Deutsch</button></div>
      </form>
    </section>
  </div>`;
}

function render() {
  const { role, page } = route();
  document.getElementById('demo-bar').innerHTML = demoBar(role);
  let html;
  if (role === 'teacher') html = (TEACHER_VIEWS[page] || TEACHER_VIEWS.dashboard)();
  else if (role === 'student') html = (STUDENT_VIEWS[page] || STUDENT_VIEWS.home)();
  else if (role === 'parent') html = (PARENT_VIEWS[page] || PARENT_VIEWS.overview)();
  else html = landing();
  document.getElementById('app').innerHTML = html;
  refreshIcons();
}

function go(hash) {
  if (location.hash === hash) render(); else location.hash = hash;
}

/* ---------- shared + teacher actions ---------- */
Object.assign(ACTIONS, {
  reset() { resetDemo(); closeModal(); go('#/'); toast('Demo reset'); },
  noop() {},
  loginRole(el) { S.loginRole = el.dataset.v; save(); render(); },
  login(el, e) {
    if (e) e.preventDefault();
    const a = document.getElementById('login-1').value.trim(), b = document.getElementById('login-2').value.trim();
    if (!a || !b) { toast('Fill in both fields to log in'); return; }
    go(LOGIN[S.loginRole || 'student'].home);
  },
  logout() { go('#/'); toast('Logged out'); },
  closeModal() { closeModal(); },
  closeModalOutside(el, e) { if (e.target === el) closeModal(); },
  demoOnly() { toast('Not part of this prototype — follow Omar’s exam'); },
  export() { toast('Grades exported to Grade3_Math_5Nov.csv'); },
  remind(el) { toast(`Reminder sent to ${el.dataset.v}`); },
  filter(el) { S.queueFilter = el.dataset.v; save(); render(); },
  ocrGo(el) { S.ocrCurrent = Number(el.dataset.v); save(); render(); },
  ocrPrev() { if (S.ocrCurrent > 0) { S.ocrCurrent--; save(); render(); } else go('#/teacher/queue'); },
  ocrConfirm() {
    S.ocrConfirmed[S.ocrCurrent] = true;
    const next = S.ocrConfirmed.findIndex(c => !c);
    save();
    if (next === -1) { toast('All 5 answers confirmed'); go('#/teacher/grading'); }
    else { S.ocrCurrent = next; save(); render(); }
  },
  zoom(el) {
    const inner = document.getElementById('scan-inner');
    const cur = Number(inner.dataset.z || 1);
    const z = Math.min(1.6, Math.max(0.8, cur + Number(el.dataset.v) * 0.2));
    inner.dataset.z = z;
    inner.style.transform = `scale(${z})`;
    inner.style.transformOrigin = 'left top';
    document.getElementById('zoomv').textContent = Math.round(z * 100) + '%';
  },
  flag(el) { S.flag = el.dataset.v; save(); render(); },
  altMethod() {
    S.altMethod = !S.altMethod;
    S.marks[3] = S.altMethod ? 4 : S.ai[3];
    save(); render();
  },
  fbTab(el) { S.fbTab = el.dataset.v; save(); render(); },
  fbLang(el) { S.fbLang = el.dataset.v; save(); render(); },
  regen() {
    S.omar.forEach(o => { if (!o.edited) o.v = 1 - o.v; });
    save(); render(); toast('AI drafts regenerated · your edits were kept');
  },
  chk(el) { S[el.dataset.v] = el.checked; save(); },
  saveDraft() { toast('Draft saved'); },
  send() {
    if (S.flag === 'pending') { toast('Confirm or dismiss the red flag first'); go('#/teacher/grading'); return; }
    S.sent = true;
    if (S.sendOmar) {
      S.studentChat.push({ me: false, text: 'Your Math results are ready! 🎉 Great try on fractions, let’s practice together', de: 'Deine Mathe-Ergebnisse sind da! 🎉 Toller Versuch bei Brüchen, lass uns zusammen üben', link: 'results' });
      if (S.assignPractice) S.studentChat.push({ me: false, text: 'I added a fractions practice for you 🍕', de: 'Ich habe dir eine Bruch-Übung hinzugefügt 🍕' });
    }
    if (S.sendMona) S.parentChat.push({ me: false, text: 'Hi Mona, Omar’s math exam has been graded. He’s doing well overall, and I’ve flagged fractions so we can work on them together. You’ll find tips in his report.', de: 'Hallo Mona, Omars Mathe-Arbeit ist bewertet. Insgesamt macht er das gut. Ich habe Brüche markiert, damit wir zusammen daran arbeiten. Tipps finden Sie in seinem Bericht.' });
    save(); render(); sentModal();
  },
  planReexplain() { toast('Added to your plan: re-explain fractions · Mon 16 Nov'); },
  assignOpen() { assignModal(); },
  assignDo() { S.groupAssigned = true; save(); closeModal(); render(); toast('Practice assigned · 11 students and their parents notified'); },
  followUp() { S.followUp = !S.followUp; save(); render(); },
  reply() { toast('Reply box opens here in the full product'); },
});

Object.assign(INPUTS, {
  search(el) {
    const q = el.value.toLowerCase();
    document.querySelectorAll('table.q tbody tr').forEach(tr => { tr.style.display = tr.textContent.toLowerCase().includes(q) ? '' : 'none'; });
  },
  ocrAnswer(el, type) { S.ocrAnswers[S.ocrCurrent] = el.value; save(); if (type === 'change') render(); },
  mark(el, type) {
    const k = Number(el.dataset.v);
    S.marks[k] = Math.max(0, Math.min(4, Number(el.value) || 0));
    save(); if (type === 'change') render();
  },
  aiNote(el) { S.aiNoteQ3 = el.innerText; save(); },
  omarText(el) {
    const i = Number(el.dataset.v);
    S.omar[i].custom[S.fbLang] = el.innerText.trim();
    S.omar[i].edited = true;
    save();
  },
});

/* ---------- event wiring ---------- */
document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]');
  if (!el) return;
  const fn = ACTIONS[el.dataset.a];
  if (!fn) return;
  if (el.tagName === 'BUTTON' || el.dataset.a === 'closeModalOutside' || el.tagName === 'DIV' || el.tagName === 'SPAN') { /* fine */ }
  fn(el, e);
});
['input', 'change'].forEach(type => document.addEventListener(type, e => {
  const el = e.target.closest('[data-in]');
  if (el && INPUTS[el.dataset.in]) INPUTS[el.dataset.in](el, type);
}));
document.addEventListener('focusout', e => {
  if (e.target.matches && e.target.matches('[data-in="omarText"]')) render();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
window.addEventListener('hashchange', () => { closeModal(); render(); window.scrollTo(0, 0); });

render();
