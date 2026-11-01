'use strict';
const API='https://nerdxd-card-api.kodychristian.workers.dev';
const ASSETS='https://cards.nerdxd.com/';
const form=document.getElementById('search'), input=document.getElementById('username');
const message=document.getElementById('message'), results=document.getElementById('results'), grid=document.getElementById('grid');
const dialog=document.getElementById('detail');
const rarityNames={common:'Common',uncommon:'Uncommon',rare:'Rare',legendary:'Legendary'};
function el(tag,cls,text){let node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;}
async function load(username){message.textContent='Looking up collection…';results.hidden=true;grid.replaceChildren();try{
 const resp=await fetch(`${API}/collection?user=${encodeURIComponent(username)}`,{cache:'no-store'});
 const data=await resp.json();
 if(!resp.ok){message.textContent=resp.status===404?'No collection found yet. Redeem Daily Check-In to start collecting.':(data.error||'Unable to load collection.');return;}
 document.getElementById('viewer').textContent=data.viewer;
 document.getElementById('unique').textContent=`${data.unique_cards}/${data.collection_size}`;
 document.getElementById('total').textContent=data.total_cards;
 document.getElementById('duplicates').textContent=data.duplicates;
 for(const card of data.cards){const owned=card.quantity>0;
  const button=el('button',`card ${card.rarity} ${owned?'':'locked'}`);button.type='button';button.setAttribute('aria-label',owned?`${card.title}, ${card.quantity} owned`:`Card ${card.id}, undiscovered`);
  const img=el('img');img.loading='lazy';img.src=ASSETS+(owned?card.image_path:'cards/card-back.png');img.alt=owned?card.title:'Undiscovered card';button.appendChild(img);
  const info=el('div','info');info.appendChild(el('strong','',owned?card.title:`Card #${String(card.id).padStart(2,'0')} · Locked`));
  info.appendChild(el('small','',owned?`${rarityNames[card.rarity]} · ×${card.quantity}`:'Undiscovered'));
  button.appendChild(info);
  button.addEventListener('click',()=>{document.getElementById('detailImage').src=img.src;document.getElementById('detailImage').alt=img.alt;document.getElementById('detailTitle').textContent=owned?card.title:'Undiscovered';document.getElementById('detailMeta').textContent=owned?`${rarityNames[card.rarity]} · ${card.quantity} owned`:'Keep checking in to discover this card';dialog.showModal();});
  grid.appendChild(button);
 }
 results.hidden=false;message.textContent=`Viewing ${data.viewer}'s collection`;
 }catch(e){message.textContent='Connection error. Please try again.';}}
form.addEventListener('submit',e=>{e.preventDefault();let name=input.value.trim().replace(/^@/,'');if(!/^[A-Za-z0-9_]{1,25}$/.test(name)){message.textContent='Please enter a valid Twitch username.';return;}history.replaceState(null,'',`?user=${encodeURIComponent(name)}`);load(name);});
document.getElementById('close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
const initial=new URLSearchParams(location.search).get('user');if(initial){input.value=initial;load(initial);}
