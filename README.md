# Assess – AI exam feedback for Grades 1–5

Interactive front-end prototype for CSEN 909 (Human Computer Interaction), Milestone 3 bonus.
Team Cult · German University in Cairo · Winter 2026.

Plain HTML, CSS and JavaScript. No backend and no build step. All data is mock data kept in the browser (`localStorage`).

## The three views

| Role | Who | What they can do |
|---|---|---|
| Student | Omar, Grade 3, age 8 | Upload an exam photo, see grades as stars, open feedback written for his age, practice fractions with hints, ask Ms. Rana a question. English or German. |
| Teacher | Ms. Rana, Grade 3 Math | Class queue, check every AI-read answer (OCR), override marks, accept an alternative method, confirm red flags, approve feedback for herself, Omar and Mona, see class insights and focus groups, assign practice. |
| Parent | Mona, Omar's mother | See Omar's progress, a WhatsApp-style summary, tips for home, request office hours. English or German. |

The views share one demo state. What Ms. Rana approves and sends is what Omar and Mona see, and Omar's questions and Mona's office-hours requests reach Ms. Rana.

## Suggested walkthrough (for the video)

1. **Login** → pick Student, Teacher or Parent with the toggle (fields are pre-filled) → Log in. Use **Log out** to switch.
1. **Omar** → Upload my exam → *Demo: use a sample photo* → Yes send it.
2. **Ms. Rana** → Start reviewing → confirm the AI-read answers (Q3 has a low-confidence `<`).
3. Grading: turn on *Accept alternative method* on Q4 (13 → 15/20), confirm the red flag, then *Next: write feedback*.
4. Feedback: switch between *For you / For Omar / For Mona*, edit Omar's note, try *Regenerate* and *DE*, then *Approve and send*.
5. **Omar** → results (3 of 4 stars) → Q3 *Look again* shows Ms. Rana's edited note → practice → ask Ms. Rana.
6. **Mona** → WhatsApp summary → request office hours.
7. **Ms. Rana** → dashboard shows Omar's question and Mona's request. Insights → assign practice to a focus group.

Use **Reset demo** in the top bar to start again.

## Run it locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Put it on GitHub Pages

1. Create a repository and upload the contents of this folder (so `index.html` is at the top level).
2. Repository **Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch `main`, folder `/ (root)`.
3. The site appears at `https://<your-username>.github.io/<repository-name>/` after a minute.

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

Fonts: Lexend and Caveat from Google Fonts. Icons: [Lucide](https://lucide.dev).
