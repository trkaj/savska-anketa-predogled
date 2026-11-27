'use strict';

const financeSections = {
  pregled: 'Proračun po letih', dela: 'Mala dela', sejnine: 'Sejnine', model: 'Scenarij 5 %', preverjanje: 'Preverjene navedbe'
};
function financeLink(s) {
  if(s.route)return anchor(s.route,s.label);
  if(s.date){
    const m=db.meetings.find(m=>m.date===s.date);
    if(s.id)return anchor(decisionRoute(s.date,s.id),'Sklep '+s.id);
    return link(m.pdf+'#page='+s.page,s.label||m.title+' · str. '+s.page);
  }
  return link(s.url,s.label);
}
function financeLinks(sources) {
  return '<div class="links fin-sources">'+sources.map(financeLink).join('')+'</div>';
}
function euros(n, digits) {
  return n==null?'Ni podatka':new Intl.NumberFormat('sl-SI',{style:'currency',currency:'EUR',minimumFractionDigits:digits,maximumFractionDigits:digits}).format(n);
}
function financeTable(headers,rows) {
  return '<div class="tablewrap fin-table"><table><thead><tr>'+headers.map(v=>'<th scope="col">'+h(v)+'</th>').join('')+'</tr></thead><tbody>'+
    rows.map(r=>'<tr><th scope="row">'+r[0]+'</th>'+r.slice(1).map(v=>'<td>'+v+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
}
function financeOverview(f) {
  const rows=f.years.map(y=>[h(y.year),euros(y.adopted,0),euros(y.plan,0)+(y.interim?'<small>po rebalansu</small>':''),
    euros(y.spent,y.precision)+(y.interim?'<small>1. 1.–30. 6.</small>':''),financeLinks(y.sources)]);
  return '<h3>Koliko je ČS Bežigrad porabila?</h3><p>Zneski se nanašajo na proračunskega uporabnika 5.3 Četrtna skupnost Bežigrad. Zaključni račun prikaže letno porabo. Za leto 2026 je prikazana realizacija prvega polletja.</p>'+
    financeTable(['Leto','Sprejeti načrt¹','Veljavni načrt oziroma rebalans','Realizirani odhodki','Dokazilo'],rows)+
    '<p class="meta">¹ Za zaključena leta je sprejeti načrt prepisan iz stolpca »sprejeti proračun« v zaključnem računu. Ta lahko že vključuje spremembe med letom.</p>'+
    '<h3>Kako se je spreminjal načrt za leto 2025?</h3><p>Finančni načrt istega uporabnika je najprej znašal 45.750 €, po spomladanskem rebalansu 47.151 €, po jesenskem pa 48.080 €. Ob koncu leta je veljavni načrt znašal 46.780 €. Za porabo uporabimo zaključni račun.</p>'+financeLinks(f.planSources)+
    '<h3>Kaj pomeni približno 56.000 €?</h3><p>V razdelitvi za leto 2025 je bilo 56.050 € sestavljenih iz 45.750 € lastnega finančnega načrta in 10.300 € za mala dela. Marca 2025 je zgodnji osnutek načrta za leto 2026 znašal 55.951 €. Septembra je svet za 2026 sprejel razdelitev 58.380 €, od tega 49.080 € za lastni načrt in 9.300 € za mala dela.</p>'+financeLinks(f.framework)+
    '<h3>Kje so stroški del v soseski?</h3><p>ČS sodeluje pri načrtovanju malih del. Sredstva zanje se praviloma vodijo v finančnem načrtu mestnega oddelka, ki jih izvede. Znesek v tabeli zato ne zajema vseh občinskih vlaganj v Bežigrad.</p>'+financeLinks([{route:'finance/dela',label:'Od načrta do obračuna malih del'},f.rules[0]]);
}
function financeWork(f) {
  return '<h3>Obnova igral v Savskem naselju</h3><p>Otroško igrišče med Savsko, Linhartovo in Mislejevo lahko spremljamo od načrta do poročila o prenovi. Načrtovani znesek je znan, končni obračun za točno to igrišče pa v navedenih listinah ni izkazan.</p>'+
    f.work.map(w=>'<article class="event"><div class="when">'+h(w.when)+'</div><div><h4>'+h(w.title)+'</h4><p>'+h(w.text)+'</p>'+financeLinks(w.sources)+'</div></article>').join('')+
    '<h3>Kaj mora o izvedbi sporočiti mestni oddelek?</h3><p>Po 6. členu odloka pristojni oddelek ČS sproti sporoča začetek del, izvajalca, predvidene roke, zaključek in obračun. Za dopolnitev evidence pri posameznem projektu potrebujemo lokacijo, številko zadeve in obračun ali prevzemni zapisnik.</p>'+financeLinks(f.rules.slice(0,1))+
    '<h3>Načrt drugih malih del za leto 2026</h3><p>Sklep 5/19 je razporedil 9.300 € za količke (800 €), stojala za kolesa (2.800 €), zelene površine, parkovno opremo in igrala (5.000 €), čiščenje športnih površin v BS3 (300 €) ter ptičje gnezdilnice (400 €). Svet je maja 2026 pristojnemu oddelku posredoval mikrolokacije. Novembra je sprejel poročilo o izvedbi. Za posamezno lokacijo se dokazilo o končnem znesku išče v obračunu izvajalca oziroma pristojnega oddelka.</p>'+financeLinks(f.work2026)+
    '<h3>Športni park Savsko naselje · mestna investicija</h3><p>Pri projektu 7560-24-1173 zaključni račun MOL za leto 2025 izkazuje 536.485 € realizacije. Od tega je 42.053 € vodil oddelek za nepremičnine in 494.432 € oddelek za promet. Strošek se nanaša na eno leto mestnega projekta. MOL je maja 2026 objavila odprtje parka.</p>'+financeLinks(f.parkSources);
}
function financeFees(f) {
  return personFeeChart(f)+'<h3>Sklepi o bruto sejninah in poraba proračuna</h3><p>Sklep sveta določi podlago za izplačilo. Zaključni račun ločeno izkaže porabo na kontu 402905 »Sejnine in pripadajoča povračila stroškov«. Za poimensko izplačilo je potrebna obračunska listina.</p>'+
    financeTable(['Leto','Bruto znesek po sklepu','Realizacija na kontu 402905','Vir in posebnosti'],f.fees.map(x=>[h(x.year),x.gross==null?'Končni znesek v sklepu ni izpisan':euros(x.gross,2),x.expense==null?'Letni obračun še ni izkazan':euros(x.expense,2),'<p>'+h(x.note)+'</p>'+financeLinks(x.sources)]))+
    '<h3>Kako se obračuna sejnina?</h3><p>Po 12. členu odloka znaša sejnina predsednika 4 %, člana pa 1,6 % mesečne plače župana brez dodatka za delovno dobo. Skupna omejitev je deset sej na leto, vključno z dopisnimi sejami in sejami na daljavo. Izplačilo se določi na podlagi poročila o udeležbi in sklepa sveta. Pred 8. julijem 2023 sta veljali nižji stopnji, 2 % za predsednika in 0,8 % za člana.</p>'+
    '<p>Za 2026 je svet pri obračunu navedel tri osnove. Do 31. marca je znašala 5.594,01 €, aprila in maja 5.644,36 €, od 1. junija pa 6.035,70 €. Za končni izračun je bilo treba upoštevati tudi zadnjo dopisno sejo.</p>'+
    '<p>Odlok posebej določa 25 € mesečnega povračila predsedniku za uporabo lastnega telefona. Podatki o udeležbi sami ne dokazujejo nakazanega bruto ali neto zneska, obdavčitve povračila ali trajanja upravičenosti posameznika.</p>'+
    financeLinks([f.rules[1],f.rules[2],{date:'2026-11-12',page:3},{route:'seje/osebe',label:'Poimenska evidenca udeležbe'}]);
}
function financeModel(f) {
  const params=new URLSearchParams(location.hash.split('?')[1]||'');
  const original=params.get('osnova')==='sprejeti';
  const base=original?f.city.original:f.city.rebalanced;
  const total=f.people.reduce((a,x)=>[a[0]+x.residents,a[1]+x.areaHa],[0,0]);
  const b=f.people.find(x=>x.name==='Bežigrad'), res=b.residents/total[0], area=b.areaHa/total[1], equal=1/f.people.length;
  const pot=base.amount*0.05;
  return '<h3>Koliko bi pomenilo 5 % mestnih odhodkov?</h3><p>To je simulacija predloga za participativni proračun. Veljavni odlok letno maso za naloge ČS prepušča proračunu MOL. Za ponazoritev primerjamo tri različne načine delitve hipotetičnega sklada.</p>'+
    '<div class="tools"><label>Osnova za leto 2026<select id="finance-base"><option value="rebalans"'+(!original?' selected':'')+'>Po rebalansu</option><option value="sprejeti"'+(original?' selected':'')+'>Prvotni proračun</option></select></label></div>'+
    '<p>Mestni odhodki v izbrani različici znašajo <b>'+euros(base.amount,0)+'</b>. Pet odstotkov bi za vseh 17 četrti znašalo <b>'+euros(pot,2)+'</b>.</p>'+
    financeTable(['Način delitve','Delež za Bežigrad','Ilustrativni znesek'],[['Po merilih iz 8. člena',.65*equal+.35*(.70*res+.30*area)],['Samo po številu prebivalcev',res],['Na 17 enakih delov',equal]].map(([name,r])=>[h(name),nf(r*100,3)+' %',euros(r*pot,2)]))+
    '<p>Model uporabi primerljive opise vseh 17 četrti iz zaključnega računa 2025, ki skupaj navajajo '+total[0].toLocaleString('sl-SI')+' prebivalcev in '+total[1].toLocaleString('sl-SI')+' ha. Za Bežigrad opis navaja '+b.residents.toLocaleString('sl-SI')+' prebivalcev in '+b.areaHa+' ha. Referenčni datum prebivalstva v teh opisih ni naveden. Uradna delitev za 2026 bi zahtevala stalno prijavljene v centralnem registru na 1. januar 2025.</p>'+
    '<p>Po 8. členu se 65 % mase razdeli enako. Od preostalih 35 % se 70 % deli po prebivalcih in 30 % po površini.</p>'+financeLinks([base.source,f.rules[0],f.party])+
    '<details class="decision-guide"><summary>Podatki za vseh 17 četrti</summary>'+financeTable(['Četrt','Prebivalci v opisu','Površina (ha)','Stran zaključnega računa'],[...f.people].sort((a,b)=>b.residents-a.residents).map(x=>[h(x.name),x.residents.toLocaleString('sl-SI'),x.areaHa.toLocaleString('sl-SI'),link(f.demographicSource+'#page='+x.page,'Str. '+x.page)]))+'</details>';
}
function showFinance() {
  const f=db.finance, key=Object.hasOwn(financeSections,focusId)?focusId:'pregled';
  const panes={pregled:financeOverview,dela:financeWork,sejnine:financeFees,model:financeModel,preverjanje:()=>'<h3>Katere navedbe lahko potrdimo?</h3>'+f.checks.map(x=>'<article class="fin-check"><span class="meta">'+h(x.status)+'</span><h4>'+h(x.title)+'</h4><p>'+h(x.text)+'</p>'+financeLinks(x.sources)+'</article>').join('')};
  app.innerHTML=head('Finance in delovanje','Proračun, sejnine in mala dela ČS Bežigrad v mandatu 2022–2026. Vsak znesek je povezan z listino, ki pove, kaj pomeni.')+
    '<div class="subtabs">'+Object.entries(financeSections).map(([k,label])=>'<a href="#finance/'+k+'"'+(key===k?' aria-current="page"':'')+'>'+h(label)+'</a>').join('')+'</div><section class="fin-content">'+panes[key](f)+'</section>';
  const base=app.querySelector('#finance-base');
  if(base)base.onchange=()=>{history.replaceState(null,'','#finance/model'+(base.value==='sprejeti'?'?osnova=sprejeti':''));showFinance();document.getElementById('finance-base').focus({preventScroll:true})};
}