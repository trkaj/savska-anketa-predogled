/* Plast »Glas učencev«: dokler ni izvoza od šole, ostane prazna z oznako »kmalu«.
   Prosta besedila se pokažejo samo, če imajo polje odobreno. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const escapeHTML = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const CENTER = [14.5223, 46.0635];
  const COLORS = {
    ulica: '#2563eb',
    druzzenje: '#0f766e',
    izogibanje: '#b45309',
    kmalu: '#173f34'
  };

  let layer = null, loaded = false, collection = null;

  function whenReady(fn) {
    const t = setInterval(() => {
      if (window.savsko && window.savsko.ready && window.savsko.viewer) {
        clearInterval(t); fn();
      }
    }, 50);
    setTimeout(() => clearInterval(t), 120000);
  }

  async function loadJson() {
    try {
      const r = await fetch('glas-ucencev.geojson');
      if (r.ok) return await r.json();
    } catch (e) { /* manjkajoča datoteka */ }
    return {
      type: 'FeatureCollection',
      properties: {sloj: 'Glas učencev', status: 'kmalu', povzetek: '', n: 0},
      features: []
    };
  }

  function isKmalu(data) {
    const st = (data && data.properties && data.properties.status) || 'kmalu';
    return st === 'kmalu' || !((data && data.features) || []).length && !(data && data.properties && data.properties.n);
  }

  function countersHTML(title, obj) {
    const entries = Object.entries(obj || {}).sort((a, b) => b[1] - a[1]);
    if (!entries.length) return '';
    return `<h3>${escapeHTML(title)}</h3><ul>` +
      entries.map(([k, n]) => `<li>${escapeHTML(k)}: <strong>${escapeHTML(String(n))}</strong></li>`).join('') +
      `</ul>`;
  }

  function showOverview() {
    const heading = $('heading'), intro = $('intro'), detail = $('detail');
    if (!heading || !detail) return;
    const p = (collection && collection.properties) || {};
    heading.textContent = 'Glas učencev';
    if (isKmalu(collection)) {
      if (intro) intro.textContent = 'kmalu';
      detail.innerHTML =
        `<div class="anketa-card sola-card glas-card">` +
        `<p><strong>kmalu</strong></p>` +
        `<p>Tu bo zbirni prikaz ankete učencev. Vir bo anonimen izvoz, ki ga pošlje šola. Plast je za zdaj prazna.</p>` +
        `</div>`;
    } else {
      if (intro) intro.textContent = 'Zbirni prikaz ankete učencev (anonimen izvoz šole).';
      const okvir = p.stranski_okvir || {};
      const ulice = p.ulice || [];
      const razredi = p.razredi || [];
      const texts = (p.besedila || []).filter(t => t && t.odobreno && t.besedilo);
      detail.innerHTML =
        `<div class="anketa-card sola-card glas-card">` +
        `<p><strong>${escapeHTML(String(p.n || 0))}</strong> odgovorov.</p>` +
        (p.povzetek ? `<p>${escapeHTML(p.povzetek)}</p>` : `<p class="small">Kratki povzetek prostih besedil bo dodan po učiteljevem pregledu.</p>`) +
        (razredi.length ? `<h3>Po razredih</h3><ul>` + razredi.map(r =>
          `<li>${escapeHTML(r.razred)}: ${escapeHTML(String(r.n))} odgovorov` +
          (r.ocena_naselja != null ? `, ocena naselja ${escapeHTML(String(r.ocena_naselja))}` : '') +
          (r.ocena_poti != null ? `, varnost poti ${escapeHTML(String(r.ocena_poti))}` : '') +
          `</li>`
        ).join('') + `</ul>` : '') +
        (ulice.length ? `<h3>Po ulicah</h3><ul>` + ulice.map(u =>
          `<li>${escapeHTML(u.ulica)}: ${escapeHTML(String(u.n))}` +
          (u.ocena_naselja != null ? `, ocena naselja ${escapeHTML(String(u.ocena_naselja))}` : '') +
          (u.ocena_poti != null ? `, varnost poti ${escapeHTML(String(u.ocena_poti))}` : '') +
          `</li>`
        ).join('') + `</ul>` : '') +
        countersHTML('Želeni dogodki', okvir.dogodki) +
        countersHTML('Pripravljenost za pomoč', okvir.pomoc) +
        countersHTML('Pri čem bi pomagali', okvir.pomoc_pri) +
        (texts.length ? `<h3>Odobrena prosta besedila</h3>` + texts.map(t =>
          `<p>${escapeHTML(t.besedilo)}</p>`
        ).join('') : '') +
        `<p class="small">Prosti odgovori so javni samo po učiteljevem pregledu (polje odobreno). E-naslovov ni.</p>` +
        `</div>`;
    }
    window.dispatchEvent(new Event('savsko-property-selected'));
  }

  function showFeature(props) {
    const heading = $('heading'), intro = $('intro'), detail = $('detail');
    if (!heading || !detail) return;
    if (!props || props.vrsta === 'kmalu') { showOverview(); return; }
    if (props.vrsta === 'ulica') {
      heading.textContent = props.ime || 'Ulica';
      if (intro) intro.textContent = 'Glas učencev · zbirno po ulici';
      detail.innerHTML =
        `<div class="anketa-card sola-card glas-card">` +
        `<p><strong>${escapeHTML(String(props.n || 0))}</strong> odgovorov.</p>` +
        (props.ocena_naselja != null ? `<p>Povprečna ocena naselja: ${escapeHTML(String(props.ocena_naselja))}</p>` : '') +
        (props.ocena_poti != null ? `<p>Povprečna ocena varnosti poti: ${escapeHTML(String(props.ocena_poti))}</p>` : '') +
        countersHTML('Kaj je všeč', props.vsec) +
        countersHTML('Kaj najbolj moti', props.moti) +
        `</div>`;
    } else if (props.vrsta === 'druzzenje' || props.vrsta === 'izogibanje') {
      heading.textContent = props.ime || 'Kraj';
      if (intro) intro.textContent = props.vrsta === 'izogibanje' ? 'Kraj izogibanja (število glasov)' : 'Kraj druženja (število glasov)';
      detail.innerHTML =
        `<div class="anketa-card sola-card glas-card">` +
        `<p><strong>${escapeHTML(String(props.glasovi || props.n || 0))}</strong> glasov.</p>` +
        `<p class="small">Prikazano je samo število, brez posamičnih odgovorov.</p>` +
        `</div>`;
    } else {
      showOverview();
      return;
    }
    window.dispatchEvent(new Event('savsko-property-selected'));
  }
  window.showGlasUcencev = showFeature;

  function refreshLegend() {
    const box = $('infraLegend');
    const on = $('layerGlasUcencev') && $('layerGlasUcencev').checked;
    if (!box) return;
    let html = box.innerHTML.replace(/\s*<div class="glas-legend">[\s\S]*?<\/div>/, '');
    if (on) {
      const kmalu = isKmalu(collection);
      html += `<div class="glas-legend">` +
        (kmalu
          ? `<span><b>Glas učencev</b> — kmalu</span>`
          : `<span><b>Glas učencev</b> — zbirno` +
            ` <i style="background:${COLORS.ulica}"></i>ulice` +
            ` <i style="background:${COLORS.druzzenje}"></i>druženje` +
            ` <i style="background:${COLORS.izogibanje}"></i>izogibanje</span>`) +
        `</div>`;
    }
    box.innerHTML = html;
    box.hidden = !box.innerHTML.trim();
  }

  async function build() {
    if (loaded) return;
    const viewer = window.savsko.viewer;
    const C = Cesium;
    collection = await loadJson();
    layer = new C.CustomDataSource('glas-ucencev');
    layer.show = false;
    if (isKmalu(collection)) {
      const ent = layer.entities.add({
        position: C.Cartesian3.fromDegrees(CENTER[0], CENTER[1]),
        label: {
          text: 'Glas učencev — kmalu',
          font: 'bold 16px sans-serif',
          fillColor: C.Color.WHITE,
          outlineColor: C.Color.fromCssColorString(COLORS.kmalu),
          outlineWidth: 4,
          style: C.LabelStyle.FILL_AND_OUTLINE,
          pixelOffset: new C.Cartesian2(0, -12),
          heightReference: C.HeightReference.CLAMP_TO_GROUND,
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        },
        point: {
          pixelSize: 10,
          color: C.Color.fromCssColorString(COLORS.kmalu),
          outlineColor: C.Color.WHITE,
          outlineWidth: 2,
          heightReference: C.HeightReference.CLAMP_TO_GROUND,
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        }
      });
      ent.glasUcencev = {vrsta: 'kmalu'};
    } else {
      for (const f of collection.features || []) {
        if (!f.geometry || f.geometry.type !== 'Point') continue;
        const [lon, lat] = f.geometry.coordinates;
        const props = Object.assign({}, f.properties);
        const color = COLORS[props.vrsta] || '#334155';
        const n = props.glasovi || props.n;
        const ent = layer.entities.add({
          position: C.Cartesian3.fromDegrees(lon, lat),
          point: {
            pixelSize: props.vrsta === 'ulica' ? 14 : 12,
            color: C.Color.fromCssColorString(color),
            outlineColor: C.Color.WHITE,
            outlineWidth: 2,
            heightReference: C.HeightReference.CLAMP_TO_GROUND,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          },
          label: n != null ? {
            text: String(n),
            font: 'bold 11px sans-serif',
            fillColor: C.Color.WHITE,
            outlineColor: C.Color.fromCssColorString('#102137'),
            outlineWidth: 3,
            style: C.LabelStyle.FILL_AND_OUTLINE,
            pixelOffset: new C.Cartesian2(0, -16),
            heightReference: C.HeightReference.CLAMP_TO_GROUND,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          } : undefined
        });
        ent.glasUcencev = props;
      }
    }
    await viewer.dataSources.add(layer);
    loaded = true;
  }

  function wire() {
    const input = $('layerGlasUcencev');
    if (!input) return;
    input.addEventListener('change', async () => {
      if (input.checked && !loaded) await build();
      if (layer) layer.show = input.checked;
      refreshLegend();
      if (input.checked) showOverview();
      window.savsko.viewer && window.savsko.viewer.scene.requestRender();
    });
  }

  whenReady(() => { wire(); });
})();
