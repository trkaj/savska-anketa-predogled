/* Sloj »Predlogi učencev« za glavni (in interni) superzemljevid.
   Javno samo zbirno: najmanj 5 predlogov, brez besedil, fotografij in posamičnih točk. */
(function () {
  'use strict';
  const P = () => window.SolaPristojnost;
  const $ = id => document.getElementById(id);
  const escapeHTML = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const POBUDE_PORTAL = 'https://pobude.ljubljana.si/PregledOdgovorjenihPobud.aspx';
  const FORM_URL = 'https://forms.gle/yue9bRAvcCxCYcj16';

  let solaLayer = null, unsafeLayer = null, pobudeLayer = null;
  let loaded = false, usingPrimer = false, usingPrimerPoti = false;

  function whenReady(fn) {
    const t = setInterval(() => {
      if (window.savsko && window.savsko.ready && window.savsko.viewer && P()) {
        clearInterval(t); fn();
      }
    }, 50);
    setTimeout(() => clearInterval(t), 120000);
  }

  async function loadJson(paths) {
    const inline = window.INLINE_DATA || {};
    for (const path of paths) {
      if (inline[path]) return {data: inline[path], path};
      try {
        const r = await fetch(path);
        if (r.ok) return {data: await r.json(), path};
      } catch (e) { /* file:// ali manjkajoča datoteka */ }
    }
    return null;
  }

  function parcels() { return window.savsko && window.savsko.parcels; }
  function zvetl() { return window.savsko && window.savsko.zvetl; }

  function kamSummary(codes) {
    const labels = {
      mol: 'k Četrtni skupnosti (zemljišče MOL, plan manjših del)',
      upravnik: 'k upravniku (skupni del stavbe, odločajo etažni lastniki)',
      druzbena: 'še ni jasno, kdo odloča (ni zemljišče MOL in ni skupni del bloka)',
      drugo: 'to ni zemljišče MOL in ni skupni del bloka — predlog gre drugam',
      neznano: 'za to mesto še nimamo dovolj podatkov o zemljišču'
    };

    const parts = Object.keys(codes || {}).sort((a, b) => codes[b] - codes[a]).map(code => {
      const n = codes[code];
      return n + ' ' + (labels[code] || code);
    });
    return parts.length ? parts.join('; ') : '';
  }

  function addClusterEntity(ds, cluster, kind) {
    const C = Cesium;
    const color = (P().COLORS[cluster.topic] || '#6b7280');
    const size = cluster.wide ? 22 : 14 + Math.min(10, cluster.count / 2);
    const extra = cluster.wide ? {ellipse: {
      semiMajorAxis: Math.max(60, cluster.cellM / 2),
      semiMinorAxis: Math.max(60, cluster.cellM / 2),
      material: C.Color.fromCssColorString(color).withAlpha(0.22),
      heightReference: C.HeightReference.CLAMP_TO_GROUND,
      outline: true,
      outlineColor: C.Color.fromCssColorString(color).withAlpha(0.7)
    }} : {};
    const entity = ds.entities.add(Object.assign({
      position: C.Cartesian3.fromDegrees(cluster.lon, cluster.lat),
      point: {
        pixelSize: size,
        color: C.Color.fromCssColorString(color),
        outlineColor: C.Color.WHITE,
        outlineWidth: 2,
        heightReference: C.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      },
      label: {
        text: String(cluster.count),
        font: 'bold 11px sans-serif',
        fillColor: C.Color.WHITE,
        outlineColor: C.Color.fromCssColorString('#102137'),
        outlineWidth: 3,
        style: C.LabelStyle.FILL_AND_OUTLINE,
        pixelOffset: new C.Cartesian2(0, 0),
        heightReference: C.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      }
    }, extra));
    entity.solaSkupina = Object.assign({vrsta: kind}, cluster);
    return entity;
  }

  function moodLine(moods) {
    if (!moods) return '';
    const M = P().MOODS || {veselo:'😊', srednje:'😐', zalostno:'☹️'};
    return ['veselo','srednje','zalostno'].filter(k => moods[k]).map(k => M[k] + ' ' + moods[k]).join(' · ');
  }

  function showSolaSkupina(c) {
    const heading = $('heading'), intro = $('intro'), detail = $('detail');
    if (!heading || !detail) return;
    const title = c.vrsta === 'nevarno'
      ? ('Kje se učenci ne počutijo varno' + (c.topic ? ' · ' + c.topic : ''))
      : ('Predlogi učencev · ' + (c.kraj || c.topic || 'Drugo'));
    heading.textContent = title;
    if (intro) intro.textContent = c.wide ? 'Širše območje (združeno, da se ne vidi posameznih točk).' : (c.kraj || 'Zbirni prikaz pregledanih predlogov.');
    const vRedu = (c.stances && c.stances.v_redu) || 0;
    const spremenil = (c.stances && c.stances.spremenil) || 0;
    const kam = kamSummary(c.kam);
    const pobude = (c.pobude_id || []).map(id =>
      `<a href="${POBUDE_PORTAL}" target="_blank" rel="noopener">pobuda ${escapeHTML(id)}</a>`
    ).join(', ');
    detail.innerHTML =
      `<div class="anketa-card sola-card">` +
      (c.primer ? `<p class="primer-flag">PRIMER podatki — izmišljeni, niso pravi predlogi učencev.</p>` : '') +
      `<p><strong>${escapeHTML(String(c.count))}</strong> pregledanih predlogov` +
      (c.wide ? ' na širšem območju' : '') + `.</p>` +
      `<p>Kategorija: ${escapeHTML(c.topic || 'Drugo')}</p>` +
      (c.vrsta === 'nevarno' ? '' :
        `<p>${vRedu} × tu je v redu · ${spremenil} × tu bi spremenil</p>`) +
      (moodLine(c.moods) ? `<p>Kako je tu všeč: ${moodLine(c.moods)}</p>` : '') +
      (kam ? `<p>Kam gre predlog: ${escapeHTML(kam)}</p>` : '') +
      (pobude ? `<p>Povezane pobude meščanov: ${pobude}</p>` : '') +
      `<p class="small">Prikaz je zbiren. Posameznih točk, besedil in fotografij ni. Hvala šolskemu parlamentu in vsem, ki so dali predloge.</p>` +
      `<section class="popravljeno"><h3>Popravljeno</h3><p>Tu bodo stvari, ki so že urejene.</p></section>` +
      `</div>`;
    window.dispatchEvent(new Event('savsko-property-selected'));
  }

  function showSolaPobuda(p) {
    const heading = $('heading'), intro = $('intro'), detail = $('detail');
    if (!heading || !detail) return;
    heading.textContent = p.naslov || ('Pobuda meščanov ' + (p.id_pobude || ''));
    if (intro) intro.textContent = p.igrisce || p.ulica || 'Pobuda meščanov ob igrišču';
    const kam = p.kam ? p.kam.text : '';
    /* Pristojnost po parceli te točke, ne po celotnem igrišču. */
    detail.innerHTML =
      `<div class="anketa-card sola-card">` +
      `<p>Pobuda meščanov <a href="${POBUDE_PORTAL}" target="_blank" rel="noopener">${escapeHTML(p.id_pobude || p.id || '')}</a></p>` +
      `<p>Igrišče: ${escapeHTML(p.igrisce || 'ni navedeno')}</p>` +
      (p.leto ? `<p>Leto: ${escapeHTML(String(p.leto))}</p>` : '') +
      (p.status ? `<p>Status: ${escapeHTML(p.status)}</p>` : '') +
      (kam ? `<p>Kam gre predlog na tem mestu: ${escapeHTML(kam)}</p>` : '') +
      `<p class="small">Pristojnost velja za točko na zemljišču, ne za celotno igrišče.</p>` +
      `</div>`;
    window.dispatchEvent(new Event('savsko-property-selected'));
  }
  window.showSolaSkupina = showSolaSkupina;
  window.showSolaPobuda = showSolaPobuda;

  function refreshSolaLegend() {
    const box = $('infraLegend');
    if (!box) return;
    const on = $('layerSolaPredlogi') && $('layerSolaPredlogi').checked;
    const unsafeOn = $('layerSolaPoti') && $('layerSolaPoti').checked;
    const pobudeOn = $('layerSolaPobude') && $('layerSolaPobude').checked;
    let html = box.innerHTML;
    html = html.replace(/\s*<div class="sola-legend">[\s\S]*?<\/div>/, '');
    if (on || unsafeOn || pobudeOn) {
      const swatches = P().CATEGORIES.map(t =>
        `<span><i style="background:${P().COLORS[t]}"></i>${t}</span>`
      ).join('');
      html += `<div class="sola-legend">` +
        (on ? `<span><b>Predlogi učencev</b> — zbirno, najmanj 5</span>${swatches}` : '') +
        (unsafeOn ? `<span>Pot v šolo (zbirno, najmanj 5): <i style="background:#22c55e"></i>Varno <i style="background:#eab308"></i>Pazi <i style="background:#dc2626"></i>Nevarno</span>` : '') +
        (pobudeOn ? `<span>Pobude meščanov ob igriščih</span>` : '') +
        (usingPrimer || usingPrimerPoti ? `<p class="primer-flag">PRIMER podatki — izmišljeni, niso pravi vnosi.</p>` : '') +
        `<p>Hvala šolskemu parlamentu in vsem, ki so dali predloge. <a href="${FORM_URL}" target="_blank" rel="noopener">Google obrazec</a></p>` +
        `</div>`;
    }
    box.innerHTML = html;
    box.hidden = !box.innerHTML.trim();
  }

  async function build() {
    if (loaded) return;
    const viewer = window.savsko.viewer;
    const C = Cesium;
    const pred = await loadJson(['sola-predlogi.geojson', 'sola-predlogi.PRIMER.geojson']);
    const poti = await loadJson(['sola-poti.geojson', 'sola-poti.PRIMER.geojson']);
    const pobude = await loadJson(['sloji/pobude-igrisca-sola.geojson', '../pobude-igrisca-sola.geojson']);

    solaLayer = new C.CustomDataSource('sola-predlogi');
    solaLayer.show = false;
    if (pred && pred.data) {
      usingPrimer = /PRIMER/i.test(pred.path) || P().isPrimerCollection(pred.data);
      const clusters = P().clusterCollection(pred.data, parcels(), zvetl());
      clusters.forEach(c => addClusterEntity(solaLayer, c, 'predlog'));
    }
    await viewer.dataSources.add(solaLayer);

    unsafeLayer = new C.CustomDataSource('sola-poti');
    unsafeLayer.show = false;
    if (poti && poti.data) {
      usingPrimerPoti = /PRIMER/i.test(poti.path) || P().isPrimerCollection(poti.data);
      const clusters = P().clusterUnsafe(poti.data, parcels(), zvetl());
      clusters.forEach(c => addClusterEntity(unsafeLayer, c, 'nevarno'));
      const segs = P().clusterPathSegments(poti.data);
      segs.forEach(s => {
        const flat = s.coords.flat();
        if (flat.length < 4) return;
        const ent = unsafeLayer.entities.add({
          polyline: {
            positions: C.Cartesian3.fromDegreesArray(flat),
            width: 5,
            clampToGround: true,
            material: C.Color.fromCssColorString(s.color || '#22c55e')
          }
        });
        ent.solaSkupina = {
          vrsta: 'odsek',
          topic: (P().PATH_SAFETY_LABEL || {})[s.safety] || s.safety,
          count: s.count,
          safety: s.safety,
          primer: s.primer,
          stances: {},
          kam: {},
          kraj: '',
          pobude_id: [],
          wide: false
        };
      });
    }
    await viewer.dataSources.add(unsafeLayer);

    pobudeLayer = new C.CustomDataSource('sola-pobude');
    pobudeLayer.show = false;
    if (pobude && pobude.data) {
      for (const f of pobude.data.features || []) {
        if (f.geometry && f.geometry.type === 'Point') {
          const [lon, lat] = f.geometry.coordinates;
          const props = Object.assign({}, f.properties);
          props.kam = (window.SOLA_INTERNAL ? P().kamGrePredlog : P().kamGreJavno)(lon, lat, parcels(), zvetl());
          const entity = pobudeLayer.entities.add({
            position: C.Cartesian3.fromDegrees(lon, lat),
            point: {
              pixelSize: 9,
              color: C.Color.fromCssColorString('#0f766e'),
              outlineColor: C.Color.WHITE,
              outlineWidth: 1,
              heightReference: C.HeightReference.CLAMP_TO_GROUND,
              disableDepthTestDistance: Number.POSITIVE_INFINITY
            }
          });
          entity.solaPobuda = props;
        }
      }
    }
    await viewer.dataSources.add(pobudeLayer);
    loaded = true;
  }

  function wire() {
    const pairs = [
      ['layerSolaPredlogi', () => solaLayer],
      ['layerSolaPoti', () => unsafeLayer],
      ['layerSolaPobude', () => pobudeLayer]
    ];
    pairs.forEach(([id, get]) => {
      const input = $(id);
      if (!input) return;
      input.addEventListener('change', async () => {
        if (input.checked && !loaded) await build();
        const ds = get();
        if (ds) ds.show = input.checked;
        refreshSolaLegend();
        window.savsko.viewer && window.savsko.viewer.scene.requestRender();
      });
    });
  }

  whenReady(() => { wire(); });
})();
