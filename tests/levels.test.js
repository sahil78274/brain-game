import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {actions,apply,createState} from '../js/engine.js';
import {art} from '../js/art.js';
import {behaviors} from '../js/behaviors.js';
import {fresh,load,save,reward,unlocked} from '../js/progress.js';
import {RewardedAdService,RevealService,mockProvider} from '../js/services.js';
const read=name=>JSON.parse(readFileSync(new URL(`../levels/${name}`,import.meta.url)));
const manifest=read('manifest.json');
const levels=manifest.batches.flatMap(read).sort((a,b)=>a.id-b.id);
const difficulties=['Easy','Medium','Hard','Very Hard'];
test('catalog IDs, questions and scene/action fingerprints are unique',()=>{
 assert.equal(manifest.worldCount*manifest.worldCapacity,2000);
 levels.forEach((l,i)=>{assert.equal(l.id,i+1);assert.equal(l.world,Math.ceil(l.id/manifest.worldCapacity));});
 for(const fingerprint of [l=>l.question,l=>JSON.stringify(l.steps)])assert.equal(new Set(levels.map(fingerprint)).size,levels.length);
});
for(const raw of levels)test(`Level ${raw.id}: ${raw.question}`,()=>{
 const l={...raw,...behaviors[raw.id]};
 for(const key of ['question','subtitle','hint','solution'])assert.ok(l[key]?.trim(),key);
 assert.ok(difficulties.includes(l.difficulty));assert.ok(l.scene.length>1);assert.ok(l.steps.length);
 const ids=new Set(l.scene.map(p=>p.id));assert.equal(ids.size,l.scene.length);
 for(const p of l.scene){assert.match(p.id,/^[a-z][a-z-]*$/);assert.ok(p.x>0&&p.x<650&&p.y>0&&p.y<330);assert.equal(typeof p.hidden,'boolean');assert.ok(art(p.id),`missing artwork for ${p.id}`);}
 const state=createState(l);assert.equal(apply(l,state,{id:'missing',type:'tap'}),false);
 l.steps.forEach((a,i)=>{assert.ok(ids.has(a.id));assert.ok(actions.includes(a.type));if(a.type==='drop'){assert.ok(ids.has(a.target));assert.notEqual(a.id,a.target);}if(a.reveal)assert.ok(state.pieces[a.reveal]?.hidden);assert.equal(state.won,false);assert.equal(apply(l,state,{...a,type:'invalid'}),false);assert.equal(state.index,i);assert.ok(apply(l,state,a));assert.equal(state.index,i+1);});
 assert.ok(state.won);assert.equal(apply(l,state,l.steps.at(-1)),false);assert.equal(createState(l).index,0);
});
test('unlock sequentially, persist and do not double-pay campaign or daily',()=>{
 const backing=new Map(), storage={setItem:(k,v)=>backing.set(k,v),getItem:k=>backing.get(k)};
 const state=fresh();assert.ok(unlocked(state,1));assert.equal(unlocked(state,2),false);assert.equal(reward(state,1),10);assert.ok(unlocked(state,2));assert.equal(reward(state,1),0);assert.equal(reward(state,44,'2026-11-20'),25);assert.equal(reward(state,2,'2026-11-20'),0);assert.equal(unlocked(state,45),false);state.current=2;state.reveals[1]={hint:true};assert.ok(save(storage,state));assert.deepEqual(load(storage),state);assert.equal(state.coins,35);assert.deepEqual(load(null),fresh());assert.equal(save(null,state),false);
});
test('rewards reveal the intended text or fail closed',async()=>{
 const service=p=>new RevealService(new RewardedAdService(p));assert.equal(await service(mockProvider).reveal(levels[0],'hint'),levels[0].hint);assert.equal(await service(mockProvider).reveal(levels[0],'solution'),levels[0].solution);assert.equal(await service(null).reveal(levels[0],'hint'),null);assert.equal(await service({show(){throw Error();}}).reveal(levels[0],'hint'),null);
});
