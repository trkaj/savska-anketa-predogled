export const landmarks = [
  {id: 'school', name: 'OŠ Savsko naselje', short: 'Šola', address: 'Matjaževa ulica 4', icon: 'school', side: -1, offset: -20},
  {id: 'things', name: 'Knjižnica Reči', short: 'Knjižnica Reči', address: 'Belokranjska ulica 6', icon: 'things', side: -1, offset: 26},
  {id: 'library', name: 'Knjižnica Savsko naselje (MKL)', short: 'Knjižnica MKL', address: 'Belokranjska ulica 2', icon: 'book', side: 1, offset: -26},
  {id: 'serkovo', name: 'Igrišče na Šerkovi', short: 'Šerkova', icon: 'pin', side: 1, offset: 28, point: [14.52195, 46.06177], hint: 'Učenci pogosto predlagajo prijaznejšo podlago in nove gole.', primer: true},
  {id: 'filipovo', name: 'Filipovo igrišče', short: 'Filipovo', icon: 'pin', side: -1, offset: 30, point: [14.52397, 46.06457], hint: 'Če predlagaš odbojkarsko mrežo, jo postavi ob igrišče, ne na pot.', primer: true}
];

export function placeIndex(addresses) {
  const streets = addresses.map(a => ({name: a.label, address: '', point: [a.longitude, a.latitude]}));
  const known = landmarks.flatMap(place => {
    if (place.point) return [place];
    const street = streets.find(a => a.name === place.address);
    return street ? [{...place, point: street.point}] : [];
  });
  return [...known, ...streets];
}

function fold(text) {
  return text.trim().toLocaleLowerCase('sl').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ');
}

export function searchPlaces(index, query) {
  const q = fold(query);
  if (!q) return {exact: null, matches: []};
  const exact = index.find(p => [p.name, p.short || ''].some(v => fold(v) === q)) || null;
  const parts = q.split(' ');
  const matches = index.filter(place => {
    const haystack = fold([place.name, place.address, place.short].join(' '));
    return parts.every(part => haystack.includes(part));
  }).sort((a, b) => Number(!!b.id) - Number(!!a.id) || a.name.localeCompare(b.name, 'sl', {numeric: true}));
  return {exact, matches};
}

const questions = {
  idea: ['Kaj bi tukaj dodal/a ali spremenil/a?', 'Kaj tu manjka? Pomisli, kako bi ta prostor uporabljal/a po pouku.', 'Komu bi sprememba pomagala in kako bi jo lahko preizkusili?'],
  keep: ['Kaj želiš tukaj ohraniti?', 'Kaj na tem mestu najraje počneš? Kaj naj ostane tako, kot je?', 'Zakaj je ta prostor pomemben in kdo ga uporablja?'],
  problem: ['Kaj te na tem mestu moti?', 'Kaj se tu zgodi? Napiši, kdaj to opaziš.', 'Kdaj je težava največja, koga prizadene in kaj bi jo ublažilo?'],
  avoid: ['Zakaj se temu mestu raje izogneš?', 'Kako se tu počutiš? Kaj bi ti pomagalo?', 'Kaj vpliva na tvoje počutje in s katero spremembo bi se počutil/a bolje?']
};

export function writingPrompt(kind, grade) {
  const [label, simple, advanced] = questions[kind] || questions.idea;
  return {label, hint: Number.parseInt(grade, 10) >= 7 ? advanced : simple};
}

export function scaleBar(metresPerPixel) {
  if (!(metresPerPixel > 0)) return null;
  const ideal = metresPerPixel * 72;
  const base = 10 ** Math.floor(Math.log10(ideal));
  const metres = [1, 2, 5, 10].map(n => n * base).reduce((best, n) =>
    Math.abs(n - ideal) < Math.abs(best - ideal) ? n : best);
  return {metres, width: metres / metresPerPixel};
}
