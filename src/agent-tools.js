// Progressive enhancement: ordinary browsers do not need WebMCP support.
export function registerAgentTools(behavior,position,choose,togglePause){
 const context=document.modelContext;if(!context?.registerTool)return;
 const lifecycle=new AbortController();
 const tool={name:'set_shunataro_activity',title:'しゅな太郎の行動を選ぶ',description:'家具へ移動して選んだ行動を開始します。autoは自動生活、pause/resumeは時間の停止と再開です。',inputSchema:{type:'object',properties:{action:{type:'string',enum:['cook','eat','read','sleep','clean','auto','pause','resume']}},required:['action'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){
  if(!input||!['cook','eat','read','sleep','clean','auto','pause','resume'].includes(input.action))throw new Error('Unknown activity');
  if(input.action==='auto')behavior.setAuto(position);else if(input.action==='pause'||input.action==='resume'){if(behavior.paused!==(input.action==='pause'))togglePause();}else choose(input.action);
  return {activity:behavior.action,phase:behavior.phase,paused:behavior.paused,automatic:behavior.auto};
 }};
 try{Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{/* Optional browser API; visible controls remain available. */}
 window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
}
