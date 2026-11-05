// Savsko naselje · anketa – odgovori kandidatnih list
const CONFIG = {
  endpoint: '', // TODO: URL spletne aplikacije Apps Script
  rok: 'nedelja, 8. 11. 2026, ob 12.00',
  upravljavec: '', // TODO: ime, naslov, kontakt upravljavca
  maxBesed: 0, // 0 = brez omejitve besed (odločitev Rok, 4. 11. 2026)
  storageKey: 'savska-odgovori-v4'
};
const $ = s => document.querySelector(s);
const ph = s => !s || /\[.*\]/.test(s);
let Q = null, G = {}, state = {};
const NVSEH = 359; // veljavnih anket v izvozu 5. 11. 2026 (1 test izločen)
const words = t => (t.trim().match(/\S+/g) || []).length;
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}

async function init(){
  $('#rok').textContent = CONFIG.rok;
  const off = ph(CONFIG.endpoint)||ph(CONFIG.upravljavec);
  if(ph(CONFIG.upravljavec)) $('#upr').hidden=true; else $('#uprTxt').textContent = CONFIG.upravljavec;
  if(off){const e=$('#cfgwarn');e.hidden=false;e.textContent='Oddaja odgovorov bo odprta kmalu. Odgovore lahko že pripravite – shranjujejo se v vašem brskalniku – in prenesete kopijo.';}
  Q = await (await fetch('questions.json?v=20261105m')).json();
  try{G=await (await fetch('grafi/grafi.json?v=20261105m')).json()}catch(e){G={}}
  try{state=JSON.parse(localStorage.getItem(CONFIG.storageKey))||{}}catch(e){state={}}
  state.odg ||= {};
  render(); restore();
  $('#f').addEventListener('input', save); $('#f').addEventListener('change', onFormChange);
  $('#pregled').onclick = review; $('#nazaj').onclick = ()=>{$('#review').hidden=true;$('#f').hidden=false};
  $('#oddaj').onclick = submit; if(off){$('#oddaj').disabled=true;$('#oddaj').textContent='Oddaja bo odprta kmalu';}
  $('#prenesiJ').onclick = ()=>dl(JSON.stringify(payload(),null,2),'json','application/json');
  $('#prenesiT').onclick = ()=>dl(toTxt(payload()),'txt','text/plain');
}

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
    const numbered=s.id!=='obvescanje';
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
    const numbered=s.id!=='obvescanje';
    if(numbered) tema++;
    const naslov=numbered
      ? `<h2><span class="nr">${tema}.</span> <span class="tema-lab">tema</span> ${esc(s.naslov)}</h2>`
      : `<h2>${esc(s.naslov)}</h2>`;
    const prio=s.id==='obvescanje'
      ? `<p class="obv-tema">Ta tema je za vse liste enaka, zato ni med petimi prioritetnimi temami. Prosimo, da nanjo odgovorite v celoti.</p>`
      : `<label class="prio"><input type="checkbox" class="priobox" id="p-${s.id}" data-s="${s.id}"> To je ena od naših 5 prioritet</label>`;
    const qs=s.vprasanja.map((q,i)=>{
      const polje=q.polje||'Razlaga zaveze (kako in do kdaj)';
      const razlaga=q.razlaga||'';
      return `<div class="q" data-q="${q.id}">
      <p class="qt" id="t-${q.id}">${i+1}. ${esc(q.besedilo)}</p>
      <fieldset class="radios" aria-labelledby="t-${q.id}"><legend class="small">Odgovor</legend>
        ${['Da','Ne','Delno'].map(v=>`<label><input type="radio" name="r-${q.id}" value="${v}"> ${v}</label>`).join('')}</fieldset>
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
function graf(id){const g=G[id];if(!g)return '';
  let vir = g.vir ? esc(g.vir) : `Vir: Savska anketa, vprašanje ${g.stevilka} »${esc(g.vprasanje)}«; možnosti: ${esc(g.moznosti)}; n = ${g.n}/${NVSEH} odgovorov.${g.opomba?' '+esc(g.opomba):''}${g.izbor?' '+esc(g.izbor):''}`;
  if(g.pobude!=null) vir += ` MOL je za to temo prejel ${g.pobude} pobud (portal Pobude meščanov).`;
  return `<figure class="graf"><figcaption class="gq">Prebivalci so odgovarjali na vprašanje: »${esc(g.vprasanje)}«</figcaption>
  <img src="${g.slika}?v=20261105m" alt="${esc(g.alt)}" loading="lazy" width="704">
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
function payload(){const c=collect();const ime=id=>(Q.sekcije.find(s=>s.id===id)||{}).naslov||id;
  const out={casOddaje:new Date().toISOString(),lista:c.lista,email:c.email,predstavitev:c.predstavitev,foto:c.foto,videoPozdrav:c.videoPozdrav,soglasje:c.soglasje,prioritet:c.prioritet.map(ime),odgovori:[]};
  Q.sekcije.forEach(s=>s.vprasanja.forEach(q=>out.odgovori.push({id:q.id,sklop:s.naslov,prioriteta:c.prioritet.includes(s.id),vprasanje:q.besedilo,...c.odg[q.id]})));return out}
function toTxt(p){return `Savsko naselje · anketa – odgovori liste\nLista: ${p.lista}\nE-naslov: ${p.email}\nPrioritetne teme: ${(p.prioritet||[]).join(', ')||'—'}\nPredstavitev ekipe, liste ali stranke: ${p.predstavitev||'—'}\nFotografija: ${p.foto||'—'}\nVideo pozdrav: ${p.videoPozdrav||'—'}\nČas: ${p.casOddaje}\n\n`+
  p.odgovori.map(a=>`[${a.sklop}${a.prioriteta?' · prioriteta':''}] ${a.vprasanje}\nOdgovor: ${a.odgovor||'—'}\nRazlaga zaveze (kako in do kdaj): ${a.besedilo||'—'}\n`).join('\n')}
function dl(txt,ext,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:type+';charset=utf-8'}));
  a.download=`odgovori-${(collect().lista||'lista').replace(/[^\wčšžČŠŽ-]+/g,'_')}.${ext}`;a.click();URL.revokeObjectURL(a.href)}

function validate(){
  const c=collect(),e=[];
  if(!c.lista)e.push('Vpišite ime liste.');
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c.email))e.push('Vpišite veljaven e-naslov.');
  if(c.prioritet.includes('obvescanje')) e.push('Obveščanje ni med prioritetnimi temami — je enako za vse liste.');
  if(c.prioritet.length!==5)e.push('Označite 5 prioritetnih tem (zdaj '+c.prioritet.length+').');
  const pset=new Set(c.prioritet);
  pset.add('obvescanje');
  let manj=0,prazno=0,dolg=0;
  Q.sekcije.forEach(s=>{
    if(!pset.has(s.id)) return;
    s.vprasanja.forEach(q=>{
      const a=c.odg[q.id];
      if(!a.odgovor) manj++;
      if(!String(a.besedilo||'').trim()) prazno++;
      if(CONFIG.maxBesed&&words(a.besedilo)>CONFIG.maxBesed) dolg++;
    });
  });
  if(manj)e.push(`Pri ${manj} obveznih vprašanjih (obveščanje ali prioritetne teme) še ni izbran odgovor Da / Ne / Delno.`);
  if(prazno)e.push(`Pri ${prazno} obveznih vprašanjih (obveščanje ali prioritetne teme) še manjka razlaga zaveze (kako in do kdaj).`);
  if(dolg)e.push(`${dolg} odgovorov je daljših od ${CONFIG.maxBesed} besed.`);
  const urlOk = u => !u || /^https:\/\/\S+$/i.test(u);
  if(!urlOk(c.foto) || !urlOk(c.videoPozdrav)) e.push('Povezava do fotografije ali video pozdrava naj se začne s https://.');
  if(!c.soglasje)e.push('Potrdite soglasje za objavo.');
  return e}
function review(){
  const e=validate();$('#err').innerHTML=e.map(esc).join('<br>');if(e.length)return;
  const p=payload();
  $('#revBody').innerHTML=`<p><b>Lista:</b> ${esc(p.lista)}<br><b>E-naslov:</b> ${esc(p.email)}<br><b>Prioritetne teme:</b> ${esc((p.prioritet||[]).join(', ')||'—')}</p>`+(p.predstavitev?`<div class="rv"><b>Predstavitev ekipe, liste ali stranke</b><br>${esc(p.predstavitev)}</div>`:'')+
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
