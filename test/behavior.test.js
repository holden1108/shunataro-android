import test from 'node:test';
import assert from 'node:assert/strict';
import {Behavior,ACTIONS} from '../src/behavior.js';
const furniture=ACTIONS.map((a,i)=>({id:a.id,target:[i*.35,0]}));
test('manual activity reaches destination, completes once, and waits',()=>{const p={x:0,z:0},b=new Behavior(furniture);b.choose('eat',p);for(let i=0;i<400;i++)b.update(.05,p);assert.equal(b.phase,'idle');assert.equal(b.auto,false);assert.equal(p.x,.35);});
test('pause freezes walking and activity time',()=>{const p={x:0,z:0},b=new Behavior(furniture);b.choose('sleep',p);b.paused=true;b.update(10,p);assert.deepEqual(p,{x:0,z:0});assert.equal(b.elapsed,0);});
test('automatic behavior advances to a different activity',()=>{const p={x:0,z:0},b=new Behavior(furniture,()=>{},()=>0);b.choose('cook',p,false);b.update(.1,p);b.update(17,p);assert.equal(b.action,'eat');assert.equal(b.phase,'walking');assert.equal(b.auto,true);});
test('manual selection redirects an ongoing walk and rejects unknown furniture',()=>{const p={x:-3,z:1},b=new Behavior(furniture);b.choose('sleep',p);b.update(.2,p);b.choose('read',p);assert.deepEqual(b.waypoints.at(-1),[.7,0]);assert.equal(b.choose('missing',p),false);assert.equal(b.action,'read');});
