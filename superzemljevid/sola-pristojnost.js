/* Skupna logika sloja Predlogi učencev. Brez imen, deležev in EMŠO.
   Javni sloj kaže samo zbirne skupine (najmanj 5), brez prostega besedila in fotografij. */
(function (root) {
  'use strict';

  /* V učenskem vnosnem pogledu (/sola/) ne kažemo oznak ZVEtL.
     Če je treba obratno, to zastavico nastavi na true. */
  const SHOW_ZVETL_IN_SCHOOL_VIEW = false;

  const REVIEWED = {reviewed: 1, prepare_visual: 1, visual_ready: 1, closed: 1};
  const CATEGORIES = ['Igrišča', 'Šport', 'Čistoča', 'Druženje', 'Drugo'];
  const TOPIC_MAP = {
    'Igrišča': 'Igrišča', 'Šport': 'Šport', 'Čistoča': 'Čistoča',
    'Druženje': 'Druženje', 'Drugo': 'Drugo',
    'Zelenje': 'Drugo', 'Varna pot': 'Drugo'
  };
  const COLORS = {
    'Igrišča': '#e4572e', 'Šport': '#2a9d8f', 'Čistoča': '#4c9f38',
    'Druženje': '#7b2cbf', 'Drugo': '#6b7280'
  };
  const MOODS = {veselo: '😊', srednje: '😐', zalostno: '☹️'};
  const PATH_SAFETY = {varno: '#22c55e', pazi: '#eab308', nevarno: '#dc2626'};
  const PATH_SAFETY_LABEL = {varno: 'Varno', pazi: 'Pazi', nevarno: 'Nevarno'};
  const KNOWN_KRAJI = {
    'Šerkovo igrišče': 1, 'Igrišče na Šerkovi': 1, 'Filipovo igrišče': 1
  };
  const UNSAFE_REASONS = {
    promet: 'Promet',
    prehod: 'Prehod',
    tema: 'Tema',
    'pasji iztrebki': 'Pasji iztrebki',
    drugo: 'Drugo'
  };
  const CELL_M = 50;
  const LAT0 = 46.0635, LON0 = 14.5223;
  const M_PER_LAT = 111320;
  const M_PER_LON = 111320 * Math.cos(LAT0 * Math.PI / 180);

  function mapTopic(topic) {
    if (!topic) return 'Drugo';
    return TOPIC_MAP[topic] || (CATEGORIES.indexOf(topic) >= 0 ? topic : 'Drugo');
  }
  function stanceFromKind(kind) {
    return kind === 'keep' ? 'v_redu' : 'spremenil';
  }
  function stanceLabel(s) {
    return s === 'v_redu' ? 'tu je v redu' : 'tu bi spremenil';
  }
  function toMeters(lon, lat) {
    return [(lon - LON0) * M_PER_LON, (lat - LAT0) * M_PER_LAT];
  }
  function fromMeters(x, y) {
    return [LON0 + x / M_PER_LON, LAT0 + y / M_PER_LAT];
  }
  function cellKey(lon, lat, size) {
    const m = toMeters(lon, lat);
    return Math.floor(m[0] / size) + ',' + Math.floor(m[1] / size);
  }
  function inRing(point, ring) {
    let yes = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const a = ring[i], b = ring[j];
      if (((a[1] > point[1]) !== (b[1] > point[1])) &&
          (point[0] < (b[0] - a[0]) * (point[1] - a[1]) / (b[1] - a[1]) + a[0])) yes = !yes;
    }
    return yes;
  }
  function contains(point, g) {
    if (!g) return false;
    const polys = g.type === 'MultiPolygon' ? g.coordinates : [g.coordinates];
    return polys.some(r => inRing(point, r[0]) && !r.slice(1).some(h => inRing(point, h)));
  }
  function normalizePobude(v) {
    if (v == null || v === '') return [];
    const arr = Array.isArray(v) ? v : String(v).split(/[,\s]+/);
    return arr.map(x => String(x).trim()).filter(Boolean);
  }
  function stripProps(p) {
    const kraj = KNOWN_KRAJI[p.kraj] ? p.kraj : '';
    return {
      kind: p.kind || 'idea',
      topic: mapTopic(p.topic),
      stance: stanceFromKind(p.kind),
      mood: (p.mood && MOODS[p.mood]) ? p.mood : '',
      kraj,
      primer: !!p.primer,
      pobude_id: normalizePobude(p.pobude_id),
      status: p.status
    };
  }
  function isReviewed(p) {
    return !!(p && REVIEWED[p.status]);
  }

  /* Kam gre predlog — samo za glavni in interni zemljevid, ne za učenski vnos.
     Brez imen lastnikov (ne uporablja zvetl_owner_label). */
  function findParcel(lon, lat, parcels) {
    if (!parcels || !parcels.features) return null;
    for (const f of parcels.features) {
      if (contains([lon, lat], f.geometry)) return f;
    }
    return null;
  }
  function parcelZvetl(feat, zvetl) {
    if (!feat) return {};
    const p = feat.properties || {};
    const key = p.KO_ID + ':' + p.ST_PARCELE;
    return (zvetl && zvetl.parcels && (zvetl.parcels[key] || zvetl.parcels['2636:' + p.ST_PARCELE])) || {};
  }
  function hasZvetlAnnotation(rec) {
    if (!rec) return false;
    if (rec.zvetl_status === 'case_pending') return true;
    const cases = rec.cases || [];
    return cases.some(c => c && (c.koda === '317' || c.koda === '318' || c.koda === 317 || c.koda === 318));
  }
  function opravilne(rec) {
    const seen = {}, out = [];
    for (const c of rec.cases || []) {
      const o = c && c.opravilna;
      if (o && !seen[o]) { seen[o] = 1; out.push(o); }
    }
    if (!out.length && rec.zvetl_case) {
      const m = String(rec.zvetl_case).match(/III N\s+\d+\/\d+/g);
      if (m) m.forEach(x => { if (!seen[x]) { seen[x] = 1; out.push(x); } });
    }
    return out;
  }
  function kamGrePredlog(lon, lat, parcels, zvetl) {
    /* Javna različica: brez oznake ZVEtL. */
    return kamGreJavno(lon, lat, parcels, zvetl);
  }

  function kamGreJavno(lon, lat, parcels, zvetl) {
    const feat = findParcel(lon, lat, parcels);
    if (!feat) {
      return {code: 'neznano', text: 'Za to mesto še nimamo dovolj podatkov o zemljišču.', parcela: null, lastnik_tip: '', opravilna: []};
    }
    const p = feat.properties;
    const rec = parcelZvetl(feat, zvetl);
    const typ = rec.zvetl_owner_type || '';
    const cat = p.owner_categories || '';
    const mol = typ === 'MOL' || {mol: 1, mol_gis_only: 1, mol_unspecified: 1}[p.owner_status];
    const etazni = typ === 'etazni_lastniki' || /etažni|etazni/i.test(cat) || rec.zvetl_caretaker === 'upravnik etažnih lastnikov';
    if (mol) return {code: 'mol', text: 'k Četrtni skupnosti (zemljišče MOL, plan manjših del)', parcela: null, lastnik_tip: '', opravilna: []};
    if (etazni) return {code: 'upravnik', text: 'k upravniku (skupni del stavbe, odločajo etažni lastniki)', parcela: null, lastnik_tip: '', opravilna: []};
    if (typ === 'druzbena_lastnina' || /družbena|druzbena/i.test(cat)) {
      return {code: 'druzbena', text: 'še ni jasno, kdo odloča (ni zemljišče MOL in ni skupni del bloka)', parcela: null, lastnik_tip: '', opravilna: []};
    }
    return {code: 'drugo', text: 'to ni zemljišče MOL in ni skupni del bloka — predlog gre drugam', parcela: null, lastnik_tip: '', opravilna: []};
  }

  function reviewedPoints(collection) {
    const out = [];
    for (const f of (collection && collection.features) || []) {
      if (!f || !f.geometry || f.geometry.type !== 'Point') continue;
      const p = f.properties || {};
      if (!isReviewed(p)) continue;
      const c = f.geometry.coordinates;
      if (!c || !Number.isFinite(c[0]) || !Number.isFinite(c[1])) continue;
      out.push({lon: c[0], lat: c[1], props: stripProps(p), id: p.id});
    }
    return out;
  }

  function groupToCluster(members, topic, sizeM, wide) {
    if (members.length < 5) return null;
    let slon = 0, slat = 0;
    const stances = {v_redu: 0, spremenil: 0};
    const moods = {veselo: 0, srednje: 0, zalostno: 0};
    const codes = {};
    const pobude = {};
    let primer = false;
    const kraji = {};
    members.forEach(m => {
      slon += m.lon; slat += m.lat;
      stances[m.props.stance] = (stances[m.props.stance] || 0) + 1;
      if (m.props.mood && moods[m.props.mood] != null) moods[m.props.mood]++;
      primer = primer || m.props.primer;
      if (m.props.kraj) kraji[m.props.kraj] = (kraji[m.props.kraj] || 0) + 1;
      (m.props.pobude_id || []).forEach(id => { pobude[id] = 1; });
      if (m.kam && m.kam.code) codes[m.kam.code] = (codes[m.kam.code] || 0) + 1;
    });
    const kraj = Object.keys(kraji).sort((a, b) => kraji[b] - kraji[a])[0] || '';
    return {
      lon: slon / members.length,
      lat: slat / members.length,
      count: members.length,
      topic,
      stances,
      primer,
      kraj,
      moods,
      pobude_id: Object.keys(pobude),
      kam: codes,
      wide: !!wide || sizeM > CELL_M,
      cellM: sizeM
    };
  }

  function attachKam(points, parcels, zvetl) {
    if (!parcels) return points;
    const fn = (typeof window !== 'undefined' && window.SOLA_INTERNAL) ? kamGrePredlog : kamGreJavno;
    points.forEach(m => { m.kam = fn(m.lon, m.lat, parcels, zvetl); });
    return points;
  }

  function clusterPoints(points, parcels, zvetl) {
    attachKam(points, parcels, zvetl);
    const used = new Set();
    const clusters = [];

    function bucket(size, topicOf) {
      const map = new Map();
      points.forEach((m, i) => {
        if (used.has(i)) return;
        const topic = topicOf(m);
        const key = cellKey(m.lon, m.lat, size) + '|' + topic;
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(i);
      });
      return map;
    }

    function take(map, size, wide) {
      for (const [key, idxs] of map) {
        if (idxs.length < 5) continue;
        const topic = key.split('|')[1];
        const members = idxs.map(i => points[i]);
        const c = groupToCluster(members, topic, size, wide);
        if (c) {
          clusters.push(c);
          idxs.forEach(i => used.add(i));
        }
      }
    }

    take(bucket(CELL_M, m => m.props.topic), CELL_M, false);
    take(bucket(CELL_M, () => 'Drugo'), CELL_M, false);
    take(bucket(100, () => 'Drugo'), 100, true);
    take(bucket(200, () => 'Drugo'), 200, true);
    const leftover = points.filter((_, i) => !used.has(i));
    if (leftover.length >= 5) {
      const c = groupToCluster(leftover, 'Drugo', 400, true);
      if (c) clusters.push(c);
    }
    return clusters;
  }

  function clusterCollection(collection, parcels, zvetl) {
    return clusterPoints(reviewedPoints(collection), parcels, zvetl);
  }

  /* Poti ne obrezujemo in jih ne začenjamo pri križišču.
     Anonimnost: javno samo zbirni prikaz, odseki z manj kot 5 potmi ostanejo skriti. */
  function trimPath(coords, meters) {
    return coords || [];
  }
  function nearestCorner(lon, lat, corners, maxM) {
    return null;
  }
  function preparePath(coords, corners) {
    if (!coords || coords.length < 2) return coords || [];
    return coords.map(c => [c[0], c[1]]);
  }

  function reviewedUnsafe(pathCollection) {
    const out = [];
    for (const f of (pathCollection && pathCollection.features) || []) {
      const p = f.properties || {};
      if (!isReviewed(p)) continue;
      for (const u of p.unsafe || []) {
        const c = u.coordinates || u;
        if (!c || !Number.isFinite(c[0]) || !Number.isFinite(c[1])) continue;
        const reason = UNSAFE_REASONS[u.reason] ? u.reason : 'drugo';
        out.push({
          lon: c[0], lat: c[1],
          props: {topic: reason, kind: 'problem', stance: 'spremenil', primer: !!p.primer, pobude_id: [], status: p.status, kraj: ''},
          id: (p.id || 'pot') + '-' + reason,
          unsafeReason: reason
        });
      }
    }
    return out;
  }
  function clusterUnsafe(pathCollection, parcels, zvetl) {
    /* Združujemo po razlogu (kot po kategoriji). Javno samo zbirno. */
    const points = reviewedUnsafe(pathCollection).map(m => {
      m.props.topic = UNSAFE_REASONS[m.unsafeReason] || 'Drugo';
      return m;
    });
    return clusterPoints(points, parcels, zvetl);
  }


  function safetyOfPoint(lon, lat, marks) {
    let best = 'varno', bestD = Infinity;
    for (const m of marks || []) {
      const a = toMeters(lon, lat), b = toMeters(m.lon, m.lat);
      const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (d < 35 && d < bestD) {
        bestD = d;
        best = m.safety === 'nevarno' || m.reason ? 'nevarno' : (m.safety || 'pazi');
        if (m.safety) best = m.safety;
      }
    }
    return best;
  }

  function reviewedPathSegments(collection) {
    const out = [];
    for (const f of (collection && collection.features) || []) {
      const p = f.properties || {};
      if (!isReviewed(p)) continue;
      const primer = !!p.primer;
      const pid = p.id || ('pot-' + out.length);
      if (Array.isArray(p.odseki) && p.odseki.length) {
        for (const od of p.odseki) {
          const coords = od.coordinates || od.coords;
          const safety = PATH_SAFETY[od.safety] ? od.safety : 'varno';
          if (!coords || coords.length < 2) continue;
          out.push({id: pid, coords, safety, primer});
        }
        continue;
      }
      const g = f.geometry || {};
      const coords = g.type === 'LineString' ? g.coordinates : null;
      if (!coords || coords.length < 2) continue;
      const marks = [];
      for (const u of p.unsafe || []) {
        const c = u.coordinates || u;
        if (!c || !Number.isFinite(c[0])) continue;
        marks.push({lon: c[0], lat: c[1], safety: u.safety || 'nevarno', reason: u.reason});
      }
      for (const m of p.pazi || p.caution || []) {
        const c = m.coordinates || m;
        if (!c || !Number.isFinite(c[0])) continue;
        marks.push({lon: c[0], lat: c[1], safety: 'pazi'});
      }
      /* Razreži na kratke odseke in pobarvaj po najbližji oznaki. */
      for (let i = 0; i < coords.length - 1; i++) {
        const a = coords[i], b = coords[i + 1];
        const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
        out.push({id: pid, coords: [a, b], safety: safetyOfPoint(mid[0], mid[1], marks), primer});
      }
    }
    return out;
  }

  function clusterPathSegments(collection) {
    const segs = reviewedPathSegments(collection);
    const buckets = new Map();
    segs.forEach(s => {
      const mid = s.coords[0];
      const key = cellKey(mid[0], mid[1], CELL_M) + '|' + s.safety;
      if (!buckets.has(key)) buckets.set(key, {safety: s.safety, segs: [], ids: new Set(), primer: false, coords: []});
      const b = buckets.get(key);
      b.segs.push(s);
      b.ids.add(s.id);
      b.primer = b.primer || s.primer;
      b.coords.push(s.coords);
    });
    const out = [];
    for (const b of buckets.values()) {
      if (b.ids.size < 5) continue; /* javno skrij odseke z manj kot 5 potmi */
      let slon = 0, slat = 0, n = 0;
      b.coords.forEach(pair => pair.forEach(c => { slon += c[0]; slat += c[1]; n++; }));
      out.push({
        safety: b.safety,
        color: PATH_SAFETY[b.safety],
        count: b.ids.size,
        lon: slon / n,
        lat: slat / n,
        coords: b.coords[0],
        primer: b.primer,
        wide: false
      });
    }
    return out;
  }

  function isPrimerCollection(data) {
    if (!data) return false;
    if (data.properties && data.properties.primer) return true;
    const feats = data.features || [];
    return feats.length > 0 && feats.every(f => f.properties && f.properties.primer);
  }

  root.SolaPristojnost = {
    SHOW_ZVETL_IN_SCHOOL_VIEW,
    REVIEWED, CATEGORIES, TOPIC_MAP, COLORS, MOODS, PATH_SAFETY, PATH_SAFETY_LABEL, UNSAFE_REASONS, CELL_M, KNOWN_KRAJI,
    mapTopic, stanceFromKind, stanceLabel, stripProps, isReviewed,
    contains, findParcel, kamGrePredlog, kamGreJavno, hasZvetlAnnotation, opravilne, parcelZvetl,
    reviewedPoints, clusterPoints, clusterCollection, attachKam,
    trimPath, preparePath, lineLengthM, nearestCorner,
    reviewedUnsafe, clusterUnsafe, clusterPathSegments, isPrimerCollection, normalizePobude
  };
})(typeof window !== 'undefined' ? window : globalThis);
