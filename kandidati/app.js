// Savsko naselje · anketa – odgovori kandidatnih list
const CONFIG = {
  endpoint: '', // TODO: URL spletne aplikacije Apps Script
  rok: 'nedelja, 8. 11. 2026, ob 12.00',
  upravljavec: '', // TODO: ime, naslov, kontakt upravljavca
  maxBesed: 0, // 0 = brez omejitve besed (odločitev Rok, 4. 11. 2026)
  storageKey: 'savska-odgovori-v3'
};
const $ = s => document.querySelector(s);
const ph = s => !s || /\[.*\]/.test(s);
let Q = null, state = {};
const words = t => (t.trim().match(/\S+/g) || []).length;
const VIDEO_RE = /^https:\/\/(www\.)?(youtube\.com\/(watch\?v=|shorts\/)[\w-]{6,}|youtu\.be\/[\w-]{6,}|drive\.google\.com\/(file\/d\/|open\?id=)[\w-]+|vimeo\.com\/\d+)/i;

function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}

async function init(){
  $('#rok').textContent = CONFIG.rok;
  const off = ph(CONFIG.endpoint)||ph(CONFIG.upravljavec);
  if(ph(CONFIG.upravljavec)) $('#upr').hidden=true; else $('#uprTxt').textContent = CONFIG.upravljavec;
  if(off){const e=$('#cfgwarn');e.hidden=false;e.textContent='Oddaja odgovorov bo odprta kmalu. Odgovore lahko že pripravite – shranjujejo se v vašem brskalniku – in prenesete kopijo.';}
  Q = await (await fetch('questions.json')).json();
  try{state=JSON.parse(localStorage.getItem(CONFIG.storageKey))||{}}catch(e){state={}}
  state.odg ||= {};
  render(); restore();
  $('#f').addEventListener('input', save); $('#f').addEventListener('change', save);
  $('#pregled').onclick = review; $('#nazaj').onclick = ()=>{$('#review').hidden=true;$('#f').hidden=false};
  $('#oddaj').onclick = submit; if(off){$('#oddaj').disabled=true;$('#oddaj').textContent='Oddaja bo odprta kmalu';}
  $('#prenesiJ').onclick = ()=>dl(JSON.stringify(payload(),null,2),'json','application/json');
  $('#prenesiT').onclick = ()=>dl(toTxt(payload()),'txt','text/plain');
}

function render(){
  const sek=$('#sekcije'); let nq=0;
  Q.sekcije.forEach(s=>{
    const qs=s.vprasanja.map((q)=>`<div class="q" data-q="${q.id}">
      <p class="qt" id="t-${q.id}">${++nq}. ${esc(q.besedilo)}</p>
      <fieldset class="radios" aria-labelledby="t-${q.id}"><legend class="small">Odgovor</legend>
        ${['Da','Ne','Delno'].map(v=>`<label><input type="radio" name="r-${q.id}" value="${v}"> ${v}</label>`).join('')}</fieldset>
      <label for="x-${q.id}">Kako in do kdaj</label>
      <textarea id="x-${q.id}" name="x-${q.id}" aria-describedby="c-${q.id}"></textarea>
      <div class="row"><button type="button" class="mic" aria-pressed="false" data-t="x-${q.id}">🎤 Narekuj</button>
        <span class="small cnt" id="c-${q.id}" aria-live="polite">0 besed</span></div>
      <p class="small micmsg" aria-live="polite"></p>
      <label for="v-${q.id}">Povezava do videa (neobvezno, največ 2 min)</label>
      <input type="url" id="v-${q.id}" name="v-${q.id}" placeholder="https://youtu.be/… ali Drive / Vimeo" inputmode="url">
      <p class="msg vmsg" aria-live="polite"></p></div>`).join('');
    sek.insertAdjacentHTML('beforeend',`<section class="card sek" data-s="${s.id}"><h2>${esc(s.naslov)}</h2>${qs}</section>`);
  });
  document.querySelectorAll('textarea').forEach(t=>t.addEventListener('input',()=>count(t)));
  document.querySelectorAll('input[type=url]').forEach(i=>i.addEventListener('blur',()=>vcheck(i)));
  setupMic();
}
function count(t){const n=words(t.value),c=$('#c-'+t.id.slice(2)),m=CONFIG.maxBesed;c.textContent=m?`${n} / ${m} besed`:`${n} besed`;c.classList.toggle('over',!!m&&n>m)}
function vcheck(i){const m=i.closest('.q').querySelector('.vmsg');const v=i.value.trim();const ok=!v||VIDEO_RE.test(v);
  m.textContent=ok?'':'Prosimo, vpišite povezavo YouTube, Google Drive ali Vimeo (začne se s https://).';i.setAttribute('aria-invalid',!ok);return ok}

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
  const o={lista:$('#lista').value.trim(),email:$('#email').value.trim(),soglasje:$('#soglasje').checked,odg:{}};
  Q.sekcije.forEach(s=>s.vprasanja.forEach(q=>{
    const r=document.querySelector(`input[name="r-${q.id}"]:checked`);
    o.odg[q.id]={odgovor:r?r.value:'',besedilo:$('#x-'+q.id).value,video:$('#v-'+q.id).value.trim()};
  }));return o}
function save(){state=collect();localStorage.setItem(CONFIG.storageKey,JSON.stringify(state));
  $('#saved').textContent='Shranjeno v tej napravi ob '+new Date().toLocaleTimeString('sl-SI',{hour:'2-digit',minute:'2-digit'})}
function restore(){
  $('#lista').value=state.lista||'';$('#email').value=state.email||'';$('#soglasje').checked=!!state.soglasje;
  Object.entries(state.odg||{}).forEach(([id,a])=>{
    const r=document.querySelector(`input[name="r-${id}"][value="${a.odgovor}"]`);if(r)r.checked=true;
    const t=$('#x-'+id);if(t){t.value=a.besedilo||'';count(t)} const v=$('#v-'+id);if(v)v.value=a.video||'';});
}
function active(){return Q.sekcije} // vse sekcije so obvezne (brez izbire tem)
function payload(){const c=collect();const out={casOddaje:new Date().toISOString(),lista:c.lista,email:c.email,soglasje:c.soglasje,odgovori:[]};
  active().forEach(s=>s.vprasanja.forEach(q=>out.odgovori.push({id:q.id,sklop:s.naslov,vprasanje:q.besedilo,...c.odg[q.id]})));return out}
function toTxt(p){return `Savsko naselje · anketa – odgovori liste\nLista: ${p.lista}\nE-naslov: ${p.email}\nČas: ${p.casOddaje}\n\n`+
  p.odgovori.map(a=>`[${a.sklop}] ${a.vprasanje}\nOdgovor: ${a.odgovor||'—'}\nKako in do kdaj: ${a.besedilo||'—'}\nVideo: ${a.video||'—'}\n`).join('\n')}
function dl(txt,ext,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:type+';charset=utf-8'}));
  a.download=`odgovori-${(collect().lista||'lista').replace(/[^\wčšžČŠŽ-]+/g,'_')}.${ext}`;a.click();URL.revokeObjectURL(a.href)}

function validate(){
  const c=collect(),e=[];
  if(!c.lista)e.push('Vpišite ime liste.');
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c.email))e.push('Vpišite veljaven e-naslov.');
  let manj=0,dolg=0,vid=0;
  active().forEach(s=>s.vprasanja.forEach(q=>{const a=c.odg[q.id];if(!a.odgovor)manj++;if(CONFIG.maxBesed&&words(a.besedilo)>CONFIG.maxBesed)dolg++;if(!vcheck($('#v-'+q.id)))vid++}));
  if(manj)e.push(`Pri ${manj} vprašanjih še ni izbran odgovor Da / Ne / Delno.`);
  if(dolg)e.push(`${dolg} odgovorov je daljših od ${CONFIG.maxBesed} besed.`);
  if(vid)e.push(`${vid} povezav do videa ni veljavnih.`);
  if(!c.soglasje)e.push('Potrdite soglasje za objavo.');
  return e}
function review(){
  const e=validate();$('#err').innerHTML=e.map(esc).join('<br>');if(e.length)return;
  const p=payload();
  $('#revBody').innerHTML=`<p><b>Lista:</b> ${esc(p.lista)}<br><b>E-naslov:</b> ${esc(p.email)}</p>`+
    p.odgovori.map(a=>`<div class="rv"><b>${esc(a.vprasanje)}</b><br>Odgovor: ${esc(a.odgovor)}<br>${esc(a.besedilo||'—')}${a.video?'<br>Video: '+esc(a.video):''}</div>`).join('');
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
