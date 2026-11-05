// Savsko naselje · anketa – odgovori kandidatnih list
const CONFIG = {
  endpoint: '', // TODO: URL spletne aplikacije Apps Script
  rok: 'nedelja, 8. 11. 2026, ob 12.00',
  upravljavec: 'Rok Terkaj, savskonaselje1@gmail.com, 070 205 595',
  maxBesed: 0, // 0 = brez omejitve besed (odločitev Rok, 4. 11. 2026)
  storageKey: 'savska-odgovori-v5'
};
const $ = s => document.querySelector(s);
const ph = s => !s || /\[.*\]/.test(s);
let Q = null, G = {}, state = {};
const NVSEH = 359; // veljavnih anket v izvozu 5. 11. 2026 (1 test izločen)
const words = t => (t.trim().match(/\S+/g) || []).length;
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}


const ZASEBNOST='<h2 tabindex="-1">Zasebnost</h2><p class="small">Verzija 1.3, 5. 11. 2026</p>'+
 '<h3>Kdo je upravljavec</h3><p>Rok Terkaj, fizična oseba, koordinator neodvisne in civilne pobude prebivalcev Savskega naselja; <a href="mailto:savskonaselje1@gmail.com">savskonaselje1@gmail.com</a>, <a href="tel:+38670205595">070 205 595</a>.</p>'+
 '<h3>Kaj zbiramo in zakaj</h3><p>Od kandidatnih list zbiramo ime liste, e-naslov za potrditev, odgovore na vprašanja, kratko predstavitev ekipe, liste ali stranke ter neobvezno povezavo do fotografije ali video pozdrava. Namen je, da prebivalci Savskega naselja pred volitvami v svet ČS Bežigrad 15. 11. 2026 vidijo zaveze list. Podlaga je vaša privolitev (točka (a) 6(1) Splošne uredbe).</p>'+
 '<h3>Kaj objavimo</h3><p>Odgovore, predstavitev in morebitno fotografijo ali video pozdrav objavimo skupaj z imenom liste, dobesedno in v celoti, vse naenkrat, liste v vrstnem redu uradnega seznama za volilno enoto 01: na spletni strani Savsko naselje (savska.org), v skupini Savsko naselje, v Facebook skupinah Savčan, Savc in Civilna iniciativa Savsko naselje, po e-pošti prostovoljcev, ki jih imamo, in tistih, ki so želeli biti obveščeni, ter na vhodih blokov, do 12. 11. 2026. E-naslova liste ne objavimo — uporabimo ga samo za potrditev prejema in morebitna vprašanja.</p>'+
 '<h3>Česa ne zbiramo</h3><p>Ne prosimo za osebna imena kandidatov, domače naslove ali telefonske številke. Imena kandidatov bomo po potrebi kasneje vzeli iz javne predstavitve kandidatk in kandidatov ČS Bežigrad, kjer so že objavljena. Narek z mikrofonom ostane v vašem brskalniku; zvoka ne shranjujemo in ne pošiljamo nam. Dokler odgovorov ne oddate, ostanejo samo v tej napravi.</p>'+
 '<h3>Avtorske pravice</h3><p>Avtorske pravice fotografij in videoposnetkov urejate sami. Z pregledom odgovorov in pošiljanjem se zavežete, da imajo fotografije in videoposnetki pravice urejene in podeljene Civilni iniciativi za objavo na mestih, navedenih na začetku obrazca.</p>'+
 '<h3>Katere storitve uporabljamo</h3><p>Stran teče na GitHubu. Ko bo oddaja odprta, se odgovori shranijo v Googlovo preglednico, ki jo ureja upravljavec.</p>'+
 '<h3>Kako dolgo hranimo</h3><ul><li>E-naslov hranimo, dokler potrdimo prejem in uredimo objavo, največ 12 mesecev; nato ga izbrišemo.</li><li>Objavljeni odgovori, predstavitev in povezave ostanejo javno, ker so zaveze liste prebivalcem.</li><li>Enkrat letno preverimo, ali je hramba še potrebna, in to zapišemo (43. člen ZVOP-2).</li></ul>'+
 '<h3>Kaj lahko zahtevate</h3><p>Lahko vprašate, kaj imamo o vas, in zahtevate popravek ali izbris neobjavljenih podatkov (na primer e-naslova), ugovarjate ali umaknete privolitev pred objavo. Dovolj je sporočilo na <a href="mailto:savskonaselje1@gmail.com">savskonaselje1@gmail.com</a>. Če niste zadovoljni, se lahko obrnete na Informacijskega pooblaščenca (www.ip-rs.si).</p>'+
 '<button type="button" class="pri" id="zasebnost-zapri">Zapri</button>';
function setupZasebnost(){
  const zOkno=document.createElement('dialog');
  zOkno.id='zasebnost-okno';
  zOkno.setAttribute('aria-label','Zasebnost');
  zOkno.innerHTML=ZASEBNOST;
  document.body.appendChild(zOkno);
  function odpri(){ if(!zOkno.open){ if(zOkno.showModal) zOkno.showModal(); else zOkno.setAttribute('open',''); } const h=zOkno.querySelector('h2'); if(h) h.focus(); }
  function zapri(){ if(zOkno.close) zOkno.close(); else zOkno.removeAttribute('open'); if(location.hash==='#zasebnost') history.replaceState(null,'',location.pathname+location.search); }
  document.addEventListener('click',function(e){ if(e.target.closest('[data-zasebnost]')){ e.preventDefault(); odpri(); } else if(e.target.id==='zasebnost-zapri'||e.target===zOkno) zapri(); });
  window.addEventListener('hashchange',function(){ if(location.hash==='#zasebnost') odpri(); });
  if(location.hash==='#zasebnost') odpri();
}


const LISTE = [
  {n:1, ime:'Gibanje Svoboda'},
  {n:2, ime:'Slovenska ljudska stranka'},
  {n:3, ime:'Demokrati. Anžeta Logarja'},
  {n:4, ime:'Pirati'},
  {n:5, ime:'Levica'},
  {n:6, ime:'Prerod – stranka Vladimirja Prebiliča'},
  {n:7, ime:'Slovenska demokratska stranka – SDS'},
  {n:8, ime:'Vesna – zelena stranka'},
  {n:9, ime:'Nova Slovenija in Fokus'},
  {n:10, ime:'Socialni demokrati'},
  {n:11, ime:'Cilj – Bežigrad'},
  {n:12, ime:'Stranka Straža – katoliška narodna stranka'},
  {n:13, ime:'Ljubljana smo vsi – lista mag. Urške Klakočar Zupančič in dr. Antona Ropa'},
  {n:14, ime:'Državljansko gibanje Resni.ca'},
  {n:15, ime:'Lista Zorana Jankovića'}
];
function fillListe(){
  const sel=$('#lista');
  if(!sel || sel.tagName!=='SELECT') return;
  sel.innerHTML='<option value="">Izberite listo</option>'+LISTE.map(x=>`<option value="${esc(x.ime)}" data-n="${x.n}">${x.n}. ${esc(x.ime)}</option>`).join('');
}
function listaMeta(ime){return LISTE.find(x=>x.ime===ime)||null}
function casLj(){return new Date().toLocaleString('sl-SI',{timeZone:'Europe/Ljubljana',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit'})+' (Europe/Ljubljana)'}

async function init(){
  $('#rok').textContent = CONFIG.rok;
  const off = ph(CONFIG.endpoint)||ph(CONFIG.upravljavec);
  if(ph(CONFIG.upravljavec)) $('#upr').hidden=true; else $('#uprTxt').textContent = CONFIG.upravljavec;
  if(off){const e=$('#cfgwarn');e.hidden=false;e.textContent='Oddaja odgovorov bo odprta kmalu. Odgovore lahko že pripravite – shranjujejo se v vašem brskalniku – in prenesete kopijo.';}
  Q = await (await fetch('questions.json?v=20261105ae')).json();
  try{G=await (await fetch('grafi/grafi.json?v=20261105ae')).json()}catch(e){G={}}
  try{state=JSON.parse(localStorage.getItem(CONFIG.storageKey))||{}}catch(e){state={}}
  state.odg ||= {};
  fillListe(); render(); restore(); setupGrafZoom(); setupZasebnost();
  $('#f').addEventListener('input', save); $('#f').addEventListener('change', onFormChange);
  $('#pregled').onclick = review; $('#nazaj').onclick = ()=>{$('#review').hidden=true;$('#f').hidden=false};
  $('#oddaj').onclick = submit; if(off){$('#oddaj').disabled=true;$('#oddaj').textContent='Oddaja bo odprta kmalu';}
  $('#prenesiJ').onclick = ()=>dl(JSON.stringify(payload(),null,2),'json','application/json');
  $('#prenesiT').onclick = ()=>dl(toTxt(payload()),'txt','text/plain');
}

function jeEnaka(s){return s.id==='obvescanje'||!!s.enaka;}
function uniquePrios(){
  return [...new Set([...document.querySelectorAll('input.priobox:checked')].map(b=>b.dataset.s).filter(Boolean))];
}
function onFormChange(ev){
  if(ev.target && ev.target.classList.contains('priobox')){
    const id=ev.target.dataset.s, on=ev.target.checked;
    document.querySelectorAll('input.priobox[data-s="'+id+'"]').forEach(b=>b.checked=on);
    if(uniquePrios().length>5){
      document.querySelectorAll('input.priobox[data-s="'+id+'"]').forEach(b=>b.checked=false);
    }
    syncPrio();
  }
  save();
}

function syncPrio(){
  const selected=uniquePrios();
  const n=selected.length;
  const el=$('#priost');
  if(el){
    el.textContent='Prioritetne teme: '+n+' / 5';
    el.classList.toggle('ok', n===5);
    el.classList.toggle('over', n>5);
  }
  document.querySelectorAll('input.priobox').forEach(b=>{
    b.disabled=!b.checked && n>=5;
  });
  document.querySelectorAll('.sek').forEach(sek=>{
    sek.classList.toggle('prio-on', selected.includes(sek.dataset.s));
  });
  document.querySelectorAll('#lestvica li').forEach(li=>{
    const b=li.querySelector('input.priobox');
    li.classList.toggle('prio-on', !!(b&&b.checked));
  });
}

function renderLestvica(){
  const el=$('#lestvica'); if(!el) return;
  let tema=0;
  const rows=Q.sekcije.map(s=>{
    const numbered=!jeEnaka(s);
    if(numbered) tema++;
    const ime=numbered?`${tema}. tema ${esc(s.naslov)}`:esc(s.naslov);
    if(!numbered){
      return `<li class="lez-enaka"><a href="#sek-${s.id}">${ime}</a> <span class="small">za vse enaka</span></li>`;
    }
    return `<li><input type="checkbox" class="priobox" data-s="${s.id}" id="lp-${s.id}" aria-label="Prioriteta: ${esc(s.naslov)}"> <a href="#sek-${s.id}">${ime}</a></li>`;
  }).join('');
  el.innerHTML=`<h2>Pregled tem</h2><p class="small">Označite 5 prioritetnih tem. Ista kljukica velja tudi pri temi spodaj, kjer je krajši opis.</p><ol>${rows}</ol>`;
}
function render(){
  renderLestvica();
  const sek=$('#sekcije'); let tema=0;
  Q.sekcije.forEach(s=>{
    const numbered=!jeEnaka(s);
    if(numbered) tema++;
    const naslov=numbered
      ? `<h2><span class="nr">${tema}.</span> <span class="tema-lab">tema</span> ${esc(s.naslov)}</h2>`
      : `<h2>${esc(s.naslov)}</h2>`;
    const prio=jeEnaka(s)
      ? `<p class="obv-tema">Ta sklop je za vse liste enak, zato ni med petimi prioritetnimi temami. Prosimo, da nanj odgovorite v celoti.</p>`
      : `<label class="prio"><input type="checkbox" class="priobox" id="p-${s.id}" data-s="${s.id}"> To je ena od naših 5 prioritet</label>`;
    const qs=s.vprasanja.map((q,i)=>{
      const polje=q.polje||'Razlaga zaveze (neobvezno: kako in do kdaj, lasten predlog, …)';
      const razlaga=q.razlaga||'';
      const radios=q.tip==='besedilo'?'':`<fieldset class="radios" aria-labelledby="t-${q.id}"><legend class="small">Odgovor</legend>
        ${['Da','Ne','Delno'].map(v=>`<label><input type="radio" name="r-${q.id}" value="${v}"> ${v}</label>`).join('')}</fieldset>`;
      return `<div class="q" id="q-${q.id}" data-q="${q.id}">
      <p class="qt" id="t-${q.id}">${i+1}. ${esc(q.besedilo)}</p>
      ${radios}
      <label for="x-${q.id}">${esc(polje)}</label>
      ${razlaga?`<p class="small razlaga">${esc(razlaga)}</p>`:''}
      <textarea id="x-${q.id}" name="x-${q.id}" aria-describedby="c-${q.id}"></textarea>
      <div class="row"><button type="button" class="mic" aria-pressed="false" data-t="x-${q.id}">🎤 Narekuj</button>
        <span class="small cnt" id="c-${q.id}" aria-live="polite">0 besed</span></div>
      <p class="small micmsg" aria-live="polite"></p></div>`;
    }).join('');
    sek.insertAdjacentHTML('beforeend',`<section class="card sek" id="sek-${s.id}" data-s="${s.id}">${naslov}${prio}${s.opis?`<p class="opis">${esc(s.opis)}</p>`:''}${graf(s.id)}${(s.citati||[]).length?`<div class="cit"><p class="small">Iz odgovorov prebivalcev:</p>${s.citati.map(c=>`<blockquote>»${esc(c)}«</blockquote>`).join('')}</div>`:''}${qs}</section>`);
  });
  document.querySelectorAll('textarea').forEach(t=>t.addEventListener('input',()=>count(t)));
  setupMic();
  syncPrio();
}

function setupGrafZoom(){
  let box = $('#grafzoom');
  if(!box){
    box = document.createElement('div');
    box.id = 'grafzoom';
    box.hidden = true;
    box.setAttribute('role','dialog');
    box.setAttribute('aria-modal','true');
    box.setAttribute('aria-label','Povečan graf');
    box.innerHTML = '<img alt="">';
    document.body.appendChild(box);
    const close = () => { box.hidden = true; box.querySelector('img').removeAttribute('src'); };
    box.addEventListener('click', close);
    document.addEventListener('keydown', e => { if(e.key==='Escape' && !box.hidden) close(); });
  }
  const open = src => {
    const im = box.querySelector('img');
    im.src = src.src;
    im.alt = src.alt || 'Povečan graf';
    box.hidden = false;
  };
  document.querySelectorAll('.graf img').forEach(el => {
    el.addEventListener('click', () => open(el));
    el.addEventListener('keydown', e => { if(e.key==='Enter' || e.key===' '){ e.preventDefault(); open(el); } });
  });
}
function graf(id){const g=G[id];if(!g)return '';
  if(g.skrij_vir) return `<figure class="graf"><img src="${g.slika}" alt="${esc(g.alt||'')}"></figure>`;
  let vir = g.vir ? esc(g.vir) : `Vir: Savska anketa, vprašanje ${g.stevilka} »${esc(g.vprasanje)}«; možnosti: ${esc(g.moznosti)}; n = ${g.n}/${NVSEH} odgovorov.${g.opomba?' '+esc(g.opomba):''}${g.izbor?' '+esc(g.izbor):''}`;
  if(g.pobude!=null) vir += ` MOL je za to temo prejel ${g.pobude} pobud (portal Pobude meščanov).`;
  return `<figure class="graf"><figcaption class="gq">Prebivalci so odgovarjali na vprašanje: »${esc(g.vprasanje)}«</figcaption>
  <img class="gz" src="${g.slika}?v=20261105ae" alt="${esc(g.alt)}" loading="lazy" width="704" tabindex="0" role="button" aria-label="Povečaj graf">
  <p class="small vir">${vir}</p></figure>`}
function count(t){const n=words(t.value),c=$('#c-'+t.id.slice(2)),m=CONFIG.maxBesed;c.textContent=m?`${n} / ${m} besed`:`${n} besed`;c.classList.toggle('over',!!m&&n>m)}
function setupMic(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  document.querySelectorAll('.mic').forEach(b=>{
    const msg=b.closest('.q').querySelector('.micmsg');
    if(!SR){b.onclick=()=>msg.textContent='Vaš brskalnik ne podpira nareka. Odgovor lahko vtipkate ali uporabite narek na tipkovnici telefona.';return}
    let rec=null;
    b.onclick=()=>{
      if(rec){rec.stop();return}
      const t=$('#'+b.dataset.t); rec=new SR(); rec.lang='sl-SI'; rec.continuous=true; rec.interimResults=false;
      rec.onresult=e=>{for(let i=e.resultIndex;i<e.results.length;i++) if(e.results[i].isFinal){t.value=(t.value?t.value.trimEnd()+' ':'')+e.results[i][0].transcript.trim();count(t);save()}};
      rec.onerror=e=>{msg.textContent=e.error==='not-allowed'?'Dostop do mikrofona ni dovoljen. Dovolite ga v nastavitvah brskalnika ali odgovor vtipkajte.':'Narek se je ustavil. Poskusite znova ali odgovor vtipkajte.'};
      rec.onend=()=>{rec=null;b.setAttribute('aria-pressed','false');b.textContent='🎤 Narekuj'};
      try{rec.start();b.setAttribute('aria-pressed','true');b.textContent='⏹ Ustavi narek';msg.textContent='Poslušam … (zvok ostane v brskalniku)'}catch(e){rec=null;msg.textContent='Nareka ni bilo mogoče zagnati.'}
    };
  });
}

function collect(){
  const o={lista:$('#lista').value.trim(),email:$('#email').value.trim(),predstavitev:($('#predstavitev')||{}).value?$('#predstavitev').value.trim():'',foto:($('#foto')||{}).value?$('#foto').value.trim():'',videoPozdrav:($('#videoPozdrav')||{}).value?$('#videoPozdrav').value.trim():'',soglasje:$('#soglasje').checked,prioritet:[],odg:{}};
  o.prioritet = uniquePrios();
  Q.sekcije.forEach(s=>{
    s.vprasanja.forEach(q=>{
      const r=document.querySelector(`input[name="r-${q.id}"]:checked`);
      o.odg[q.id]={odgovor:r?r.value:'',besedilo:$('#x-'+q.id).value};
    });
  });
  return o;
}
function save(){state=collect();localStorage.setItem(CONFIG.storageKey,JSON.stringify(state));
  $('#saved').textContent='Shranjeno v tej napravi ob '+new Date().toLocaleTimeString('sl-SI',{hour:'2-digit',minute:'2-digit'})}
function restore(){
  $('#lista').value=state.lista||'';$('#email').value=state.email||'';if($('#predstavitev'))$('#predstavitev').value=state.predstavitev||'';if($('#foto'))$('#foto').value=state.foto||'';if($('#videoPozdrav'))$('#videoPozdrav').value=state.videoPozdrav||'';$('#soglasje').checked=!!state.soglasje;
  (state.prioritet||[]).forEach(id=>{document.querySelectorAll('input.priobox[data-s="'+id+'"]').forEach(b=>b.checked=true)});
  Object.entries(state.odg||{}).forEach(([id,a])=>{
    const r=document.querySelector(`input[name="r-${id}"][value="${a.odgovor}"]`);if(r)r.checked=true;
    const t=$('#x-'+id);if(t){t.value=a.besedilo||'';count(t)}});
  syncPrio();
}
function tipSklopa(s, prioritet){
  if(s.id==='zakaj') return 'predstavitev';
  if(jeEnaka(s)) return 'obvezno';
  if(prioritet.includes(s.id)) return 'prioriteta';
  return 'ostalo';
}
function payload(){const c=collect();const ime=id=>(Q.sekcije.find(s=>s.id===id)||{}).naslov||id;
  const meta=listaMeta(c.lista);
  const out={casOddaje:new Date().toISOString(),casOddajeLokalni:casLj(),lista:c.lista,listaStevilka:meta?meta.n:null,email:c.email,predstavitev:c.predstavitev,foto:c.foto,videoPozdrav:c.videoPozdrav,soglasje:c.soglasje,prioritet:c.prioritet.map(ime),prioritetId:c.prioritet,odgovori:[]};
  Q.sekcije.forEach(s=>s.vprasanja.forEach(q=>out.odgovori.push({id:q.id,temaId:s.id,sklop:s.naslov,tip:tipSklopa(s,c.prioritet),prioriteta:c.prioritet.includes(s.id),vprasanje:q.besedilo,...c.odg[q.id]})));return out}
function toTxt(p){const oznaka=p.listaStevilka?`${p.listaStevilka}. ${p.lista}`:p.lista;
  return `Savsko naselje · anketa – odgovori liste\nLista: ${oznaka}\nE-naslov: ${p.email}\nPrioritetne teme: ${(p.prioritet||[]).join(', ')||'—'}\nPredstavitev ekipe, liste ali stranke: ${p.predstavitev||'—'}\nFotografija: ${p.foto||'—'}\nVideo pozdrav: ${p.videoPozdrav||'—'}\nČas: ${p.casOddajeLokalni||p.casOddaje}\n\n`+
  p.odgovori.map(a=>`[${a.sklop}${a.temaId?' · '+a.temaId:''}${a.tip?' · '+a.tip:''}${a.prioriteta?' · prioriteta':''}] ${a.vprasanje}\nOdgovor: ${a.odgovor||'—'}\nRazlaga zaveze (kako in do kdaj, lasten predlog, …): ${a.besedilo||'—'}\n`).join('\n')}
function dl(txt,ext,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:type+';charset=utf-8'}));
  a.download=`odgovori-${(collect().lista||'lista').replace(/[^\wčšžČŠŽ-]+/g,'_')}.${ext}`;a.click();URL.revokeObjectURL(a.href)}

function validate(){
  const c=collect(),e=[];
  if(!c.lista || !listaMeta(c.lista))e.push('Izberite listo s uradnega seznama za volilno enoto 01.');
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c.email))e.push('Vpišite veljaven e-naslov.');
  if(c.prioritet.some(id=>{const s=Q.sekcije.find(x=>x.id===id);return s&&jeEnaka(s);})) e.push('Obveščanje in zaključni sklop nista med prioritetnimi temami — sta enaka za vse liste.');
  if(c.prioritet.length!==5)e.push('Označite 5 prioritetnih tem (zdaj '+c.prioritet.length+').');
  const pset=new Set(c.prioritet);
  Q.sekcije.filter(jeEnaka).forEach(s=>pset.add(s.id));
  const manjkajo=[];
  let dolg=0;
  Q.sekcije.forEach(s=>{
    if(!pset.has(s.id)) return;
    s.vprasanja.forEach((q,i)=>{
      const a=c.odg[q.id];
      if(q.tip!=='besedilo' && !a.odgovor){
        const txt=String(q.besedilo||'').replace(/\s+/g,' ');
        manjkajo.push({id:q.id,label:s.naslov+' · '+(i+1)+'. '+(txt.length>80?txt.slice(0,77)+'…':txt)});
      }
      if(CONFIG.maxBesed&&words(a.besedilo)>CONFIG.maxBesed) dolg++;
    });
  });
  if(manjkajo.length) e.push({text:'Pri '+manjkajo.length+' obveznih vprašanjih (obveščanje ali prioritetne teme) še ni izbran odgovor Da / Ne / Delno.',links:manjkajo});
  if(dolg)e.push(dolg+' odgovorov je daljših od '+CONFIG.maxBesed+' besed.');
  const urlOk = u => !u || /^https:\/\/\S+$/i.test(u);
  if(!urlOk(c.foto) || !urlOk(c.videoPozdrav)) e.push('Povezava do fotografije ali video pozdrava naj se začne s https://.');
  if(!c.soglasje)e.push('Potrdite soglasje za objavo.');
  return e}
function prikaziNapake(e){
  const box=$('#err');
  if(!e.length){box.className='ok';box.textContent='Hvala — obvezni odgovori Da / Ne / Delno so označeni.';return}
  box.className='msg';
  box.innerHTML=e.map(it=>{
    if(typeof it==='string') return esc(it);
    let h=esc(it.text);
    if(it.links&&it.links.length){
      h+='<ul class="err-povezave">'+it.links.map(l=>'<li><a href="#q-'+esc(l.id)+'">'+esc(l.label)+'</a></li>').join('')+'</ul>';
    }
    return h;
  }).join('<br>');
}
function review(){
  const e=validate();prikaziNapake(e);if(e.length)return;
  const p=payload();
  $('#revBody').innerHTML=`<p><b>Lista:</b> ${esc(p.listaStevilka?p.listaStevilka+'. '+p.lista:p.lista)}<br><b>E-naslov:</b> ${esc(p.email)}<br><b>Prioritetne teme:</b> ${esc((p.prioritet||[]).join(', ')||'—')}</p>`+(p.predstavitev?`<div class="rv"><b>Predstavitev ekipe, liste ali stranke</b><br>${esc(p.predstavitev)}</div>`:'')+
    p.odgovori.filter(a=>a.odgovor||(a.besedilo||'').trim()).map(a=>`<div class="rv"><b>${esc(a.vprasanje)}</b>${a.prioriteta?' <span class="small">(prioriteta)</span>':''}<br>Odgovor: ${esc(a.odgovor||'—')}<br>${esc(a.besedilo||'—')}</div>`).join('');
  $('#f').hidden=true;$('#review').hidden=false;$('#review').focus();
}
async function submit(){
  const s=$('#status');
  if(ph(CONFIG.endpoint)||ph(CONFIG.upravljavec)){s.textContent='Oddaja bo odprta kmalu. Medtem lahko prenesete kopijo svojih odgovorov.';return}
  $('#oddaj').disabled=true;s.textContent='Pošiljam …';
  try{const r=await fetch(CONFIG.endpoint,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload())});
    const j=await r.json();if(!j.ok)throw new Error(j.error||'napaka');
    s.className='ok';s.textContent='Hvala! Odgovore smo prejeli. Potrditev bomo poslali na vaš e-naslov.';localStorage.removeItem(CONFIG.storageKey);
  }catch(err){$('#oddaj').disabled=false;s.textContent='Oddaja ni uspela. Poskusite znova ali prenesite kopijo in jo pošljite na savskonaselje1@gmail.com.'}
}
init();
