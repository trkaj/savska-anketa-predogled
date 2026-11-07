// Savsko naselje · anketa – odgovori kandidatnih list
const CONFIG = {
  endpoint: 'https://script.google.com/macros/s/AKfycbw0rHVWyMBTwv3VhaZIwMczxN2Kw6dpHNWjcmUeCJiOPGLxDPRcJXSgXj2dcZl6m-t1/exec',
  rok: 'do torka, 10. 11. 2026, do 24.00',
  upravljavec: 'Rok Terkaj, savskonaselje1@gmail.com, 070 205 595',
  storageKey: 'savska-odgovori-v7-'+((new URLSearchParams(location.search).get('l')||'').slice(0,6))
};
const $ = s => document.querySelector(s);
const ph = s => !s || /\[.*\]/.test(s);
let Q = null, G = {}, state = {};
const NVSEH = 394; // veljavnih anket v izvozu 6. 11. 2026 ob 6.20 (1 test izločen); izbor tem od 382
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}


const ZASEBNOST='<h2 tabindex="-1">Zasebnost</h2><p class="small">Verzija 1.4, 5. 11. 2026</p>'+
 '<h3>Kdo je upravljavec</h3><p>Rok Terkaj, fizična oseba, koordinator neodvisne in civilne pobude prebivalcev Savskega naselja; <a href="mailto:savskonaselje1@gmail.com">savskonaselje1@gmail.com</a>, <a href="tel:+38670205595">070 205 595</a>.</p>'+
 '<h3>Kaj zbiramo in zakaj</h3><p>Od kandidatnih list zbiramo ime liste, e-naslov za potrditev, odgovore na vprašanja, kratko predstavitev ekipe, liste ali stranke ter neobvezno povezavo do fotografije ali video pozdrava. Namen je, da prebivalci Savskega naselja pred volitvami v svet ČS Bežigrad 15. 11. 2026 vidijo zaveze list. Podlaga je vaša privolitev (točka (a) 6(1) Splošne uredbe).</p>'+
 '<h3>Kaj objavimo</h3><p>Odgovore in povzetke odgovorov, predstavitev in morebitno fotografijo ali video pozdrav objavimo skupaj z imenom liste v celoti, liste v vrstnem redu uradnega seznama za volilno enoto 01: na spletni strani <a href="https://anketa.savska.org">savska.org</a>, po naših socialnih omrežjih, po e-pošti prostovoljcev, ki jih imamo, in tistih, ki so želeli biti obveščeni, ter na vhodih blokov, od 11. 11. 2026. E-naslova liste ne objavimo — uporabimo ga samo za potrditev prejema in morebitna vprašanja.</p>'+
 '<h3>Česa ne zbiramo</h3><p>Ne prosimo za osebna imena kandidatov, domače naslove ali telefonske številke. Imena kandidatov bomo po potrebi kasneje vzeli iz javne predstavitve kandidatk in kandidatov ČS Bežigrad, kjer so že objavljena. Dokler odgovorov ne oddate, ostanejo samo v tej napravi.</p>'+
 '<h3>Avtorske pravice</h3><p>Avtorske pravice fotografij in videoposnetkov urejate sami. Z pregledom odgovorov in pošiljanjem se zavežete, da imajo fotografije in videoposnetki pravice urejene in podeljene Civilni iniciativi za objavo za namene uporabe, kot so v teh pogojih zasebnosti.</p>'+
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


let LISTA=null, TOKEN='';
function skrijObrazec(){
  $('#brezTokena').hidden=false; $('#f').hidden=true; $('#review').hidden=true; $('#oddaj').disabled=true;
  return false;
}
async function fillListe(){
  TOKEN=(new URLSearchParams(location.search).get('l')||'').trim();
  if(!TOKEN) return skrijObrazec();
  try{
    const r=await fetch(CONFIG.endpoint+'?action=lista&l='+encodeURIComponent(TOKEN));
    const j=await r.json();
    if(!j || !j.ok || !j.ime) return skrijObrazec();
    LISTA={n:j.n, ime:j.ime};
    const el=$('#lista');
    if(el) el.textContent=LISTA.n?LISTA.n+'. '+LISTA.ime:LISTA.ime;
    return true;
  }catch(err){
    return skrijObrazec();
  }
}
function listaMeta(){return LISTA}
function casLj(){return new Date().toLocaleString('sl-SI',{timeZone:'Europe/Ljubljana',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit'})+' (Europe/Ljubljana)'}

async function init(){
  $('#rok').textContent = CONFIG.rok;
  const off = ph(CONFIG.endpoint)||ph(CONFIG.upravljavec);
  if(ph(CONFIG.upravljavec)) $('#upr').hidden=true; else $('#uprTxt').textContent = CONFIG.upravljavec;
  if(off){const e=$('#cfgwarn');e.hidden=false;e.textContent='Spletna oddaja bo odprta kmalu. Odgovore lahko že pripravite – shranjujejo se v vašem brskalniku – in jih s pregleda pošljete na savskonaselje1@gmail.com.';}
  Q = await (await fetch('questions.json?v=20261107x')).json();
  try{G=await (await fetch('grafi/grafi.json?v=20261106a')).json()}catch(e){G={}}
  try{state=JSON.parse(localStorage.getItem(CONFIG.storageKey))||{}}catch(e){state={}}
  state.odg ||= {};
  setupZasebnost();
  if(!await fillListe()) return;
  render(); restore(); setupGrafZoom();
  $('#f').addEventListener('input', save); $('#f').addEventListener('change', onFormChange);
  function vpisiDopolnjenoPovezavo(el){const n=dopolniPovezavo(el.value);if(n&&povezavaOk(n))el.value=n;save();}
  ['foto','videoPozdrav'].forEach(id=>{const el=$('#'+id);if(!el)return;el.addEventListener('blur',()=>vpisiDopolnjenoPovezavo(el));el.addEventListener('paste',()=>setTimeout(()=>vpisiDopolnjenoPovezavo(el),0));el.addEventListener('change',()=>vpisiDopolnjenoPovezavo(el));});
  $('#pregled').onclick = review; $('#nazaj').onclick = ()=>{$('#review').hidden=true;$('#f').hidden=false}; if($('#shraniPregled')) $('#shraniPregled').onclick = shraniInPrenesi;
  $('#oddaj').onclick = submit; if(off){$('#oddaj').disabled=false;$('#oddaj').textContent='Pošlji na savskonaselje1@gmail.com';$('#oddaj').onclick=posljiMail;}
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
    const names=selected.map(id=>{const s=(Q&&Q.sekcije||[]).find(x=>x.id===id);return s?s.naslov:id;});
    const slots=[1,2,3,4,5].map(i=>names[i-1]?`${i}. ${names[i-1]}`:`${i}. —`).join(' · ');
    el.innerHTML='<span class="priost-head">✋ '+n+' / 5 prioritet</span><span class="priost-list">'+slots+'</span>';
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
    let badge=li.querySelector('.prio-nr');
    if(b&&b.checked){
      const nr=selected.indexOf(b.dataset.s)+1;
      if(!badge){badge=document.createElement('span');badge.className='prio-nr';li.appendChild(badge);}
      badge.textContent=String(nr);
    } else if(badge){badge.remove();}
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
  el.innerHTML=`<h2>Pregled tem</h2><p class="small">✋ Označite 5 prioritet. Ista kljukica velja tudi pri temi spodaj, kjer je krajši opis.</p><ol>${rows}</ol>`;
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
      ? (s.obvezno===false
        ? `<p class="obv-tema">Ta sklop je za vse liste enak, zato ni med 5 prioritetami. Ni obvezen.</p>`
        : `<p class="obv-tema">Ta sklop je za vse liste enak, zato ni med 5 prioritetami. Prosimo, da nanj odgovorite v celoti.</p>`)
      : `<label class="prio"><input type="checkbox" class="priobox" id="p-${s.id}" data-s="${s.id}"> To je ena od naših 5 prioritet</label>`;
    const qs=s.vprasanja.map((q,i)=>{
      const polje=q.polje||'Razlaga zaveze (neobvezno: kako in do kdaj)';
      const razlaga=q.razlaga||'';
      const radios=q.tip==='besedilo'?'':`<fieldset class="radios" aria-labelledby="t-${q.id}"><legend class="small">Odgovor</legend>
        ${['Da','Ne','Delno'].map(v=>`<label><input type="radio" name="r-${q.id}" value="${v}"> ${v}</label>`).join('')}</fieldset>`;
      return `<div class="q" id="q-${q.id}" data-q="${q.id}">
      <p class="qt" id="t-${q.id}">${i+1}. ${esc(q.besedilo)}</p>
      ${radios}
      <label for="x-${q.id}">${esc(polje)}</label>
      ${razlaga?`<p class="small razlaga">${esc(razlaga)}</p>`:''}
      <textarea id="x-${q.id}" name="x-${q.id}"></textarea></div>`;
    }).join('');
    sek.insertAdjacentHTML('beforeend',`<section class="card sek" id="sek-${s.id}" data-s="${s.id}">${naslov}${prio}${s.opis?`<p class="opis">${esc(s.opis)}</p>`:''}${graf(s.id)}${(s.citati||[]).length?`<div class="cit"><p class="small">Iz odgovorov prebivalcev:</p>${s.citati.map(c=>`<blockquote>»${esc(c)}«</blockquote>`).join('')}</div>`:''}${qs}</section>`);
  });
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
  return `<figure class="graf"><figcaption class="gq">Prebivalci so odgovarjali na vprašanje: »${esc(g.vprasanje)}«</figcaption>
  <img class="gz" src="${g.slika}?v=20261106a" alt="${esc(g.alt)}" loading="lazy" width="704" tabindex="0" role="button" aria-label="Povečaj graf">
  </figure>`}
function dopolniPovezavo(u){
  u=String(u||'').trim();
  if(!u) return '';
  if(/^\/\//.test(u)) u='https:'+u;
  else if(!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(u)) u='https://'+u;
  return u;
}
function povezavaOk(u){
  u=dopolniPovezavo(u);
  if(!u) return true;
  try{
    const x=new URL(u);
    return (x.protocol==='http:'||x.protocol==='https:') && !!x.hostname && x.hostname.includes('.');
  }catch(e){return false}
}
function collect(){
  const o={lista:LISTA?LISTA.ime:'',token:LISTA?TOKEN:'',email:$('#email').value.trim(),predstavitev:($('#predstavitev')||{}).value?$('#predstavitev').value.trim():'',foto:dopolniPovezavo(($('#foto')||{}).value||''),videoPozdrav:dopolniPovezavo(($('#videoPozdrav')||{}).value||''),soglasje:$('#soglasje').checked,prioritet:[],odg:{}};
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
  const msg='Shranjeno v tej napravi ob '+new Date().toLocaleTimeString('sl-SI',{hour:'2-digit',minute:'2-digit'});
  ['#saved','#savedRev'].forEach(id=>{const el=$(id);if(el)el.textContent=msg})}
function restore(){
  $('#email').value=state.email||'';if($('#predstavitev')){$('#predstavitev').value=state.predstavitev||'';}if($('#foto'))$('#foto').value=state.foto||'';if($('#videoPozdrav'))$('#videoPozdrav').value=state.videoPozdrav||'';$('#soglasje').checked=!!state.soglasje;
  (state.prioritet||[]).forEach(id=>{document.querySelectorAll('input.priobox[data-s="'+id+'"]').forEach(b=>b.checked=true)});
  Object.entries(state.odg||{}).forEach(([id,a])=>{
    const r=document.querySelector(`input[name="r-${id}"][value="${a.odgovor}"]`);if(r)r.checked=true;
    const t=$('#x-'+id);if(t){t.value=a.besedilo||''}});
  syncPrio();
}
function tipSklopa(s, prioritet){
  if(s.id==='zakaj') return 'predstavitev';
  if(jeEnaka(s) && s.obvezno===false) return 'neobvezno';
  if(jeEnaka(s)) return 'obvezno';
  if(prioritet.includes(s.id)) return 'prioriteta';
  return 'ostalo';
}
function payload(){const c=collect();const ime=id=>(Q.sekcije.find(s=>s.id===id)||{}).naslov||id;
  const meta=listaMeta(c.lista);
  const out={casOddaje:new Date().toISOString(),casOddajeLokalni:casLj(),lista:LISTA?LISTA.ime:'',token:LISTA?TOKEN:'',listaStevilka:LISTA?LISTA.n:null,email:c.email,predstavitev:c.predstavitev,foto:c.foto,videoPozdrav:c.videoPozdrav,soglasje:c.soglasje,test:false,prioritet:c.prioritet.map(ime),prioritetId:c.prioritet,odgovori:[]};
  Q.sekcije.forEach(s=>s.vprasanja.forEach(q=>out.odgovori.push({id:q.id,temaId:s.id,sklop:s.naslov,tip:tipSklopa(s,c.prioritet),prioriteta:c.prioritet.includes(s.id),vprasanje:q.besedilo,...c.odg[q.id]})));return out}
function toTxt(p){const oznaka=p.listaStevilka?`${p.listaStevilka}. ${p.lista}`:p.lista;
  return `Savsko naselje · anketa – odgovori liste\nLista: ${oznaka}\nPreizkus: ${p.test?'da':'ne'}\nE-naslov: ${p.email}\n5 prioritet: ${(p.prioritet||[]).join(', ')||'—'}\nPredstavitev ekipe, liste ali stranke na ravni ČS Bežigrad: ${p.predstavitev||'—'}\nFotografija: ${p.foto||'—'}\nVideo pozdrav: ${p.videoPozdrav||'—'}\nČas: ${p.casOddajeLokalni||p.casOddaje}\n\n`+
  p.odgovori.map(a=>`[${a.sklop}${a.temaId?' · '+a.temaId:''}${a.tip?' · '+a.tip:''}${a.prioriteta?' · prioriteta':''}] ${a.vprasanje}\nOdgovor: ${a.odgovor||'—'}\nRazlaga zaveze (kako in do kdaj): ${a.besedilo||'—'}\n`).join('\n')}


function imeDatoteke(p){
  const raw=(p.listaStevilka?p.listaStevilka+'-':'')+(p.lista||'lista');
  const slug=String(raw).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9._-]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'');
  return 'zaveze-savsko-naselje-'+(slug||'lista')+'.txt';
}
function shraniInPrenesi(){
  save();
  const p=payload();
  const blob=new Blob([toTxt(p)],{type:'text/plain;charset=utf-8'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=imeDatoteke(p);
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  const el=$('#savedRev');
  if(el) el.textContent='Shranjeno v tem brskalniku. Prenesena je tudi datoteka z odgovori.';
}
function validate(){
  const c=collect(),e=[];
  if(!LISTA)e.push('Obrazec odprite prek povezave iz e-pošte.');
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c.email))e.push('Vpišite veljaven e-naslov.');
  if(c.prioritet.some(id=>{const s=Q.sekcije.find(x=>x.id===id);return s&&jeEnaka(s);})) e.push('Obveščanje in zaključni sklop nista med 5 prioritetami — sta enaka za vse liste.');
  if(c.prioritet.length!==5)e.push('Označite 5 prioritet (zdaj '+c.prioritet.length+').');
  const pset=new Set(c.prioritet);
  Q.sekcije.filter(s=>jeEnaka(s)&&s.obvezno!==false).forEach(s=>pset.add(s.id));
  const manjkajo=[];
  Q.sekcije.forEach(s=>{
    if(!pset.has(s.id)) return;
    s.vprasanja.forEach((q,i)=>{
      const a=c.odg[q.id];
      if(q.tip!=='besedilo' && !a.odgovor){
        const txt=String(q.besedilo||'').replace(/\s+/g,' ');
        manjkajo.push({id:q.id,label:s.naslov+' · '+(i+1)+'. '+(txt.length>80?txt.slice(0,77)+'…':txt)});
      }
    });
  });
  if(manjkajo.length) e.push({text:'Pri '+manjkajo.length+' obveznih vprašanjih (obveščanje ali 5 prioritet) še ni izbran odgovor Da / Ne / Delno.',links:manjkajo});
  if(!povezavaOk(c.foto) || !povezavaOk(c.videoPozdrav)) e.push('Povezava do fotografije ali video pozdrava naj bo običajna spletna povezava (YouTube, Google Drive ali Vimeo).');
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
  $('#revBody').innerHTML=`<p><b>Lista:</b> ${esc(p.listaStevilka?p.listaStevilka+'. '+p.lista:p.lista)}<br><b>E-naslov:</b> ${esc(p.email)}<br><b>5 prioritet:</b> ${esc((p.prioritet||[]).join(', ')||'—')}</p>`+(p.predstavitev?`<div class="rv"><b>Predstavitev ekipe, liste ali stranke na ravni ČS Bežigrad</b><br>${esc(p.predstavitev)}</div>`:'')+
    p.odgovori.filter(a=>a.odgovor||(a.besedilo||'').trim()).map(a=>`<div class="rv"><b>${esc(a.vprasanje)}</b>${a.prioriteta?' <span class="small">(prioriteta)</span>':''}<br>Odgovor: ${esc(a.odgovor||'—')}<br>${esc(a.besedilo||'—')}</div>`).join('');
  $('#f').hidden=true;$('#review').hidden=false;$('#review').focus();
}

function posljiMail(){
  const e=validate();prikaziNapake(e);if(e.length)return;
  const p=payload();
  const oznaka=p.listaStevilka?`${p.listaStevilka}. ${p.lista}`:(p.lista||'lista');
  const link='https://anketa.savska.org/kandidati/?l='+encodeURIComponent(TOKEN);
  const sub=(p.test?'PREIZKUS – ':'')+'Zaveze kandidatne liste: '+oznaka;
  const body='Pozdravljeni,\n\npovezava do obrazca: '+link+'\nLista: '+oznaka+'\nE-naslov: '+(p.email||'')+'\n\nOdgovori:\n\n'+toTxt(p);
  const s=$('#status');
  s.className='ok';
  s.textContent='Odprlo se je okno pošte za savskonaselje1@gmail.com z vašimi odgovori. Sporočilo pošljite.';
  setTimeout(function(){
    location.href='mailto:savskonaselje1@gmail.com?subject='+encodeURIComponent(sub)+'&body='+encodeURIComponent(body);
  }, 400);
}
async function submit(){
  const e=validate();prikaziNapake(e);if(e.length)return;
  const s=$('#status');
  if(ph(CONFIG.endpoint)||ph(CONFIG.upravljavec)){s.textContent='Oddaja bo odprta kmalu. Odgovori ostanejo shranjeni v tej napravi.';return}
  const p=payload();
  $('#oddaj').disabled=true;s.textContent='Pošiljam …';
  try{const r=await fetch(CONFIG.endpoint,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(p)});
    const j=await r.json();if(!j.ok)throw new Error(j.error||'napaka');
    s.className='ok';s.textContent='Hvala! Odgovore smo prejeli.';localStorage.removeItem(CONFIG.storageKey);
  }catch(err){$('#oddaj').disabled=false;s.textContent='Oddaja ni uspela. Poskusite znova ali pišite na savskonaselje1@gmail.com ali 070 205 595.'}
}
init();
