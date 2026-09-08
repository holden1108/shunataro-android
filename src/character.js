import * as THREE from 'three';
import {ball,box,cylinder,group,mat} from './world/primitives.js';

export function createDog(scene){
 const root=group(scene,0,.13,1);const body=group(root);const salt=mat('#aaada5'),pepper=mat('#696e69'),light=mat('#e3e3d5'),nose=mat('#333b37',{roughness:.46});
 ball(body,0,.62,0,.33,.45,.24,pepper);ball(body,0,.66,.11,.29,.32,.21,'#acb39a');
 // Linen apron, pocket, and strap.
 box(body,0,.66,.263,.38,.39,.045,'#c5c4a0',.065);box(body,0,.61,.294,.18,.12,.018,'#acaf88');
 const legs=[group(body,-.18,.28,0),group(body,.18,.28,0)];legs.forEach(g=>{ball(g,0,-.08,0,.135,.22,.14,salt);ball(g,0,-.17,.07,.15,.12,.19,light);});
 const arms=[group(body,-.31,.85,0),group(body,.31,.85,0)];arms.forEach((g,i)=>{g.rotation.z=i?.15:-.15;ball(g,0,-.17,0,.115,.23,.115,salt);ball(g,0,-.31,.025,.12,.12,.13,light);});
 const head=group(body,0,1.24,.035);ball(head,0,0,0,.43,.41,.35,salt);ball(head,0,.11,-.08,.37,.3,.29,pepper);
 const ears=[group(head,-.37,.19,-.04),group(head,.37,.19,-.04)];ears.forEach((g,i)=>{g.rotation.z=i?.23:-.23;ball(g,0,-.14,0,.15,.29,.1,pepper);ball(g,0,-.18,.074,.087,.16,.026,'#92938a');});
 const eyes=[];for(const s of [-1,1]){const eye=ball(head,s*.165,.055,.309,.056,.064,.032,nose);eyes.push(eye);ball(head,s*.165-.012,.075,.339,.013,.016,.008,'#fffbed');const brow=ball(head,s*.177,.164,.316,.151,.066,.065,light);brow.rotation.z=s*.17;}
 const jaw=group(head,0,-.15,.31);ball(jaw,0,-.035,0,.26,.19,.12,light);
 for(const s of [-1,1]){const beard=ball(jaw,s*.15,.045,.045,.16,.11,.115,light);beard.rotation.z=s*.2;for(let i=0;i<3;i++)ball(jaw,s*(.095+i*.044),-.13+Math.abs(i-1)*.013,.015,.047,.08,.06,light);}
 ball(head,0,-.073,.415,.098,.067,.055,nose);ball(head,-.022,-.056,.46,.027,.012,.005,'#7b8078');
 const tail=group(body,0,.61,-.22);tail.rotation.x=-.5;ball(tail,0,.12,-.03,.085,.2,.085,pepper);ball(tail,0,.27,-.03,.088,.087,.087,light);
 // Center the open book between both paws, with pages facing the eyes.
 const props={};const book=group(body,0,.7,.38);book.rotation.x=-.35;
 for(const side of [-1,1]){
  const leaf=group(book);leaf.rotation.z=side*.1;
  box(leaf,side*.13,-.024,0,.26,.025,.34,'#63795d',.012);
  box(leaf,side*.128,0,0,.24,.024,.31,'#eee4c9',.008);
  for(let line=0;line<6;line++)box(leaf,side*.128,.013,-.105+line*.037,.17,.002,.004,'#b5ac91',.001);
 }
 box(book,0,-.022,0,.026,.032,.34,'#52664c',.009);props.read=book;
 const meat=group(arms[1],0,-.34,.14);ball(meat,0,0,0,.13,.1,.18,'#a66943');cylinder(meat,0,0,.19,.035,.035,.2,'#e6d6b2').rotation.x=Math.PI/2;props.eat=meat;
 const spoon=group(arms[1],0,-.33,.17);cylinder(spoon,0,0,.07,.02,.02,.34,'#b58f5b').rotation.x=Math.PI/2;ball(spoon,0,0,.27,.066,.026,.095,'#b58f5b');props.cook=spoon;
 const broom=group(arms[1],0,-.3,.05);cylinder(broom,0,-.07,0,.024,.024,.85,'#b49465');box(broom,0,-.49,0,.3,.22,.12,'#c7ac6f');props.clean=broom;
 Object.values(props).forEach(p=>p.visible=false);
 return {root,body,head,ears,eyes,jaw,arms,legs,tail,props};
}

export function animateDog(d,time,dt,state){
 const action=state.phase==='acting'?state.action:null;const walking=state.phase==='walking';const stride=Math.sin(time*9);
 const blend=Math.min(dt*5,1);const seated=action==='read',sleeping=action==='sleep';
 d.body.position.x=THREE.MathUtils.lerp(d.body.position.x,seated?.142:0,blend);
 d.body.position.z=THREE.MathUtils.lerp(d.body.position.z,seated?-1.06:sleeping?.1:0,blend);
 const height=seated?.66:sleeping?.48:walking?Math.abs(stride)*.04:Math.sin(time*2)*.008;
 d.body.position.y=THREE.MathUtils.lerp(d.body.position.y,height,blend);d.body.rotation.z=walking?Math.sin(time*4.5)*.035:0;d.body.rotation.x=THREE.MathUtils.lerp(d.body.rotation.x,sleeping?Math.PI/2:0,blend);
 d.head.rotation.set(action==='read'?.22:action==='sleep'?.17:0,Math.sin(time*.8)*.045,action==='sleep'?.12:Math.sin(time*1.4)*.025);
 d.ears.forEach((e,i)=>e.rotation.z=(i?.23:-.23)+Math.sin(time*(walking?9:2.5)+i)*.075);
 d.tail.rotation.z=Math.sin(time*(action==='eat'?11:5))*.3;
 d.legs.forEach((l,i)=>l.rotation.x=walking?stride*(i?-.55:.55):seated?-1.1:0);
 d.arms.forEach((a,i)=>{a.rotation.x=walking?stride*(i?.45:-.45):0;a.rotation.z=i?.15:-.15;});
 Object.entries(d.props).forEach(([id,p])=>p.visible=id===action);
 d.jaw.scale.y=action==='eat'?1+Math.sin(time*12)*.12:1;
 if(action==='eat'){d.arms[1].rotation.x=-1.25+Math.sin(time*4)*.22;d.head.rotation.x=Math.sin(time*8)*.045;}
 if(action==='cook'){d.arms[1].rotation.x=-.85+Math.sin(time*3)*.25;d.arms[1].rotation.z=Math.sin(time*2)*.2;if(time%7>5)d.arms[1].rotation.x=-1.5;}
 if(action==='read'){
  d.arms.forEach((arm,i)=>{arm.rotation.x=-1.05;arm.rotation.z=i?-.18:.18;});
  d.head.rotation.x=.3;d.head.rotation.y=Math.sin(time*.8)*.055;
 }
 if(action==='clean'){d.arms[1].rotation.x=-.2+Math.sin(time*4)*.45;d.body.rotation.z=Math.sin(time*4)*.08;}
 const blink=action==='sleep'||time%4.7>4.52;d.eyes.forEach(e=>e.scale.y=blink?.009:.064);
}
