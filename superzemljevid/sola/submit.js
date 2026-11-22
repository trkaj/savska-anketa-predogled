import {api,upload,preparePhoto,download} from './data.mjs';
import {recordText,surveyUrl} from './core.mjs';
const $=id=>document.getElementById(id);
export function attachSubmission({getRecord,validate,resetMap,toast}){
 let id=crypto.randomUUID(),photo=null,photoUrl=null,photoSequence=0,photoBusy=false,busy=false,saved=null,pending=null;
 const error=message=>{$('formError').textContent=message;$('formError').hidden=!message;};
 function lock(){
  for(const e of $('proposalForm').querySelectorAll('input,select,textarea,button'))e.disabled=busy||!!saved||!!pending;
  for(const name of ['reset','newProposal','downloadCard','openSurvey','copyText','deleteProposal'])$(name).disabled=busy||photoBusy;
  $('submitProposal').disabled=busy||photoBusy||!!saved;
  $('submitProposal').hidden=!!saved;
 }
 function clearPhoto(){++photoSequence;photo=null;photoBusy=false;if(photoUrl)URL.revokeObjectURL(photoUrl);photoUrl=null;$('photoPreview').removeAttribute('src');$('photoPreview').hidden=true;$('removePhoto').hidden=true;$('photoConsentLabel').hidden=true;$('photoConsent').required=false;$('photoConsent').checked=false;$('aiRequested').checked=false;$('photoStatus').textContent='';$('cameraPhoto').value='';$('galleryPhoto').value='';lock();}
 async function addPhoto(file){
  if(!file||busy||saved||pending)return;clearPhoto();photoBusy=true;const sequence=++photoSequence;lock();error('');$('photoStatus').textContent='Pripravljam fotografijo …';
  try{const blob=await preparePhoto(file);if(sequence!==photoSequence)return;photo=blob;photoUrl=URL.createObjectURL(blob);$('photoPreview').src=photoUrl;$('photoPreview').hidden=false;$('removePhoto').hidden=false;$('photoConsentLabel').hidden=false;$('photoConsent').required=true;$('photoStatus').textContent=`Pripravljena · ${Math.ceil(blob.size/1024)} kB. Shrani se ob oddaji predloga.`;}
  catch(e){if(sequence===photoSequence){error(e.message);$('photoStatus').textContent='Fotografija ni dodana.';}}
  finally{if(sequence===photoSequence){photoBusy=false;lock();}}
 }
 $('cameraPhoto').onchange=e=>addPhoto(e.target.files[0]);$('galleryPhoto').onchange=e=>addPhoto(e.target.files[0]);$('removePhoto').onclick=clearPhoto;
 $('proposalForm').onsubmit=async e=>{
  e.preventDefault();error('Oddaja v zasebno zbirko še ni vklopljena.');return;if(busy||photoBusy||saved||!validate())return;
  if(!pending&&$('aiRequested').checked&&!photo){error('Za fotomontažo dodaj fotografijo prostora. Predlog lahko oddaš tudi brez te želje.');return;}
  if(!pending&&(!$('consent').checked||(photo&&!$('photoConsent').checked))){error('Preberi in potrdi oddajo predloga ter fotografije.');return;}
  busy=true;lock();error('');$('submitProposal').textContent='Shranjujem …';
  try{
   // Establish the session cookie before the first write, so a lost response can be retried safely.
   await api('/session');
   if(!pending){const r=getRecord();pending={...r,id,longitude:r.point[0],latitude:r.point[1],location:r.place,description:r.text,residence:$('residence').value||null,safety:$('safety').value?Number($('safety').value):null,ai_requested:$('aiRequested').checked,consent:true,photo_consent:$('photoConsent').checked,website:$('website').value};}
   const form=new FormData();form.set('proposal',JSON.stringify(pending));if(photo)form.set('photo',photo,'izvirnik.jpg');
   saved=await upload('/school/proposals',form,n=>{$('submitProposal').textContent=n<100?`Nalagam ${n} % …`:'Potrjujem shranjevanje …';});
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
 $('submitProposal').hidden=true;$('deleteProposal').hidden=true;/* fotografija ostane vidna kot neobvezna; oddaja ostane izklopljena */
 const staticNote=document.createElement('p');staticNote.className='notice';staticNote.textContent='Oddaja v zasebno zbirko še ni vklopljena. Ko jo skrbnik potrdi (kam se shranjuje in kdo vidi), bo gumb Shrani predlog znova na voljo.';$('proposalForm').prepend(staticNote);
 return {isLocked:()=>busy||!!saved||!!pending};
}
