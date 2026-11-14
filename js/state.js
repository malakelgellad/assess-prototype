/* Demo state shared by the student, teacher and parent views.
   Everything lives in the browser (localStorage). There is no backend. */

const STORE_KEY = 'assess-demo-v1';

const PRACTICE = [
  { a: 3, b: 4, ans: '>' },   // 1/3 vs 1/4 (the exam question)
  { a: 2, b: 2, ans: '=' },   // 1/2 vs 1/2
  { a: 2, b: 6, ans: '>' },   // 1/2 vs 1/6
];

const QUESTIONS = [
  { q: 'Add 1/5 + 2/5', read: '3/5', hand: '3/5', topic: 'Fractions · adding' },
  { q: 'Shade 3/8 of the shape', read: '3 of 8 parts shaded', hand: '▣▣▣□□□□□', topic: 'Fractions · shading' },
  { q: 'Which is bigger? Write > or <   1/3 __ 1/4', read: '1/3 < 1/4', hand: '1/3 < 1/4', topic: 'Fractions · comparing', lowConf: '<' },
  { q: 'Put in order from smallest to biggest: 1/2, 1/4, 3/4', read: '1/4, 1/2, 3/4', hand: '1/4 , 1/2 , 3/4', topic: 'Fractions · ordering' },
  { q: 'Mona cut a pizza into 4 pieces. Omar ate 3. What fraction did he eat?', read: '3 + 4 = 7', hand: '3 + 4 = 7', topic: 'Word problems · setup' },
];

/* Feedback the AI drafts. Index 0/1 = the two versions "Regenerate" switches between. */
const OMAR_DRAFTS = [
  { label: 'What you did great · Q1, Q2, Q4', versions: [
    { en: 'You’re great at adding fractions! ⭐', de: 'Du kannst Brüche super addieren! ⭐' },
    { en: 'Adding fractions is your superpower! ⭐', de: 'Brüche addieren ist deine Superkraft! ⭐' } ] },
  { label: 'Q3 · Fractions · comparing', versions: [
    { en: 'Great try, Omar! Remember the pizza trick 🍕', de: 'Toller Versuch, Omar! Denk an den Pizza-Trick 🍕' },
    { en: 'So close, Omar! More slices means smaller slices 🍕', de: 'Fast, Omar! Mehr Stücke heißt kleinere Stücke 🍕' } ] },
  { label: 'Q5 · Word problems · setup', versions: [
    { en: 'Read the story slowly and draw it first ✏️', de: 'Lies die Geschichte langsam und mal sie zuerst ✏️' },
    { en: 'Draw the story first, then find the fraction ✏️', de: 'Mal zuerst die Geschichte, dann finde den Bruch ✏️' } ] },
];

const TEACHER_NOTES = [
  { label: 'Q3 · Fractions · comparing', text: 'Misconception: compares unit fractions by denominator size (larger denominator → larger fraction). Same error in Sep and Oct exams. Suggest area or pizza models.' },
  { label: 'Q4 · Alternative method', text: 'Used a number line instead of common denominators. Reasoning is correct, so full marks can be given.' },
  { label: 'Q5 · Word problems · setup', text: 'Wrote 3 + 4 instead of 3/4. Struggles to turn the story into a fraction. New this exam.' },
];

const MONA_DRAFTS = [
  { label: 'This week', en: 'Omar did well this week: 3 of 4 stars. ⭐', de: 'Omar hat diese Woche gut gearbeitet: 3 von 4 Sternen. ⭐' },
  { label: 'Fractions', en: 'He’s still learning which fraction is bigger. At home, cut a paper circle into halves, thirds and quarters, and ask him which piece is bigger.', de: 'Er lernt noch, welcher Bruch größer ist. Schneiden Sie zu Hause einen Papierkreis in Halbe, Drittel und Viertel und fragen Sie ihn, welches Stück größer ist.' },
  { label: 'Practice', en: 'Ms. Rana sent him 3 short practice questions in the app.', de: 'Frau Rana hat ihm 3 kurze Übungsaufgaben in der App geschickt.' },
];

function defaultState() {
  return {
    lang: 'en',                         // student + parent interface language
    upload: 'none',                     // none | check | sent
    photo: null,
    ocrCurrent: 2,                      // index of the question open on the OCR screen
    ocrConfirmed: [true, true, false, false, false],
    ocrAnswers: QUESTIONS.map(q => q.read),
    ai: [4, 4, 1, 2, 2],
    marks: [4, 4, 1, 2, 2],
    altMethod: false,
    aiNoteQ3: 'Compared denominators instead of piece size: thinks a larger denominator means a larger fraction.',
    flag: 'pending',                    // pending | confirmed | dismissed
    fbTab: 'omar',
    fbLang: 'en',
    omar: OMAR_DRAFTS.map(() => ({ v: 0, custom: {}, edited: false })),
    sent: false,
    sendOmar: true,
    sendMona: true,
    assignPractice: true,
    queueFilter: 'all',
    groupAssigned: false,
    followUp: true,
    practice: { i: 0, picked: null, right: 0 },
    practiceDone: false,
    fractionsProgress: 50,
    asked: false,
    askedText: '',
    officeHours: null,
    studentChat: [
      { me: false, text: 'Hi Omar! I got your Math exam photo. I’m checking it now ⏳', de: 'Hallo Omar! Ich habe das Foto deiner Mathe-Arbeit. Ich schaue sie gerade an ⏳' },
    ],
    parentChat: [
      { me: false, text: 'Hello Mona, Omar’s Math exam from 5 Nov is being checked. I’ll send his results soon.', de: 'Hallo Mona, Omars Mathe-Arbeit vom 5. Nov wird gerade geprüft. Ich schicke die Ergebnisse bald.' },
    ],
    meetMode: 'person',
    gradeFilter: 'all',
  };
}

let S = load();

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return Object.assign(defaultState(), JSON.parse(raw));
  } catch (e) { /* storage unavailable: keep in memory */ }
  return defaultState();
}

function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch (e) { /* ignore */ }
}

function resetDemo() {
  S = defaultState();
  save();
}

/* ---------- derived values ---------- */
const total = () => S.marks.reduce((a, b) => a + Number(b || 0), 0);
const aiTotal = () => S.ai.reduce((a, b) => a + b, 0);
const starsFromTotal = t => Math.round((t / 20) * 4);
const percent = () => Math.round((total() / 20) * 100);

function omarText(i, lang) {
  const item = S.omar[i];
  if (item.custom && item.custom[lang]) return item.custom[lang];
  return OMAR_DRAFTS[i].versions[item.v][lang];
}
