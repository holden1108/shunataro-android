import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export const mat = (color, extra={}) => new THREE.MeshStandardMaterial({color,roughness:.82,...extra});
export const materials = {wood:mat('#bd905b'),darkWood:mat('#80613c'),cream:mat('#e8dfc5'),green:mat('#7a8a53'),metal:mat('#526d66',{metalness:.35,roughness:.4})};
export function mesh(parent,geometry,material,x=0,y=0,z=0){const m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
export function ball(p,x,y,z,sx,sy,sz,color){return mesh(p,new THREE.SphereGeometry(1,24,16),typeof color==='string'?mat(color):color,x,y,z).scale.set(sx,sy,sz),p.children.at(-1);}
export function box(p,x,y,z,w,h,d,color,r=.05){return mesh(p,new RoundedBoxGeometry(w,h,d,3,Math.min(r,w/3,h/3,d/3)),typeof color==='string'?mat(color):color,x,y,z);}
export function cylinder(p,x,y,z,rt,rb,h,color){return mesh(p,new THREE.CylinderGeometry(rt,rb,h,48),typeof color==='string'?mat(color):color,x,y,z);}
export function torus(p,x,y,z,r,t,color){return mesh(p,new THREE.TorusGeometry(r,t,10,64),typeof color==='string'?mat(color):color,x,y,z);}
export function group(parent,x=0,y=0,z=0){const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);return g;}
export function label(p,text,x,y,z,w=1,h=.4,color='#5d4937',bg='#efe5ca'){
 const c=document.createElement('canvas');c.width=512;c.height=192;const ctx=c.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,512,192);ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold 55px sans-serif';ctx.fillText(text,256,99);const tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;return mesh(p,new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:tx,roughness:1}),x,y,z);
}
export function woodTexture(){const c=document.createElement('canvas');c.width=512;c.height=256;const ctx=c.getContext('2d');ctx.fillStyle='#bc915f';ctx.fillRect(0,0,512,256);let seed=39;const random=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};for(let i=0;i<190;i++){const y=random()*256;ctx.strokeStyle=`rgba(${random()>.5?'77,43,20':'244,214,160'},${.05+random()*.16})`;ctx.lineWidth=.4+random()*1.5;ctx.beginPath();ctx.moveTo(0,y);for(let x=0;x<=512;x+=8)ctx.lineTo(x,y+Math.sin(x*.025+i)*2+Math.sin(x*.009+i)*4);ctx.stroke();}const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
