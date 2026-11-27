'use strict';

const meetingStates = {
  called: 'Sklic objavljen',
  rescheduled: 'Prestavljen termin',
  cancelled: 'Seja preklicana',
  minutes: 'Zapisnik objavljen'
};

function localDate() {
  return new Intl.DateTimeFormat('sv-SE', {timeZone:'Europe/Ljubljana', year:'numeric', month:'2-digit', day:'2-digit'}).format(new Date());
}
function meetingTime(row) {
  return [day(row.date), row.time, row.location].filter(Boolean).join(' · ');
}
function scheduledMeetings(rows) {
  const today=localDate();
  return rows.filter(r=>r.date>=today && ['called','rescheduled'].includes(r.state))
    .sort((a,b)=>a.date.localeCompare(b.date)||(a.time||'').localeCompare(b.time||''));
}
function currentMeetingBanner() {
  const catalog=db.meetingUpdates;
  const next=scheduledMeetings(catalog.sessions)[0];
  return '<section class="current-meeting-banner"><div><h2>Aktualne seje ČS Bežigrad</h2>'+
    (next?'<p><b>'+h(next.title)+'</b> · '+h(meetingTime(next))+'</p>':
      '<p>V zadnjem objavljenem pregledu ni prihodnjega potrjenega termina.</p>')+
    '</div>'+anchor('seje/aktualno','Sklici, spremembe in zapisniki')+'</section>';
}
function currentMeetingRow(row, open) {
  const minutes=row.minutes;
  const history=(row.changes||[]).map(change=>'<li>'+day(change.date)+' · '+h(change.text)+' '+link(change.url,'Vir MOL')+'</li>').join('');
  const decisions=(minutes?.decisions||[]).map(d=>'<li><b>'+h(d.id)+'</b> '+h(d.text)+' '+link(minutes.url+'#page='+d.page,'Str. '+d.page)+'</li>').join('');
  const attendance=(minutes?.attendance||[]).map(a=>'<li>'+h(a.name)+' · '+h(a.status)+'</li>').join('');
  const pages=(minutes?.pages||[]).map(p=>'<section><b>Stran '+h(p.page)+'</b><p class="current-transcript">'+h(p.text)+'</p></section>').join('');
  const agenda=(row.agenda||[]).map(a=>'<li>'+h(a)+'</li>').join('');
  const body='<p>'+h(meetingTime(row))+'</p><p class="meta">Mandat '+h(row.term)+'</p>'+
    (row.note?'<p>'+h(row.note)+'</p>':'')+(agenda?'<h4>Dnevni red</h4><ol>'+agenda+'</ol>':'')+
    (history?'<h4>Spremembe objave</h4><ul>'+history+'</ul>':'')+
    (minutes?'<h4>Kaj je svet obravnaval?</h4><p>'+h(minutes.summary)+'</p>'+
      (decisions?'<h4>Sklepi</h4><ul>'+decisions+'</ul>':'')+
      (attendance?'<details><summary>Poimenska udeležba</summary><ul>'+attendance+'</ul></details>':'')+
      (pages?'<details><summary>Celoten prepis zapisnika</summary>'+pages+'</details>':''):'')+
    '<div class="links">'+link(row.url,'Uradna stran seje')+
    (row.noticeUrl?link(row.noticeUrl,'Sklic oziroma sprememba'):'')+
    (minutes?link(minutes.url,'Izvirni zapisnik MOL'):'')+'</div>';
  return detail('aktualno-'+row.id,meetingTime(row),row.title,meetingStates[row.state],body,open);
}
function showCurrentMeetings() {
  const feed=db.meetingUpdates;
  const selected=new URLSearchParams(location.hash.split('?')[1]||'').get('seja');
  const row=selected&&feed.sessions.find(r=>r.id===selected);
  if(row){app.innerHTML=head(row.title,'Mandat '+row.term+' · '+meetingTime(row))+currentMeetingRow(row,true)+'<div class="links">'+anchor('seje/aktualno','Vse aktualne seje')+'</div>';return}
  const archiveLast=[...db.meetings].filter(m=>m.pdf).sort((a,b)=>b.date.localeCompare(a.date))[0];
  app.innerHTML=head('Aktualne seje ČS Bežigrad','Sklici, prestavljeni termini, preklici in naknadno objavljeni zapisniki.')+
    '<div class="links">'+link(archive,'Uradni seznam sej MOL')+anchor('seje','Seje in prisotnost 2022–2026')+'</div>'+
    '<p class="meta">Zadnja objava v tem pregledu · '+day(feed.publishedOn)+'</p>'+
    (feed.sessions.length?'<div class="tools"><label>Išči po novih sejah, sklepih in prepisih<input id="current-query" type="search" placeholder="Npr. šolska pot ali 5/14"></label></div>':'')+'<div id="current-results"></div>';
  const input=document.getElementById('current-query');
  function showResults() {
    const words=queryWords(input?.value||'');
    const rows=feed.sessions.filter(r=>{
      const searchable=searchFormOf([r.title,r.term,day(r.date),r.location,r.note,...(r.agenda||[]),
        ...(r.changes||[]).map(c=>c.text),r.minutes?.summary,...(r.minutes?.decisions||[]).map(d=>d.id+' '+d.text),
        ...(r.minutes?.attendance||[]).map(a=>a.name+' '+a.status),...(r.minutes?.pages||[]).map(p=>p.text)].join(' '));
      return words.every(w=>searchable.includes(w));
    });
    const next=scheduledMeetings(rows), upcoming=new Set(next.map(r=>r.id));
    const other=rows.filter(r=>!upcoming.has(r.id)).sort((a,b)=>b.date.localeCompare(a.date));
    let result='<h3>Napovedane seje</h3>'+(next.length?next.map((r,i)=>currentMeetingRow(r,i===0)).join(''):
      '<p>'+(words.length?'Ni napovedanih sej za to iskanje.':'V zadnjem pregledu uradnih objav ni potrjenega prihodnjega termina.')+'</p>');
    result+='<h3>Zapisniki in spremembe</h3>'+(other.length?other.map(r=>currentMeetingRow(r,Boolean(words.length))).join(''):
      words.length?'<p>Ni zadetkov.</p>':'<p>Zadnji zapisnik v arhivu mandata 2022–2026 je '+anchor('seje/'+archiveLast.date,archiveLast.title+' · '+day(archiveLast.date))+'.</p>');
    document.getElementById('current-results').innerHTML=result;
  }
  input?.addEventListener('input',showResults);
  showResults();
}
