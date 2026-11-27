'use strict';

function filteredRoute(route, params) {
  const query=params.toString();
  return route+(query?'?'+query:'');
}
function bindFilters(route,params,renderResults) {
  for(const el of app.querySelectorAll('[data-filter]')) {
    el.addEventListener(el.tagName==='INPUT'?'input':'change',()=>{
      const value=el.value.trim(), key=el.dataset.filter;
      if(value)params.set(key,value); else params.delete(key);
      history.replaceState(null,'','#'+filteredRoute(route,params));
      renderResults();
    });
  }
  renderResults();
}
function filterOptions(choices,selected) {
  return choices.map(([v,label])=>'<option value="'+h(v)+'"'+(v===selected?' selected':'')+'>'+h(label)+'</option>').join('');
}
function showMeetingDecisions() {
  const params=new URLSearchParams(location.hash.split('?')[1]||'');
  const meetings=[...db.meetings].sort((a,b)=>b.date.localeCompare(a.date));
  const rows=getDecisionRows();
  const byMeeting=new Map(meetings.map(m=>[m.date,[]]));
  for(const row of rows)byMeeting.get(row.m.date).push(row);
  for(const group of byMeeting.values())group.sort((a,b)=>parseInt(a.d.id,10)-parseInt(b.d.id,10));
  app.innerHTML=head('Sklepi','Poiščite sklep po temi ali številki. Odprite naslov in preverite, za kaj je svet glasoval ter kaj se je zgodilo pozneje.')+
    '<div class="links">'+(db.meetingUpdates.sessions.length?anchor('seje/aktualno','Seje in sklepi po volitvah 2026'):'')+'</div>'+
    '<div class="tools"><label>Izbor<select data-filter="izbor">'+filterOptions([['','Vsi sklepi'],['dokazila','S poznejšimi dokazili'],['moji','Moji sklepi'],['novosti','Novosti pri mojih sklepih']],params.get('izbor')||'')+'</select></label><label>Stanje<select data-filter="stanje">'+filterOptions([['','Vsa stanja'],['odprti','Vsi odprti'],...Object.entries(decisionStatuses)],params.get('stanje')||'')+'</select></label><label>Vrsta<select data-filter="vrsta">'+filterOptions([['','Vse vrste'],...Object.entries(decisionKinds)],params.get('vrsta')||'')+'</select></label><label>Leto<select data-filter="leto">'+filterOptions([['','Vsa leta'],...yOpts.map(y=>[y,y])],params.get('leto')||'')+'</select></label><label>Prikaz<select data-filter="prikaz">'+filterOptions([['','Posamezni sklepi'],['seje','Združeno po sejah']],params.get('prikaz')||'')+'</select></label><label>Seja<select data-filter="seja"><option value="">Vse seje</option>'+filterOptions(meetings.map(m=>[m.date,day(m.date)+' · '+m.title+(!m.pdf?' · samo sklic':'')]),params.get('seja'))+
    '</select></label><label>Iskanje po sklepih<input type="search" data-filter="q" placeholder="Npr. Endliherjeva, promet, 5/14" value="'+h(params.get('q')||'')+'"></label></div>'+
    '<p id="watch-feedback" class="meta" role="status"></p><div id="session-hits"></div>';
  bindFilters('sklepi-po-sejah',params,()=>{
    const query=params.get('q')||'', words=queryWords(query), selected=params.get('seja');
    const groups=[]; let total=0;
    const grouped=params.get('prikaz')==='seje';
    for(const m of meetings) {
      if((selected&&m.date!==selected)||(params.get('leto')&&!m.date.startsWith(params.get('leto'))))continue;
      const found=byMeeting.get(m.date).filter(row=>{
        const scope=params.get('izbor'), status=params.get('stanje');
        if(scope==='moji'&&!decisionWatch.has(row.key)||scope==='novosti'&&!changedDecision(row)||scope==='dokazila'&&!hasDecisionEvidence(row))return false;
        if(status&&(status==='odprti'?!['sprejet','spremljanje','delno'].includes(row.trail.status):row.trail.status!==status))return false;
        if(params.get('vrsta')&&params.get('vrsta')!==row.trail.kind)return false;
        const index=searchFormOf(['Sklep',row.index,decisionBriefs[row.key]?.summary,decisionBriefs[row.key]?.outcome].join(' '));
        return words.every(word=>index.includes(word));
      });
      if(!found.length&&(params.get('izbor')||params.get('stanje')||params.get('vrsta')||words.length||(!grouped&&!selected)))continue;
      total+=found.length;
      const context=new URLSearchParams(params);context.set('iz','seje');
      const contents=found.map(row=>'<article class="session-decision"><div class="session-top"><div><span class="when">Sklep '+h(row.d.id)+' · '+day(m.date)+' · '+h(m.title)+'</span><h4>'+anchor(overviewRoute(m.date,row.d.id,context),row.d.title)+'</h4></div>'+watchAction(row)+'</div>'+
        decisionStatus(row.trail.status)+decisionSummary(row)+'<details class="decision-text"><summary>Kaj točno je svet sprejel?</summary><div class="wording">'+markedPassage(row.d.text,query)+'</div></details>'+
        (words.length?'<p class="passage">'+markedPassage(row.d.text,query,true)+'</p>':'')+
        '<div class="links">'+overviewLink(m.date,row.d.id,context)+link(m.pdf+'#page='+row.d.page,'Izvirnik · str. '+row.d.page)+'</div></article>').join('');
      const notes=words.length?'':[...(m.unnumbered||[]).map(d=>['Neoštevilčena odločitev',d]),...(m.rejected||[]).map(d=>['Zavrnjen predlog '+d.id,d])].map(([label,d])=>'<p class="meta"><b>'+h(label)+'</b> · '+h(d.title)+' '+link(m.pdf+'#page='+d.page,'Str. '+d.page)+'</p>').join('');
      const empty=m.pdf?'Zapisnik ne navaja sprejetega oštevilčenega sklepa.':'Objavljen je sklic. Izida glasovanj ne poznamo.';
      if(!grouped){groups.push(contents||(selected?'<p>'+h(empty)+'</p>':''));if(selected&&notes)groups[groups.length-1]+=notes;continue;}
      groups.push(detail('odlocitve-'+m.date,day(m.date),m.title,m.pdf?'Sklepi · '+found.length:'Samo sklic',
        (contents||'<p>'+h(empty)+'</p>')+notes+'<div class="links">'+anchor('seje/'+m.date,'Povzetek celotne seje')+link(m.url,'Uradna stran seje')+'</div>',Boolean(selected||words.length)));
    }
    document.getElementById('session-hits').innerHTML='<p class="num">Sprejeti oštevilčeni sklepi · '+total+' / '+rows.length+' &nbsp; | &nbsp; Prikazane seje · '+groups.length+'</p>'+
      (groups.length?'<div class="rows">'+groups.join('')+'</div>':'<p class="notebox">Ni zadetkov. Poskusite z delom besede ali izberite drugo sejo.</p>');
  });
}
const savskoKinds={sklep:'Sprejet sklep',razprava:'Razprava',porocilo:'Poročilo ali seznanitev',predlog:'Predlog',zavrnjeno:'Zavrnjen predlog'};
function showSavsko() {
  const params=new URLSearchParams(location.hash.split('?')[1]||'');
  const meetings=new Map(db.meetings.map(m=>[m.date,m]));
  const entries=[...db.savsko].sort((a,b)=>b.date.localeCompare(a.date));
  const topics=[...new Set(entries.map(e=>e.topic))].sort((a,b)=>a.localeCompare(b,'sl'));
  app.innerHTML=head('Savsko naselje na sejah','Kdaj je svet ČS Bežigrad obravnaval Savsko naselje, o čem je odločil in kaj so svetniki izvedeli pozneje? Ob obravnavi odprite zunanje vire za odzive mesta, pojasnila izvajalcev ali poročila o izvedbi. Pregled javnih virov do 27. 11. 2026.')+
    '<div class="links">'+anchor('sled/5-14','Podrobni pregled · varna pot do šole in vrtcev')+anchor('zapisniki/manjkajo','Pokritost arhiva')+'</div>'+
    '<div class="tools"><label>Ulica ali zadeva<input type="search" data-filter="q" value="'+h(params.get('q')||'')+'" placeholder="Npr. igrišče, knjižnica, Linhartova"></label>'+
    '<label>Tema<select data-filter="tema"><option value="">Vse teme</option>'+filterOptions(topics.map(t=>[t,t]),params.get('tema'))+'</select></label>'+
    '<label>Vrsta obravnave<select data-filter="vrsta"><option value="">Vse vrste</option>'+filterOptions(Object.entries(savskoKinds),params.get('vrsta'))+'</select></label>'+
    '<label>Leto<select data-filter="leto"><option value="">Vsa leta</option>'+filterOptions(yOpts.map(y=>[y,y]),params.get('leto'))+'</select></label></div><div id="savski-dogodki"></div>';
  bindFilters('savsko',params,()=>{
    const words=queryWords(params.get('q')||''), year=params.get('leto'), kind=params.get('vrsta'), topic=params.get('tema');
    const shown=entries.filter(e=>(!year||e.date.startsWith(year))&&(!kind||e.kind===kind)&&(!topic||e.topic===topic)&&
      words.every(w=>searchFormOf([e.title,e.place,e.topic,e.text,reviewText(e),...e.decisions].join(' ')).includes(w)));
    let html='<p class="num">Obravnave · '+shown.length+' / '+entries.length+' &nbsp; | &nbsp; Različne seje · '+new Set(shown.map(e=>e.date)).size+' · od najnovejše do najstarejše</p>',previous='';
    for(const e of shown){
      const m=meetings.get(e.date);
      if(previous!==e.date.slice(0,4)){previous=e.date.slice(0,4);html+='<h3 class="groupTitle">'+previous+'</h3>'}
      html+='<article class="event"><div><time class="when" datetime="'+h(e.date)+'">'+day(e.date)+'</time><div class="meta">'+h(m.title)+'</div></div><div><span class="meta">'+h(savskoKinds[e.kind])+' · '+h(e.topic)+'</span><h4>'+h(e.title)+'</h4><div class="meta">'+h(e.place)+'</div><p>'+h(e.text)+'</p>'+
        reviewEvidence(e)+(!neighbourhoodReview(e)&&e.result?'<div class="evidence"><strong>Poznejša potrditev · '+day(e.result.date)+'</strong><p>'+h(e.result.text)+'</p>'+link(e.result.url,'Objava MOL')+'</div>':'')+'<div class="links">'+
        e.decisions.map(id=>overviewLink(e.date,id)).join('')+
        (e.financeSection?anchor('finance/'+e.financeSection,'Načrt, poraba in dokazila'):'')+anchor('zapisniki/'+e.date+'/'+e.page,'Prepis · str. '+e.page)+link(m.pdf+'#page='+e.page,'Izvirnik · str. '+e.page)+'</div></div></article>';
    }
    document.getElementById('savski-dogodki').innerHTML=html+(shown.length?'':'<p class="notebox">Ni obravnav za ta izbor.</p>');
  });
}
const evidenceScopes=[['Ves splet',''],['MOL','site:ljubljana.si'],['Mestni svet in svetniki','(site:ljubljana.si/assets OR site:ljubljana.parlameter.si) (svetnika OR svetnice OR svetniškega OR "mestni svet")']];
function webSearchLinks(query) {
  return evidenceScopes.map(([title,scope])=>link('https://www.google.com/search?'+new URLSearchParams({q:[query,scope].filter(Boolean).join(' ')}),title)).join('');
}
function measureEvidence(m,i) {
  return '<div class="measure-evidence"><h5>Dokumenti in ugotovitve</h5><ul>'+m.web.map(e=>'<li>'+link(e.url,e.label)+'<p>'+h(e.text)+'</p></li>').join('')+'</ul>'+
    '<label for="web-query-'+i+'">Ponovi iskanje</label><input class="web-query" id="web-query-'+i+'" type="search" value="'+h(m.query)+'">'+
    '<div class="links web-scopes">'+webSearchLinks(m.query)+'</div></div>';
}
function bindEvidenceSearch() {
  for(const el of app.querySelectorAll('.web-query'))el.addEventListener('input',()=>{
    el.nextElementSibling.innerHTML=el.value.trim()?webSearchLinks(el.value.trim()):'<span class="meta">Vnesite iskalni izraz.</span>';
  });
}
