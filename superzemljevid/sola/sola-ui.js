/* Izboljšave šolskega vnosa: zavihki, bližnjice, smeško, pot v šolo (prostooročno v 2D in 3D),
   kam gre predlog (samo k ČS / k upravniku), rubrika Popravljeno. Oddaja ostane izklopljena,
   dokler ni nastavljen RECEIVER_URL. */
import {SIMPLIFY_M, MIN_STROKE_M, SAMPLE_M, distM, douglasPeucker, strokeLengthM, flattenStrokes} from './path-draw.mjs';
import {submitSchoolPath} from './submit.js';

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
let pathSubmitted = false;
let fullscreenWanted = false;

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

function isNarrow() {
  return window.matchMedia('(max-width: 740px)').matches;
}

function isUiEvent(e) {
  const t = e.target;
  if (!t || !t.closest) return false;
  return !!t.closest('button, a, input, select, textarea, label, .path-hud, .map-bar, .search-wrap, .map-search, .map-side-controls, .place-strip, .map-guidance, .quick-places, #searchChoices');
}

function setDrawingClass(on) {
  document.body.classList.toggle('sola-drawing', on);
  document.querySelector('.map-pane')?.classList.toggle('drawing-path', on);
  document.querySelector('.map-stage')?.classList.toggle('drawing-path', on);
  $('map2d')?.classList.toggle('drawing-path', on);
  $('mapSvg')?.classList.toggle('drawing-path', on);
  $('map3d')?.classList.toggle('drawing-path', on);
  window.solaLockCamera?.(on && is3dView());
}

function resizeMapsSoon() {
  const run = () => window.solaResizeMaps?.();
  run();
  requestAnimationFrame(run);
  setTimeout(run, 120);
  setTimeout(run, 350);
}

function isNativeFullscreen() {
  return !!(document.fullscreenElement || document.webkitFullscreenElement);
}

function isFullscreen() {
  return document.body.classList.contains('sola-map-fullscreen') || isNativeFullscreen();
}

function enterFullscreen() {
  fullscreenWanted = true;
  const pane = document.querySelector('.map-pane');
  document.body.classList.add('sola-map-fullscreen');
  pane?.classList.add('is-fullscreen');
  const btn = $('pathFullscreen');
  if (btn) {
    btn.setAttribute('aria-pressed', 'true');
    btn.textContent = 'Zapri cel zaslon';
  }
  if (pane && !isNativeFullscreen()) {
    const req = pane.requestFullscreen || pane.webkitRequestFullscreen;
    if (typeof req === 'function' && document.fullscreenEnabled !== false) {
      try {
        const out = req.call(pane);
        if (out && typeof out.catch === 'function') out.catch(() => { /* iPhone nima Fullscreen API; ostane CSS */ });
      } catch (err) { /* CSS nadomestek */ }
    }
  }
  updateHudVisibility();
  resizeMapsSoon();
}

function exitFullscreen() {
  fullscreenWanted = false;
  const pane = document.querySelector('.map-pane');
  document.body.classList.remove('sola-map-fullscreen');
  pane?.classList.remove('is-fullscreen');
  const btn = $('pathFullscreen');
  if (btn) {
    btn.setAttribute('aria-pressed', 'false');
    btn.textContent = 'Cel zaslon';
  }
  if (isNativeFullscreen()) {
    const exit = document.exitFullscreen || document.webkitExitFullscreen;
    try { exit?.call(document); } catch (err) { /* ignoriraj */ }
  }
  updateHudVisibility();
  resizeMapsSoon();
}

function toggleFullscreen() {
  if (isFullscreen() && fullscreenWanted) exitFullscreen();
  else enterFullscreen();
}

function onFullscreenChange() {
  if (!isNativeFullscreen() && !fullscreenWanted) {
    document.body.classList.remove('sola-map-fullscreen');
    document.querySelector('.map-pane')?.classList.remove('is-fullscreen');
    const btn = $('pathFullscreen');
    if (btn) {
      btn.setAttribute('aria-pressed', 'false');
      btn.textContent = 'Cel zaslon';
    }
  }
  updateHudVisibility();
  resizeMapsSoon();
}

function pointFromEvent(e) {
  const x = e.clientX, y = e.clientY;
  if (x == null || y == null) return null;
  if (is3dView() && typeof window.solaLonLatFromClient3D === 'function') {
    return window.solaLonLatFromClient3D(x, y);
  }
  if (typeof window.solaLonLatFromClient === 'function') {
    return window.solaLonLatFromClient(x, y);
  }
  return null;
}

const MAX_STEP_M = 150;
function addLivePoint(e) {
  const p = pointFromEvent(e);
  if (!p) return;
  if (typeof window.solaInMap === 'function' && !window.solaInMap(p)) return;
  const last = liveStroke && liveStroke[liveStroke.length - 1];
  if (last && distM(last, p) < SAMPLE_M) return;
  if (last && distM(last, p) > MAX_STEP_M) return;
  if (!liveStroke) liveStroke = [];
  liveStroke.push(p);
  drawPathPreview();
}

function startStroke(e) {
  if (drawingPointerId != null && e.pointerId !== drawingPointerId) return;
  drawingPointerId = e.pointerId;
  liveStroke = [];
  addLivePoint(e);
  const stage = document.querySelector('.map-stage');
  const target = stage || e.currentTarget || (is3dView() ? window.solaCesiumCanvas?.() : $('mapSvg'));
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

function setBtn(id, {hidden, disabled, pressed, text} = {}) {
  const el = $(id);
  if (!el) return;
  if (hidden != null) el.hidden = hidden;
  if (disabled != null) el.disabled = disabled;
  if (pressed != null) el.setAttribute('aria-pressed', String(pressed));
  if (text != null) el.textContent = text;
}

function updatePathButtons() {
  const drawing = isDrawingMode();
  const done = pathIsDone();
  const canFinish = !done && pathPoints().length >= 2;
  const canUndo = !done && (strokes.length > 0 || !!liveStroke);
  const drawLabel = drawing ? 'Rišem …' : 'Riši';
  for (const id of ['pathDraw', 'pathHudDraw']) {
    setBtn(id, {hidden: done, disabled: done, pressed: drawing, text: drawLabel});
  }
  for (const id of ['pathUndo', 'pathHudUndo']) setBtn(id, {disabled: !canUndo});
  for (const id of ['pathDone', 'pathHudDone']) setBtn(id, {disabled: !canFinish, hidden: done});
  const showSubmit = done && !pathSubmitted;
  for (const id of ['pathSubmit', 'pathHudSubmit']) {
    setBtn(id, {hidden: !done, disabled: !showSubmit, text: pathSubmitted ? 'Oddano' : 'Oddaj'});
  }
  updateHudVisibility();
}

function updateHudVisibility() {
  const hud = $('pathHud');
  if (!hud) return;
  const fs = isFullscreen() || document.body.classList.contains('sola-map-fullscreen');
  const show = tab === 'pot' && (fs || isNarrow() || drawingActive || pathIsDone());
  hud.hidden = !show;
  const exit = $('pathExitFs');
  if (exit) exit.hidden = !fs;
}

function updatePathStatus() {
  let text = '';
  if (pathSubmitted) {
    text = ($('pathSubmitResult') && $('pathSubmitResult').textContent) || 'Pot je shranjena.';
  } else if (pathIsDone()) {
    text = 'Pot je narisana. Pritisni Oddaj. Lahko še označiš, kje paziti (rumeno) ali je nevarno (rdeče), največ 3 oznake.' +
      (marks.length ? ' Oznak: ' + marks.length + ' / ' + MAX_MARKS + '.' : '');
  } else if (!drawingActive) {
    text = 'Pritisni Riši, nato vleci s prstom od doma do šole. Ko končaš, pritisni Končaj in nato Oddaj.';
  } else {
    const n = pathPoints().length;
    const k = strokes.length;
    if (!k && !liveStroke) text = HINT + '. Zemljevid se med risanjem ne premika.';
    else text = (k ? ('Potez: ' + k + '. ') : '') + (n ? 'Točk na črti: ' + n + '. ' : '') + 'Lahko dodaš še eno potezo, razveljaviš zadnjo ali pritisneš »Končaj«.';
  }
  for (const id of ['pathStatus', 'pathHudStatus']) {
    const st = $(id);
    if (st) st.textContent = text;
  }
}

function setMapHint() {
  const hint = $('mapHint');
  if (!hint) return;
  if (tab !== 'pot') {
    hint.textContent = 'Za svoj predlog označi mesto na zemljevidu.';
    return;
  }
  if (pathIsDone()) hint.textContent = 'Pritisni Oddaj. Na poti lahko označiš, kje paziti ali je nevarno (največ 3 oznake).';
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
    if (isFullscreen()) exitFullscreen();
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
  if (isNarrow() && !isFullscreen()) enterFullscreen();
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
  toast('Pot je narisana. Pritisni Oddaj.');
}

function undoStroke() {
  if (pathIsDone()) return;
  if (liveStroke) { liveStroke = null; drawingPointerId = null; }
  else if (strokes.length) strokes.pop();
  updatePathButtons();
  updatePathStatus();
  drawPathPreview();
}

function clearSubmitResult() {
  for (const id of ['pathSubmitResult', 'pathHudResult']) {
    const el = $(id);
    if (el) { el.hidden = true; el.textContent = ''; }
  }
}

function resetPath() {
  strokes = []; marks = []; liveStroke = null; drawingPointerId = null;
  drawingActive = false;
  pathSubmitted = false;
  if ($('pathDone')) $('pathDone').dataset.done = '';
  if ($('pathMarks')) $('pathMarks').hidden = true;
  clearSubmitResult();
  setDrawingClass(false);
  setMapHint();
  updatePathButtons();
  updatePathStatus();
  drawPathPreview();
}

function showSubmitResult(msg) {
  for (const id of ['pathSubmitResult', 'pathHudResult']) {
    const el = $(id);
    if (!el) continue;
    el.hidden = false;
    el.textContent = msg;
  }
  updatePathStatus();
}

async function submitPath() {
  if (!pathIsDone() || pathPoints().length < 2) {
    toast('Najprej nariši pot in pritisni Končaj.');
    return;
  }
  if (pathSubmitted) {
    toast('Ta pot je že shranjena.');
    return;
  }
  const btns = ['pathSubmit', 'pathHudSubmit'].map($).filter(Boolean);
  btns.forEach(b => { b.disabled = true; b.textContent = 'Shranjujem …'; });
  try {
    const result = await submitSchoolPath(pathPoints(), marks);
    pathSubmitted = true;
    showSubmitResult(result.message);
    toast(result.message);
    updatePathButtons();
  } catch (err) {
    const msg = (err && err.message) ? err.message : 'Oddaja ni uspela.';
    showSubmitResult(msg);
    toast(msg);
    btns.forEach(b => { b.disabled = false; b.textContent = 'Oddaj'; });
  }
}

export function pathPointer(e) {
  if (!isDrawingMode()) return false;
  if (isUiEvent(e)) return false;
  if (e.type === 'pointerdown') {
    if (e.button != null && e.button !== 0) return false;
    if (e.isPrimary === false) return true;
    if (drawingPointerId != null && e.pointerId !== drawingPointerId) return true;
    if (typeof e.preventDefault === 'function') e.preventDefault();
    startStroke(e);
    return true;
  }
  if (e.type === 'pointermove') {
    if (drawingPointerId == null || e.pointerId !== drawingPointerId) return drawingPointerId != null;
    if (typeof e.preventDefault === 'function') e.preventDefault();
    addLivePoint(e);
    return true;
  }
  if (e.type === 'pointerup' || e.type === 'pointercancel' || e.type === 'lostpointercapture') {
    if (drawingPointerId == null || (e.pointerId != null && e.pointerId !== drawingPointerId)) return false;
    if (typeof e.preventDefault === 'function') e.preventDefault();
    endStroke();
    return true;
  }
  return false;
}

function bindDrawSurface() {
  const stage = document.querySelector('.map-stage');
  if (!stage || stage.dataset.pathBound) return;
  stage.dataset.pathBound = '1';
  const opts = {passive: false, capture: true};
  const wrap = e => {
    if (pathPointer(e)) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  for (const type of ['pointerdown', 'pointermove', 'pointerup', 'pointercancel', 'lostpointercapture']) {
    stage.addEventListener(type, wrap, opts);
  }
  const guard = e => {
    if (!isDrawingMode() || isUiEvent(e)) return;
    e.preventDefault();
  };
  for (const type of ['touchstart', 'touchmove', 'touchend', 'touchcancel', 'gesturestart']) {
    stage.addEventListener(type, guard, opts);
  }
}

function onMapMode() {
  if (isDrawingMode()) setDrawingClass(true);
  else window.solaLockCamera?.(false);
  drawPathPreview();
  resizeMapsSoon();
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
  bindDrawSurface();
  $('tabPredlogi')?.addEventListener('click', () => setTab('predlogi'));
  $('tabPot')?.addEventListener('click', () => setTab('pot'));
  $('pathDraw')?.addEventListener('click', startDrawing);
  $('pathHudDraw')?.addEventListener('click', startDrawing);
  $('pathDone')?.addEventListener('click', finishPath);
  $('pathHudDone')?.addEventListener('click', finishPath);
  $('pathReset')?.addEventListener('click', resetPath);
  $('pathHudReset')?.addEventListener('click', resetPath);
  $('pathUndo')?.addEventListener('click', undoStroke);
  $('pathHudUndo')?.addEventListener('click', undoStroke);
  $('pathSubmit')?.addEventListener('click', submitPath);
  $('pathHudSubmit')?.addEventListener('click', submitPath);
  $('pathFullscreen')?.addEventListener('click', toggleFullscreen);
  $('pathExitFs')?.addEventListener('click', exitFullscreen);
  document.addEventListener('fullscreenchange', onFullscreenChange);
  document.addEventListener('webkitfullscreenchange', onFullscreenChange);
  window.addEventListener('resize', () => { updateHudVisibility(); resizeMapsSoon(); });
  window.visualViewport?.addEventListener('resize', resizeMapsSoon);
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
    submitted: pathSubmitted,
    strokes: strokes.length,
    points: pathPoints().length,
    marks: marks.length,
    path: pathPoints(),
    fullscreen: isFullscreen()
  });
  updatePathButtons();
  updatePathStatus();
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
