'use strict';

// Values are held in cents. Percentages use thousandths of the salary base.
function feeYearRows(meetings, schedule, year) {
  const rows = new Map();
  const periods = schedule.periods.filter(p => p.from.startsWith(year));
  const eligibleStates = ['present', 'partial', 'voted'];
  for (const meeting of meetings.filter(m => m.date.startsWith(year)).sort((a,b)=>a.date.localeCompare(b.date))) {
    const period = periods.filter(p=>p.from<=meeting.date).at(-1);
    for (const member of meeting.attendance.members) {
      if (!rows.has(member.name)) rows.set(member.name, {name:member.name, visits:[], low:0, high:0, counted:0});
      const row = rows.get(member.name);
      if (!eligibleStates.includes(member.state)) continue;
      const chair = member.name === schedule.chair;
      const eligible = !period.liveOnly || meeting.attendance.mode !== 'remotevote';
      const top = chair ? period.chairRate : period.memberRate;
      const bottom = chair && meeting.date === schedule.election ? period.memberRate : top;
      const cents = rate => Math.round(period.baseCents*rate/1000);
      row.visits.push({date:meeting.date, title:meeting.title, eligible,
        low:eligible?cents(bottom):0, high:eligible?cents(top):0});
    }
  }
  for (const row of rows.values()) {
    const items = row.visits.filter(v=>v.eligible);
    row.counted = Math.min(schedule.cap,items.length);
    row.low = items.map(v=>v.low).sort((a,b)=>a-b).slice(0,row.counted).reduce((a,b)=>a+b,0);
    row.high = items.map(v=>v.high).sort((a,b)=>b-a).slice(0,row.counted).reduce((a,b)=>a+b,0);
  }
  return [...rows.values()];
}
function feeRows(year, schedule) {
  const byName = new Map();
  for (const y of yOpts.filter(y=>year==='mandat'||y===year)) {
    for (const row of feeYearRows(db.meetings,schedule,y)) {
      if (!byName.has(row.name)) byName.set(row.name,{name:row.name,low:0,high:0,counted:0,years:[]});
      const total=byName.get(row.name);
      total.low+=row.low; total.high+=row.high; total.counted+=row.counted;
      total.years.push({year:y,...row});
    }
  }
  return [...byName.values()].sort((a,b)=>b.high-a.high||b.low-a.low||a.name.localeCompare(b.name,'sl'));
}
function feeAmount(lo,hi) {
  return lo===hi?euros(lo/100,2):euros(lo/100,2)+' – '+euros(hi/100,2);
}
function personFeeDetail(row) {
  return row.years.map(y=>'<p><b>'+h(y.year)+'</b> · '+h(feeAmount(y.low,y.high))+' · evidentirane udeležbe: '+y.visits.length+' · upoštevane v oceni: '+y.counted+'</p>'+
    (y.visits.length?'<ul class="fee-visits">'+y.visits.map(v=>'<li>'+anchor('seje/'+v.date,day(v.date)+' · '+v.title)+' · '+
      (v.eligible?h(feeAmount(v.low,v.high)):'dopisna seja pred spremembo odloka, izločena iz ocene')+'</li>').join('')+'</ul>':'')).join('');
}
function personFeeChart(f) {
  const selected=new URLSearchParams(location.hash.split('?')[1]||'').get('leto');
  const year=[...yOpts,'mandat'].includes(selected)?selected:'2026';
  const years=[...yOpts,'mandat'];
  const rows=feeRows(year,f.feeSchedule);
  const max=Math.max(1,...rows.map(r=>r.high));
  const tabs=years.map(y=>'<a href="#finance/sejnine?leto='+y+'"'+(y===year?' aria-current="page"':'')+'>'+
    (y==='mandat'?'Celoten mandat':h(y))+'</a>').join('');
  const sources=f.feeSchedule.sources.filter(s=>year==='mandat'||s.year===year);
  const periodRows=f.feeSchedule.periods.filter(p=>year==='mandat'||p.from.startsWith(year)).map(p=>[
    h(day(p.from)),euros(p.baseCents/100,2),h(nf(p.memberRate/10,1)+' %'),h(nf(p.chairRate/10,1)+' %')]);
  return '<section class="fee-chart"><h3>Sejnine po osebah · ocena bruto zneska</h3>'+
    '<p>Izberi leto ali celoten mandat. Odpri ime za seznam sej in izračun. Za potrditev dejanskih izplačil potrebujemo poimenske obračune ČS.</p>'+
    '<nav class="subtabs fee-years" aria-label="Obdobje ocene sejnin">'+tabs+'</nav>'+
    '<p class="meta">Zneski v evrih · razvrščeno po zgornji oceni. Temni del prikazuje nižjo oceno, svetlejši podaljšek pa razliko do višje.</p>'+
    '<div class="fee-rows">'+rows.map(row=>'<details class="fee-row"><summary><span class="fee-name">'+h(row.name)+
      (row.name===f.feeSchedule.chair?'<small>predsednik</small>':'')+'</span><span class="fee-bar" aria-hidden="true"><i style="width:'+
      (row.high/max*100).toFixed(3)+'%"><b style="width:'+(row.high?row.low/row.high*100:0).toFixed(3)+'%"></b></i></span>'+
      '<span class="fee-value">'+h(feeAmount(row.low,row.high))+'</span></summary><div class="fee-detail">'+personFeeDetail(row)+'</div></details>').join('')+'</div>'+
    (['2023','mandat'].includes(year)?'<p class="meta">Za 2023 dobimo ob izbiri prvih desetih upravičenih udeležb in predsedniške tarife na ustanovni seji skupaj 7.299,04 € bruto. Če prištejemo prispevka izplačevalca po 8,85 % in 0,53 %, zaokrožena pri vsaki osebi, dobimo 7.983,65 €. Toliko znaša tudi evidentirani letni strošek ČS.</p>':'')+
    (['2024','2025','mandat'].includes(year)?'<p class="meta">Kontrola z zaključnim računom ČS Bežigrad: za 2024 se seštevek ocen ujema z realizacijo 11.547,00 €. Za 2025 se prvih deset evidentiranih udeležb na osebo oziroma vse udeležbe, če jih je manj, sešteje v 12.744,03 €, kar se prav tako ujema z realizacijo. Ujemanje potrjuje skupni znesek. Posamezna nakazila lahko potrdi poimenski obračun.</p>':'')+
    '<details class="decision-guide"><summary>Kako smo ocenili bruto sejnine?</summary><p>Model za vsako poimensko evidentirano udeležbo uporabi osnovo in odstotek ter znesek zaokroži na cent. Upošteva udeležbe na rednih in izrednih sejah ter oddane glasove na dopisnih sejah od 8. julija 2023. Predpostavlja plačilo vseh tako ugotovljenih udeležb do deset na osebo in leto. Če jih je več, spodnjo oceno da deset najnižjih, zgornjo deset najvišjih pripadajočih zneskov. Za mandat sešteje letne ocene.</p>'+
    '<p>Za 2023 in 2024 uporabimo letni osnovi, ki ju je za obračun sejnin navedla ČS Center: 4.654,92 € in 4.811,33 €. Julija 2023 se spremeni odstotek sejnine. Za 2025 je ČS Center objavila dve obdobji. Način poračuna v Bežigradu za ta leta iz objavljenih zapisnikov ni razviden. Za 2026 jih določa sam bežigrajski sklep 4/24. Na ustanovni seji 10. januarja 2023 je bil Stanko Furlan izvoljen med sejo, zato zanjo prikazujemo razpon od članske do predsedniške tarife. Graf zajema bruto sejnine. Povračilo za telefon, davki in prispevki delodajalca so ločeni.</p>'+
    financeTable(['Za seje od','Uporabljena osnova','Član','Predsednik'],periodRows)+financeLinks([...sources,f.rules[1],f.rules[2],f.feeSchedule.oldRule])+'</details></section>';
}
