/* Small shared UI helpers. */

/* Click handlers (data-a="name") and input handlers (data-in="name"), registered by each view file. */
const ACTIONS = {};
const INPUTS = {};

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* Lucide icon placeholder; lucide.createIcons() swaps it for an SVG after each render. */
const ic = (name, size = 20, cls = '') => `<i data-lucide="${name}" class="ic ${cls}" style="width:${size}px;height:${size}px"></i>`;

/* Student and parent copy in English or German. */
const L = (en, de) => (S.lang === 'de' ? de : en);

const pill = (text, kind = 'grey', extra = '') => `<span class="pill pill-${kind} ${extra}">${text}</span>`;

function starsHTML(n, of = 4, size = 28) {
  let out = '';
  for (let i = 0; i < of; i++) out += `<span class="star ${i < n ? 'on' : ''}" style="font-size:${size}px">★</span>`;
  return `<span class="stars" aria-label="${n} of ${of} stars">${out}</span>`;
}

/* A pizza cut into `n` slices with `k` of them shaded. */
function pizza(n, k = 1, size = 120) {
  const r = size / 2 - 4, c = size / 2;
  let paths = '';
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * 2 * Math.PI - Math.PI / 2;
    const a1 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2;
    const x0 = c + r * Math.cos(a0), y0 = c + r * Math.sin(a0);
    const x1 = c + r * Math.cos(a1), y1 = c + r * Math.sin(a1);
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const fill = i < k ? '#FFA94D' : '#FFE8B6';
    paths += n === 1
      ? `<circle cx="${c}" cy="${c}" r="${r}" fill="${fill}"/>`
      : `<path d="M${c},${c} L${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 ${large} 1 ${x1.toFixed(1)},${y1.toFixed(1)} Z" fill="${fill}" stroke="#E8952F" stroke-width="1.5" stroke-linejoin="round"/>`;
  }
  paths += `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="#E8952F" stroke-width="${Math.max(3, size / 22).toFixed(1)}"/>`;
  return `<svg class="pizza" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="Pizza cut into ${n} slices, ${k} shaded">${paths}</svg>`;
}

/* ---------- modal ---------- */
function openModal(html, opts = {}) {
  const root = document.getElementById('modal-root');
  root.innerHTML = `<div class="overlay" data-a="closeModalOutside"><div class="modal ${opts.cls || ''}" role="dialog" aria-modal="true">${html}</div></div>`;
  refreshIcons();
}
function closeModal() { document.getElementById('modal-root').innerHTML = ''; }

/* ---------- toast ---------- */
function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2400);
}

function refreshIcons() {
  if (window.lucide) window.lucide.createIcons({ attrs: { 'stroke-width': 2 } });
}
