import {api,upload,preparePhoto,download} from './data.mjs';
import {recordText,surveyUrl} from './core.mjs';

/* Oddaja v zasebno tabelo: vstavi /exec URL in oddaja se vklopi sama. */
const RECEIVER_URL = '';
const ODDAJA_VKLOPLJENA = Boolean(RECEIVER_URL);
const RECEIVER_TOKEN = '';
const MOOD_MARK = {veselo: '😊', srednje: '😐', zalostno: '☹️'};
const PATH_STORAGE_KEY = 'sola-pot-lokalno';
export const PATH_DISABLED_MSG = 'Pot je shranjena na tej napravi. Oddaja bo kmalu vklopljena.';
export {ODDAJA_VKLOPLJENA, RECEIVER_URL};

const $=id=>document.getElementById(id);

export async function postToSheet(payload){
  if(!RECEIVER_URL)throw new Error('Naslov sprejemnika še ni nastavljen.');
  const res=await fetch(RECEIVER_URL,{
   method:'POST',
   redirect:'follow',
   headers:{'Content-Type':'text/plain;charset=utf-8'},
   body:JSON.stringify(payload)
  });
  const text=await res.text();
  let data={};
  try{data=JSON.parse(text);}catch{throw new Error('Sprejemnik ni vrnil veljavnega odgovora.');}
  if(!data.ok)throw new Error('Oddaja ni uspela.');
  return{id:data.id||payload.id,created_at:new Date().toISOString()};
}

function pathFeatureCollection(path, marks){
  const features=[{
    type:'Feature',
    geometry:{type:'LineString',coordinates:path},
    properties:{vrsta:'pot'}
  }];
  for(const m of marks||[]){
    if(!m||!m.point)continue;
    features.push({
      type:'Feature',
      geometry:{type:'Point',coordinates:m.point},
      properties:{vrsta:'oznaka',safety:m.safety||'',reason:m.reason||''}
    });
  }
  return {type:'FeatureCollection',features};
}

function savePathLocally(payload){
  let list=[];
  try{list=JSON.parse(localStorage.getItem(PATH_STORAGE_KEY)||'[]');}catch{list=[];}
  if(!Array.isArray(list))list=[];
  list.push({
    id:payload.id,
    cas:new Date().toISOString(),
    vrsta:'pot',
    lon:payload.lon,
    lat:payload.lat,
    geometrija:payload.geometrija
  });
  if(list.length>20)list=list.slice(-20);
  try{localStorage.setItem(PATH_STORAGE_KEY,JSON.stringify(list));}catch{/* zasebni način ali poln prostor */}
}

export function pathPayload(path, marks){
  const first=path&&path[0];
  return{
    id:(crypto.randomUUID&&crypto.randomUUID())||('pot-'+Date.now()),
    vrsta:'pot',
    razred:'',
    kategorija:'',
    smesko:'',
    besedilo:'',
    lon:first?first[0]:'',
    lat:first?first[1]:'',
    geometrija:pathFeatureCollection(path, marks),
    token:RECEIVER_TOKEN,
    website:''
  };
}

/** Oddaja poti: če je prejemnik vklopljen, POST; sicer samo localStorage. */
export async function submitSchoolPath(path, marks){
  if(!path||path.length<2)throw new Error('Najprej nariši pot in pritisni Končaj.');
  const payload=pathPayload(path, marks);
  savePathLocally(payload);
  if(!ODDAJA_VKLOPLJENA||!RECEIVER_URL){
    return{ok:true,local:true,id:payload.id,message:PATH_DISABLED_MSG};
  }
  const saved=await postToSheet(payload);
  return{ok:true,local:false,id:saved.id,message:'Hvala! Pot je oddana.'};
}

export function attachSubmission({getRecord,validate,resetMap,toast}){
 let id=crypto.randomUUID(),photo=null,photoUrl=null,photoSequence=0,photoBusy=false,busy=false,saved=null,pending=null;
 const error=message=>{$('formError').textContent=message;$('formError').hidden=!message;};
 function lock(){
  for(const e of $('proposalForm').querySelectorAll('input,select,textarea,button'))e.disabled=busy||!!saved||!!pending;
  for(const name of ['reset','newProposal','downloadCard','openSurvey','copyText','deleteProposal'])$(name).disabled=busy||photoBusy;
  $('submitProposal').disabled=busy||photoBusy||!!saved;
  $('submitProposal').hidden=!!saved||!ODDAJA_VKLOPLJENA;
 }
 function clearPhoto(){++photoSequence;photo=null;photoBusy=false;if(photoUrl)URL.revokeObjectURL(photoUrl);photoUrl=null;$('photoPreview').removeAttribute('src');$('photoPreview').hidden=true;$('removePhoto').hidden=true;$('photoConsentLabel').hidden=true;$('photoConsent').required=false;$('photoConsent').checked=false;$('aiRequested').checked=false;$('photoStatus').textContent='';$('cameraPhoto').value='';$('galleryPhoto').value='';lock();}
 async function addPhoto(file){
  if(!file||busy||saved||pending)return;clearPhoto();photoBusy=true;const sequence=++photoSequence;lock();error('');$('photoStatus').textContent='Pripravljam fotografijo …';
  try{const blob=await preparePhoto(file);if(sequence!==photoSequence)return;photo=blob;photoUrl=URL.createObjectURL(blob);$('photoPreview').src=photoUrl;$('photoPreview').hidden=false;$('removePhoto').hidden=false;$('photoConsentLabel').hidden=false;$('photoConsent').required=true;$('photoStatus').textContent=`Pripravljena · ${Math.ceil(blob.size/1024)} kB. Shrani se ob oddaji predloga.`;}
  catch(e){if(sequence===photoSequence){error(e.message);$('photoStatus').textContent='Fotografija ni dodana.';}}
  finally{if(sequence===photoSequence){photoBusy=false;lock();}}
 }
 function sheetPayload(record){
  const point=record.point;
  return{
   id,
   vrsta:'predlog',
   razred:record.grade||'',
   kategorija:record.topic||'',
   smesko:MOOD_MARK[record.mood]||record.mood||'',
   besedilo:String(record.text||'').slice(0,140),
   lon:point?point[0]:'',
   lat:point?point[1]:'',
   geometrija:point?{type:'Point',coordinates:point}:'',
   token:RECEIVER_TOKEN,
   website:($('website')&&$('website').value)||''
  };
 }
 /* postToSheet je v skupni rabi z oddajo poti. */
 $('cameraPhoto').onchange=e=>addPhoto(e.target.files[0]);$('galleryPhoto').onchange=e=>addPhoto(e.target.files[0]);$('removePhoto').onclick=clearPhoto;
 $('proposalForm').onsubmit=async e=>{
  e.preventDefault();
  if(!ODDAJA_VKLOPLJENA){error('Oddaja v zasebno zbirko še ni vklopljena.');return;}
  if(busy||photoBusy||saved||!validate())return;
  if(!pending&&$('aiRequested').checked&&!photo){error('Za fotomontažo dodaj fotografijo prostora. Predlog lahko oddaš tudi brez te želje.');return;}
  if(!pending&&(!$('consent').checked||(photo&&!$('photoConsent').checked))){error('Preberi in potrdi oddajo predloga ter fotografije.');return;}
  busy=true;lock();error('');$('submitProposal').textContent='Shranjujem …';
  try{
   if(!pending){const r=getRecord();pending=sheetPayload(r);}
   /* Fotografije se v tabelo ne pošiljajo. */
   saved=await postToSheet(pending);
   $('saveReceipt').textContent=`Oznaka: ${saved.id} · ${new Date(saved.created_at).toLocaleString('sl-SI')}`;
   $('saveResult').hidden=false;$('stepIdea').classList.remove('current');$('stepSave').classList.add('current');$('saveResult').focus();toast('Hvala! Predlog je shranjen.');
  }catch(e){error(e.message+(pending?' Ob ponovitvi se pošlje isti predlog; za novo vsebino izberi »Začni znova«.':''));$('formError').scrollIntoView({block:'nearest'});}
  finally{busy=false;lock();$('submitProposal').textContent=pending?'Ponovi oddajo istega predloga':'Shrani predlog';}
 };
 function reset(force=false){
  if(busy)return;if(!force&&(getRecord().text||getRecord().point||photo)&&!confirm(saved?'Začnem nov predlog? Shranjeni predlog ostane v zbirki.':pending?'Počistim osnutek? Prejšnja oddaja morda že obstaja; najprej jo lahko preveriš s ponovitvijo oddaje.':'Počistim trenutni osnutek in izbrano mesto?'))return;
  saved=null;pending=null;id=crypto.randomUUID();HTMLFormElement.prototype.reset.call($('proposalForm'));clearPhoto();resetMap();$('saveResult').hidden=true;$('handoffResult').hidden=true;$('stepSave').classList.remove('current');$('submitProposal').textContent='Shrani predlog';error('');lock();
 }
 $('reset').onclick=()=>reset();$('newProposal').onclick=()=>{reset(true);$('grade').focus();};
 $('deleteProposal').onclick=async()=>{
  if(!saved||!confirm('Umaknem ta predlog in njegovi fotografiji iz zbirke?'))return;busy=true;lock();
  try{await api('/school/proposals/'+saved.id,{method:'DELETE'});busy=false;reset(true);toast('Predlog je odstranjen iz zbirke.');}catch(e){error(e.message);}finally{busy=false;lock();}
 };
 $('downloadCard').onclick=()=>{if(!validate())return;const r=pending||getRecord();download('Moja_ideja_za_Savsko_naselje.txt',`NASELJE PO TVOJE\n${r.grade}\n\n${recordText(r,location.origin)}\n\n${saved?'Shranjeno v zasebni zbirki. Oznaka: '+saved.id+'\nDatum: '+saved.created_at:'To je osnutek. Oddaja še ni potrjena; uporabi gumb Shrani predlog.'}\n`,'text/plain;charset=utf-8');};
 $('openSurvey').onclick=()=>{if(!validate())return;const url=surveyUrl(pending||getRecord(),location.origin);$('retrySurvey').href=url;$('handoffResult').hidden=false;window.open(url,'_blank','noopener,noreferrer');};
 $('copyText').onclick=async()=>{try{await navigator.clipboard.writeText(recordText(pending||getRecord(),location.origin));toast('Besedilo je kopirano.');}catch{toast('Kopiranje ni uspelo. Prenesi besedilno kartico.');}};
 $('privacyOpen').onclick=()=>$('aboutDialog').showModal();
 $('submitProposal').hidden=!ODDAJA_VKLOPLJENA;$('deleteProposal').hidden=true;/* fotografija ostane vidna kot neobvezna; oddaja ostane izklopljena */
 if(!ODDAJA_VKLOPLJENA){
  const staticNote=document.createElement('p');staticNote.className='notice';staticNote.textContent='Oddaja v zasebno zbirko še ni vklopljena. Ko jo skrbnik potrdi (kam se shranjuje in kdo vidi), bo gumb Shrani predlog znova na voljo.';$('proposalForm').prepend(staticNote);
 }
 return {isLocked:()=>busy||!!saved||!!pending};
}
