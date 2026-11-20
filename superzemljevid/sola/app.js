import {FORM,KIND_NAMES,inRing,validPoint,recordText,surveyUrl,importRecords,geojson} from './core.mjs';
import {attachSubmission} from './submit.js';
import {api} from './data.mjs';
import {attachPlaces} from './map-places.js';
import {writingPrompt,scaleBar} from './places.mjs';
import {attachClassroom} from './classroom.mjs';
const $=id=>document.getElementById(id),NS='http://www.w3.org/2000/svg';
const state={scene:null,addresses:[],point:null,place:'',mode:'2d',requestedMode:'3d',tileset:null,photoReady:false,tileFailure:false,records:[],view:{x:0,y:0,w:1000,h:1100},H:1100,viewer:null,threeReady:false};
const places=attachPlaces({choose:selectPoint,xy});
const classroom=attachClassroom({download,toast});
let toastTimer,threePromise;
function toast(t){$('toast').textContent=t;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,5000);}
function xy(p){const b=state.scene.bbox;return [(p[0]-b[0])/(b[2]-b[0])*1000,(b[3]-p[1])/(b[3]-b[1])*state.H];}
function ll(p){const b=state.scene.bbox;return [b[0]+p[0]/1000*(b[2]-b[0]),b[3]-p[1]/state.H*(b[3]-b[1])];}
function screenPoint(clientX,clientY){const p=$('mapSvg').createSVGPoint();p.x=clientX;p.y=clientY;return p.matrixTransform($('mapSvg').getScreenCTM().inverse());}
function refreshView(){
 if(!state.scene||$('map2d').hidden)return;
 const svg=$('mapSvg'),v=state.view;
 svg.setAttribute('viewBox',[v.x,v.y,v.w,v.h].join(' '));
 const matrix=svg.getScreenCTM(),s=matrix?.a;if(!s)return;
 if(state.point){const [x,y]=xy(state.point);$('chosenPin').setAttribute('transform','translate('+x+' '+y+') scale('+1/s+')');}
 for(const marker of svg.querySelectorAll('.landmark-marker,.import-pin')){
  marker.setAttribute('transform','translate('+marker.dataset.x+' '+marker.dataset.y+') scale('+1/s+')');
 }
 const b=state.scene.bbox;
 places.fitLabels(svg,matrix);
 const metresPerPixel=(b[2]-b[0])*111320*Math.cos(state.scene.center[1]*Math.PI/180)/(1000*s);
 const scale=scaleBar(metresPerPixel);
 if(scale){$('scaleText').textContent=scale.metres+' m';$('scaleLine').style.width=scale.width+'px';}
}
function setView(p,w){const [x,y]=xy(p);state.view={x:x-w/2,y:y-(w*state.H/1000)/2,w,h:w*state.H/1000};refreshView();}
function zoom(f,client){if(state.mode==='3d'&&state.viewer){const c=state.viewer.camera;const ground=state.viewer.scene.globe.getHeight(c.positionCartographic);const distance=Math.max(15,Math.max(30,c.positionCartographic.height-(Number.isFinite(ground)?ground:300))*.3);f<1?c.zoomIn(distance):c.zoomOut(distance);state.viewer.scene.requestRender();return;}const v=state.view,w=Math.max(80,Math.min(1500,v.w*f)),ratio=w/v.w;const p=client?screenPoint(...client):{x:v.x+v.w/2,y:v.y+v.h/2};state.view={x:p.x-(p.x-v.x)*ratio,y:p.y-(p.y-v.y)*ratio,w,h:v.h*ratio};refreshView();}
function goHome(){if(!state.scene)return;if(state.mode==='3d'){fly3D(state.scene.center,1050);return;}state.view={x:-25,y:-state.H*.025,w:1050,h:state.H*1.05};refreshView();}
function focusPoint(p){if(!state.scene)return;if(state.mode==='3d')fly3D(p,420);else setView(p,360);}
function distance(a,b){return Math.hypot((a[0]-b[0])*111320*Math.cos(a[1]*Math.PI/180),(a[1]-b[1])*111320);}
function selectPoint(p,{focus=false,label=''}={}){
 if(!state.scene)return false;
 if(submission.isLocked()){toast('Za novo lokacijo izberi »Dodaj nov predlog« ali »Začni znova«.');return false;}
 if(!validPoint(p,state.scene.boundary)){toast('Izberi mesto znotraj označenega izreza naselja.');return false;}
 state.point=p.map(n=>+n.toFixed(6));
 const near=state.addresses.reduce((best,a)=>{const d=distance(p,[a.longitude,a.latitude]);return !best||d<best.d?{a,d}:best;},null);
 if(!label)$('addressSearch').value='';
 state.place=label||(near?'Najbližji naslov je '+near.a.label+' (približno '+Math.round(near.d)+' m)':'Označeno mesto');
 $('placeLabel').textContent=state.place;
 $('coordinates').textContent=p[1].toFixed(6)+', '+p[0].toFixed(6);
 $('placeHeading').textContent='Izbrano mesto';$('chosenPin').removeAttribute('hidden');
 $('mapHint').textContent=label||'Mesto je označeno. S klikom ga lahko premakneš.';
 $('toIdea').hidden=false;places.highlight(state.point);
 $('stepPlace').classList.remove('current');$('stepIdea').classList.add('current');
 $('formError').hidden=true;$('handoffResult').hidden=true;refreshView();update3DPin();
 if(focus)focusPoint(p);return true;
}
function getRecord(){return {point:state.point,place:state.place,grade:$('grade').value,kind:document.querySelector('[name=kind]:checked').value,topic:document.querySelector('input[name=topic]:checked').value,text:$('proposal').value.trim()};}
function validate(){let msg='';if(!state.point)msg='Najprej označi mesto na zemljevidu.';else if(!$('grade').value)msg='Izberi svoj razred.';else if($('proposal').value.trim().length<10)msg='Napiši vsaj kratek stavek: kaj predlagaš in zakaj.';$('formError').textContent=msg;$('formError').hidden=!msg;if(msg){$('formError').scrollIntoView({block:'nearest',behavior:'smooth'});return false;}return true;}
function download(name,content,type){const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);}
function updateDraft(){$('charCount').textContent=`${$('proposal').value.length} / 700`;$('handoffResult').hidden=true;}
function resetMap(){
 state.point=null;state.place='';$('chosenPin').setAttribute('hidden','');
 $('placeHeading').textContent='Kje je tvoja ideja?';$('placeLabel').textContent='Klikni na zemljevid ali poišči naslov.';
 $('coordinates').textContent='';$('stepPlace').classList.add('current');$('stepIdea').classList.remove('current');
 $('mapHint').textContent='Za svoj predlog označi mesto na zemljevidu.';$('toIdea').hidden=true;
 $('addressSearch').value='';$('searchChoices').hidden=true;places.highlight(null);update3DPin();updateKind();
}
const submission=attachSubmission({getRecord,validate,resetMap,toast});
function updateKind(){
 const {label,hint}=writingPrompt(document.querySelector('[name=kind]:checked').value,$('grade').value);
 $('proposalLabel').textContent=label;$('writingHint').textContent=hint;updateDraft();
}
$('proposal').oninput=updateDraft;
$('grade').onchange=updateKind;
document.querySelectorAll('[name=kind]').forEach(e=>e.onchange=updateKind);
document.querySelectorAll('[name=topic]').forEach(e=>e.onchange=updateDraft);
$('toIdea').onclick=()=>{const field=$('grade').disabled?$('saveResult'):$('grade');field.focus();field.scrollIntoView({block:'center'});};
$('backToMap').onclick=()=>{$('addressSearch').focus();$('searchForm').scrollIntoView({block:'center'});};
updateKind();
$('zoomIn').onclick=()=>zoom(.72);$('zoomOut').onclick=()=>zoom(1.4);$('home').onclick=goHome;
$('selectCenter').onclick=()=>{if(!state.scene)return;if(state.mode==='3d'){if(!state.viewer)return;const C=window.Cesium,v=state.viewer,p=new C.Cartesian2(v.canvas.clientWidth/2,v.canvas.clientHeight/2);select3D(p);}else selectPoint(ll([state.view.x+state.view.w/2,state.view.y+state.view.h/2]));};


const svg=$('mapSvg'),pointers=new Map();let drag=null,pinch=null,moved=false;
svg.addEventListener('pointerdown',e=>{if(e.target.closest('.import-pin,.landmark-marker'))return;svg.focus({preventScroll:true});svg.setPointerCapture(e.pointerId);pointers.set(e.pointerId,[e.clientX,e.clientY]);if(pointers.size===1){drag={x:e.clientX,y:e.clientY,v:{...state.view}};moved=false;}else{const p=[...pointers.values()];pinch=Math.hypot(p[0][0]-p[1][0],p[0][1]-p[1][1]);moved=true;}});
svg.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,[e.clientX,e.clientY]);if(pointers.size===2){const p=[...pointers.values()],d=Math.hypot(p[0][0]-p[1][0],p[0][1]-p[1][1]);if(pinch&&d>0)zoom(pinch/d,[(p[0][0]+p[1][0])/2,(p[0][1]+p[1][1])/2]);pinch=d;return;}if(drag){const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(dx,dy)>5)moved=true;const scale=svg.getScreenCTM().a;state.view={...drag.v,x:drag.v.x-dx/scale,y:drag.v.y-dy/scale};refreshView();}});
function pointerEnd(e){if(!pointers.has(e.pointerId))return;const click=!moved&&pointers.size===1&&e.type==='pointerup';pointers.delete(e.pointerId);if(click){const p=screenPoint(e.clientX,e.clientY);selectPoint(ll([p.x,p.y]));}if(pointers.size===1){const p=[...pointers.values()][0];drag={x:p[0],y:p[1],v:{...state.view}};moved=true;}else drag=null;pinch=null;}
svg.addEventListener('pointerup',pointerEnd);svg.addEventListener('pointercancel',pointerEnd);svg.addEventListener('wheel',e=>{e.preventDefault();zoom(Math.exp(e.deltaY*.0015),[e.clientX,e.clientY]);},{passive:false});
svg.addEventListener('keydown',e=>{const v=state.view,s=v.w*.08;if(e.key==='+'||e.key==='=')zoom(.72);else if(e.key==='-')zoom(1.4);else if(e.key==='Enter')$('selectCenter').click();else if(e.key==='ArrowLeft')v.x-=s;else if(e.key==='ArrowRight')v.x+=s;else if(e.key==='ArrowUp')v.y-=s;else if(e.key==='ArrowDown')v.y+=s;else return;e.preventDefault();refreshView();});
new ResizeObserver(()=>{if(state.scene&&state.mode==='2d')refreshView();}).observe(document.querySelector('.map-stage'));
function dialogOpen(id){$(id).showModal();}document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$(b.dataset.close).close());$('teacherOpen').onclick=()=>dialogOpen('teacherDialog');$('aboutOpen').onclick=()=>dialogOpen('aboutDialog');
function filtered(){return state.records.filter(r=>(!$('filterGrade').value||r.grade===$('filterGrade').value)&&(!$('filterKind').value||r.kind===$('filterKind').value));}
function showRecord(r){$('recordTitle').textContent=`${KIND_NAMES[r.kind]} · ${r.grade}`;const p=document.createElement('p');p.className='record-text';p.textContent=r.text;const small=document.createElement('p');small.className='muted';small.textContent=`${r.point[1].toFixed(6)}, ${r.point[0].toFixed(6)}`;$('recordBody').replaceChildren(p,small,classroom.button(r));classroom.render();dialogOpen('recordDialog');}
const colors={idea:'#205d62',keep:'#547432',problem:'#9a5122',avoid:'#674c88'};
const color=kind=>colors[kind]||colors.idea;
const marks={idea:'◆',keep:'♥',problem:'!',avoid:'−'};
function renderImported(){const rows=filtered();$('importPins').replaceChildren();$('importList').replaceChildren();for(const r of rows){const p=xy(r.point),g=document.createElementNS(NS,'g');g.classList.add('import-pin');g.dataset.x=p[0];g.dataset.y=p[1];g.setAttribute('tabindex','0');g.setAttribute('role','button');g.setAttribute('aria-label',`${KIND_NAMES[r.kind]}, zapis ${r.id}, ${r.grade}`);const c=document.createElementNS(NS,'circle');c.setAttribute('r','13');c.setAttribute('fill',color(r.kind));const t=document.createElementNS(NS,'text');t.textContent=marks[r.kind]||'◆';g.append(c,t);g.onclick=e=>{e.stopPropagation();showRecord(r);};g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();showRecord(r);}};$('importPins').append(g);if($('importList').childElementCount<150){const b=document.createElement('button');b.className='record-card';const title=document.createElement('b');title.textContent=`${r.id}. ${KIND_NAMES[r.kind]} · ${r.grade}`;const txt=document.createElement('span');txt.textContent=r.text.slice(0,220);b.append(title,txt);b.onclick=()=>{$('teacherDialog').close();focusPoint(r.point);showRecord(r);};const row=document.createElement('div');row.className='record-row';row.append(b,classroom.button(r));$('importList').append(row);}}
classroom.render();if(rows.length>150){const p=document.createElement('p');p.textContent=`V seznamu je prvih 150 od ${rows.length} zapisov. Na zemljevidu so vsi prikazani zapisi.`;$('importList').append(p);}if(state.scene)refreshView();if(state.threeReady)update3DImported();$('showImported').textContent=`Pokaži ${rows.length} zapisov na zemljevidu`;}
$('importFile').onchange=async e=>{const f=e.target.files[0];if(!f)return;if(f.size>5*1024*1024){toast('Datoteka naj bo manjša od 5 MB.');e.target.value='';return;}try{const {records,skipped}=importRecords(await f.text(),f.name,state.scene.boundary);classroom.clear();state.records=records;$('filterGrade').value='';$('filterKind').value='';$('importStatus').textContent=`Prebranih lokacij: ${records.length}. Preskočenih vrstic/zapisov brez veljavne lokacije: ${skipped}. Prejšnji uvoz je nadomeščen. Uvoz ostane samo v tem zavihku.`;$('importStatus').hidden=false;$('teacherFilters').hidden=!records.length;renderImported();}catch(err){$('importStatus').textContent=`Uvoz ni uspel: ${err.message} Prejšnji uvoz ostaja.`;$('importStatus').hidden=false;}finally{e.target.value='';}};
$('filterGrade').onchange=renderImported;$('filterKind').onchange=renderImported;$('showImported').onclick=()=>{$('teacherDialog').close();goHome();toast(`${filtered().length} uvoženih zapisov. Klikni oznako za besedilo.`);};$('exportGeojson').onclick=()=>download('Solski_predlogi_Savsko_naselje.geojson',JSON.stringify(geojson(filtered()),null,2),'application/geo+json');$('clearImported').onclick=()=>{state.records=[];classroom.clear();renderImported();$('teacherFilters').hidden=true;$('importStatus').textContent='Uvoz je odstranjen iz tega zavihka. Izvorna datoteka in anketa ostajata nespremenjeni.';};
// Only the signed-in owner can load the private collection. Nothing is persisted in browser storage.
api('/session').then(s=>{$('loadSaved').hidden=!s.admin;}).catch(()=>{});
$('loadSaved').onclick=async()=>{
 const button=$('loadSaved');button.disabled=true;button.textContent='Nalagam zasebno zbirko …';
 try{if(!state.scene)throw Error('Počakaj, da se naloži zemljevid.');let offset=0,all=[];
  do{const page=await api('/school/proposals?offset='+offset);all.push(...page.items);offset=page.nextOffset;}while(offset!==null&&all.length<1000);
  classroom.clear();state.records=all.map((r,i)=>({id:i+1,sourceId:r.id,grade:r.grade,kind:r.kind,topic:r.topic,text:r.description,place:r.location,point:[r.longitude,r.latitude],hasPhoto:!!r.has_photo}));
  $('filterGrade').value='';$('filterKind').value='';$('teacherFilters').hidden=!all.length;$('importStatus').hidden=false;$('importStatus').textContent=`Naloženih ${all.length} zasebnih predlogov${offset!==null?' (prvih 1000)':''}. Pred skupinskim prikazom preglej besedila. Fotografije so v skrbniškem pregledu.`;renderImported();
 }catch(e){toast(e.message);}finally{button.disabled=false;button.textContent='Naloži shranjene predloge na ta zemljevid';}
};
function load3D(){return new Promise((resolve,reject)=>{if(window.Cesium)return resolve();window.CESIUM_BASE_URL='../cesium/';const css=document.createElement('link');css.rel='stylesheet';css.href='../cesium/Widgets/widgets.css';document.head.append(css);const s=document.createElement('script');s.src='../cesium/Cesium.js';s.onload=resolve;s.onerror=()=>reject(Error('3D knjižnice ni bilo mogoče naložiti.'));document.head.append(s);});}
function fly3D(p,range=650){
 const C=window.Cesium,v=state.viewer;if(!v)return;
 v.camera.flyToBoundingSphere(new C.BoundingSphere(C.Cartesian3.fromDegrees(...p,340),1),{
  offset:new C.HeadingPitchRange(C.Math.toRadians(335),C.Math.toRadians(-43),range),
  duration:window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:.7
 });
}
function update3DPin(){const v=state.viewer;if(!v)return;const C=window.Cesium;v.entities.removeById('draft');if(state.point)v.entities.add({id:'draft',position:C.Cartesian3.fromDegrees(...state.point,0),point:{heightReference:C.HeightReference.CLAMP_TO_GROUND,pixelSize:17,color:C.Color.fromCssColorString('#dfff8f'),outlineColor:C.Color.fromCssColorString('#126354'),outlineWidth:4,disableDepthTestDistance:Number.POSITIVE_INFINITY},label:{heightReference:C.HeightReference.CLAMP_TO_GROUND,text:'Tvoja lokacija',font:'15px Arial',fillColor:C.Color.WHITE,showBackground:true,backgroundColor:C.Color.fromCssColorString('#126354'),pixelOffset:new C.Cartesian2(0,-27),disableDepthTestDistance:Number.POSITIVE_INFINITY}});v.scene.requestRender();}
function update3DImported(){
 const C=window.Cesium,v=state.viewer;if(!v)return;
 for(const e of [...v.entities.values])if(e.id.startsWith('import-'))v.entities.remove(e);
 for(const r of filtered()){
  const style={heightReference:C.HeightReference.CLAMP_TO_GROUND,disableDepthTestDistance:Infinity};
  v.entities.add({
   id:'import-'+r.id,position:C.Cartesian3.fromDegrees(...r.point,0),
   point:{...style,pixelSize:23,color:C.Color.fromCssColorString(color(r.kind)),outlineColor:C.Color.WHITE,outlineWidth:2},
   label:{...style,text:marks[r.kind]||'◆',font:'bold 12px Arial',fillColor:C.Color.WHITE,
    verticalOrigin:C.VerticalOrigin.CENTER,horizontalOrigin:C.HorizontalOrigin.CENTER}
  });
 }
 v.scene.requestRender();
}
function select3D(position){
 const C=window.Cesium,v=state.viewer;if(!v||!state.threeReady)return;
 const picked=v.scene.pick(position);
 if(places.pickGlobe(picked?.id?.id))return;
 if(picked?.id?.id?.startsWith('import-')){const r=state.records.find(r=>'import-'+r.id===picked.id.id);if(r)showRecord(r);return;}
 let world;
 if(v.scene.pickPositionSupported&&C.defined(picked))world=v.scene.pickPosition(position);
 if(!C.defined(world)){const ray=v.camera.getPickRay(position);if(ray)world=v.scene.globe.pick(ray,v.scene);}
 if(!C.defined(world))return;
 const c=C.Cartographic.fromCartesian(world);selectPoint([C.Math.toDegrees(c.longitude),C.Math.toDegrees(c.latitude)]);
}
function clipToNeighborhood(C){
 return new C.ClippingPolygonCollection({
  polygons:[new C.ClippingPolygon({positions:C.Cartesian3.fromDegreesArray(state.scene.boundary.slice(0,-1).flat())})],
  inverse:true
 });
}
function refresh3DNotice(){
 if(state.mode!=='3d')return;
 $('mapStatus').hidden=state.photoReady;
 $('mapStatus').textContent=state.tileFailure?'Nekaterih delov 3D-posnetka ni bilo mogoče naložiti. Uporabi pogled Zemljevid.':'Nalagam fotografski 3D-posnetek GURS …';
 $('mapCredit').textContent=state.tileFailure?'GURS · nekateri deli 3D-posnetka niso dosegljivi':'Fotografski 3D-posnetek GURS';
}
async function init3D(){
 await load3D();const C=window.Cesium;C.Ion.defaultAccessToken='';
 const v=state.viewer=new C.Viewer('map3d',{
  baseLayer:false,baseLayerPicker:false,geocoder:false,homeButton:false,sceneModePicker:false,
  navigationHelpButton:false,animation:false,timeline:false,fullscreenButton:false,selectionIndicator:false,
  infoBox:false,skyBox:false,skyAtmosphere:false,requestRenderMode:true,maximumRenderTimeChange:Infinity,
  contextOptions:{webgl:{alpha:false,antialias:true}}
 });
 const green=C.Color.fromCssColorString('#739365');
 v.scene.backgroundColor=green;v.scene.globe.baseColor=green;
 if(v.scene.sun)v.scene.sun.show=false;if(v.scene.moon)v.scene.moon.show=false;
 v.scene.fog.enabled=false;v.scene.globe.showGroundAtmosphere=false;v.scene.globe.enableLighting=false;
 v.scene.globe.maximumScreenSpaceError=2;v.scene.postProcessStages.fxaa.enabled=true;
 v.scene.screenSpaceCameraController.minimumZoomDistance=20;
 v.scene.screenSpaceCameraController.maximumZoomDistance=3500;
 v.scene.screenSpaceCameraController.enableCollisionDetection=true;
 if(!C.ClippingPolygonCollection.isSupported(v.scene))throw Error('Za fotografski izrez je potreben WebGL 2.');
 // The base imagery layer stretches beyond its rectangle. Clip the globe itself,
 // as on the original map, so only the photographed neighborhood is visible.
 v.scene.globe.clippingPolygons=clipToNeighborhood(C);
 v.cesiumWidget.creditDisplay.addStaticCredit(new C.Credit('Fotografski 3D-model, ortofoto in teren: GURS',true));
 fly3D(state.point||state.scene.center,state.point?500:1050);
 const imagery=await C.SingleTileImageryProvider.fromUrl('../orthophoto.jpg',{
  rectangle:C.Rectangle.fromDegrees(...state.scene.bbox),credit:'Ortofoto GURS DOF025'
 });
 v.imageryLayers.addImageryProvider(imagery);
 C.CesiumTerrainProvider.fromUrl(state.scene.terrain_url,{requestVertexNormals:true}).then(t=>{
  if(state.viewer!==v||v.isDestroyed())return;v.terrainProvider=t;v.scene.requestRender();
 }).catch(()=>{if(state.viewer===v&&!v.isDestroyed())v.scene.requestRender();});
 const tileset=await C.Cesium3DTileset.fromUrl(state.scene.mesh_url,{
  maximumScreenSpaceError:2.5,cacheBytes:268435456,maximumCacheOverflowBytes:134217728,skipLevelOfDetail:true
 });
 // Reuse the real photographed mesh and its embedded materials, without any
 // white extruded building overlay or replacement facade texture.
 tileset.clippingPolygons=clipToNeighborhood(C);
 state.tileset=tileset;v.scene.primitives.add(tileset);
 tileset.tileVisible.addEventListener(()=>{if(!state.photoReady){state.photoReady=true;refresh3DNotice();}});
 tileset.tileFailed.addEventListener(()=>{state.tileFailure=true;refresh3DNotice();});
 const handler=new C.ScreenSpaceEventHandler(v.scene.canvas);
 handler.setInputAction(e=>select3D(e.position),C.ScreenSpaceEventType.LEFT_CLICK);
 state.threeReady=true;places.addToGlobe(C,v);update3DPin();update3DImported();v.scene.requestRender();
}
function showMode(which){
 state.mode=which;$('map2d').hidden=which!=='2d';$('map3d').hidden=which!=='3d';
 $('mode2d').classList.toggle('active',which==='2d');$('mode3d').classList.toggle('active',which==='3d');
 $('mode2d').setAttribute('aria-pressed',which==='2d');$('mode3d').setAttribute('aria-pressed',which==='3d');
 $('northCue').hidden=which!=='2d';$('scaleCue').hidden=which!=='2d';
 if(which==='2d'){$('mapStatus').hidden=true;$('mapCredit').textContent='Ortofoto GURS · september 2026';refreshView();}
 else refresh3DNotice();
}
async function mode(which,userAction=false){
 state.requestedMode=which;if(!state.scene)return;
 showMode(which);if(which==='2d')return;
 if(state.threeReady){state.viewer.resize();state.viewer.scene.requestRender();return;}
 try{
  threePromise??=init3D();await threePromise;
  if(state.requestedMode==='3d')refresh3DNotice();
 }catch{
  threePromise=null;if(state.viewer){try{state.viewer.destroy();}catch{}state.viewer=null;}
  $('map3d').replaceChildren();state.tileset=null;state.threeReady=false;state.photoReady=false;state.tileFailure=false;
  const showWarning=state.requestedMode==='3d';state.requestedMode='2d';showMode('2d');
  if(showWarning){
   if(!state.point)$('mapHint').textContent='3D trenutno ni na voljo. Za predlog označi mesto na 2D zemljevidu.';
   if(state.point)setView(state.point,360);
   if(userAction)toast('3D-posnetka trenutno ni mogoče prikazati.');
  }
 }
}
$('mode2d').onclick=()=>mode('2d');$('mode3d').onclick=()=>mode('3d',true);
async function init(){try{const data=await Promise.all(['scene.json','addresses.json'].map(async n=>{const r=await fetch('../'+n);if(!r.ok)throw Error(n);return r.json();}));[state.scene,state.addresses]=data;const b=state.scene.bbox;state.H=1000*(b[3]-b[1])/((b[2]-b[0])*Math.cos(state.scene.center[1]*Math.PI/180));$('ortho').setAttribute('height',state.H);
 const boundary=state.scene.boundary.map((p,i)=>(i?'L':'M')+xy(p).join(' ')).join(' ')+' Z';
 $('areaBoundary').setAttribute('d',boundary);$('photoClipPath').setAttribute('d',boundary);
 places.fill(state.addresses);goHome();const q=new URLSearchParams(location.search);if(q.has('lat')&&q.has('lon')){const p=[Number(q.get('lon')),Number(q.get('lat'))];if(validPoint(p,state.scene.boundary))selectPoint(p,{focus:true});else toast('Povezava ne vsebuje veljavnega mesta v tem izrezu.');}await mode(state.requestedMode);}catch{$('mapStatus').hidden=false;$('mapStatus').textContent='Podatkov zemljevida ni bilo mogoče naložiti. Osveži stran ali odpri Larsovo anketo.';const a=document.createElement('a');a.href=FORM;a.textContent='Odpri anketo';a.style.display='block';$('mapStatus').append(a);}}
init();
