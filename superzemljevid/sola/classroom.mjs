import {KIND_NAMES} from './core.mjs';

export function meetingNote(records, nextStep, origin) {
  const lines = ['Naselje po tvoje · Razredni izbor', 'Savsko naselje, Ljubljana', ''];
  for (const [i, r] of records.entries()) {
    const link = new URL('./', import.meta.url);
    link.searchParams.set('lat', r.point[1].toFixed(6));
    link.searchParams.set('lon', r.point[0].toFixed(6));
    lines.push((i + 1) + '. ' + KIND_NAMES[r.kind] + ' · ' + r.grade + ' · ' + r.topic,
      r.text, r.place || 'Označeno mesto', link.href, '');
  }
  lines.push('Naslednji korak', nextStep.trim() || 'Dogovor dopišemo na sestanku.', '');
  return lines.join('\n');
}

export function attachClassroom({download, toast}) {
  const $ = id => document.getElementById(id);
  const selected = new Map();
  function render() {
    $('classList').replaceChildren();
    for (const record of selected.values()) {
      const li = document.createElement('li');
      li.append(document.createTextNode(record.id + '. ' + KIND_NAMES[record.kind] + ' · ' + record.text.slice(0, 70)));
      const remove = document.createElement('button');
      remove.textContent = 'Odstrani';
      remove.setAttribute('aria-label', 'Odstrani zapis ' + record.id + ' iz izbora');
      remove.onclick = () => { toggle(record); $('classList').querySelector('button')?.focus(); };
      li.append(remove);
      $('classList').append(li);
    }
    $('classExport').disabled = selected.size === 0;
    $('classCount').textContent = 'Izbrano ' + selected.size + ' od 3.';
    for (const button of document.querySelectorAll('[data-class-record]')) {
      const active = selected.has(Number(button.dataset.classRecord));
      button.setAttribute('aria-pressed', String(active));
      button.textContent = active ? 'V izboru ✓' : 'V izbor';
      button.setAttribute('aria-label', (active ? 'Odstrani zapis ' : 'Dodaj zapis ') + button.dataset.classRecord + (active ? ' iz razrednega izbora' : ' v razredni izbor'));
    }
  }
  function toggle(record) {
    if (selected.has(record.id)) selected.delete(record.id);
    else if (selected.size < 3) selected.set(record.id, record);
    else { $('classCount').textContent = 'Izbrani so že trije zapisi. Najprej enega odstrani.'; toast($('classCount').textContent); return; }
    render();
  }
  function button(record) {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.classRecord = record.id;
    b.onclick = () => toggle(record);
    return b;
  }
  function clear() { selected.clear(); $('classNext').value = ''; render(); }
  $('classExport').onclick = () => {
    if (selected.size) download('Razredni_izbor_Savsko_naselje.txt', meetingNote([...selected.values()], $('classNext').value, location.origin), 'text/plain;charset=utf-8');
  };
  return {button, render, clear};
}
