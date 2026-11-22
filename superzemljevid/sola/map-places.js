import {placeIndex, searchPlaces} from './places.mjs';

const $ = id => document.getElementById(id);
const svgNS = 'http://www.w3.org/2000/svg';
function svgElement(tag, attributes) {
  const element = document.createElementNS(svgNS, tag);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
  return element;
}

export function attachPlaces({choose, xy}) {
  let index = [];
  let known = [];
  const input = $('addressSearch');
  const popup = $('searchChoices');
  const list = $('searchList');

  function select(place) {
    if (choose(place.point, {focus: true, label: [place.name, place.address].filter(Boolean).join(' · '), playground: place.hint ? {hint: place.hint, id: place.id, name: place.name} : null}) !== false) {
      input.value = place.name;
      popup.hidden = true;
      if (list.contains(document.activeElement)) input.focus({preventScroll: true});
    }
  }

  function suggestions(submitted = false) {
    const {exact, matches} = searchPlaces(index, input.value);
    if (submitted && exact) { select(exact); return; }
    if (submitted && matches.length === 1) { select(matches[0]); return; }
    list.replaceChildren();
    popup.hidden = !input.value.trim() && !submitted;
    if (popup.hidden) return;
    $('searchStatus').textContent = !input.value.trim() ? 'Vpiši ime kraja, ulico ali hišno številko.'
      : matches.length ? (matches.length > 8 ? 'Prvih 8 zadetkov. Za ožji izbor dopiši hišno številko.' : 'Izberi točen kraj.')
      : 'Ni zadetkov. Poskusi drugo ime ali klikni mesto na zemljevidu.';
    for (const place of matches.slice(0, 8)) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = place.name;
      if (place.address) {
        const address = document.createElement('small');
        address.textContent = place.address;
        button.append(address);
      }
      button.onclick = () => select(place);
      list.append(button);
    }
  }

  $('searchForm').onsubmit = event => { event.preventDefault(); suggestions(true); };
  input.oninput = () => suggestions();
  input.onkeydown = event => {
    if (event.key === 'ArrowDown' && input.value.trim()) {
      event.preventDefault();
      suggestions();
      list.firstElementChild?.focus();
    }
  };
  const wrap = $('searchForm').parentElement;
  wrap.addEventListener('keydown', event => {
    if (event.key === 'Escape') { popup.hidden = true; input.focus(); }
    if (!list.contains(event.target)) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const button = event.key === 'ArrowDown' ? event.target.nextElementSibling : event.target.previousElementSibling || input;
      button?.focus();
    }
  });
  wrap.addEventListener('focusout', event => {
    if (!wrap.contains(event.relatedTarget)) popup.hidden = true;
  });
  document.addEventListener('pointerdown', event => {
    if (!wrap.contains(event.target)) popup.hidden = true;
  });

  function fill(addresses) {
    index = placeIndex(addresses);
    known = index.filter(p => p.id);
    for (const place of known) {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.dataset.place = place.id;
      chip.title = place.hint ? (place.name + ' · ' + place.hint) : (place.name + (place.address ? ' · ' + place.address : ''));
      chip.setAttribute('aria-label', 'Izberi kraj ' + chip.title);
      chip.setAttribute('aria-pressed', 'false');
      const icon = svgElement('svg', {class: 'ui-icon', 'aria-hidden': 'true'});
      icon.append(svgElement('use', {href: '#i-' + place.icon}));
      chip.append(icon, document.createTextNode(place.short));
      chip.onclick = () => select(place);
      $('quickPlaces').append(chip);

      const [x, y] = xy(place.point);
      const group = svgElement('g', {class: 'landmark-marker', 'data-x': x, 'data-y': y, role: 'button', tabindex: 0, 'aria-label': chip.title});
      const width = place.id === 'school' ? 48 : 96;
      group.dataset.width = width;
      group.dataset.side = place.side;
      group.dataset.offset = place.offset;
      const left = place.side === -1 ? -width - 9 : 9;
      group.append(
        svgElement('path', {d: 'M0 0 L' + (place.side * 14) + ' ' + place.offset, class: 'leader'}),
        svgElement('circle', {r: 4}),
        svgElement('rect', {x: left, y: place.offset - 10, width, height: 20, rx: 6})
      );
      const label = svgElement('text', {x: left + width / 2, y: place.offset, 'text-anchor': 'middle'});
      label.textContent = place.short;
      group.append(label);
      group.onclick = event => { event.stopPropagation(); select(place); };
      group.onkeydown = event => {
        if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); event.stopPropagation(); select(place); }
      };
      $('landmarkPins').append(group);
    }
  }

  function fitLabels(svg, matrix) {
    const bounds = svg.getBoundingClientRect();
    const controls = $('zoomIn').parentElement.getBoundingClientRect();
    const search = $('searchForm').getBoundingClientRect();
    const clamp = (n, lo, hi) => Math.max(lo, Math.min(n, hi));
    for (const marker of $('landmarkPins').children) {
      const x = matrix.a * Number(marker.dataset.x) + matrix.e - bounds.left;
      const y = matrix.d * Number(marker.dataset.y) + matrix.f - bounds.top;
      const visible = x >= 0 && y >= 0 && x <= bounds.width && y <= bounds.height;
      marker.style.visibility = visible ? 'visible' : 'hidden';
      if (!visible) continue;
      const width = Number(marker.dataset.width);
      let labelY = clamp(y + Number(marker.dataset.offset), 14, bounds.height - 14);
      const leftSide = Number(marker.dataset.side) < 0;
      if (x < search.right - bounds.left && labelY < search.bottom - bounds.top + 12)
        labelY = search.bottom - bounds.top + 13;
      const besideControls = labelY > controls.top - bounds.top - 10 && labelY < controls.bottom - bounds.top + 10;
      const rightEdge = besideControls ? controls.left - bounds.left - 4 : bounds.width - 4;
      let left = leftSide ? x - width - 9 : x + 9;
      if (left + width > rightEdge) left = x - width - 9;
      const dx = clamp(left, 4, rightEdge - width) - x;
      const dy = labelY - y;
      const box = marker.querySelector('rect'), label = marker.querySelector('text');
      box.setAttribute('x', dx); box.setAttribute('y', dy - 10);
      label.setAttribute('x', dx + width / 2); label.setAttribute('y', dy);
      marker.querySelector('.leader').setAttribute('d', 'M0 0 L' + clamp(0, dx + 5, dx + width - 5) + ' ' + dy);
    }
  }

  function highlight(point) {
    for (const place of known) {
      const active = !!point && place.point.every((v, i) => Math.abs(v - point[i]) < 0.000001);
      $('quickPlaces').querySelector('[data-place="' + place.id + '"]').setAttribute('aria-pressed', String(active));
    }
  }

  function addToGlobe(C, viewer) {
    for (const place of known) {
      const side = place.id === 'library' && viewer.canvas.clientWidth < 500 ? -1 : place.side;
      viewer.entities.add({
        id: 'landmark-' + place.id, position: C.Cartesian3.fromDegrees(...place.point),
        point: {pixelSize: 9, color: C.Color.fromCssColorString('#234b3b'), outlineColor: C.Color.WHITE, outlineWidth: 2,
          heightReference: C.HeightReference.CLAMP_TO_GROUND, disableDepthTestDistance: Infinity},
        label: {text: place.short, font: 'bold 13px Arial', fillColor: C.Color.fromCssColorString('#193e30'),
          showBackground: true, backgroundColor: C.Color.fromCssColorString('#fffef5'), backgroundPadding: new C.Cartesian2(6, 4),
          horizontalOrigin: side === -1 ? C.HorizontalOrigin.RIGHT : C.HorizontalOrigin.LEFT,
          pixelOffset: new C.Cartesian2(side * 8, place.offset), heightReference: C.HeightReference.CLAMP_TO_GROUND, disableDepthTestDistance: Infinity}
      });
    }
  }

  function pickGlobe(id) {
    const place = known.find(p => 'landmark-' + p.id === id);
    if (!place) return false;
    select(place);
    return true;
  }

  return {fill, highlight, fitLabels, addToGlobe, pickGlobe};
}
