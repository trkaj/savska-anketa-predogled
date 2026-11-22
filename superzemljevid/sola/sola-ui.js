/* Izboljšave šolskega vnosa: zavihki, bližnjice, smeško, pot v šolo, kam gre predlog (samo k ČS / k upravniku), rubrika Popravljeno. Oddaja ostane izklopljena. */
const FORM_URL = 'https://forms.gle/yue9bRAvcCxCYcj16';
const $ = id => document.getElementById(id);

let tab = 'predlogi';
let path = [];
let marks = [];
const MAX_MARKS = 3;
let parcels = null, zvetl = null;

function setTab(next) {
  tab = next;
  const pred = next === 'predlogi';
  const tabP = $('tabPredlogi'), tabT = $('tabPot');
  if (tabP) { tabP.setAttribute('aria-selected', String(pred)); }
  if (tabT) { tabT.setAttribute('aria-selected', String(!pred)); }
  const form = $('proposalForm'), panel = $('pathPanel');
  if (form) form.hidden = !pred;
  if (panel) panel.hidden = pred;
  const hint = $('mapHint');
  if (hint) {
    hint.textContent = pred
      ? 'Za svoj predlog označi mesto na zemljevidu.'
      : 'Nariši pot s kliki po zemljevidu. Za zasebnost jo začnemo pri vogalu, ne pri hišnih vratih.';
  }
  drawPathPreview();
}

function showKam(point) {
  const el = $('routeHint');
  if (!el) return;
  const P = window.SolaPristojnost;
  if (!P || !parcels) { el.hidden = true; return; }
  const k = P.kamGreJavno(point[0], point[1], parcels, zvetl);
  el.hidden = false;
  el.textContent = 'Kam gre tvoj predlog: ' + k.text;
}

export function handleMapClick(point, opts) {
  if (tab !== 'pot') {
    if (point) showKam(point);
    const playground = opts && opts.playground;
    const note = $('playgroundHint');
    if (note) {
      if (playground && playground.hint) {
        note.hidden = false;
        note.textContent = playground.hint + ' Na igrišču so različna zemljišča: ko označiš točko, vidiš, kam gre predlog.';
      } else {
        note.hidden = true;
      }
    }
    return false;
  }
  /* Na zavihku poti: najprej risanje, potem do 3 oznake pazi/nevarno. */
  if (path.length < 2 || !$('pathDone') || $('pathDone').dataset.done !== '1') {
    path.push(point);
    drawPathPreview();
    const st = $('pathStatus');
    if (st) st.textContent = path.length < 2
      ? 'Klikni še eno mesto, da začneš črto.'
      : 'Pot ima ' + path.length + ' točk. Ko končaš, pritisni »Pot je narisana«.';
    return true;
  }
  if (marks.length >= MAX_MARKS) {
    toast('Največ 3 oznake (pazi ali nevarno).');
    return true;
  }
  const level = (document.querySelector('input[name=pathMark]:checked') || {}).value || 'nevarno';
  const reason = ($('pathReason') || {}).value || '';
  if (level === 'nevarno' && !reason) {
    toast('Pri rdeči oznaki izberi razlog.');
    return true;
  }
  marks.push({point, safety: level, reason: level === 'nevarno' ? reason : ''});
  drawPathPreview();
  const st = $('pathStatus');
  if (st) st.textContent = 'Oznak: ' + marks.length + ' / ' + MAX_MARKS + '.';
  return true;
}

function drawPathPreview() {
  const g = $('pathPreview');
  if (!g || !window.placesXy) { if (g) g.replaceChildren(); return; }
  g.replaceChildren();
  const NS = 'http://www.w3.org/2000/svg';
  if (path.length >= 2) {
    const pl = document.createElementNS(NS, 'polyline');
    pl.setAttribute('fill', 'none');
    pl.setAttribute('stroke', '#22c55e');
    pl.setAttribute('stroke-width', '6');
    pl.setAttribute('stroke-linecap', 'round');
    pl.setAttribute('stroke-linejoin', 'round');
    pl.setAttribute('points', path.map(p => window.placesXy(p).join(',')).join(' '));
    g.append(pl);
  }
  marks.forEach(m => {
    const [x, y] = window.placesXy(m.point);
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', '9');
    c.setAttribute('fill', m.safety === 'pazi' ? '#eab308' : '#dc2626');
    c.setAttribute('stroke', '#fff'); c.setAttribute('stroke-width', '2');
    g.append(c);
  });
}

function toast(msg) {
  const t = $('toast');
  if (!t) return;
  t.textContent = msg; t.hidden = false;
  setTimeout(() => { t.hidden = true; }, 3200);
}

function finishPath() {
  if (path.length < 2) { toast('Najprej nariši pot z vsaj dvema točkama.'); return; }
  const P = window.SolaPristojnost;
  if (P && P.preparePath) path = P.preparePath(path, window.solaCorners || []);
  $('pathDone').dataset.done = '1';
  const box = $('pathMarks');
  if (box) box.hidden = false;
  const st = $('pathStatus');
  if (st) st.textContent = 'Označi, kje paziti (rumeno) ali je nevarno (rdeče). Največ 3 oznake. Ostalo ostane zeleno (varno).';
  drawPathPreview();
}

function resetPath() {
  path = []; marks = [];
  if ($('pathDone')) $('pathDone').dataset.done = '';
  if ($('pathMarks')) $('pathMarks').hidden = true;
  if ($('pathStatus')) $('pathStatus').textContent = 'Klikni začetek poti na zemljevidu.';
  drawPathPreview();
}

async function loadLand() {
  try {
    const [p, z] = await Promise.all([
      fetch('../parcels.geojson').then(r => r.ok ? r.json() : null),
      fetch('../zvetl.json').then(r => r.ok ? r.json() : null)
    ]);
    parcels = p; zvetl = z;
  } catch (e) { /* brez omrežja ostane brez namiga */ }
}

let started=false;
export async function initSolaUi() {
  if(started)return; started=true;
  await loadLand();
  $('tabPredlogi')?.addEventListener('click', () => setTab('predlogi'));
  $('tabPot')?.addEventListener('click', () => setTab('pot'));
  $('pathDone')?.addEventListener('click', finishPath);
  $('pathReset')?.addEventListener('click', resetPath);
  $('primerOpen')?.addEventListener('click', () => $('primerDialog')?.showModal());
  document.querySelectorAll('[data-goto]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.goto;
      const chip = document.querySelector('#quickPlaces [data-place="' + id + '"]');
      if (chip) chip.click();
      $('primerDialog')?.close();
      setTab('predlogi');
    });
  });
  window.solaHandleMapClick = handleMapClick;
  window.solaDrawPathPreview = drawPathPreview;
}

if (typeof window !== 'undefined') {
  window.solaInitUi = initSolaUi;
  window.solaHandleMapClick = handleMapClick;
}

if (document.readyState==="loading") document.addEventListener("DOMContentLoaded", () => initSolaUi());
else initSolaUi();
