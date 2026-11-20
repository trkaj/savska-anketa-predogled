export const STATUS_NAMES={new:'Novo',reviewed:'Pregledano',prepare_visual:'Za fotomontažo',visual_ready:'Fotomontaža dodana',closed:'Zaključeno'};
const STATIC_NOTE='Oddaja pobud tukaj ni na voljo.';
export async function api(){throw Error(STATIC_NOTE);}
export function upload(){return Promise.reject(Error(STATIC_NOTE));}
export async function preparePhoto(file){
 if(!file||file.size>25*1024*1024)throw Error('Izberi fotografijo do 25 MB.');
 let bitmap;
 if(typeof createImageBitmap==='function'){try{bitmap=await createImageBitmap(file);}catch{}}
 if(!bitmap){const url=URL.createObjectURL(file);try{bitmap=await new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(Error('Format ni podprt. Izberi JPEG ali PNG; HEIC lahko pretvoriš v telefonu.'));img.src=url;});}finally{URL.revokeObjectURL(url);}}
 const scale=Math.min(1,1920/Math.max(bitmap.width,bitmap.height)),canvas=document.createElement('canvas');
 canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));
 const context=canvas.getContext('2d');context.fillStyle='#fff';context.fillRect(0,0,canvas.width,canvas.height);context.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close?.();
 const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',.85));
 if(!blob||blob.size>3*1024*1024)throw Error('Fotografije ni mogoče pripraviti. Poskusi manjšo.');return blob;
}
export function download(name,content,type){const url=URL.createObjectURL(content instanceof Blob?content:new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}
export function aiPrompt(r){return `NAVODILO ZA FOTOMONTAŽO — NASELJE PO TVOJE\nPredlog: ${r.id}\nLokacija: ${r.location}\nWGS84: ${r.latitude}, ${r.longitude}\n\nIzvorna fotografija: izvirnik.jpg (pomanjšana, brez lokacijskih metapodatkov).\nŽelja učenca, ki jo skrbnik pred uporabo pregleda:\n${r.description}\n\nPripravi vizualno ponazoritev predloga na priloženi fotografiji. Ohrani zorni kot, obstoječe stavbe in razmerja prostora. Dodaj samo elemente iz opisa; manjkajočih mer, dovoljenj ali lastništva ne predpostavljaj. Ne dodajaj prepoznavnih ljudi.\n\nKončni izdelek jasno označi: »IDEJNA FOTOMONTAŽA — PREDLOG, NE DEJANSKO STANJE«.\n\nTo je navodilo za ročno uporabo z izbranim orodjem. Datoteka ni bila samodejno poslana AI-storitvi. Fotomontaža ne spreminja 3D-modela GURS in ni 3D-rekonstrukcija.\n`;}
export function csv(rows){const cols=['id','grade','kind','topic','description','residence','safety','location','latitude','longitude','ai_requested','status','admin_note','created_at','has_photo','has_visual'];const cell=v=>'"'+String(v??'').replace(/^[\s]*[=+@-]/,m=>"'"+m).replaceAll('"','""')+'"';return '\uFEFF'+[cols.join(','),...rows.map(r=>cols.map(k=>cell(r[k])).join(','))].join('\r\n');}
export function geojson(rows){return {type:'FeatureCollection',features:rows.map(r=>({type:'Feature',geometry:{type:'Point',coordinates:[r.longitude,r.latitude]},properties:{id:r.id,grade:r.grade,kind:r.kind,topic:r.topic,text:r.description,place:r.location,status:r.status,ai_requested:!!r.ai_requested}}))};}

// Small, dependency-free ZIP writer (uncompressed STORE entries, UTF-8 names).
// Source photos are already JPEG-compressed. The limits avoid unbounded browser memory use.
const crcTable=Uint32Array.from({length:256},(_,n)=>{for(let k=0;k<8;k++)n=(n&1)?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
function crc32(bytes){let n=0xffffffff;for(const b of bytes)n=crcTable[(n^b)&255]^(n>>>8);return (n^0xffffffff)>>>0;}
export async function zip(files){
 const pieces=[],central=[];let offset=0,total=0;
 if(files.length>500)throw Error('Za en ZIP izberi manj datotek.');
 for(const file of files){
  if(!/^[a-zA-Z0-9_./-]+$/.test(file.name)||file.name.includes('..')||file.name.startsWith('/'))throw Error('Neveljavno ime datoteke.');
  const name=new TextEncoder().encode(file.name),bytes=typeof file.data==='string'?new TextEncoder().encode(file.data):new Uint8Array(await new Blob([file.data]).arrayBuffer());
  total+=bytes.length;if(total>80*1024*1024)throw Error('ZIP bi presegel 80 MB. Zmanjšaj izbor predlogov.');
  const crc=crc32(bytes),local=new Uint8Array(30),l=new DataView(local.buffer);l.setUint32(0,0x04034b50,true);l.setUint16(4,20,true);l.setUint16(6,0x800,true);l.setUint32(14,crc,true);l.setUint32(18,bytes.length,true);l.setUint32(22,bytes.length,true);l.setUint16(26,name.length,true);pieces.push(local,name,bytes);
  const dir=new Uint8Array(46),d=new DataView(dir.buffer);d.setUint32(0,0x02014b50,true);d.setUint16(4,20,true);d.setUint16(6,20,true);d.setUint16(8,0x800,true);d.setUint32(16,crc,true);d.setUint32(20,bytes.length,true);d.setUint32(24,bytes.length,true);d.setUint16(28,name.length,true);d.setUint32(42,offset,true);central.push(dir,name);offset+=30+name.length+bytes.length;
 }
 const size=central.reduce((n,v)=>n+v.length,0),end=new Uint8Array(22),e=new DataView(end.buffer);e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,size,true);e.setUint32(16,offset,true);
 return new Blob([...pieces,...central,end],{type:'application/zip'});
}
