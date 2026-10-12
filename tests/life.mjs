import assert from 'node:assert/strict';
import {Simulation} from '../dist/sim.js';
import {currentPlan,routine} from '../dist/life.js';
const sim=new Simulation();
for(let i=0;i<4000;i++)sim.step();
const chats=sim.citizens.flatMap(c=>c.conversations||[]);
assert.ok(chats.length>0,'Citizens must naturally meet and talk');
assert.ok(sim.citizens.some(c=>c.reflections.length),'Experiences form reflections');
assert.ok(sim.citizens.some(c=>c.observations.length),'Travel and actions form observations');
for(const chat of chats){assert.equal(chat.lines.length,4);assert.equal(chat.participants.length,2);assert.ok(sim.world.parcels.some(p=>p.id===chat.placeId));}
for(const c of sim.citizens){assert.ok(c.observations.length<=40);assert.ok(c.conversations.length<=16);assert.equal(routine(c).length,8);assert.ok(currentPlan(c,sim).action);}
const saved=JSON.parse(JSON.stringify(sim)),restored=new Simulation(saved);
assert.deepEqual(restored.citizens[0].conversations,saved.citizens[0].conversations);
assert.deepEqual(restored.citizens[0].brain.weights,saved.citizens[0].brain.weights);
console.log(JSON.stringify({passed:true,conversations:chats.length,reflections:sim.citizens.reduce((n,c)=>n+c.reflections.length,0),observations:sim.citizens.reduce((n,c)=>n+c.observations.length,0)}));
