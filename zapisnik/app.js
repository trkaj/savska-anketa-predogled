'use strict';
const app=document.querySelector('#app');
const h=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fold=s=>String(s??'').toLocaleLowerCase('sl').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d');
const day=s=>s?new Intl.DateTimeFormat('sl-SI',{day:'numeric',month:'numeric',year:'numeric',timeZone:'Europe/Ljubljana'}).format(new Date(s.length===10?s+'T12:00:00+01:00':s)):'';
const nf=(v,k=1)=>v.toLocaleString('sl-SI',{maximumFractionDigits:k,minimumFractionDigits:k});
const link=(u,t)=>/^https:\/\//.test(u||'')?'<a href="'+h(u)+'" target="_blank" rel="noopener noreferrer">'+h(t)+'</a>':'';
const anchor=(path,title)=>'<a href="#'+h(path)+'">'+h(title)+'</a>';
const archive='https://www.ljubljana.si/sl/mestna-obcina/cetrtne-skupnosti/bezigrad/seje-cetrtne-skupnosti-bezigrad';
const stateName={present:'Navzoči',partial:'Delna navzočnost',absent:'Odsotni',excused:'Opravičeno odsotni',voted:'Oddali opredelitev',unknown:'Brez potrjene opredelitve'};
let db,tab,focusId;
const f={seje:{q:'',year:'',mode:'',view:'seje',order:'count'}};
const isRemote=m=>m.attendance.mode==='remotevote';
const yOpts=['2023','2024','2025','2026'];
function searchForm(key,filters,placeholder){
 let html='<div class="tools"><label>Iskanje<input type="search" id="q" autocomplete="off" placeholder="'+h(placeholder)+'" value="'+h(f[key].q)+'"></label>';
 for(const [name,label,choices] of filters)html+='<label>'+h(label)+'<select id="'+name+'">'+(name==='order'?'':'<option value="">Vse možnosti</option>')+choices.map(v=>{let [val,desc]=Array.isArray(v)?v:[v,v];return '<option value="'+h(val)+'" '+(f[key][name]===val?'selected':'')+'>'+h(desc)+'</option>'}).join('')+'</select></label>';
 return html+'</div><div id="results"></div>'
}
function listen(key,render){for(const el of app.querySelectorAll('input,select'))el.addEventListener(el.tagName==='INPUT'?'input':'change',()=>{f[key][el.id]=el.value;render()});render()}
function head(title,desc){return '<h1 class="view-title">'+h(title)+'</h1><p class="lead">'+h(desc)+'</p>'}
function pill(s,amber=false){return '<span class="pill'+(amber?' amber':'')+'">'+h(s)+'</span>'}
function detail(id,meta,title,status,body,open=false){return '<details class="item" id="'+h(id)+'"'+(open?' open':'')+'><summary><span class="sumText"><span class="sumMeta">'+h(meta)+'</span><strong>'+h(title)+'</strong></span>'+pill(status,['Brez potrditve','Delni odgovor','Samo sklic','Samodejni prejem'].includes(status))+'<span class="expand" aria-hidden="true"></span></summary><div class="inside">'+body+'</div></details>'}
const count=(m,s)=>m.attendance.members.filter(v=>s.includes(v.state)).length;
function agendaText(m){return m.agenda.map(a=>String(a).replace(/^\s*\d+\.\s*/,''))}
function meetingBody(m){
 let t='<p>'+h(m.summary)+'</p><div class="links">'+(m.pdf?anchor('zapisniki/'+m.date+(m.readerNotes?'/vse':'/1'),m.readerNotes?'Povzetek in celoten prepis':'Preberi celoten zapisnik po straneh'):anchor('zapisniki/manjkajo','Pokritost arhiva'))+(m.date==='2026-03-10'?anchor('sled/5-14','Kaj se je zgodilo s sklepom 5/14?'):'')+'</div><h4>'+(m.pdf?'Dnevni red':'Napovedani dnevni red')+'</h4><ol>'+agendaText(m).map(a=>'<li>'+h(a)+'</li>').join('')+'</ol>';
 t+='<h4>Sprejeti oštevilčeni sklepi</h4><div class="links">'+anchor('sklepi-po-sejah?seja='+m.date,'Išči po sklepih te seje')+'</div>'; if(m.decisions.length)t+='<p class="meta">Izberite številko sklepa za stanje in poznejša dokazila.</p>';
 if(!m.pdf)t+='<p>V javnem arhivu je bil ob preseku objavljen sklic. Glasovanja, sprejeti sklepi in prisotnost niso preverljivi iz tega vira.</p>';
 else if(!m.decisions.length)t+='<p>V tem zapisniku ni sprejetega oštevilčenega sklepa.</p>';
 else t+='<div class="tablewrap"><table><thead><tr><th>Sklep</th><th>Kaj je svet sprejel</th><th>Vir</th></tr></thead><tbody>'+m.decisions.map(d=>'<tr><td><b>'+anchor(overviewRoute(m.date,d.id),d.id)+'</b></td><td>'+h(d.title)+'<div>'+overviewLink(m.date,d.id)+'</div>'+(d.glasovanje?'<div class="meta">'+h(typeof d.glasovanje==='string'?d.glasovanje:Object.entries(d.glasovanje).map(([k,v])=>k+' '+v).join(' · '))+'</div>':'')+'</td><td>'+link(m.pdf+'#page='+d.page,'str. '+d.page)+'</td></tr>').join('')+'</tbody></table></div>';
 for(const [key,label] of [['unnumbered','Neoštevilčena odločitev'],['rejected','Zavrnjeni predlog']])for(const d of m[key]||[])t+='<p><b>'+label+' · '+h(d.id)+'</b> '+h(d.title)+' '+link(m.pdf+'#page='+d.page,'str. '+d.page)+'</p>';
 if(m.topics.length)t+='<h4>Povezave s temami iz soseske</h4>'+m.topics.map(z=>'<div class="qa"><strong>'+h(z.title)+'</strong><p>'+h(z.text)+'</p><small>'+link(z.url,'Mesto v zapisniku')+(m.date==='2025-01-21'&&z.title.startsWith('Varna pot')?' · '+anchor('sled/5-14','Sledi sklepu 5/14 in rezultatom'):'')+'</small></div>').join('');
 t+='<h4>'+(isRemote(m)?'Dopisno glasovanje':'Poimenska prisotnost')+'</h4>';
 if(!m.pdf)t+='<p>Poimenski podatki niso objavljeni.</p>';else for(const [state,label] of Object.entries(stateName)){let a=m.attendance.members.filter(x=>x.state===state);if(a.length)t+='<p><b>'+label+' ('+a.length+')</b> · '+a.map(x=>h(x.name)+(x.note?' <span class="meta">('+h(x.note)+')</span>':'')).join(', ')+'</p>'}
 if(m.attendance.note)t+='<p class="meta">'+h(m.attendance.note)+'</p>';
 return t+'<div class="links">'+link(m.url,'Uradna stran seje')+(m.pdf?link(m.pdf,'Izvirni zapisnik PDF'):'')+anchor('seje/'+m.date,'Povezava do seje')+'</div>'
}
function membersTable(ms,q){let a={};for(const m of ms.filter(m=>m.pdf))for(const v of m.attendance.members){let row=a[v.name]??={name:v.name,p:0,n:0,exc:0,abs:0,v:0,r:0,days:[]};if(isRemote(m)){row.r++;row.v+=Number(v.state==='voted')}else if(['present','partial','absent','excused'].includes(v.state)){row.n++;row.p+=Number(['present','partial'].includes(v.state));row.abs+=Number(v.state==='absent');row.exc+=Number(v.state==='excused')}row.days.push({date:m.date,state:v.state,title:m.title})}
 const byShare=f.seje.order==='share';
 const value=row=>byShare?(row.n?row.p/row.n:0):row.p;
 const ranked=Object.values(a).sort((x,y)=>value(y)-value(x)||y.p-x.p||x.name.localeCompare(y.name,'sl'));
 let rank=0,previousValue=null;
 ranked.forEach((row,index)=>{const score=value(row);if(score!==previousValue){rank=index+1;previousValue=score}row.rank=rank});
 const rows=ranked.filter(row=>fold(row.name).includes(fold(q)));
 const maxCount=Math.max(0,...ranked.map(row=>row.p));
 const leaders=ranked.filter(row=>row.p===maxCount).map(row=>h(row.name));
 const inPerson=ms.filter(m=>m.pdf&&!isRemote(m)),remote=ms.filter(m=>m.pdf&&isRemote(m));let nP=0,dP=0,nR=0,dR=0;
 for(const row of Object.values(a)){nP+=row.p;dP+=row.n;nR+=row.v;dR+=row.r}
 const elected=a['Stanko Furlan'];
 let recap='<div class="notebox"><b>Skupna navzočnost '+(dP?nf(nP*100/dP,1)+' %':'—')+'</b> · '+nP+' navzočnosti pri '+dP+' poimenskih vnosih na '+inPerson.length+' sejah v živo. Na '+remote.length+' dopisnih sejah je bilo oddanih '+nR+' od '+dR+' možnih opredelitev.'+(elected?' Predsednik Stanko Furlan je evidentiran na '+elected.p+' od '+elected.n+' sej v živo in pri '+elected.v+' od '+elected.r+' dopisnih glasovanj.':'')+'</div>';
 return (leaders.length?'<p><b>Največ udeležb na sejah v živo</b> · '+leaders.join(', ')+' ('+maxCount+').</p>':'')+recap+'<p>Delež je izračunan samo za fizične seje, pri katerih je oseba v zapisniku navedena kot član ali članica s potrjenim statusom. Opravičene odsotnosti so prikazane posebej. Pri dopisnem glasovanju sta navedena število odzivov in število poimenskih evidenc v času članstva.</p><div class="tablewrap"><table><thead><tr><th>Mesto</th><th>Svetnik / svetnica</th><th>Navzočnost</th><th>Delež</th><th>Opravičeno</th><th>Druga odsotnost</th><th>Dopisni odzivi</th></tr></thead><tbody>'+rows.map(x=>'<tr><td>'+x.rank+'.</td><td><details><summary>'+h(x.name)+'</summary><div class="memberDates">'+x.days.map(d=>'<div>'+anchor('seje/'+d.date,day(d.date))+' · '+h(stateName[d.state])+'</div>').join('')+'</div></details></td><td>'+x.p+' / '+x.n+'</td><td>'+(x.n?nf(x.p/x.n*100,0)+' %':'—')+'</td><td>'+x.exc+'</td><td>'+x.abs+'</td><td>'+x.v+' / '+x.r+'</td></tr>').join('')+'</tbody></table></div>'
}
function showMeet(){if(focusId==='aktualno'){showCurrentMeetings();return}
 const selected=focusId&&db.meetings.find(m=>m.date===focusId);
 if(selected){app.innerHTML=head(selected.title,day(selected.date)+' · Mandat 2022–2026')+'<article class="meeting-detail">'+meetingBody(selected)+'</article>';return}
 let v=f.seje;let people=v.view==='osebe';app.innerHTML=head(people?'Prisotnost po svetnikih':'Seje in prisotnost',people?'Poglejte, kolikokrat se je posamezni svetnik v mandatu 2022–2026 udeležil seje ali glasoval dopisno.':'Arhiv mandata 2022–2026. Pri vsaki seji najdete teme, odločitve in podatek, kdo je sodeloval.')+(!people?currentMeetingBanner():'')+'<div class="subtabs"><a href="#seje" '+(!people?'aria-current="page"':'')+'>Časovnica sej</a><a href="#seje/osebe" '+(people?'aria-current="page"':'')+'>Prisotnost po svetnikih</a></div>'+searchForm('seje',people?[['year','Leto',yOpts],['order','Razvrstitev',[['count','Največ udeležb v živo'],['share','Najvišji delež udeležbe']]]]:[['year','Leto',yOpts],['mode','Vrsta seje',[['redna','Redna'],['izredna','Izredna'],['dopisna','Korespondenčna'],['sklic','Samo sklic']]]],people?'Priimek svetnika ali svetnice':'Npr. sklep 5/19, pošta, ime svetnika');
 const update=()=>{
  const ms=db.meetings.filter(m=>!v.year||m.date.startsWith(v.year)),dest=document.querySelector('#results');
  if(people){dest.innerHTML=membersTable(ms,v.q);return}
  const key=fold(v.q).replace(/^sklep\s+/,'').trim(), words=queryWords(key);
  const shown=ms.filter(m=>{
    const sameType=!v.mode||(v.mode==='sklic'?!m.pdf:v.mode==='dopisna'?isRemote(m):v.mode==='izredna'?m.title.includes('izredna'):!m.title.includes('izredna')&&!isRemote(m));
    const topicMatch=m.date===db.safeRoute.date&&words.every(w=>searchFormOf(db.safeRoute.title).includes(w));
    return sameType&&(fold(JSON.stringify(m)).includes(key)||topicMatch||(pageIndex.get(m.date)||[]).some(page=>words.every(w=>page.includes(w))));
  }).sort((a,b)=>b.date.localeCompare(a.date));
  const params=new URLSearchParams();
  if(key)params.set('q',key);
  if(v.year)params.set('leto',v.year);
  const go=anchor(archiveHref('','',params),key?'Pokaži zadetke po straneh zapisnikov':'Išči po celotnem besedilu zapisnikov');
  const matches=words.length?getDecisionRows().filter(row=>shown.includes(row.m)&&words.every(word=>searchFormOf([row.d.id,row.d.title,row.d.text,row.extended?.title].join(' ')).includes(word))):[];
  const direct=matches.length?'<section class="home-matches"><h3>Sklepi, ki ustrezajo iskanju</h3>'+matches.slice(0,4).map(row=>'<p>'+anchor(overviewRoute(row.m.date,row.d.id),'Sklep '+row.d.id+' · '+row.d.title)+'</p>').join('')+'</section>':'';
  dest.innerHTML=direct+'<div class="links">'+go+anchor('zapisniki/manjkajo','Pokritost arhiva')+'</div><p class="num">Prikazane seje · '+shown.length+' od '+db.meetings.length+'</p><div class="rows">'+shown.map(m=>{
   const n=count(m,['present','partial']), voted=count(m,['voted']);
   return detail('m-'+m.date,day(m.date)+(m.pdf?' · '+(isRemote(m)?'Oddane opredelitve '+voted:'Evidentirani navzoči '+n)+' / '+m.attendance.members.length:''),m.title,m.pdf?'Sklepi · '+m.count:'Samo sklic',meetingBody(m),focusId===m.date);
  }).join('')+'</div>';
 };
 listen('seje',update);
 if(!people&&!corpus)readCorpus().then(()=>{if(tab==='seje'&&f.seje===v&&v.q)update()}).catch(()=>{});
}
function showPractices(){app.innerHTML=head('Kako to spremljajo drugod','Pet javnih evidenc pokaže, kako lahko prebivalec preveri, kdo ima njegovo pobudo, kdaj je prišel odgovor in kaj je bilo izvedeno.')+'<div class="places">'+db.practices.map(p=>'<article class="place"><div class="eyebrow">'+h(p.city.toLocaleUpperCase('sl'))+'</div><h3>'+h(p.title)+'</h3><p>'+h(p.practice)+'</p><details><summary>Primer in uporaba v Savskem naselju</summary><p>'+h(p.example)+'</p><p><b>Za Savsko naselje</b> · '+h(p.application)+'</p><p class="meta">'+h(p.scope)+'</p></details><div class="links">'+p.sources.map(z=>link(z.url,z.label)).join('')+'</div></article>').join('')+'</div>'}
function showMethod(){app.innerHTML='<div class="method">'+head('Kako smo šteli','Podatki o odločitvah in prisotnosti izhajajo iz uradnih zapisnikov ČS Bežigrad.')+
 '<h3>Koliko sklepov je sprejel svet?</h3><p>V evidentiranih zapisnikih ('+db.meetings.filter(m=>m.pdf).length+') je skupaj '+getDecisionRows().length+' sprejetih oštevilčenih sklepov. Med njimi so vsebinski in postopkovni sklepi, tudi potrditve zapisnikov. Seštevek izključuje glasovanja o dnevnem redu. Neoštevilčene mandatne odločitve in volitve so opisane pri seji.</p>'+
 '<table><thead><tr><th>Leto</th><th>Seje v evidenci</th><th>Zapisniki</th><th>Oštevilčeni sprejeti sklepi</th></tr></thead><tbody>'+yOpts.map(y=>{let m=db.meetings.filter(m=>m.date.startsWith(y));return '<tr><td>'+y+'</td><td>'+m.length+'</td><td>'+m.filter(z=>z.pdf).length+'</td><td>'+m.reduce((s,x)=>s+(x.count||0),0)+'</td></tr>'}).join('')+'</tbody></table>'+
 '<p>Za leto 2025 letno poročilo navaja 48 sprejetih sklepov, 48 obravnavanih pobud občanov in 37 svetniških pobud. V enajstih zapisnikih za isto leto je bilo mogoče po številki potrditi 47 sprejetih sklepov. Razlike ene enote ni mogoče zanesljivo pojasniti. '+link(db.meetings.find(m=>m.date==="2026-02-03").pdf+"#page=6","Letno poročilo za 2025, str. 6")+'</p>'+
 '<p>Za prisotnost štejejo poimenska navedba v zapisniku in spremembe sestave sveta. Pri sejah v živo štejemo navzoče tudi, če so bili tam le del seje. Kadar je znano zgolj skupno število poznejših prihodov ali odhodov, ga navedemo v opombi. Pri korespondenčnih sejah štejemo oddane opredelitve. Osebe, zaposlene v mestni upravi, gosti in predstavniki javnosti niso v imenovalcu svetniške udeležbe. Stopnja navzočnosti meri udeležbo na dokumentiranih sejah; za obseg dela izven sej ni podatka.</p><div class="links">'+link(archive,'Celoten arhiv MOL')+anchor('seje/osebe','Poimenska evidenca')+'</div></div>'}
function render(scroll, previousHash=''){
 const [route,sub]=(location.hash.slice(1).split('?')[0]||'domov').split('/');
 tab=Object.hasOwn(sectionNames,route)?route:'domov';
 focusId=sub;
 const params=new URLSearchParams(location.hash.split('?')[1]||'');
 const parent=tab==='sled'||(tab==='sklepi'&&sub&&params.get('iz')==='seje')?'sklepi-po-sejah':tab;
 for(const a of document.querySelectorAll('#sections a')){
   if(a.hash==='#'+parent)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
 }
 const crumbs=document.getElementById('breadcrumbs');
 crumbs.innerHTML=tab==='domov'?'':'<div class="crumbs">'+anchor('domov','Začetna stran')+'<span aria-hidden="true">/</span>'+
   (sub?anchor(parent,sectionNames[parent]):'<span>'+h(sectionNames[tab])+'</span>')+
   (previousHash.startsWith('#iskanje?')&&tab!=='iskanje'?anchor(previousHash.slice(1),'Nazaj na zadetke'):'')+'</div>';
 document.body.classList.toggle('home',tab==='domov');
 if(tab==='seje'){
   const view=sub==='osebe'?'osebe':'seje';
   if(view!==f.seje.view||sub||params.has('q'))f.seje={q:params.get('q')||'',year:'',mode:'',view,order:'count'};
 }
 ({domov:showHome,iskanje:showSiteSearch,vodnik:showGuide,seje:showMeet,metoda:showMethod,prakse:showPractices,zapisniki:showTranscripts,sled:showTrail,sklepi:showDecisions,savsko:showSavsko,finance:showFinance,'sklepi-po-sejah':showMeetingDecisions})[tab]();
 simplifyFilters();
 const heading=app.querySelector('h1,h2')?.textContent||sectionNames[tab]||'Začetna stran';
 document.title=heading+' · Savski zapisnik';
 if(scroll){
   if(tab!=='iskanje'||params.has('q'))document.getElementById('vsebina').focus({preventScroll:true});
   window.scrollTo({top:0,behavior:'instant'});
 }
}
setupNavigation();
fetch('podatki.json').then(res=>{if(!res.ok)throw Error();return res.json()}).then(data=>{db=data;setupDecisionWatch();render(false);window.addEventListener('hashchange',event=>render(true,new URL(event.oldURL).hash))}).catch(()=>{app.innerHTML='<p>Podatkov ni bilo mogoče naložiti. Osvežite stran ali odprite '+link(archive,'uradni arhiv sej')+'.</p>'});