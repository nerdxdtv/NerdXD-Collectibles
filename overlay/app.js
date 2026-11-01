'use strict';
// Preview-only build. No secret, no queue consumption, no writes to the card database.
const CARD_BASE = 'https://nerdxdtv.github.io/NerdXD-Collectibles/cards/';
const CARDS = [
  ['Left Joy-Con 2','common'],['Right Joy-Con 2','common'],['Game Man Advance','common'],
  ['Three Deez Nutz','common'],['Mythical G','common'],['Bowser','uncommon'],
  ['Spider-Man','uncommon'],['Marty McFly','uncommon'],['Wheek Wheeks','uncommon'],
  ['Chris','rare'],['Middest Pizza','rare'],['2026 Family Halloween','legendary']
];
const COLORS={common:'#b8d3c0',uncommon:'#25ed85',rare:'#79b2ff',legendary:'#ffbd46'};
const stage=document.getElementById('stage'),card=document.getElementById('card');
const backImage=document.getElementById('backImage'),frontImage=document.getElementById('frontImage');
const params=new URLSearchParams(location.search);
const frames=[];
function resize(){stage.style.transform=`scale(${innerWidth/2560},${innerHeight/1080})`;}
window.addEventListener('resize',resize);resize();
backImage.src=CARD_BASE+'card-back.png';
function show(data){
 const id=Number(data.id);if(!Number.isInteger(id)||id<1||id>12)return;
 const [title,rarity]=CARDS[id-1];
 frontImage.src=CARD_BASE+String(id).padStart(2,'0')+'.png';
 stage.style.setProperty('--accent',COLORS[rarity]);
 document.getElementById('headline').textContent=data.duplicate?'DUPLICATE CARD!':'NEW CARD!';
 document.getElementById('viewer').textContent=String(data.viewer||'NerdXD Viewer').slice(0,60);
 document.getElementById('detail').textContent=`${title} · ${rarity}${data.duplicate?' · x'+Math.max(2,Number(data.quantity)||2):''}`;
 stage.classList.remove('active');void stage.offsetWidth;stage.classList.add('active');
 setTimeout(()=>stage.classList.remove('active'),7100);
}
// Demo query: /overlay/?demo=7&viewer=NerdXD . No production polling until queue is integrated.
if(params.has('demo')){
 const id=Number(params.get('demo'));
 const duplicate=params.get('duplicate')==='1';
 frontImage.addEventListener('load',()=>show({id,viewer:params.get('viewer')||'NerdXD',duplicate,quantity:2}),{once:true});
 frontImage.src=CARD_BASE+String(id).padStart(2,'0')+'.png';
}
