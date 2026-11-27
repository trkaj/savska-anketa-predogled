'use strict';

let corpus, corpusRequest;
const pageIndex = new Map();

function readCorpus() {
  if (!corpusRequest) {
    corpusRequest = fetch('prepisi.json').then(response => {
      if (!response.ok) throw Error('Prepisov ni bilo mogoče prebrati.');
      return response.json();
    }).then(data => {
      corpus = data;
      for (const [date, pages] of Object.entries(data))
        pageIndex.set(date, pages.map(page => searchFormOf(page.text)));
      return data;
    }).catch(error => { corpusRequest = undefined; throw error; });
  }
  return corpusRequest;
}

function searchFormOf(text) {
  return fold(text).replace(/endlihh?erj/g, 'endliherj').replace(/(\p{L})[-‐]\s*\n\s*(?=\p{Ll})/gu,'$1').replace(/\s+/g,' ').trim();
}
function queryWords(query) {
  return [...new Set(searchFormOf(query).split(' ').filter(Boolean))];
}
function markedPassage(text, query, snippet = false) {
  const pieces = queryWords(query);
  if (!pieces.length || !text) return h(text);
  const plain = fold(text);
  const pattern = pieces.map(word => word.replace(/[.*+?^$\x7b\x7d()|[\]\\]/g,'\\$&').replace(/endliherj/g,'endlihh?erj')).join('|');
  const re = new RegExp(pattern, 'giu');
  const first = re.exec(plain);
  const start = snippet ? Math.max(0,(first?.index || 0)-72) : 0;
  const end = snippet ? Math.min(text.length,start+235) : text.length;
  let last=start, html=start?'… ':'';
  re.lastIndex = start;
  for (let found; (found=re.exec(plain)) && found.index<end;) {
    html += h(text.slice(last,found.index))+'<mark>'+h(text.slice(found.index,Math.min(end,re.lastIndex)))+'</mark>';
    last = Math.min(end,re.lastIndex);
  }
  return html+h(text.slice(last,end))+(end<text.length?' …':'');
}
function archiveState() {
  const [path,search=''] = location.hash.slice(1).split('?');
  const [,date='',part='1'] = path.split('/');
  return { date,part,params:new URLSearchParams(search) };
}
function archiveHref(date='',part='',params) {
  const query = params?.toString();
  return 'zapisniki'+(date?'/'+date:'')+(part?'/'+part:'')+(query?'?'+query:'');
}
function meetingType(m) {
  if (m.title.includes('korespondenčna')) return 'korespondenčna';
  return m.title.includes('izredna')?'izredna':'redna';
}
function missingMinutes() {
  const missing=db.meetings.filter(m=>!m.pdf);
  const recent=db.meetings.filter(m=>m.pdf&&m.date>='2026-09-29');
  const coverage=missing.length?'<p>Za naslednje seje je v evidenci samo sklic.</p><ul>'+missing.map(m=>'<li>'+link(m.url,m.title+' · '+day(m.date))+'</li>').join('')+'</ul>':'<p>Za vseh '+db.meetings.length+' evidentiranih sej mandata je na voljo uradni zapisnik s prepisom.</p>';
  return '<section class="missing"><h2>Pokritost arhiva zapisnikov</h2>'+coverage+'<h3>Nazadnje dopolnjeni zapisniki</h3><ul>'+
    recent.map(m=>'<li>'+anchor('zapisniki/'+m.date+(m.readerNotes?'/vse':'/1'),m.title+' · '+day(m.date))+' · '+link(m.pdf,'Izvirnik MOL')+'</li>').join('')+
    '</ul><h3>Katere priloge še potrebujemo?</h3><p>Sklep 4/24 napotuje na arhivske obračunske tabele za sejnine. Sklep 5/24 potrjuje poročilo o malih delih. V objavljenem zapisniku ni razčlenitve končnih stroškov za posamezno lokacijo.</p><div class="links">'+anchor('finance/sejnine','Izplačila sejnin')+anchor('finance/dela','Dokazila za mala dela')+'</div></section>';
}
function readerNotes(m) {
  if (!m.readerNotes) return '';
  const points=m.readerNotes.map(note=>'<div class="qa"><h4>'+h(note.title)+'</h4><p>'+h(note.text)+'</p><div class="links">'+
    note.pages.map(n=>link(m.pdf+'#page='+n,'Izvirnik · str. '+n)).join('')+'</div></div>').join('');
  return '<section class="reader-notes"><h3>Kaj se je dogajalo na seji?</h3>'+points+'</section><h3>Celoten prepis zapisnika</h3>';
}
function drawDocument(m,pages,part,params) {
  const all = part === 'vse';
  const number = Math.max(1,Math.min(Number.parseInt(part,10)||1,pages.length));
  const query = params.get('q') || '';
  const options = pages.map(p=>'<option value="'+p.n+'" '+(!all&&p.n===number?'selected':'')+'>Stran '+p.n+'</option>').join('');
  const move = (n,t)=>anchor(archiveHref(m.date,String(n),params),t);
  const nav = '<div class="docpages">'+(!all&&number>1?move(number-1,'Prejšnja stran'):'')+
      '<label>Prikaz <select id="docpage">'+options+'<option value="vse" '+(all?'selected':'')+'>Vse strani</option></select></label>'+
      (!all&&number<pages.length?move(number+1,'Naslednja stran'):'')+'</div>';
  const shown = all?pages:[pages[number-1]];
  app.innerHTML='<div class="links">'+anchor(archiveHref('','',params),query?'Nazaj na zadetke':'Vsi zapisniki')+anchor('seje/'+m.date,'Povzetek, sklepi in navzočnost')+'</div>'+
    head(m.title+' · '+day(m.date),'Prepis uradnega zapisnika po straneh. Skenirane preglednice ohranijo številko strani, vrstni red celic v prepisu pa se lahko razlikuje od izvirnika.')+
    (m.readerNotes?(all?readerNotes(m):'<div class="links">'+move('vse','Povzetek in celoten prepis')+'</div>'):'')+
    nav+
    shown.map(p=>'<section class="doc-sheet"><div class="sheet-head"><h3>Stran '+p.n+' od '+pages.length+'</h3>'+link(m.pdf+'#page='+p.n,'Primerjaj z izvirnikom PDF')+'</div><p class="meta">'+
      (p.kind==='checked'?'Prepis preverjen ob izvirniku.':p.kind==='blank'?'Prazna stran v izvirniku.':'Strojni prepis skena (OCR).')+'</p>'+
      '<div class="links">'+m.decisions.filter(d=>Number(d.page)===p.n).map(d=>overviewLink(m.date,d.id)).join('')+'</div>'+
      (p.text?'<div class="sheet-text">'+markedPassage(p.text,query)+'</div>':'')+'</section>').join('')+
    (!all&&number<pages.length?'<div class="links">'+move(number+1,'Nadaljuj na stran '+(number+1))+'</div>':'');
  document.getElementById('docpage').onchange=e=>{location.hash=archiveHref(m.date,e.target.value,params)};
}
function showTranscriptList(params) {
  const meta=db.meetings.filter(m=>m.pdf);
  const pagesTotal=meta.reduce((n,m)=>n+corpus[m.date].length,0);
  const years=[...new Set(meta.map(m=>m.date.slice(0,4)))];
  const options=(values,key)=>values.map(v=>'<option'+(v===params.get(key)?' selected':'')+'>'+h(v)+'</option>').join('');
  app.innerHTML=head('Iskanje po zapisnikih','Preiščite celotna besedila in priloge. Vpišite del imena ulice, temo ali številko sklepa. Več iskalnih izrazov se mora pojaviti na isti strani. Iščete lahko tudi brez šumnikov.')+
   '<div class="links">'+anchor('zapisniki/manjkajo','Pokritost arhiva')+anchor('sled/5-14','Sled sklepa 5/14 o varni poti')+(db.meetingUpdates.sessions.length?anchor('seje/aktualno','Zapisniki po volitvah 2026'):'')+'</div>'+
   '<div class="tools"><label>Iskanje po besedilu<input type="search" id="minute-query" placeholder="Npr. Endliherjeva, prehodi, 5/14" value="'+h(params.get('q')||'')+'"></label>'+
   '<label>Leto<select id="minute-year"><option value="">Vsa leta</option>'+options(years,'leto')+'</select></label>'+
   '<label>Vrsta seje<select id="minute-type"><option value="">Vse vrste</option>'+options(['redna','izredna','korespondenčna'],'vrsta')+'</select></label></div>'+
   '<div id="minute-hits" aria-live="polite"></div><p class="meta">Viri so skenirani zapisniki MOL. Pri številkah, imenih in tabelah lahko besedilo preverite na isti strani izvirnega dokumenta. V arhivu je '+pagesTotal+' strani, vključno s praznimi stranmi izvirnikov.</p>';
  function results() {
    const query=params.get('q')||'', words=queryWords(query), year=params.get('leto'), type=params.get('vrsta');
    let list=[],matchedPages=0;
    for (const m of [...meta].reverse()) {
      if ((year&&!m.date.startsWith(year))||(type&&meetingType(m)!==type)) continue;
      const found=words.length?corpus[m.date].filter((p,i)=>words.every(w=>pageIndex.get(m.date)[i].includes(w))):corpus[m.date];
      if (!found.length) continue;
      matchedPages+=found.length;
      list.push('<article class="minute-hit"><span class="when">'+day(m.date)+'</span><div><h3>'+
        anchor(archiveHref(m.date,m.readerNotes&&!words.length?'vse':String(found[0].n),params),m.title)+'</h3>'+
        '<p class="meta">'+(words.length?'Strani z zadetki · '+found.length:'Strani v dokumentu · '+found.length)+'</p>'+
        (words.length?'<p class="passage">'+markedPassage(found[0].text,query,true)+'</p><div class="page-links">'+found.map(p=>anchor(archiveHref(m.date,String(p.n),params),'Str. '+p.n)).join('')+'</div>':'')+'</div></article>');
    }
    document.getElementById('minute-hits').innerHTML='<p class="num">'+(words.length?'Zapisniki z zadetki':'Zapisniki')+' · '+list.length+' / '+meta.length+' &nbsp; | &nbsp; '+(words.length?'Strani z zadetki':'Strani')+' · '+matchedPages+'</p>'+
       (list.length?list.join(''):'<p class="notebox">Ni zadetkov. Poskusite s krajšim delom besede ali odstranite filter.</p>');
  }
  for (const [id,key] of [['minute-query','q'],['minute-year','leto'],['minute-type','vrsta']]) {
    const el=document.getElementById(id);
    el.addEventListener(key==='q'?'input':'change',()=>{
      if (el.value.trim()) params.set(key,el.value.trim()); else params.delete(key);
      history.replaceState(null,'','#'+archiveHref('','',params));results();
    });
  }
  results();
}
function showTranscripts() {
  const {date,part,params}=archiveState();
  if (date==='manjkajo') {
    app.innerHTML='<div class="links">'+anchor('zapisniki','Vsi prepisi')+'</div>'+missingMinutes();return;
  }
  if (!corpus) {
    app.innerHTML='<p>Odpiram prepise zapisnikov …</p>';
    readCorpus().then(()=>{if(tab==='zapisniki'){showTranscripts();simplifyFilters();document.title=(app.querySelector('h1,h2')?.textContent||'Zapisniki')+' · Savski zapisnik'}}).catch(()=>{
      if(tab==='zapisniki')app.innerHTML='<p>Prepisov ni bilo mogoče naložiti. Osvežite stran. '+link(archive,'Odpri uradni arhiv MOL')+'</p>';
    });return;
  }
  const m=db.meetings.find(m=>m.date===date);
  if (m&&corpus[date]) drawDocument(m,corpus[date],part,params);
  else showTranscriptList(params);
}

const trailActors={
  cs:{label:'ČS Bežigrad', icon:'<path d="m2 10 6-5 6 5M4 9v11h8V9m1-3 3-3 6 5m-2-1v13h-5m-8 0v-5h3v5"/>'},
  svetnik:{label:'Mestni svet · svetniška pobuda ali vprašanje', icon:'<path d="M3 4h18v13H10l-5 4v-4H3zM7 9h10m-10 4h7"/>'},
  ogdp:{label:'Mestna uprava · OGDP', icon:'<path d="M5 2h10l4 4v16H5zM14 2v5h5M8 11h8m-8 4h8m-8 4h5"/>'},
  objava:{label:'Javna objava MOL',icon:'<path d="m3 11 5-1 11-5v14L8 14l-5-1zm5 3 2 6h3l-2-5M22 9v5"/>'},
  sls:{label:'Mestna uprava · Služba za lokalno samoupravo',icon:'<path d="M3 5h18v14H3zM3 6l9 7 9-7"/>'}
};
function trailActor(key) {
  const actor=trailActors[key];
  if(!actor)return '';
  return '<span class="trail-actor actor-'+h(key)+'"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">'+actor.icon+'</svg>'+h(actor.label)+'</span>';
}
function showTrail() {
  const t=db.safeRoute;
  const tracked=getDecisionRows().find(row=>row.m.date===t.date&&row.d.id===t.decision);
  const trailLinks='<div class="links">'+anchor('sklepi-po-sejah','Vsi sklepi')+anchor(decisionRoute(t.date,t.decision),'Sklep 5/14 v registru')+anchor('seje/'+t.date,'14. seja in glasovanje')+anchor('zapisniki/'+t.date+'/4','Prepis sklepa · str. 4')+'</div>';
  app.innerHTML=head(t.title,'Sklep '+t.decision+' · '+day(t.date))+(tracked?watchAction(tracked):'')+'<p id="watch-feedback" class="meta" role="status"></p>'+
    '<section class="notebox"><strong>'+h(t.status)+'</strong><p>'+h(t.summary)+'</p><p>'+h(t.owner)+'</p></section>'+trailLinks+
    '<h3>Kaj se je zgodilo po posameznem predlogu?</h3><p class="meta">Pregled javnih virov do 25. 11. 2026. Iskanje lahko ponovite z lastnimi besedami. Povezave pod iskalnim poljem odprejo Google v novem zavihku.</p><div class="measures">'+t.measures.map((m,i)=>'<article class="qa"><h4>'+h(m.title)+'</h4><p><b>'+h(m.status)+'</b></p><p>'+h(m.evidence)+'</p><p class="meta"><b>Kaj še iščemo</b> · '+h(m.needed)+'</p>'+measureEvidence(m,i)+'</article>').join('')+'</div>'+
    '<h3>Časovnica dokazov</h3>'+t.events.map(e=>'<article class="event trail-event"><time class="when" datetime="'+h(e.date)+'">'+day(e.date)+'</time><div><div class="trail-byline">'+trailActor(e.actor)+'<span class="meta">'+h(e.type)+'</span></div><h4>'+h(e.title)+'</h4><p>'+h(e.text)+'</p><div class="links">'+link(e.url,e.source)+'</div></div></article>').join('')+
    '<section class="notebox"><strong>Kako preveriti izvedbo?</strong><p>'+h(t.next)+'</p></section><div class="links">'+anchor('savsko','Savsko naselje na sejah')+anchor('zapisniki?q=Endliherj','Poišči Endliherjevo v vseh zapisnikih')+anchor('zapisniki/manjkajo','Pokritost arhiva')+'</div>';
  bindEvidenceSearch();
}