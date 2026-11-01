'use strict';
// Preview only. Never contains your API secret or awards a card.
const CARD_BASE = 'https://nerdxdtv.github.io/NerdXD-Collectibles/cards/';
const CARDS = [
 ['Left Joy-Con 2','common'],['Right Joy-Con 2','common'],['Game Man Advance','common'],
 ['Three Deez Nutz','common'],['Mythical G','common'],['Bowser','uncommon'],
 ['Spider-Man','uncommon'],['Marty McFly','uncommon'],['Wheek Wheeks','uncommon'],
 ['Chris','rare'],['Middest Pizza','rare'],['2026 Family Halloween','legendary']
];
const COLORS={common:'#b8d3c0',uncommon:'#25ed85',rare:'#79b2ff',legendary:'#ffbd46'};
const stage=document.getElementById('stage');
const backImage=document.getElementById('backImage');
const frontImage=document.getElementById('frontImage');
const params=new URLSearchParams(location.search);
let hideTimer;
let revealBusy=false;
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function resize(){stage.style.transform=`scale(${innerWidth/2560},${innerHeight/1080})`;}
window.addEventListener('resize',resize);resize();
backImage.src=CARD_BASE+'card-back.png';
function show(data){
 const id=Number(data.id);if(!Number.isInteger(id)||id<1||id>12)return;
 const [title,rarity]=CARDS[id-1];
 const source=CARD_BASE+String(id).padStart(2,'0')+'.png';
 // Never start the flip before the front image is loaded.
 return new Promise((resolve,reject)=>{
 const preload=new Image();
 preload.onload=()=>{
  frontImage.src=source;
  stage.style.setProperty('--accent',COLORS[rarity]);
  document.getElementById('headline').textContent=data.duplicate?'DUPLICATE CARD!':'NEW CARD!';
  document.getElementById('viewer').textContent=String(data.viewer||'NerdXD Viewer').slice(0,60);
  document.getElementById('detail').textContent=`${title} · ${rarity}${data.duplicate?' · x'+Math.max(2,Number(data.quantity)||2):''}`;
  clearTimeout(hideTimer);
  stage.classList.remove('active');void stage.offsetWidth;stage.classList.add('active');
  hideTimer=setTimeout(()=>{stage.classList.remove('active');resolve();},7100);
 };
 preload.onerror=()=>{console.error('Unable to load card image:',source);reject(new Error('Missing card art'));};
 preload.src=source;
 });
}
if(params.has('demo')){
 show({id:Number(params.get('demo')),viewer:params.get('viewer')||'NerdXD',duplicate:params.get('duplicate')==='1',quantity:2});
}

// Live queue only when no demo parameter. A separate, scoped reveal token is stored
// in the OBS Browser Source URL fragment. Never put CARD_API_SECRET here.
const config=new URLSearchParams(location.hash.replace(/^#/,''));
const apiBase=(config.get('api')||'').replace(/\/$/,'');
const revealToken=config.get('token')||'';
async function queueRequest(path,body={}) {
 const response=await fetch(apiBase+path,{
  method:'POST',headers:{'Authorization':'Bearer '+revealToken,'Content-Type':'application/json'},
  body:JSON.stringify(body),cache:'no-store'
 });
 if(!response.ok) throw new Error(path+' returned '+response.status);
 return await response.json();
}
async function pollQueue(){
 if(revealBusy||document.visibilityState==='hidden') return;
 revealBusy=true;
 try{
  const claimed=await queueRequest('/reveal/claim');
  if(claimed.status!=='claimed')return;
  const data=claimed.reveal;
  try{
   await show(data);
   await queueRequest('/reveal/ack',{redemption_id:data.redemption_id,lease_id:data.lease_id});
  }catch(err){console.error('Reveal not acknowledged; will be retried after lease expires',err);}
 }catch(error){console.error('Reveal poll failed',error);}
 finally{revealBusy=false;}
}
if(!params.has('demo')&&apiBase&&revealToken){
 setInterval(pollQueue,2500);
 pollQueue();
}
