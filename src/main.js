import './style.css';
// 日本語フォントをアプリに同梱する。オフライン起動でも書体が変わらない。
import '@fontsource/zen-maru-gothic/latin-500.css';
import '@fontsource/zen-maru-gothic/japanese-500.css';
import '@fontsource/zen-maru-gothic/latin-700.css';
import '@fontsource/zen-maru-gothic/japanese-700.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createRoom } from './world/room.js';
import { createFurniture } from './world/furniture.js';
import { createDog, animateDog } from './character.js';
import { ACTIONS, Behavior } from './behavior.js';
import { registerAgentTools } from './agent-tools.js';

const icon=(paths)=>`<svg viewBox="0 0 24 24" aria-hidden="true">${paths}</svg>`;
const homeIcon=icon('<path d="m3 11 9-8 9 8M6 9v11h12V9M10 20v-7h4v7"/>');
document.querySelector('#app').innerHTML=`<main class="app">
 <header><div class="brand"><div class="brand-mark" aria-hidden="true">♧</div><div><div class="eyebrow">A LITTLE LIFE, A LITTLE HOME</div><h1>しゅな太郎の穴ぐら暮らし</h1></div></div><div class="weather"><span class="sun">☼</span><div>ひだまりの午後<small>きょうも、のんびり。</small></div></div></header>
 <section class="stage" aria-label="しゅな太郎の3Dのお部屋"><div class="scene-caption"><span class="live">LIVE</span><strong>小さなおうちの、大切な時間。</strong>家具を選んで、暮らしをのぞこう。</div><div id="bubble" class="bubble">今日は、なにをしようかな。</div><div id="paused" class="paused-tag hidden">時間をとめています</div></section>
 <aside class="profile"><div class="overline">ここの住人</div><h2>しゅな太郎</h2><p>ミニチュアシュナウザー</p><div class="mood">♡ ごきげん、しっぽもゆらゆら</div><div class="status" role="status" aria-live="polite"><span class="status-dot"></span><span id="status">のんびりしています</span></div><div class="progress" aria-hidden="true"><span id="progress"></span></div></aside>
 <div class="hint">ドラッグで回転　·　スクロールでズーム</div>
 <div class="view-controls"><button class="icon-button" id="zoom-in" aria-label="拡大" title="拡大">+</button><button class="icon-button" id="zoom-out" aria-label="縮小" title="縮小">−</button><button class="icon-button" id="reset-view" aria-label="最初の視点に戻す" title="最初の視点に戻す">${homeIcon}</button></div>
 <nav class="dock-wrap" aria-label="しゅな太郎の行動"><div class="dock-title">しゅな太郎、なにする？</div><div class="dock"><button class="action active" id="auto" aria-pressed="true"><span class="glyph">♧</span><span class="label">おまかせ</span></button>${ACTIONS.map(a=>`<button class="action" data-action="${a.id}" aria-pressed="false"><span class="glyph">${a.icon}</span><span class="label">${a.label}</span></button>`).join('')}<span class="divider"></span><button class="action pause" id="pause" aria-pressed="false"><span class="glyph" id="pause-icon">Ⅱ</span><span class="label" id="pause-label">一時停止</span></button></div></nav><span class="corner-note">SHUNATARO'S LITTLE BURROW</span>
 </main>`;

const stage=document.querySelector('.stage');
// タッチ端末では描画負荷を下げる。発熱とコマ落ちの対策。
const lowPower=matchMedia('(pointer:coarse)').matches;
let renderer;
try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});}catch(e){stage.insertAdjacentHTML('beforeend','<div class="error"><h2>3Dのお部屋を開けませんでした</h2><p>ブラウザのハードウェアアクセラレーションを有効にして、もう一度開いてください。</p></div>');throw e;}
renderer.setPixelRatio(Math.min(window.devicePixelRatio,lowPower?1.5:2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;stage.prepend(renderer.domElement);
const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(36,1,.1,80);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.enablePan=false;controls.minDistance=9;controls.maxDistance=24;controls.minPolarAngle=.45;controls.maxPolarAngle=1.42;controls.minAzimuthAngle=-1.18;controls.maxAzimuthAngle=1.18;controls.target.set(0,1.0,0);
function resetView(){const mobile=stage.clientWidth<650;camera.position.set(mobile?8.2:9, mobile?10.5:9.8,mobile?18.6:16.5);controls.target.set(0,1.15,0);controls.update();}resetView();
scene.add(new THREE.HemisphereLight('#fff6dc','#a1a889',2.35));
const key=new THREE.DirectionalLight('#fff0d6',3.3);key.position.set(-3,9,6);key.castShadow=true;key.shadow.mapSize.set(lowPower?1024:2048,lowPower?1024:2048);Object.assign(key.shadow.camera,{left:-7,right:7,top:7,bottom:-7,near:.1,far:25});key.shadow.bias=-.0005;key.shadow.normalBias=.04;key.shadow.radius=4;scene.add(key);
const fill=new THREE.DirectionalLight('#e4edce',1);fill.position.set(5,4,-3);scene.add(fill);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.11}));ground.rotation.x=-Math.PI/2;ground.position.y=-.74;ground.receiveShadow=true;scene.add(ground);
createRoom(scene);const furniture=createFurniture(scene);const dog=createDog(scene);
const status=document.querySelector('#status'),bubble=document.querySelector('#bubble');
function updateUI(state){const a=ACTIONS.find(a=>a.id===state.action);status.textContent=state.phase==='walking'?`${a.label}の場所へ、てくてく`:state.phase==='acting'?a.status:'ほっと、ひと休み';bubble.textContent=state.phase==='walking'?'よいしょ、よいしょ。':state.phase==='acting'?a.thought:'次は、なにをしようかな。';document.querySelector('#auto').classList.toggle('active',state.auto);document.querySelector('#auto').setAttribute('aria-pressed',String(state.auto));document.querySelectorAll('[data-action]').forEach(b=>{const active=b.dataset.action===state.action&&state.phase!=='idle';b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});}
const behavior=new Behavior(furniture,updateUI);behavior.choose('read',dog.root.position,false);
function choose(id){behavior.choose(id,dog.root.position,true);}
document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>choose(b.dataset.action)));
document.querySelector('#auto').addEventListener('click',()=>behavior.setAuto(dog.root.position));
function togglePause(){behavior.paused=!behavior.paused;document.querySelector('#paused').classList.toggle('hidden',!behavior.paused);document.querySelector('#pause-icon').textContent=behavior.paused?'▷':'Ⅱ';document.querySelector('#pause-label').textContent=behavior.paused?'再開':'一時停止';document.querySelector('#pause').setAttribute('aria-pressed',String(behavior.paused));}
document.querySelector('#pause').addEventListener('click',togglePause);
registerAgentTools(behavior,dog.root.position,choose,togglePause);
document.addEventListener('keydown',e=>{if(e.code==='Space'&&e.target===document.body){e.preventDefault();togglePause();}});
function zoom(factor){const delta=camera.position.clone().sub(controls.target);delta.setLength(THREE.MathUtils.clamp(delta.length()*factor,controls.minDistance,controls.maxDistance));camera.position.copy(controls.target).add(delta);controls.update();}
document.querySelector('#zoom-in').addEventListener('click',()=>zoom(.85));document.querySelector('#zoom-out').addEventListener('click',()=>zoom(1.17));document.querySelector('#reset-view').addEventListener('click',resetView);
const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();let pointerStart=null;
function hit(e){const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(pointer,camera);const hits=raycaster.intersectObjects(scene.children,true);return hits.find(h=>h.object.userData.furniture)?.object.userData.furniture;}
renderer.domElement.addEventListener('pointerdown',e=>{pointerStart={x:e.clientX,y:e.clientY};});
renderer.domElement.addEventListener('pointerup',e=>{if(pointerStart&&Math.hypot(pointerStart.x-e.clientX,pointerStart.y-e.clientY)<12){const id=hit(e);if(id)choose(id);}pointerStart=null;});
renderer.domElement.addEventListener('pointercancel',()=>pointerStart=null);
renderer.domElement.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;renderer.domElement.style.cursor=hit(e)?'pointer':'grab';});
const resize=new ResizeObserver(()=>{camera.aspect=stage.clientWidth/stage.clientHeight;camera.updateProjectionMatrix();renderer.setSize(stage.clientWidth,stage.clientHeight);});resize.observe(stage);
// Steam is part of the activity layer, independent of kitchen geometry.
const steam=new THREE.Group();scene.add(steam);for(let i=0;i<5;i++){const puff=new THREE.Mesh(new THREE.SphereGeometry(.07,12,8),new THREE.MeshBasicMaterial({color:'#fff9e6',transparent:true,opacity:.25,depthWrite:false}));steam.add(puff);}
let previous=performance.now(),time=0;const screen=new THREE.Vector3();
renderer.setAnimationLoop(now=>{const dt=Math.min((now-previous)/1000,.05);previous=now;if(!behavior.paused){time+=dt;behavior.update(dt,dog.root.position);const f=furniture.find(f=>f.id===behavior.action);const desired=behavior.phase==='walking'?behavior.heading:behavior.phase==='acting'?f.facing:0;if(Number.isFinite(desired)){const diff=Math.atan2(Math.sin(desired-dog.root.rotation.y),Math.cos(desired-dog.root.rotation.y));dog.root.rotation.y+=diff*Math.min(dt*7,1);}animateDog(dog,time,dt,behavior);}
 steam.visible=behavior.action==='cook'&&behavior.phase==='acting';steam.children.forEach((p,i)=>{const u=(time*.45+i/5)%1;p.position.set(-2.85+Math.sin(time+i)*.09,1.39+u*.75,-1.28);p.scale.setScalar(.7+u*1.5);p.material.opacity=(1-u)*.25;});
 document.querySelector('#progress').style.width=`${behavior.progress*100}%`;controls.update();screen.copy(dog.root.position).add(new THREE.Vector3(0,2.08,0)).project(camera);bubble.style.left=`${(screen.x*.5+.5)*stage.clientWidth}px`;bubble.style.top=`${(-screen.y*.5+.5)*stage.clientHeight}px`;renderer.render(scene,camera);
});
window.addEventListener('pagehide',()=>{renderer.setAnimationLoop(null);resize.disconnect();controls.dispose();renderer.dispose();});
