(function(){
'use strict';
var D=window.SVETNIKI_DATA, M=D.meta, S=M.stats;
var BARVE={
 'Mestna občina Ljubljana (MOL)':'#2f9e44',
 'Skupni del etažne lastnine':'#4dabf7',
 'Druga pravna oseba':'#f08c00',
 'Družbena lastnina':'#9c36b5',
 'Zasebna lastnina (fizične osebe)':'#ced4da',
 'Mešano lastništvo':'#e8590c',
 'ni podatka':'#ffffff'};
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function fmt(n){return Number(n).toLocaleString('sl-SI');}

// povzetek
document.getElementById('povzetek').innerHTML='<h2>Povzetek</h2><div class="num">'+
 '<div><b>'+fmt(S.parcel)+'</b>parcel</div><div><b>'+fmt(S.stavb)+'</b>stavb</div><div><b>'+fmt(S.zvetl_oznacenih)+'</b>parcel z oznako ZVEtL</div></div>';
// legenda
var lg='';
Object.keys(BARVE).forEach(function(k){ if(k==='ni podatka'&&!S.kategorije[k])return;
 lg+='<div class="leg"><i style="background:'+BARVE[k]+'"></i>'+esc(k)+'<span class="n">'+fmt(S.kategorije[k]||0)+'</span></div>';});
lg+='<div class="leg"><i class="hatch"></i>Zaznana povezava s postopkom ZVEtL (nekončan)<span class="n">'+fmt(S.zvetl_oznacenih)+'</span></div>';
lg+='<div class="leg"><i style="background:#495057;opacity:.6"></i>Stavba (GURS)<span class="n">'+fmt(S.stavb)+'</span></div>';
lg+='<div class="leg"><i class="pob"></i>Pobuda meščanov MOL<span class="n">'+fmt(S.pobud)+'</span></div>';
document.getElementById('legenda').innerHTML=lg;

var b=M.bbox, bounds=L.latLngBounds([b[1],b[0]],[b[3],b[2]]);
var map=L.map('map',{zoomSnap:0.25,maxBounds:bounds.pad(0.6),minZoom:14,maxZoom:21,preferCanvas:false,attributionControl:true});
map.fitBounds(bounds);
map.attributionControl.setPrefix('Leaflet');
var orto=L.imageOverlay('ortofoto-gurs.jpg',bounds,{opacity:0.85,attribution:'Ortofoto in kataster © GURS (CC BY 4.0)'});

// šrafura z SVG vzorcem
var svgR=L.svg(); svgR.addTo(map);
var defs=document.createElementNS('http://www.w3.org/2000/svg','defs');
defs.innerHTML='<pattern id="srafura" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)"><rect width="6" height="6" fill="transparent"/><line x1="0" y1="0" x2="0" y2="6" stroke="#d7263d" stroke-width="2.2"/></pattern>';
svgR._container.insertBefore(defs,svgR._container.firstChild);

var izbran=null;
function slogP(f){return {renderer:svgR,color:'#37414b',weight:0.6,fillColor:BARVE[f.properties.kategorija]||'#fff',fillOpacity:0.7};}
function vrstica(k,v){return '<tr><td>'+esc(k)+'</td><td>'+v+'</td></tr>';}
function seznam(a){return a.map(esc).join('<br>');}
function prikaziP(p){
 var h='<h2>Parcela '+esc(p.parcela)+'</h2>';
 if(p.zvetl) h+='<p><span class="flag">ZVEtL nekončan</span> zaznana povezava s postopkom ZVEtL</p>';
 h+='<table>'+vrstica('Katastrska občina',esc(p.ko))+vrstica('Površina',p.povrsina_m2!=null?fmt(p.povrsina_m2)+' m²':'ni podatka')+
  vrstica('Vrsta lastnika',esc(p.kategorija))+vrstica('Lastnik',seznam(p.lastnik));
 if(p.upravnik&&p.upravnik.length) h+=vrstica('Upravnik',seznam(p.upravnik));
 h+=vrstica('ZVEtL',p.zvetl?'zaznana povezava s postopkom ZVEtL (nekončan)':'na zemljevidu ni oznake')+vrstica('ID parcele (GURS)',esc(p.eid||'ni podatka'))+'</table>';
 document.getElementById('podrobno').innerHTML=h;}
function prikaziB(p){
 var h='<h2>Stavba '+esc(p.id_gurs)+'</h2><table>'+vrstica('Naslovi',seznam(p.naslovi))+vrstica('Upravnik',seznam(p.upravnik))+
  vrstica('Leto izgradnje',esc(p.leto))+vrstica('Število etaž',esc(p.etaze))+vrstica('Število stanovanj',esc(p.stanovanja))+
  vrstica('Tip stavbe',esc(p.tip))+vrstica('Parcele pod stavbo (GURS)',seznam(p.parcele_gurs))+vrstica('ID stavbe (GURS)',esc(p.eid||'ni podatka'))+'</table>';
 document.getElementById('podrobno').innerHTML=h;}
function prikaziPob(p){
 var h='<h2>Pobuda '+esc(p.id)+'</h2><table>'+vrstica('Naslov',esc(p.naslov))+vrstica('Datum',esc(p.datum))+vrstica('Ulica',esc(p.ulica))+
  vrstica('Vrsta',esc(p.tema))+vrstica('Stanje odgovora',esc(p.status));
 if(p.odgovor_mol) h+=vrstica('Povzetek odgovora MOL',esc(p.odgovor_mol));
 h+=vrstica('Vir','portal pobude.ljubljana.si (ID '+esc(p.id)+')')+'</table>';
 document.getElementById('podrobno').innerHTML=h;}
function oznaci(l){ if(izbran&&izbran.setStyle&&izbran._osnova) izbran.setStyle(izbran._osnova); izbran=l;
 if(l.setStyle){l._osnova=l._osnova||{color:l.options.color,weight:l.options.weight}; l.setStyle({color:'#000',weight:2.5});} }

var idx=[];
var parcele=L.geoJSON(D.parcele,{style:slogP,onEachFeature:function(f,l){
 l.on('click',function(){oznaci(l);prikaziP(f.properties);});
 idx.push({t:'Parcela '+f.properties.parcela,k:f.properties.parcela.toLowerCase(),l:l,fn:function(){prikaziP(f.properties);}});
}}).addTo(map);
var zvetl=L.geoJSON({type:'FeatureCollection',features:D.parcele.features.filter(function(f){return f.properties.zvetl;})},
 {interactive:false,style:function(){return {renderer:svgR,color:'#d7263d',weight:1.2,fill:true,fillColor:'url(#srafura)',fillOpacity:1};}}).addTo(map);
var stavbe=L.geoJSON(D.stavbe,{style:function(){return {renderer:svgR,color:'#212529',weight:0.8,fillColor:'#495057',fillOpacity:0.55};},onEachFeature:function(f,l){
 l.on('click',function(e){L.DomEvent.stopPropagation(e);oznaci(l);prikaziB(f.properties);});
 var p=f.properties; idx.push({t:'Stavba '+p.id_gurs+(p.naslovi[0]!=='ni podatka'?' – '+p.naslovi[0]:''),k:(p.stavba+' '+p.id_gurs+' '+p.naslovi.join(' ')).toLowerCase(),l:l,fn:function(){prikaziB(p);}});
}}).addTo(map);
var pobude=L.geoJSON(D.pobude,{pointToLayer:function(f,ll){return L.circleMarker(ll,{renderer:svgR,radius:5,color:'#7a5a00',weight:1,fillColor:'#ffd43b',fillOpacity:0.95});},
 onEachFeature:function(f,l){l.on('click',function(e){L.DomEvent.stopPropagation(e);prikaziPob(f.properties);});}}).addTo(map);
// fix SVG fill url for zvetl
zvetl.eachLayer(function(l){ if(l._path) l._path.setAttribute('fill','url(#srafura)');});
map.on('zoomend moveend',function(){zvetl.eachLayer(function(l){if(l._path)l._path.setAttribute('fill','url(#srafura)');});});

function preklop(id,layer){document.getElementById(id).addEventListener('change',function(e){ if(e.target.checked){layer.addTo(map);} else {map.removeLayer(layer);}
 if(layer===zvetl) zvetl.eachLayer(function(l){if(l._path)l._path.setAttribute('fill','url(#srafura)');});
 if(layer===orto) orto.bringToBack(); });}
preklop('chkZvetl',zvetl);preklop('chkStavbe',stavbe);preklop('chkPobude',pobude);preklop('chkOrto',orto);
document.getElementById('chkOrto').addEventListener('change',function(e){parcele.setStyle(function(f){var s=slogP(f);s.fillOpacity=e.target.checked?0.45:0.7;return s;});});

var inp=document.getElementById('isci'), ul=document.getElementById('zadetki');
inp.addEventListener('input',function(){var q=inp.value.trim().toLowerCase(); ul.innerHTML=''; if(q.length<2)return;
 idx.filter(function(x){return x.k.indexOf(q)>=0;}).slice(0,12).forEach(function(x){var li=document.createElement('li');li.textContent=x.t;
  li.onclick=function(){map.fitBounds(x.l.getBounds(),{maxZoom:19});oznaci(x.l);x.fn();};ul.appendChild(li);});});
})();
