import * as THREE from 'three';
import {ball,box,cylinder,torus,group,mat,label,woodTexture} from './primitives.js';

// Each entry owns a visual, a walking destination, and an action. Add furniture here.
export function createFurniture(scene){
 const entries=[];const add=(id,name,x,z,build,target,facing=0)=>{const root=group(scene,x,.13,z);build(root);root.traverse(o=>o.userData.furniture=id);entries.push({id,name,root,target,facing});return root;};
 add('cook','くるみのキッチン',-2.85,-1.28,g=>{
  box(g,0,.45,0,1.36,.9,.85,'#899475');box(g,0,.93,0,1.55,.13,1.0,'#caa774');
  box(g,0,.43,.45,1.15,.67,.035,'#6d7b60');box(g,0,.64,.49,.37,.055,.06,'#c8b388');
  cylinder(g,0,1.03,0,.37,.37,.07,'#4a5146');const pan=cylinder(g,0,1.14,0,.32,.25,.19,'#555c51');torus(g,0,1.24,0,.3,.025,'#a0a494').rotation.x=Math.PI/2;box(g,.47,1.17,0,.45,.075,.1,'#6e5740');
  for(let i=0;i<6;i++)ball(g,Math.sin(i*2)*.16,1.24,Math.cos(i*2)*.15,.09,.035,.08,i%2?'#a86643':'#bcb26a');
  cylinder(g,-.57,1.14,-.26,.1,.08,.27,'#be8664');cylinder(g,-.57,1.3,-.26,.11,.11,.045,'#d9c49c');
 },[-1.82,-.7],-Math.PI/2);
 add('eat','ボトルキャップのお皿',1.43,1.5,g=>{
  cylinder(g,0,.29,0,.67,.58,.48,'#b39060');cylinder(g,0,.58,0,.86,.86,.12,'#d3b47e');
  cylinder(g,0,.68,0,.43,.43,.1,mat('#728d83',{metalness:.3}));torus(g,0,.74,0,.42,.045,'#90a89a').rotation.x=Math.PI/2;
  for(let i=0;i<24;i++){const a=i/24*Math.PI*2;box(g,Math.sin(a)*.43,.69,Math.cos(a)*.43,.034,.105,.034,'#607e73',.01);}
  ball(g,0,.77,0,.23,.08,.16,'#9f6541');ball(g,.18,.79,.1,.06,.035,.045,'#e3c599');
 },[.7,2.27],Math.PI*.76);
 add('read','クラシックな木の読書椅子',2.75,-.74,g=>{
  const walnut=mat('#a47b51',{map:woodTexture(),roughness:.58});
  const chair=group(g);chair.rotation.y=-.2;
  // Turned legs and stretchers beneath a rounded solid-wood seat.
  for(const x of [-.36,.36])for(const z of [-.32,.32]){
   cylinder(chair,x,.36,z,.045,.063,.66,walnut);
   for(const y of [.13,.53])ball(chair,x,y,z,.073,.085,.073,walnut);
  }
  for(const x of [-.36,.36])box(chair,x,.28,0,.055,.055,.68,walnut,.025);
  box(chair,0,.28,.32,.74,.055,.055,walnut,.025);
  box(chair,0,.7,0,.94,.16,.87,walnut,.075);
  box(chair,0,.59,.33,.74,.14,.07,walnut,.025);
  for(const x of [-.39,.39]){
   cylinder(chair,x,1.18,-.35,.043,.052,.96,walnut);
   ball(chair,x,1.68,-.35,.07,.075,.07,walnut);
  }
  for(const x of [-.24,-.12,0,.12,.24])cylinder(chair,x,1.18,-.36,.025,.029,.78,walnut);
  const crest=new THREE.CatmullRomCurve3([new THREE.Vector3(-.4,1.58,-.35),new THREE.Vector3(-.23,1.67,-.36),new THREE.Vector3(0,1.7,-.37),new THREE.Vector3(.23,1.67,-.36),new THREE.Vector3(.4,1.58,-.35)]);
  const rail=new THREE.Mesh(new THREE.TubeGeometry(crest,24,.058,10,false),walnut);rail.castShadow=true;rail.receiveShadow=true;chair.add(rail);
  const books=group(g,.7,.05,.52);box(books,0,.07,0,.57,.12,.42,'#b37c53');box(books,.02,.18,0,.53,.1,.39,'#76886d');
 },[2.4,.27],-.2);
 add('sleep','マッチ箱のベッド',.95,-2.75,g=>{
  box(g,0,.19,0,1.65,.37,1.4,'#b5714f');box(g,0,.39,.02,1.52,.18,1.3,'#e8d9b7');
  box(g,0,.51,-.42,1.2,.23,.39,'#f0e7cb',.12);box(g,0,.53,.27,1.47,.18,.74,'#a4ae7d',.07);
  for(let i=-3;i<=3;i++)box(g,i*.19,.628,.29,.02,.012,.68,'#c4ca9a',.002);
  label(g,'LITTLE MATCH',0,.2,.708,1.1,.19,'#f5e7bd','#b5714f');
 },[.93,-1.71],Math.PI);
 add('clean','どんぐりのお掃除道具',-2.7,1.88,g=>{
  cylinder(g,0,.23,0,.3,.24,.45,'#9c9c7d');torus(g,0,.47,0,.29,.035,'#c3c5a5').rotation.x=Math.PI/2;
  const handle=torus(g,0,.62,0,.27,.022,'#656f62');handle.scale.y=1.15;
  const broom=group(g,.46,0,0);broom.rotation.z=-.2;cylinder(broom,0,.7,0,.025,.025,1.3,'#a88c60');box(broom,0,.13,0,.36,.26,.16,'#d1b575');
  for(let i=-3;i<=3;i++)box(broom,i*.044,.1,.09,.012,.2,.015,'#a28b54',.003);
 },[-1.8,1.45],-.7);
 return entries;
}
