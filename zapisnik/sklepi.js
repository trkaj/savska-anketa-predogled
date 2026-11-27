'use strict';

const decisionStatuses = {
  sprejet: 'Sprejet, brez poznejšega dokazila',
  spremljanje: 'Nadaljevanje dokumentirano',
  delno: 'Delna izvedba potrjena',
  izveden: 'Izvedba potrjena',
  odloceno: 'Odločitev z glasovanjem'
};
const decisionKinds = {
  pobuda:'Pobude in pozivi', finance:'Finance in načrti', imenovanje:'Imenovanja', postopek:'Postopki', drugo:'Drugo'
};
const watchKey = 'savski-zapisnik.spremljani-sklepi.v1';
let watchAvailable = true;
function readDecisionWatch() {
  try {
    const value=JSON.parse(localStorage.getItem(watchKey)||'{}');
    return new Map(Object.entries(value && typeof value==='object' && !Array.isArray(value)?value:{}));
  } catch { return new Map(); }
}
let decisionWatch=readDecisionWatch();
function persistDecisionWatch() {
  try { localStorage.setItem(watchKey,JSON.stringify(Object.fromEntries(decisionWatch)));watchAvailable=true; }
  catch { watchAvailable=false; }
}
function decisionKey(date,id) {
  return date+'-'+id.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'');
}
function decisionRoute(date,id) { return 'sklepi/'+decisionKey(date,id); }
function overviewRoute(date,id,params) {
  if(date===db.safeRoute.date&&id===db.safeRoute.decision)return 'sled/5-14';
  const path=decisionRoute(date,id);
  return params?filteredRoute(path,params):path;
}
function overviewLink(date,id,params) {
  return '<a class="overview-link" href="#'+h(overviewRoute(date,id,params))+'">Odpri pregled sklepa '+h(id)+'</a>';
}
function listRoute(params) {
  const query=params.toString();
  return 'sklepi'+(query?'?'+query:'');
}
let decisionRows;
function getDecisionRows() {
  if (!decisionRows) decisionRows=db.meetings.flatMap(m=>m.decisions.map(d=>{
    const trail=d.tracking;
    const key=decisionKey(m.date,d.id);
    const last=trail.events.at(-1)?.date||m.date;
    const index=fold([d.id,d.title,d.text,m.title,...Object.values(trail).filter(x=>typeof x==='string'),
      ...trail.events.map(e=>e.title+' '+e.text)].join(' '));
    const extended=m.date===db.safeRoute.date&&d.id===db.safeRoute.decision?db.safeRoute:null;
    const evidence=[trail.status,trail.owner,trail.due,trail.events,trail.next,extended];
    if(d.financeSection)evidence.push(d.financeSection);
    // Actor labels describe the presentation; adding them does not change the evidence.
    const version=JSON.stringify(evidence,(key,value)=>key==='actor'?undefined:value);
    return {m,d,trail,key,last,index,version,extended};
  })).sort((a,b)=>b.last.localeCompare(a.last)||b.m.date.localeCompare(a.m.date)||a.d.id.localeCompare(b.d.id,'sl',{numeric:true}));
  return decisionRows;
}
function changedDecision(row) {
  return decisionWatch.has(row.key)&&decisionWatch.get(row.key)!==row.version;
}
function decisionStatus(status) {
  return '<span class="decision-state state-'+h(status)+'">'+h(decisionStatuses[status])+'</span>';
}
function watchAction(row) {
  const selected=decisionWatch.has(row.key);
  return '<button type="button" class="watch-decision" data-watch="'+h(row.key)+'" aria-pressed="'+selected+
    '" aria-label="'+(selected?'Prenehaj spremljati sklep ':'Spremljaj sklep ')+h(row.d.id)+'">'+
    (selected?'Spremljam':'Spremljaj')+'</button>';
}
function decisionDirectory(params) {
  const rows=getDecisionRows();
  const options=(choices,key)=>Object.entries(choices).map(([v,n])=>'<option value="'+h(v)+'" '+(params.get(key)===v?'selected':'')+'>'+h(n)+'</option>').join('');
  const scope=params.get('izbor')||'vsi';
  const statusOptions={odprti:'Vsi odprti ('+rows.filter(r=>['sprejet','spremljanje','delno'].includes(r.trail.status)).length+')'};
  for(const [code,label] of Object.entries(decisionStatuses))statusOptions[code]=label+' ('+rows.filter(r=>r.trail.status===code).length+')';
  const tabs=[['vsi','Vsi sklepi'],['dokazila','S poznejšimi dokazili'],['moji','Moji sklepi ('+decisionWatch.size+')'],['novosti','Novosti pri mojih ('+rows.filter(changedDecision).length+')']];
  const scopes=tabs.map(([v,label])=>{
    const next=new URLSearchParams(params);
    if(v==='vsi')next.delete('izbor');else next.set('izbor',v);
    return '<a href="#'+h(listRoute(next))+'" '+(v===scope?'aria-current="page"':'')+'>'+h(label)+'</a>';
  }).join('');
  app.innerHTML=head('Spremljanje sklepov','Kaj se je zgodilo po glasovanju? Odprite sklep za poznejše odgovore in dokazila. Pri potrjeni izvedbi je naveden vir za opravljeno delo.')+
    '<div class="subtabs">'+scopes+'</div><p class="meta">Z gumbom »Spremljaj« si shranite izbor v tem brskalniku. Ko se na strani spremeni stanje ali dodamo dokazilo, se sklep pojavi med novostmi.</p>'+
    '<div class="tools"><label>Išči sklep<input type="search" id="decision-q" value="'+h(params.get('q')||'')+'" placeholder="Številka sklepa, ulica ali naslovnik"></label>'+
    '<label>Stanje<select id="decision-status"><option value="">Vsa stanja</option>'+options(statusOptions,'stanje')+'</select></label>'+
    '<label>Vrsta odločitve<select id="decision-kind"><option value="">Vse vrste</option>'+options(decisionKinds,'vrsta')+'</select></label>'+
    '<label>Leto sprejema<select id="decision-year"><option value="">Vsa leta</option>'+options(Object.fromEntries(yOpts.map(y=>[y,y])),'leto')+'</select></label></div>'+
    '<div id="decision-hits"></div><details class="decision-guide"><summary>Kako določamo stanje sklepa?</summary>'+
    '<p>Nadaljevanje potrdimo z datiranim dokumentom, ki izkazuje posredovanje, odgovor ali novo obravnavo iste zadeve. Pri delni ali celotni izvedbi dodamo vir, ki potrjuje konkreten rezultat. Sprejet program ali napoved del sama po sebi še ne potrjuje izvedbe.</p>'+
    '<p>Pri potrditvah zapisnikov, imenovanjih in drugih odločitvah, ki začnejo učinkovati z glasovanjem, uporabimo oznako »Odločitev z glasovanjem«. Če sklep zahteva nadaljnje delo, ga spremljamo posebej. Manjkajoči javni dokumenti lahko prikrijejo poznejše korake. '+anchor('zapisniki/manjkajo','Pokritost arhiva')+'</p></details>'+
    '<p id="watch-feedback" class="meta" role="status"></p>';
  function results() {
    const words=fold(params.get('q')||'').trim().split(/\s+/).filter(Boolean),status=params.get('stanje');
    const found=rows.filter(row=>(scope!=='dokazila'||row.trail.events.some(e=>e.date>row.m.date)||row.extended?.events.some(e=>e.date>row.m.date))&&(scope!=='moji'||decisionWatch.has(row.key))&&(scope!=='novosti'||changedDecision(row))&&
      (!params.get('leto')||row.m.date.startsWith(params.get('leto')))&&(!params.get('vrsta')||row.trail.kind===params.get('vrsta'))&&
      (!status||(status==='odprti'?['sprejet','spremljanje','delno'].includes(row.trail.status):row.trail.status===status))&&
      words.every(w=>row.index.includes(w)));
    document.getElementById('decision-hits').innerHTML='<p class="num">Prikazani sklepi · '+found.length+' od '+rows.length+' · po zadnjem evidentiranem dogodku</p>'+
      found.map(row=>{
        const target=overviewRoute(row.m.date,row.d.id,params);
        return '<article class="decision-row"><div class="decision-row-main"><span class="meta">Sklep '+h(row.d.id)+' · '+day(row.m.date)+' · '+h(row.m.title)+'</span>'+
        '<h3>'+anchor(target,row.d.title)+'</h3>'+'<div class="links">'+overviewLink(row.m.date,row.d.id,params)+'</div>'+'<div class="decision-tags">'+decisionStatus(row.trail.status)+
        (changedDecision(row)?'<b class="decision-new">Nov podatek</b>':'')+
        (row.trail.events.length?'<span class="meta">Zadnja sled · '+day(row.last)+'</span>':'')+'</div></div>'+watchAction(row)+'</article>';
      }).join('')+(!found.length?'<p class="notebox">'+(scope==='moji'&&!decisionWatch.size?'Za prvi sklep v zavihku »Vsi sklepi« izberite »Spremljaj«.':scope==='novosti'?'V tem izboru trenutno ni novih dokazil ali sprememb.':'Noben sklep ne ustreza izbranim filtrom.')+'</p>':'');
  }
  for(const [id,key] of [['q','q'],['year','leto'],['status','stanje'],['kind','vrsta']]) {
    const el=document.getElementById('decision-'+id);
    el.addEventListener(id==='q'?'input':'change',()=>{
      const value=el.value.trim();
      if(value)params.set(key,value);else params.delete(key);
      history.replaceState(null,'','#'+listRoute(params));
      results();
      for(const [i,[v]] of tabs.entries()) {
        const next=new URLSearchParams(params);
        if(v==='vsi')next.delete('izbor');else next.set('izbor',v);
        app.querySelectorAll('.subtabs a')[i].href='#'+listRoute(next);
      }
    });
  }
  results();
}
function informationRequest(row) {
  const {m,d}=row;
  return 'Spoštovani,\n\nSvet ČS Bežigrad je '+day(m.date)+' sprejel sklep '+d.id+'. Povzetek sklepa: '+d.title.replace(/[.!?]$/,'')+'.\n\n'+
    'Prosim za trenutno stanje, datum zadnjega opravljenega koraka in kopijo dokumenta ali povezavo do njega. Če je bil sklep posredovan, prosim za datum odpreme, številko zadeve in odgovor naslovnika. Če je bil ukrep izveden, prosim tudi za datum in dokazilo o izvedbi.\n\n'+
    'Izvirnik sklepa: '+m.pdf+'#page='+d.page+'\n\nHvala in lep pozdrav';
}
function searchDecisionEvidence(m,d) {
  const query='Ljubljana '+d.title.replace(/[.!?]$/,'').split(/\s+/u).slice(0,13).join(' ');
  return '<details class="decision-guide"><summary>Poišči poznejša dokazila na spletu</summary><p>Prilagodite izraz z imenom ulice, objekta ali naslovnika. Izbrani obseg se odpre v Googlu.</p><label for="decision-web-search">Iskalni izraz</label><input class="web-query" type="search" id="decision-web-search" value="'+h(query)+'"><div class="links web-scopes">'+webSearchLinks(query)+'</div></details>';
}
function decisionDetail(row,params) {
  const {m,d,trail}=row;
  const next=trail.next||'';
  const vote=typeof d.glasovanje==='string'?d.glasovanje:d.glasovanje?Object.entries(d.glasovanje).map(([key,v])=>key+' '+v).join(' · '):'';
  const deep=m.date===db.safeRoute.date&&d.id===db.safeRoute.decision;
  const key=encodeURIComponent(d.id);
  const fromSessions=params.get('iz')==='seje', returnParams=new URLSearchParams(params);
  returnParams.delete('iz');
  app.innerHTML='<div class="links">'+(fromSessions?anchor(filteredRoute('sklepi-po-sejah',returnParams),'Nazaj na sklepe po sejah'):anchor(listRoute(params),'Nazaj na register sklepov'))+anchor('seje/'+m.date,m.title+' · '+day(m.date))+'</div>'+
    '<div class="decision-heading"><div><p class="when">Sklep '+h(d.id)+' · '+day(m.date)+'</p><h1 class="view-title">'+h(d.title)+'</h1></div>'+watchAction(row)+'</div>'+
    '<div class="decision-tags">'+decisionStatus(trail.status)+(changedDecision(row)?'<button type="button" class="mark-seen" data-seen="'+h(row.key)+'">Označi spremembo kot prebrano</button>':'')+'</div><p id="watch-feedback" class="meta" role="status"></p>'+
    '<dl class="decision-facts"><div><dt>Naslovnik ali nosilec</dt><dd>'+h(trail.owner||'V sklepu ni naveden.')+'</dd></div><div><dt>Rok po sklepu</dt><dd>'+h(trail.due||'V sklepu ni naveden.')+'</dd></div></dl>'+
    (d.financeSection?'<div class="links">'+anchor('finance/'+d.financeSection,'Finančni podatki in dokazila')+'</div>':'')+
    (deep?'<p class="notebox">'+anchor('sled/5-14','Podrobni pregled · varna pot do šole in vrtcev')+'</p>':'')+
    '<details class="decision-guide"><summary>Kaj točno je svet sprejel?</summary><div class="wording">'+h(d.text)+'</div></details>'+
    '<h3>Pot sklepa</h3><article class="event"><time class="when">'+day(m.date)+'</time><div>'+trailActor('cs')+'<h4>Svet je sprejel sklep '+h(d.id)+'</h4>'+
    (vote?'<p>'+h(vote)+'</p>':'')+'<div class="links">'+link(m.pdf+'#page='+d.page,'Izvirni zapisnik · str. '+d.page)+anchor('zapisniki/'+m.date+'/'+d.page,'Preberi prepis')+'</div></div></article>'+
    trail.events.map(e=>'<article class="event"><time class="when">'+day(e.date)+'</time><div><h4>'+h(e.title)+'</h4><p>'+h(e.text)+'</p><div class="links">'+link(e.url,e.url.includes('#page=')?'Dokument · str. '+e.url.split('#page=')[1]:'Odpri dokument')+'</div></div></article>').join('')+
    (!trail.events.length&&trail.status!=='odloceno'?'<p>V pregledanih virih ni vpisanega poznejšega dokazila za ta sklep.</p>':'')+
    (trail.status==='odloceno'?'<p class="meta">Pri tem sklepu je svet odločitev opravil z glasovanjem.</p>':'')+
    (next?'<div class="notebox"><strong>Kaj še preveriti</strong><p>'+h(next)+'</p></div>':'')+
    searchDecisionEvidence(m,d)+'<div class="links">'+anchor('zapisniki?q='+key,'Išči številko '+d.id+' v zapisnikih')+'</div>'+
    (['sprejet','spremljanje','delno'].includes(trail.status)?'<details class="decision-guide"><summary>Pripravi besedilo poizvedbe</summary><p>Besedilo lahko prilagodite in kopirate v svoj dopis.</p><textarea class="inquiry" aria-label="Besedilo poizvedbe">'+h(informationRequest(row))+'</textarea></details>':'');
}
function showDecisions() {
  const params=new URLSearchParams(location.hash.split('?')[1]||'');
  if(!focusId){decisionDirectory(params);return}
  const row=getDecisionRows().find(r=>r.key===focusId);
  if(row){decisionDetail(row,params);bindEvidenceSearch();}
  else app.innerHTML='<p>Te povezave do sklepa ni mogoče najti. '+anchor('sklepi','Odpri register sklepov')+'</p>';
}
function setupDecisionWatch() {
  app.addEventListener('click',event=>{
    const button=event.target.closest('button[data-watch],button[data-seen]');
    if(!button)return;
    const key=button.dataset.watch||button.dataset.seen;
    const row=getDecisionRows().find(r=>r.key===key);
    if(!row)return;
    if(watchAvailable) {
      const latest=readDecisionWatch();
      decisionWatch=latest;
    }
    const remove=button.hasAttribute('data-watch')&&decisionWatch.has(key);
    if(remove) decisionWatch.delete(key);
    else decisionWatch.set(key,row.version);
    persistDecisionWatch();
    if(tab==='sklepi-po-sejah')button.outerHTML=watchAction(row);
    else if(tab==='sled')showTrail();else showDecisions();
    const feedback=document.getElementById('watch-feedback');
    if(feedback)feedback.textContent=(!watchAvailable?'Izbor velja le do zaprtja strani. ':'')+
      (button.hasAttribute('data-seen')?'Sprememba označena kot prebrana.':remove?'Sklep '+row.d.id+' je odstranjen iz izbora.':'Spremljate sklep '+row.d.id+'.');
    const target=app.querySelector('[data-watch="'+key+'"]')||app.querySelector('.subtabs [aria-current]');
    if(target)target.focus({preventScroll:true});
  });
  window.addEventListener('storage',e=>{
    if(e.key!==watchKey&&e.key!==null)return;
    decisionWatch=readDecisionWatch();
    if(tab==='sklepi-po-sejah') {
      const rows=new Map(getDecisionRows().map(row=>[row.key,row]));
      for(const button of app.querySelectorAll('[data-watch]'))button.outerHTML=watchAction(rows.get(button.dataset.watch));
    }
    else if(tab==='sklepi')showDecisions();
    else if(tab==='sled')showTrail();
  });
}