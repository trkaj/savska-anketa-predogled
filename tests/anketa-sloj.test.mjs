import test from 'node:test';
import assert from 'node:assert/strict';
import {drawOrder, featureArea, formatShare, hasGeometry, mergedWith, missingGeometryNote, sequentialColor, shareOf, streetColor, topicRows} from '../superzemljevid/anketa-logika.mjs';

function fakeStreet(ulica, geometry, extra = {}) {
  return {
    type: 'Feature',
    geometry,
    properties: {
      ulica,
      N: 129,
      n_izbor: 107,
      top_teza: 'parkiranje',
      zdruzeno: 'ne',
      parkiranje_delez_pct: 82.9,
      parkiranje_stevec: 107,
      parkiranje_imenovalec: 129,
      promet_delez_pct: 10,
      promet_stevec: 13,
      promet_imenovalec: 129,
      ...extra,
    },
  };
}

const big = {type: 'Polygon', coordinates: [[[14.52, 46.06], [14.525, 46.06], [14.525, 46.065], [14.52, 46.065], [14.52, 46.06]]]};
const small = {type: 'Polygon', coordinates: [[[14.521, 46.061], [14.522, 46.061], [14.522, 46.062], [14.521, 46.062], [14.521, 46.061]]]};

test('delež je vedno izpisan s števcem in imenovalcem', () => {
  assert.equal(formatShare(82.9, 107, 129), '82,9 % (107 od 129)');
  assert.equal(formatShare(null, null, null), '0,0 % (0 od 0)');
  const alt = shareOf({promet_delez: '10,5', promet_numerator: 4, promet_denominator: 40}, 'promet');
  assert.equal(alt.pct, 10.5);
  assert.equal(alt.stevec, 4);
  assert.equal(alt.imenovalec, 40);
  assert.equal(formatShare(alt.pct, alt.stevec, alt.imenovalec), '10,5 % (4 od 40)');
});

test('teme so razvrščene po deležu, barve so kategorične ali zaporedne', () => {
  const rows = topicRows(fakeStreet('Testna ulica', big).properties);
  assert.equal(rows[0].label, 'Parkiranje');
  assert.equal(rows[0].line, '82,9 % (107 od 129)');
  assert.ok(rows[0].pct > rows[1].pct);
  assert.equal(streetColor({top_teza: 'Igle in droge, varnost'}, 'top'), '#c1121f');
  assert.equal(sequentialColor(0), '#f4f0ff');
  assert.equal(sequentialColor(100), '#3c096c');
  assert.notEqual(sequentialColor(0), sequentialColor(100));
});

test('manjša poligona sta zgoraj, zapisi brez geometrije se ne rišejo in se štejejo', () => {
  const features = [
    fakeStreet('Testna velika', big, {top_teza: 'promet'}),
    fakeStreet('Testna mala', small, {top_teza: 'hrup'}),
    {type: 'Feature', geometry: null, properties: {ulica: 'Testno drugo', N: 3, top_teza: 'drugo_tema'}},
  ];
  const order = drawOrder(features);
  assert.equal(order.length, 2);
  assert.ok(featureArea(order[0].feature) > featureArea(order[1].feature));
  assert.ok(order[1].zIndex > order[0].zIndex);
  assert.equal(missingGeometryNote(features), '1 zapis brez območja na zemljevidu (Testno drugo).');
  assert.equal(hasGeometry(features[2]), false);
});

test('združena ulica dobi opombo, posameznih odgovorov ni', () => {
  assert.equal(mergedWith({zdruzeno: 'da', zdruzeno_z: 'Testna sosednja'}), 'Testna sosednja');
  assert.equal(mergedWith({zdruzeno: 'da'}), 'sosednjimi ulicami');
  assert.equal(mergedWith({zdruzeno: 'ne'}), null);
  const dumped = JSON.stringify(topicRows(fakeStreet('Testna ulica', big).properties));
  assert.equal(dumped.includes('naslov'), false);
});
