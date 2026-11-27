'use strict';

const sectionNames = {
  seje:'Seje in prisotnost', 'sklepi-po-sejah':'Sklepi', savsko:'Savsko naselje',
  sklepi:'Sklepi', sled:'Sklepi',
  zapisniki:'Zapisniki', finance:'Finance in delovanje',
  prakse:'Tuje prakse', metoda:'Kako smo šteli', vodnik:'Kako berem ta pregled?', iskanje:'Iskanje'
};
function siteSearchRoute(query) {
  return filteredRoute('iskanje', query ? new URLSearchParams({q:query}) : new URLSearchParams());
}
function siteSearchForm(query, label) {
  return '<form class="site-search" role="search"><label for="site-q">'+h(label)+'</label>'+
    '<div><input id="site-q" type="search" name="q" value="'+h(query)+'" placeholder="Npr. šolska pot, pošta ali Endliherjeva" enterkeyhint="search">'+
    '<button type="submit">Poišči</button></div></form>';
}
function searchExamples() {
  return '<div class="search-examples"><span>Poskusite</span>'+['Šolska pot','Pošta','Igrišče'].map(x=>anchor(siteSearchRoute(x),x)).join('')+'</div>';
}
function bindSiteSearch() {
  app.querySelector('.site-search').addEventListener('submit',event=>{
    event.preventDefault();
    location.hash=siteSearchRoute(event.currentTarget.elements.q.value.trim());
  });
}
function taskLink(route,title,description) {
  return '<a class="task-link" href="#'+h(route)+'"><span>'+h(title)+'</span><small>'+h(description)+'</small></a>';
}
function showHome() {
  const next=scheduledMeetings(db.meetingUpdates.sessions)[0], t=db.safeRoute;
  app.innerHTML='<section class="hero home-hero"><div class="heroText"><div class="kicker">LJUBLJANA · BEŽIGRAD</div>'+
    '<h1>Kaj se dogaja <br>v soseski<span>?</span></h1><p>Poiščite, kaj so prebivalci predlagali, kdo je odgovoril in kaj je bilo izvedeno.</p>'+
    siteSearchForm('','Iskanje po Savskem zapisniku')+searchExamples()+'</div>'+
    '<figure><img src="savske-stolpnice.webp" width="960" height="722" alt="Savske stolpnice med gradnjo leta 1958"><figcaption>Savske stolpnice, 1958 · '+link('https://commons.wikimedia.org/wiki/File:Stolpnice_v_Savskem_naselju_v_Ljubljani_1958.jpg','Peter Strnad')+'</figcaption></figure></section>'+
    '<section class="quick-section"><h2>Hitre poti</h2><div class="task-grid">'+
    taskLink('seje/aktualno','Kdaj je naslednja seja?',next?next.title+' · '+meetingTime(next):'V zadnjem pregledu še ni potrjenega prihodnjega termina.')+
    taskLink('savsko','O čem so govorili v Savskem naselju?','Obravnave v soseski od najnovejše do najstarejše.')+
    taskLink('sklepi-po-sejah?izbor=dokazila','Kaj se je zgodilo po sprejetju sklepa?','Poiščite poznejše odgovore, dokumente in potrjeno izvedbo.')+
    '</div></section><section class="school-example"><div><div class="kicker">SKLEP '+h(t.decision)+' · '+h(day(t.date))+'</div>'+
    '<h2>'+anchor(overviewRoute(t.date,t.decision),t.title)+'</h2><p>'+h(t.status)+'</p></div>'+
    anchor(overviewRoute(t.date,t.decision),'Poglejte predloge, odgovore in dokazila')+'</section>'+
    '<div class="guide-line"><div><strong>Prvič tukaj?</strong> Četrtna skupnost (ČS) Bežigrad zbira pobude iz sosesk. Njen svet o njih razpravlja in sprejema sklepe.</div>'+
    anchor('vodnik','Kdo odloča in kako berem sklepe?')+'</div>';
  bindSiteSearch();
}
function showGuide() {
  app.innerHTML=head('Kako berem ta pregled?','Savski zapisnik združuje javne zapisnike, sklepe in poznejša dokazila. Začnete lahko pri temi, ki vas zadeva.')+
    '<div class="guide-copy"><h2>Kdo je kdo?</h2><p><b>Četrtna skupnost (ČS) Bežigrad</b> pokriva tudi Savsko naselje. Njen svet obravnava lokalne pobude. V zapisniku seje vidite, kdo je bil prisoten in o čem so glasovali.</p>'+
    '<p><b>MOL</b> pomeni Mestna občina Ljubljana. Mestni svetniki lahko zastavijo vprašanje mestni upravi. Pri prometnih temah pogosto odgovarja njen <b>Oddelek za gospodarske dejavnosti in promet (OGDP)</b>.</p>'+
    '<h2>Od pobude do izvedbe</h2><ol><li><b>Pobuda.</b> Prebivalec, vrtec ali svetnik predlaga spremembo.</li><li><b>Sklep.</b> Svet z glasovanjem sprejme odločitev. Če predlaga nov prehod za pešce, zapisnik potrjuje ta predlog.</li>'+
    '<li><b>Poznejši odgovor ali izvedba.</b> Dopis lahko potrdi, da je oddelek predlog prejel. Izvedbo označimo kot potrjeno, ko jo izkazuje vir, na primer objava z lokacijo opravljenih del. Kadar takega vira še nimamo, ostane izvedba odprta.</li></ol>'+
    '<p>'+anchor('sled/5-14','Poglejte primer varne poti do šole in vrtcev')+'</p><h2>Kje najdem izvirnik?</h2><p>Pri seji ali sklepu odprite povezavo na stran uradnega zapisnika.</p>'+
    '<div class="links">'+anchor('metoda','Kako smo šteli')+anchor('zapisniki','Poiščite uradni zapisnik')+'</div></div>';
}

const resultTypes={sklep:'Sklepi',soseska:'Savsko naselje',seja:'Seje',svetnik:'Svetniki',vodilo:'Razdelki',prepis:'Strani zapisnikov'};
const searchRoots=[
  [/^post(a|e|i|o|ne|ni|na|no|nih)$/, 'post'], [/^igrisc/, 'igrisc'], [/^endliherj/, 'endliherj'],
  [/^sol(sk|a$|e$|i$|o$)/, 'sol'], [/^fabijanij|^fabianij/, 'fabianij'], [/^linhartov/, 'linhartov']
];
function searchTerms(query) {
  const words=queryWords(query.replace(/[^\p{L}\p{N}/-]+/gu,' '));
  return words.map(word=>searchRoots.find(([pattern])=>pattern.test(word))?.[1]||word);
}
function searchable(text) { return searchFormOf(text).replace(/fabijanij/g,'fabianij'); }
let searchRecords;
function makeSearchRecords() {
  const rows=[];
  function add(type,title,path,date,summary,body='',aliases='',label='') {
    rows.push({type,title,path,date,summary,label,titleIndex:searchable(title+' '+aliases),bodyIndex:searchable([summary,body,date,day(date)].join(' '))});
  }
  for(const {m,d,trail,extended,key} of getDecisionRows()) {
    const title=extended?.title||d.title;
    add('sklep',title,overviewRoute(m.date,d.id),m.date,extended?.status||decisionStatuses[trail.status],
      [d.text,decisionBriefs[key]?.summary,decisionBriefs[key]?.outcome,trail.owner,...trail.events.map(e=>e.title+' '+e.text),...(extended?.measures||[]).map(x=>x.title+' '+x.evidence)].join(' '),
      'Sklep '+d.id+(extended?' šolska pot':''),'Sklep '+d.id);
  }
  for(const e of db.savsko) {
    add('soseska',e.title,filteredRoute('savsko',new URLSearchParams({q:e.title,leto:e.date.slice(0,4)})),e.date,e.text,e.place+' '+e.topic+' '+reviewText(e)+' '+(e.result?.text||''));
  }
  for(const m of db.meetings) {
    add('seja',m.title,'seje/'+m.date,m.date,m.summary,m.agenda.join(' '));
  }
  for(const r of db.meetingUpdates.sessions) {
    add('seja',r.title,filteredRoute('seje/aktualno',new URLSearchParams({seja:r.id})),r.date,
      'Mandat '+r.term+' · '+meetingStates[r.state]+' · '+meetingTime(r),
      [r.note,...r.agenda,...(r.changes||[]).map(x=>x.text),r.minutes?.summary,
        ...(r.minutes?.decisions||[]).map(x=>x.id+' '+x.text),...(r.minutes?.pages||[]).map(x=>x.text),
        ...(r.minutes?.attendance||[]).map(x=>x.name)].join(' '));
  }
  for(const name of new Set(db.meetings.flatMap(m=>m.attendance.members.map(a=>a.name)))) {
    add('svetnik',name,filteredRoute('seje/osebe',new URLSearchParams({q:name})),'','Prisotnost na sejah in odzivi na dopisna glasovanja v mandatu 2022–2026.','','svetnik prisotnost');
  }
  for(const [path,title,description,aliases] of [
    ['seje/aktualno','Naslednja seja','Napovedani termini, spremembe in novi zapisniki.','sklic kdaj aktualne seje'],
    ['seje/osebe','Prisotnost po svetnikih','Udeležba na sejah v mandatu 2022–2026.','navzočnost udeležba'],
    ['sklepi-po-sejah?izbor=dokazila','Sklepi s poznejšimi dokazili','Spremljajte, kaj je bilo po odločitvi dokumentirano.','izvedba rezultat'],
    ...Object.entries(financeSections).map(([k,v])=>['finance/'+k,v,'Finance in delovanje ČS Bežigrad.','proračun denar finance '+(k==='sejnine'?'izplačila svetnikom':'')])
  ])add('vodilo',title,path,'',description,'',aliases);
  return rows;
}
const inflectedTerms={
  pot:/\bpot(?:i|eh|em|mi|jo)?\b/,
  sol:/\bsol(?:a|e|i|o|ah|am|ami|sk[a-z]*)?\b/,
  post:/\bpost(?:a|e|i|o|ah|am|ami|n[a-z]*)?\b/
};
function matchesTerm(field,word) {
  if(Object.hasOwn(inflectedTerms,word))return inflectedTerms[word].test(field);
  if(/^[0-9]+\/[0-9]+/.test(word))return field.split(/[^a-z0-9/-]+/).includes(word);
  return field.includes(word);
}
function siteScore(row,words,phrase) {
  if(!words.every(w=>matchesTerm(row.titleIndex,w)||matchesTerm(row.bodyIndex,w)))return 0;
  const titleHits=words.filter(w=>matchesTerm(row.titleIndex,w)).length;
  return 1+titleHits*5+(searchable(row.title)===phrase?12:0)+(row.titleIndex.includes(phrase)?4:0)+(row.type==='sklep'&&titleHits===words.length?2:0);
}
function globalMatches(query) {
  const terms=searchTerms(query), phrase=searchable(query);
  if(!terms.length)return [];
  searchRecords??=makeSearchRecords();
  const found=searchRecords.map(row=>({row,score:siteScore(row,terms,phrase)})).filter(x=>x.score);
  if(corpus)for(const m of db.meetings) {
    const pages=corpus[m.date]||[];
    for(const [i,body] of (pageIndex.get(m.date)||[]).entries()) {
      if(!terms.every(w=>matchesTerm(body,w)))continue;
      const p=pages[i];
      found.push({score:.5,row:{type:'prepis',title:m.title+' · stran '+p.n,path:archiveHref(m.date,String(p.n),new URLSearchParams({q:query})),date:m.date,
        summary:markedPassage(p.text,terms.join(' '),true),marked:true}});
    }
  }
  return found.sort((a,b)=>b.score-a.score||b.row.date.localeCompare(a.row.date)||a.row.title.localeCompare(b.row.title,'sl')).map(hit=>hit.row);
}
function showSiteSearch() {
  const params=new URLSearchParams(location.hash.split('?')[1]||'');
  const query=(params.get('q')||'').trim();
  app.innerHTML=head('Iskanje po Savskem zapisniku','Na enem mestu poiščite sklepe, obravnave v soseski in strani zapisnikov.')+
    siteSearchForm(query,'Tema, ulica, ime ali številka sklepa')+
    (query?'':searchExamples())+'<div id="site-hits"></div>';
  bindSiteSearch();
  if(!query){app.querySelector('#site-q').focus({preventScroll:true});return;}
  const target=app.querySelector('#site-hits');
  let limit=12;
  const scope=Object.hasOwn(resultTypes,params.get('vrsta'))?params.get('vrsta'):'';
  function draw(loadFailed=false) {
    if(!target.isConnected)return;
    const hits=globalMatches(query), visible=scope?hits.filter(x=>x.type===scope):hits;
    const options=[['','Vsi zadetki'],...Object.entries(resultTypes).filter(([k])=>scope===k||hits.some(x=>x.type===k))];
    const queryLink=type=>filteredRoute('iskanje',new URLSearchParams(type?{q:query,vrsta:type}:{q:query}));
    target.innerHTML='<div class="result-controls"><p role="status">'+(visible.length?'Število zadetkov za »'+h(query)+'« · <b>'+visible.length+'</b>':'Za »'+h(query)+'« ni zadetkov.')+'</p>'+
      ((hits.length||scope)?'<label>Vrsta zadetka <select id="result-type">'+filterOptions(options,scope)+'</select></label>':'')+'</div>'+
      (!corpus?'<p class="meta">'+(loadFailed?'Celotnih prepisov trenutno ni bilo mogoče naložiti. '+anchor(archiveHref('','',new URLSearchParams({q:query})),'Odpri iskanje po zapisnikih'):'Iščem še po straneh zapisnikov …')+'</p>':'')+
      visible.slice(0,limit).map(x=>'<article class="search-hit"><div class="meta">'+h(x.label||resultTypes[x.type])+(x.date?' · '+day(x.date):'')+'</div><h2>'+anchor(x.path,x.title)+'</h2><p>'+(x.marked?x.summary:h(x.summary))+'</p></article>').join('')+
      (visible.length>limit?'<button type="button" class="more-hits">Prikaži naslednje zadetke ('+Math.min(12,visible.length-limit)+')</button>':'')+
      (!visible.length&&corpus?'<p>Poskusite s krajšim delom besede ali imenom bližnje ulice.</p>'+(scope?anchor(queryLink(''),'Pokaži vse vrste zadetkov'):searchExamples()):'');
    const type=target.querySelector('#result-type');
    if(type)type.onchange=()=>{location.hash=queryLink(type.value)};
    const more=target.querySelector('.more-hits');
    if(more)more.onclick=()=>{const start=limit;limit+=12;draw();target.querySelectorAll('.search-hit h2 a')[start]?.focus()};
  }
  draw();
  if(!corpus)readCorpus().then(()=>draw()).catch(()=>draw(true));
}
function setupNavigation() {
  const button=document.getElementById('menu-toggle'), sections=document.getElementById('sections');
  function menu(open) {
    button.setAttribute('aria-expanded',String(open));
    sections.classList.toggle('menu-open',open);
  }
  button.onclick=()=>menu(button.getAttribute('aria-expanded')!=='true');
  sections.addEventListener('click',e=>{if(e.target.closest('a'))menu(false)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&button.getAttribute('aria-expanded')==='true'){menu(false);button.focus()}});
  window.addEventListener('hashchange',()=>menu(false));
  document.querySelector('.skip').onclick=e=>{e.preventDefault();document.getElementById('vsebina').focus()};
}

function simplifyFilters() {
  const tools=app.querySelector('.tools');
  if(!tools||tools.querySelector('.filter-drawer'))return;
  const labels=[...tools.children].filter(el=>el.tagName==='LABEL'&&el.querySelector('select'));
  if(!labels.length||!tools.querySelector('input[type="search"]'))return;
  const drawer=document.createElement('details');
  drawer.className='filter-drawer';
  const summary=document.createElement('summary');
  summary.textContent='Dodatni filtri';
  drawer.append(summary);
  const fields=document.createElement('div');
  fields.className='filter-fields';
  drawer.append(fields);
  drawer.open=labels.some(label=>label.querySelector('select').selectedIndex>0);
  fields.append(...labels);
  tools.append(drawer);
}
