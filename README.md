# Assess – AI exam feedback for Grades 1–5

Interactive prototype for CSEN 909 Human Computer Interaction, Milestone 3.
Team Cult · German University in Cairo · Winter 2026.

**Live demo:** https://<username>.github.io/<repository-name>/

**Team:** Elissa Wael, Kenzy Yasser, Malak Wael, Omar Sameh, Marwan Abouelsoud 

The full workflow runs in the browser: student uploads exam → OCR → teacher verifies the extracted text → AI grading → teacher confirms or overrides → learning gaps and red flags → personalized feedback → student and parent view the results.

**Unique feature – child-facing translation layer:** every result has three versions, technical for the teacher, simple and encouraging for the student (adapted to grade and language), and plain for the parent. The teacher reviews and edits each version before anything is sent.

Plain HTML, CSS and JavaScript. No backend and no build step. AI output (OCR, grades, feedback) is mock data, kept in the browser (`localStorage`).

## Links

| | |
|---|---|
| Figma designs | <Figma link> |
| Video walkthrough | <Google Drive link> |
| HTDs (FigJam) | <FigJam link> |

## The three views

| Role | Who | What they can do |
|---|---|---|
| Student | Omar, Grade 3, age 8 | Upload an exam photo, see grades as stars, open feedback written for his age, practice fractions with hints, ask Ms. Rana a question. English or German. |
| Teacher | Ms. Rana, Grade 3 Math | Class queue, check every AI-read answer (OCR), override marks, accept an alternative method, confirm or dismiss red flags, approve feedback for herself, Omar and Mona, see class insights and focus groups, assign practice. |
| Parent | Mona, Omar's mother | See Omar's progress, a WhatsApp-style summary, tips for home, request office hours. English or German. |

The views share one demo state. What Ms. Rana approves and sends is what Omar and Mona see, and Omar's questions and Mona's office-hours requests reach Ms. Rana.

## Run it locally

**Option 1:** download or clone the repository and double-click `index.html`. It opens in your browser. An internet connection is needed only for the fonts.

**Option 2:** serve the folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## How to test it

Click **Reset demo** in the top bar first. Then:

1. **Login** → choose **Student** with the toggle (fields are pre-filled) → Let's go!
2. **Omar** → Upload my exam → *Demo: use a sample photo* → Yes send it. Then **Log out**.
3. **Login as Teacher** → Start reviewing → confirm the AI-read answers (Q3 has a low-confidence `<`).
4. Grading: turn on *Accept alternative method* on Q4 (13 → 15/20), confirm the red flag, then *Next: write feedback*.
5. Feedback: switch between *For you / For Omar / For Mona*, edit Omar's note, try *Regenerate* and *DE*, then *Approve and send*. Log out.
6. **Login as Student** → results (3 of 4 stars) → Q3 *Look again* shows Ms. Rana's edited note → ask Ms. Rana → complete the practice. Log out.
7. **Login as Parent** → WhatsApp summary → Progress → request office hours. Log out.
8. **Login as Teacher** → the dashboard shows Omar's question and Mona's request, the student profile shows the practice is completed → Insights → assign practice to a focus group.

Switch **EN | DE** on any student or parent screen to see the German version.

## Put it on GitHub Pages

1. Upload the contents of this folder to a public repository, so `index.html` is at the top level.
2. **Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch `main`, folder `/ (root)`.
3. The site appears at `https://<username>.github.io/<repository-name>/` after about a minute.

## Files

```
index.html        page shell and script order
css/styles.css    design tokens and all styles
js/state.js       mock data and shared demo state
js/ui.js          small helpers (icons, pills, stars, pizzas, modal, toast)
js/teacher.js     teacher screens
js/student.js     student screens
js/parent.js      parent screens
js/app.js         router, demo bar, event handling
vendor/           Lucide icons (ISC license)
```

## Use of AI

The interaction design, personas, task analyses and screen designs are the team's own work, based on our Milestone 1 and 2 research. The front-end code was written with the help of Claude (Anthropic). Screenshots of the chats are with the HTD's

Fonts: Lexend and Caveat from Google Fonts. Icons: [Lucide](https://lucide.dev).
