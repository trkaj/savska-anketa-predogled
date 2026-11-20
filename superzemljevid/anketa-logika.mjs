export const ANKETA_FOOTER = 'Vir: Savska anketa, N = 559, presek 20. 11. 2026 ob 13.05; prikazane so enote z vsaj 10 odgovori';
export const ANKETA_SHARE_NOTE = 'Delež je od odgovorov, ki so izbrali vsaj eno temo.';
export const GJI_SOURCE = 'Vir: GURS, zbirni kataster gospodarske javne infrastrukture, CC BY 4.0, stanje 20. 11. 2026';

export function streetName(props) {
  const name = props?.ulica || props?.ime;
  return name ? String(name) : '';
}

export const TEME = [
  {id: 'parkiranje', label: 'Parkiranje', color: '#e4572e'},
  {id: 'promet', label: 'Promet skozi naselje', color: '#f3a712'},
  {id: 'igle_in_droge_varnost', label: 'Igle in droge, varnost', color: '#c1121f'},
  {id: 'vec_klopi', label: 'Več klopi', color: '#2a9d8f'},
  {id: 'cistoca', label: 'Čistoča', color: '#4cc9f0'},
  {id: 'drevesa_in_zelenice', label: 'Drevesa in zelenice', color: '#2d6a4f'},
  {id: 'dom_skupnosti', label: 'Dom skupnosti', color: '#7b2cbf'},
  {id: 'boljsi_zrak', label: 'Boljši zrak', color: '#48cae4'},
  {id: 'koledar', label: 'Koledar dogodkov', color: '#f72585'},
  {id: 'igrisca_in_mladi', label: 'Igrišča in mladi', color: '#fb8500'},
  {id: 'hrup', label: 'Hrup', color: '#6c584c'},
  {id: 'stanovanja_brez_dvigala', label: 'Stanovanja brez dvigala', color: '#577590'},
  {id: 'druzenje_za_starejse', label: 'Druženje za starejše', color: '#9b5de5'},
  {id: 'dostop_do_zdravstva', label: 'Dostop do zdravstva', color: '#0077b6'},
  {id: 'drugo_tema', label: 'Drugo', color: '#8d99ae'},
];

const SEQ_LOW = [244, 240, 255];
const SEQ_HIGH = [60, 9, 108];

function num(value) {
  if (value == null || value === '') return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  const n = Number(String(value).trim().replace(/\s/g, '').replace('%', '').replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

function pick(props, keys) {
  for (const key of keys) {
    if (props && props[key] != null && props[key] !== '') return props[key];
  }
  return null;
}

export function formatPct(value) {
  const n = Math.round((Number(value) || 0) * 10) / 10;
  const [whole, frac] = n.toFixed(1).split('.');
  return whole + ',' + frac;
}

export function formatShare(pct, stevec, imenovalec) {
  const shown = pct == null ? (imenovalec ? (Number(stevec) || 0) / imenovalec * 100 : 0) : pct;
  const left = stevec == null ? 0 : Math.round(Number(stevec));
  const right = imenovalec == null ? 0 : Math.round(Number(imenovalec));
  return formatPct(shown) + ' % (' + left + ' od ' + right + ')';
}

export function shareOf(props, id) {
  const pct = num(pick(props, [id + '_delez_pct', id + '_delež_pct', id + '_delez', id + '_delež', id + '_pct', id + '_share']));
  const stevec = num(pick(props, [id + '_stevec', id + '_števec', id + '_numerator', id + '_stevilo']));
  const imenovalec = num(pick(props, [id + '_imenovalec', id + '_denominator', id + '_n']));
  return {pct, stevec, imenovalec};
}

export function temaByTop(value) {
  if (value == null || value === '') return null;
  const s = String(value).trim().toLowerCase();
  return TEME.find(t => t.id.toLowerCase() === s || t.label.toLowerCase() === s) || null;
}

export function sequentialColor(pct) {
  const t = Math.max(0, Math.min(100, Number(pct) || 0)) / 100;
  const rgb = SEQ_LOW.map((v, i) => Math.round(v + (SEQ_HIGH[i] - v) * t));
  return '#' + rgb.map(v => v.toString(16).padStart(2, '0')).join('');
}

export function hasGeometry(feature) {
  const g = feature && feature.geometry;
  if (!g || !g.coordinates) return false;
  if (g.type === 'Polygon') return Array.isArray(g.coordinates[0]) && g.coordinates[0].length >= 3;
  if (g.type === 'MultiPolygon') return g.coordinates.some(poly => Array.isArray(poly?.[0]) && poly[0].length >= 3);
  return false;
}

function ringArea(ring) {
  let area = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    area += (ring[j][0] - ring[i][0]) * (ring[j][1] + ring[i][1]);
  }
  return Math.abs(area / 2);
}

export function featureArea(feature) {
  const g = feature.geometry;
  const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
  return polys.reduce((sum, poly) => sum + ringArea(poly[0] || []), 0);
}

export function drawOrder(features) {
  const drawable = (features || []).filter(hasGeometry).map(feature => ({feature, area: featureArea(feature)}));
  drawable.sort((a, b) => b.area - a.area);
  return drawable.map((item, index) => ({feature: item.feature, area: item.area, zIndex: index + 1}));
}

export function missingGeometryNote(features) {
  const missing = (features || []).filter(feature => !hasGeometry(feature));
  if (!missing.length) return '';
  const names = missing.map(feature => streetName(feature.properties) || 'brez imena');
  return missing.length + ' ' + (missing.length === 1 ? 'zapis' : 'zapisov') + ' brez območja na zemljevidu (' + names.join(', ') + ').';
}

export function topicRows(props) {
  return TEME.map(tema => {
    const share = shareOf(props, tema.id);
    return {
      ...tema,
      ...share,
      line: formatShare(share.pct, share.stevec, share.imenovalec),
    };
  }).sort((a, b) => (b.pct ?? -1) - (a.pct ?? -1) || a.label.localeCompare(b.label, 'sl'));
}

export function mergedWith(props) {
  const value = props?.zdruzeno ?? props?.združeno ?? props?.Zdruzeno;
  if (value == null || value === false || value === 0 || value === '0' || value === '') return null;
  const text = String(value).trim();
  if (/^(ne|no|false)$/i.test(text)) return null;
  if (/^(da|yes|true|1)$/i.test(text)) {
    const extra = props.zdruzeno_z || props.združeno_z || props.zdruzeno_ulice || props.sosednje;
    return extra ? String(extra) : 'sosednjimi ulicami';
  }
  return text;
}

export function streetColor(props, topic) {
  if (!props) return '#bbbbbb';
  if (!topic || topic === 'top') {
    return temaByTop(props.top_teza)?.color || '#bbbbbb';
  }
  return sequentialColor(shareOf(props, topic).pct);
}

export function answerCount(props) {
  const n = num(props?.N ?? props?.n);
  return n == null ? 0 : Math.round(n);
}

export function selectionBasis(props) {
  const total = answerCount(props);
  const picked = num(props?.n_izbor);
  const fromTopic = num(pick(props, ['top_teza_imenovalec', 'parkiranje_imenovalec']));
  const izbor = picked == null ? fromTopic : Math.round(picked);
  if (izbor == null) return total ? total + ' odgovorov' : 'Zbirni deleži ankete';
  const who = izbor + ' odgovorov, ki so izbrali vsaj eno temo';
  if (total && total !== izbor) return 'Na ulici je ' + total + ' odgovorov. Deleži so od ' + who + '.';
  return 'Deleži so od ' + who + '.';
}
