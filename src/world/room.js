import * as THREE from 'three';
import {ball,box,cylinder,torus,group,mat,mesh,woodTexture,label} from './primitives.js';

export function createRoom(scene){
 const room=group(scene);const wood=mat('#e6c292',{map:woodTexture()});const bark=mat('#997655');
 cylinder(room,0,-.38,0,4.7,4.45,.65,'#96734d');cylinder(room,0,-.06,0,4.52,4.58,.13,'#d6b27d');
 for(let i=-10;i<=10;i++){const z=i*.42;const width=2*Math.sqrt(Math.max(0,4.42**2-z*z));if(width>.1)box(room,0,.025,z,width,.13,.404,wood,.035);}
 // The rear semicircle leaves the entire front open like a cutaway dollhouse.
 const wall=mesh(room,new THREE.CylinderGeometry(4.43,4.43,3.25,64,1,true,Math.PI/2,Math.PI),mat('#d9bc87',{side:THREE.DoubleSide}),0,1.57,0);
 const rim=mesh(room,new THREE.CylinderGeometry(4.58,4.58,3.4,64,1,true,Math.PI/2,Math.PI),bark,0,1.58,0);rim.material.side=THREE.DoubleSide;
 for(let i=0;i<=48;i++){const a=Math.PI/2+i/48*Math.PI;ball(room,Math.sin(a)*4.49,3.28,Math.cos(a)*4.49,.27,.18,.27,i%3===0?'#7b8950':'#89985b');}
 for(let i=0;i<2;i++){const x=i?4.46:-4.46;box(room,x,1.57,0,.2,3.38,.22,'#a28055');}
 // Arched round door on the back wall.
 const door=group(room,-.75,.12,-4.13);cylinder(door,0,1.03,0,1.04,1.04,.13,'#7b6344').rotation.x=Math.PI/2;
 cylinder(door,0,1.03,.09,.87,.87,.09,'#869367').rotation.x=Math.PI/2;
 torus(door,0,1.03,.09,.99,.12,'#ac8252');
 for(let i=-3;i<=3;i++){let x=i*.215;let half=Math.sqrt(.83**2-x*x);box(door,x,1.03,.147,.014,half*2,.015,'#687951',.002);}
 ball(door,.53,.99,.24,.09,.09,.075,'#d6b365');box(door,0,.1,.28,1.65,.15,.5,'#bea071');
 label(door,'SHUNA',0,1.45,.17,.68,.22,'#e7e7ce','#788662');
 // Round window and crossbars.
 const win=group(room,2.02,2.01,-3.78);win.rotation.y=-.35;
 cylinder(win,0,0,0,.62,.62,.1,mat('#ffdf92',{emissive:'#edbf62',emissiveIntensity:.35})).rotation.x=Math.PI/2;
 torus(win,0,0,.08,.64,.085,'#ad875b');box(win,0,0,.12,.07,1.16,.08,'#a48157');box(win,0,0,.12,1.16,.07,.08,'#a48157');box(win,0,-.69,.2,1.48,.12,.45,wood);
 const pot=cylinder(win,-.46,-.48,.21,.14,.1,.24,'#b77551');for(let i=0;i<5;i++){const l=ball(win,-.46+Math.sin(i*2)*.13,-.24+i*.025,.22,.07,.19,.055,'#6e8650');l.rotation.z=Math.sin(i)*.8;}
 // Hanging pendant.
 cylinder(room,0,3.51,-1.0,.018,.018,1.0,'#60573f');cylinder(room,0,3.03,-1,.14,.49,.3,'#67744f');ball(room,0,2.86,-1,.17,.1,.17,mat('#ffe5a3',{emissive:'#ffca67',emissiveIntensity:1.2}));
 const lamp=new THREE.PointLight('#ffc980',20,9,2);lamp.position.set(0,2.75,-1);scene.add(lamp);
 // Woven oval rug.
 const rug=cylinder(room,.0,.12,.85,1.35,1.35,.045,'#ad7952');rug.scale.z=.72;
 for(let i=0;i<10;i++){const t=torus(room,0,.148,.85,.35+i*.096,.018,i%2?'#d1b788':'#c4a273');t.rotation.x=-Math.PI/2;t.scale.y=.72;}
 // A tiny shelf with books and jars.
 const shelf=group(room,-2.87,1.75,-3.02);shelf.rotation.y=.4;box(shelf,0,0,0,1.65,.12,.45,wood);
 for(let i=0;i<5;i++){const b=box(shelf,-.55+i*.2,.3,0,.16,.48+(i%2)*.13,.29,['#9e6e50','#899571','#ceb27d','#607b78','#b78967'][i]);b.rotation.z=(i-2)*.035;}
 cylinder(shelf,.59,.21,0,.15,.15,.31,'#b8c3aa');cylinder(shelf,.59,.39,0,.16,.16,.06,'#92774c');
 // Moss clusters and small mushrooms around the cut edge.
 for(let i=0;i<35;i++){const a=i*2.399;const r=4.5+(i%3)*.16;const x=Math.sin(a)*r,z=Math.cos(a)*r;if(z<-.5||Math.abs(x)>3.9){ball(room,x,-.1,z,.23+(i%3)*.07,.14,.24,['#7d8b52','#97a566','#6e804b'][i%3]);}}
 for(const [x,z,s] of [[-4.5,1,.8],[4.3,1.35,1],[-4.12,1.6,.55]]){cylinder(room,x,.06,z,.04*s,.06*s,.38*s,'#e3d5b5');ball(room,x,.27*s,z,.21*s,.13*s,.21*s,'#b98355');for(let i=0;i<3;i++)ball(room,x+Math.sin(i*2)*.1*s,.34*s,z+Math.cos(i*2)*.09*s,.029*s,.015*s,.029*s,'#e9d6b1');}
 return room;
}
