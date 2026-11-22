/* Izboljšave šolskega vnosa: zavihki, bližnjice, smeško, pot v šolo (prostooročno v 2D in 3D),
   kam gre predlog (samo k ČS / k upravniku), rubrika Popravljeno. Oddaja ostane izklopljena. */
import {SIMPLIFY_M, MIN_STROKE_M, SAMPLE_M, distM, douglasPeucker, strokeLengthM, flattenStrokes} from './path-draw.mjs';

const FORM_URL = 'https://forms.gle/yue9bRAvcCxCYcj16';
const $ = id => document.getElementById(id);
const HINT = 'Vleci s prstom od doma do šole';

let tab = 'predlogi';
let drawingActive = false;
let strokes = [];
let liveStroke = null;
let drawingPointerId = null;
let marks = [];
const MAX_MARKS = 3;
let parcels = null, zvetl = null;

function pathPoints() {
  return flattenStrokes(strokes);
}

function pathIsDone() {
  return $('pathDone') && $('pathDone').dataset.done === '1';
}

function isDrawingMode() {
  return tab === 'pot' && drawingActive && !pathIsDone();
}

function is3dView() {
  if (typeof window.solaMapMode === 'function' && window.solaMapMode() === '3d') return true;
  const m3 = $('map3d'), m2 = $('map2d');
  return !!(m3 && !m3.hidden) || !!(m2 && m2.hidden);
}

function setDrawingClass(on) {
  document.querySelector('.map-pane')?.classList.toggle('drawing-path', on);
  document.querySelector('.map-stage')?.classList.toggle('drawing-path', on);
  $('map2d')?.classList.toggle('drawing-path', on);
  $('mapSvg')?.classList.toggle('drawing-path', on);
  $('map3d')?.classList.toggle('drawing-path', on);
  window.solaLockCamera?.(on && is3dView());
}

function pointFromEvent(e) {
  if (is3dView() && typeof window.solaLonLatFromClient3D === 'function') {
    return window.solaLonLatFromClient3D(e.clientX, e.clientY);
  }
  if (typeof window.solaLonLatFromClient === 'function') {
    return window.solaLonLatFromClient(e.clientX, e.clientY);
  }
  return null;
}

function addLivePoint(e) {
  const p = pointFromEvent(e);
  if (!p) return;
  const last = liveStroke && liveStroke[liveStroke.length - 1];
  if (last && distM(last, p) < SAMPLE_M) return;
  if (!liveStroke) liveStroke = [];
  liveStroke.push(p);
  drawPathPreview();
}

function startStroke(e) {
  drawingPointerId = e.pointerId;
  liveStroke = [];
  addLivePoint(e);
  const target = e.currentTarget || (is3dView() ? window.solaCesiumCanvas?.() : $('mapSvg'));
  try { target?.setPointerCapture?.(e.pointerId); } catch (err) { /* ni nujno */ }
}

function endStroke() {
  const raw = liveStroke || [];
  liveStroke = null;
  drawingPointerId = null;
  const simple = douglasPeucker(raw, SIMPLIFY_M);
  if (simple.length >= 2 && strokeLengthM(simple) >= MIN_STROKE_M) {
    strokes.push(simple);
  } else if (raw.length >= 2 && strokeLengthM(raw) >= MIN_STROKE_M) {
    strokes.push(raw);
  }
  updatePathButtons();
  updatePathStatus();
  drawPathPreview();
}

function updatePathButtons() {
  const draw = $('pathDraw');
  if (draw) {
    draw.hidden = pathIsDone();
    draw.disabled = pathIsDone();
    draw.setAttribute('aria-pressed', String(isDrawingMode()));
    draw.textContent = isDrawingMode() ? 'Rišem …' : 'Riši';
  }
  const undo = $('pathUndo');
  if (undo) undo.disabled = pathIsDone() || (strokes.length === 0 && !liveStroke);
  const done = $('pathDone');
  if (done) done.disabled = pathIsDone() || pathPoints().length < 2;
}

function updatePathStatus() {
  const st = $('pathStatus');
  if (!st) return;
  if (pathIsDone()) {
    st.textContent = 'Označi, kje paziti (rumeno) ali je nevarno (rdeče). Največ 3 oznake. Ostalo ostane zeleno (varno).' +
      (marks.length ? ' Oznak: ' + marks.length + ' / ' + MAX_MARKS + '.' : '');
    return;
  }
  if (!drawingActive) {
    st.textContent = 'Pritisni Riši, nato vleci s prstom od doma do šole. Deluje v 2D in 3D.';
    return;
  }
  const n = pathPoints().length;
  const k = strokes.length;
  if (!k && !liveStroke) st.textContent = HINT + '. Zemljevid se med risanjem ne premika.';
  else st.textContent = (k ? ('Potez: ' + k + '. ') : '') + (n ? 'Točk na črti: ' + n + '. ' : '') + 'Lahko dodaš še eno potezo, razveljaviš zadnjo ali pritisneš »Končaj«.';
}

function setMapHint() {
  const hint = $('mapHint');
  if (!hint) return;
  if (tab !== 'pot') {
    hint.textContent = 'Za svoj predlog označi mesto na zemljevidu.';
    return;
  }
  if (pathIsDone()) hint.textContent = 'Na narisani poti označi, kje paziti ali je nevarno (največ 3 oznake).';
  else if (drawingActive) hint.textContent = HINT + '. Javno se vidi samo zbirno — brez imen, razreda in časa oddaje.';
  else hint.textContent = HINT + '. Najprej pritisni Riši (deluje v 2D in 3D).';
}

function setTab(next) {
  tab = next;
  const pred = next === 'predlogi';
  const tabP = $('tabPredlogi'), tabT = $('tabPot');
  if (tabP) tabP.setAttribute('aria-selected', String(pred));
  if (tabT) tabT.setAttribute('aria-selected', String(!pred));
  const form = $('proposalForm'), panel = $('pathPanel');
  if (form) form.hidden = !pred;
  if (panel) panel.hidden = pred;
  if (pred) {
    drawingActive = false;
    setDrawingClass(false);
  }
  setMapHint();
  updatePathStatus();
  updatePathButtons();
  drawPathPreview();
}

function startDrawing() {
  if (tab !== 'pot' || pathIsDone()) return;
  drawingActive = true;
  setDrawingClass(true);
  setMapHint();
  updatePathStatus();
  updatePathButtons();
  toast(HINT + '. Zemljevid se med risanjem ne premika.');
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
  if (isDrawingMode()) return true;
  if (!pathIsDone()) return true;
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
  updatePathStatus();
  return true;
}

function drawPathPreview() {
  const g = $('pathPreview');
  if (g && window.placesXy) {
    g.replaceChildren();
    const NS = 'http://www.w3.org/2000/svg';
    function line(pts, color, width, dash) {
      if (!pts || pts.length < 2) return;
      const pl = document.createElementNS(NS, 'polyline');
      pl.setAttribute('fill', 'none');
      pl.setAttribute('stroke', color);
      pl.setAttribute('stroke-width', String(width));
      pl.setAttribute('stroke-linecap', 'round');
      pl.setAttribute('stroke-linejoin', 'round');
      pl.setAttribute('pointer-events', 'none');
      if (dash) pl.setAttribute('stroke-dasharray', dash);
      pl.setAttribute('points', pts.map(p => window.placesXy(p).join(',')).join(' '));
      g.append(pl);
    }
    const done = pathPoints();
    if (done.length >= 2) line(done, '#22c55e', 6);
    if (liveStroke && liveStroke.length >= 2) line(liveStroke, '#16a34a', 6, '8 6');
    else if (liveStroke && liveStroke.length === 1) {
      const [x, y] = window.placesXy(liveStroke[0]);
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', '5');
      c.setAttribute('fill', '#16a34a');
      c.setAttribute('pointer-events', 'none');
      g.append(c);
    }
    marks.forEach(m => {
      const [x, y] = window.placesXy(m.point);
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', '9');
      c.setAttribute('fill', m.safety === 'pazi' ? '#eab308' : '#dc2626');
      c.setAttribute('stroke', '#fff'); c.setAttribute('stroke-width', '2');
      c.setAttribute('pointer-events', 'none');
      g.append(c);
    });
  } else if (g) {
    g.replaceChildren();
  }
  window.solaRenderPath3D?.({
    path: pathPoints(),
    live: liveStroke || [],
    marks
  });
}

function toast(msg) {
  const t = $('toast');
  if (!t) return;
  t.textContent = msg; t.hidden = false;
  setTimeout(() => { t.hidden = true; }, 3200);
}

function finishPath() {
  if (pathPoints().length < 2) { toast('Najprej nariši pot: pritisni Riši in vleci od doma do šole.'); return; }
  $('pathDone').dataset.done = '1';
  drawingActive = false;
  setDrawingClass(false);
  const box = $('pathMarks');
  if (box) box.hidden = false;
  setMapHint();
  updatePathButtons();
  updatePathStatus();
  drawPathPreview();
}

function undoStroke() {
  if (pathIsDone()) return;
  if (liveStroke) { liveStroke = null; drawingPointerId = null; }
  else if (strokes.length) strokes.pop();
  updatePathButtons();
  updatePathStatus();
  drawPathPreview();
}

function resetPath() {
  strokes = []; marks = []; liveStroke = null; drawingPointerId = null;
  drawingActive = false;
  if ($('pathDone')) $('pathDone').dataset.done = '';
  if ($('pathMarks')) $('pathMarks').hidden = true;
  setDrawingClass(false);
  setMapHint();
  updatePathButtons();
  updatePathStatus();
  drawPathPreview();
}

export function pathPointer(e) {
  if (!isDrawingMode()) return false;
  if (e.type === 'pointerdown') {
    if (e.button != null && e.button !== 0) return false;
    if (e.isPrimary === false) return true;
    e.preventDefault();
    startStroke(e);
    return true;
  }
  if (e.type === 'pointermove') {
    if (drawingPointerId == null || e.pointerId !== drawingPointerId) return drawingPointerId != null;
    e.preventDefault();
    addLivePoint(e);
    return true;
  }
  if (e.type === 'pointerup' || e.type === 'pointercancel') {
    if (drawingPointerId == null || e.pointerId !== drawingPointerId) return false;
    e.preventDefault();
    endStroke();
    return true;
  }
  return false;
}

function onMapMode() {
  if (isDrawingMode()) setDrawingClass(true);
  else window.solaLockCamera?.(false);
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

let started = false;
export async function initSolaUi() {
  if (started) return; started = true;
  await loadLand();
  $('tabPredlogi')?.addEventListener('click', () => setTab('predlogi'));
  $('tabPot')?.addEventListener('click', () => setTab('pot'));
  $('pathDraw')?.addEventListener('click', startDrawing);
  $('pathDone')?.addEventListener('click', finishPath);
  $('pathReset')?.addEventListener('click', resetPath);
  $('pathUndo')?.addEventListener('click', undoStroke);
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
  window.solaPathPointer = pathPointer;
  window.solaIsDrawingPath = isDrawingMode;
  window.solaOnMapMode = onMapMode;
  window.solaPathState = () => ({
    tab,
    drawing: isDrawingMode(),
    done: !!pathIsDone(),
    strokes: strokes.length,
    points: pathPoints().length,
    marks: marks.length,
    path: pathPoints()
  });
  updatePathButtons();
}

if (typeof window !== 'undefined') {
  window.solaInitUi = initSolaUi;
  window.solaHandleMapClick = handleMapClick;
  window.solaPathPointer = pathPointer;
  window.solaIsDrawingPath = isDrawingMode;
  window.solaOnMapMode = onMapMode;
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => initSolaUi());
else initSolaUi();
