export const ACTIONS=[
 {id:'cook',label:'お料理',icon:'♨',status:'おなべを、ことこと',thought:'味見をちょっぴり。',duration:16},
 {id:'eat',label:'ごはん',icon:'🍖',status:'お肉を、もぐもぐ',thought:'うん、おいしい！',duration:14},
 {id:'read',label:'読書',icon:'▤',status:'物語のつづきを読書中',thought:'この先、どうなるのかな。',duration:18},
 {id:'sleep',label:'お昼寝',icon:'☾',status:'すやすや、お昼寝中',thought:'すぅ… すぅ…',duration:22},
 {id:'clean',label:'お掃除',icon:'✧',status:'お部屋を、さっさっ',thought:'きれいになると、うれしいね。',duration:14},
];
export class Behavior {
 constructor(furniture,onChange=()=>{},random=Math.random){this.furniture=furniture;this.onChange=onChange;this.random=random;this.action='read';this.phase='idle';this.elapsed=0;this.auto=true;this.paused=false;this.waypoints=[];}
 choose(id,position,manual=true){const f=this.furniture.find(f=>f.id===id);if(!f)return false;this.action=id;this.phase='walking';this.elapsed=0;this.auto=!manual;
  // Walk through the open center to avoid cutting across furniture.
  this.waypoints=[];if(Math.hypot(position.x-f.target[0],position.z-f.target[1])>2.4)this.waypoints.push([0,.35]);this.waypoints.push([...f.target]);this.onChange(this);return true;}
 setAuto(position){this.auto=true;this.next(position);}
 next(position){const choices=ACTIONS.filter(a=>a.id!==this.action);this.choose(choices[Math.floor(this.random()*choices.length)].id,position,false);}
 update(dt,position){if(this.paused)return;this.elapsed+=dt;
  if(this.phase==='idle'){if(this.auto)this.next(position);return;}
  if(this.phase==='walking'){const [x,z]=this.waypoints[0];const dx=x-position.x,dz=z-position.z,dist=Math.hypot(dx,dz);const step=dt*.83;
   if(dist<=step){position.x=x;position.z=z;this.waypoints.shift();if(!this.waypoints.length){this.phase='acting';this.elapsed=0;this.onChange(this);}}
   else{position.x+=dx/dist*step;position.z+=dz/dist*step;this.heading=Math.atan2(dx,dz);}return;}
  const duration=ACTIONS.find(a=>a.id===this.action).duration;if(this.elapsed>=duration){if(this.auto)this.next(position);else{this.phase='idle';this.elapsed=0;this.onChange(this);}}
 }
 get progress(){return this.phase==='acting'?Math.min(1,this.elapsed/ACTIONS.find(a=>a.id===this.action).duration):0;}
}
