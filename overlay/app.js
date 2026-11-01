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
function resize(){stage.style.transform=`scale(${innerWidth/2560},${innerHeight/1080})`;}
window.addEventListener('resize',resize);resize();
backImage.src=CARD_BASE+'card-back.png';
function show(data){
 const id=Number(data.id);if(!Number.isInteger(id)||id<1||id>12)return;
 const [title,rarity]=CARDS[id-1];
 const source=CARD_BASE+String(id).padStart(2,'0')+'.png';
 // Never start the flip before the front image is loaded.
 const preload=new Image();
 preload.onload=()=>{
  frontImage.src=source;
  stage.style.setProperty('--accent',COLORS[rarity]);
  document.getElementById('headline').textContent=data.duplicate?'DUPLICATE CARD!':'NEW CARD!';
  document.getElementById('viewer').textContent=String(data.viewer||'NerdXD Viewer').slice(0,60);
  document.getElementById('detail').textContent=`${title} · ${rarity}${data.duplicate?' · x'+Math.max(2,Number(data.quantity)||2):''}`;
  clearTimeout(hideTimer);
  stage.classList.remove('active');void stage.offsetWidth;stage.classList.add('active');
  hideTimer=setTimeout(()=>stage.classList.remove('active'),7100);
 };
 preload.onerror=()=>console.error('Unable to load card image:',source);
 preload.src=source;
}
if(params.has('demo')){
 show({id:Number(params.get('demo')),viewer:params.get('viewer')||'NerdXD',duplicate:params.get('duplicate')==='1',quantity:2});
}
