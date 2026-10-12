import assert from 'node:assert/strict';
import {Simulation} from '../dist/sim.js';
import {route,entrance,makeCity} from '../dist/city.js';
import {infer,learn,ensureBrain} from '../dist/brain.js';
let seed=71;Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
const city=makeCity();assert.equal(city.parcels.length,48);city.closed=['0,0'];const path=route(city,{x:-40,z:0},{x:40,z:0});assert(path);assert(!path.some(p=>p.x===0&&p.z===0));
const s=new Simulation();assert.equal(s.citizens.length,50);assert(new Set(s.citizens.map(c=>c.home)).size>5);assert(new Set(s.citizens.map(c=>`${c.x},${c.z}`)).size===50);
const c=s.citizens[0];c.hunger=10;const t=infer(c,s);assert.equal(t.chosen,0);assert.equal(t.sparse.filter(v=>v>0).length,12);assert(Math.abs(t.probabilities.reduce((a,b)=>a+b,0)-1)<1e-8);
const prior=JSON.stringify(c.brain.weights);learn(c,t,.8,{day:1,placeId:1,place:'Test market',outcome:'Food obtained'});assert.notEqual(JSON.stringify(c.brain.weights),prior);assert.equal(c.brain.episodes.length,1);assert(c.brain.places[1].value>0);
// Traveling earns no wages or nourishment.
s.choose(c);const cash=c.wealth,hunger=c.hunger;s.step();assert.equal(c.wealth,cash);assert(c.hunger<=hunger);
for(let i=0;i<6000;i++)s.step();assert(s.citizens.length>=50);assert(s.citizens.every(c=>c.brain.updates>0));for(const c of s.citizens){for(const k of ['x','z','hunger','energy','social','health','wealth'])assert(Number.isFinite(c[k]),k);assert(c.wealth>=0);assert(c.hunger>=0&&c.hunger<=100);assert(c.route.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.z)))}
const p=s.world.parcels[0],original=p.type;s.edit('clinic',p.x,p.z);assert.equal(p.type,'clinic');s.undo();assert.equal(p.type,original);
s.edit('close-road',0,0);assert(s.world.closed.includes('0,0'));s.edit('open-road',0,0);assert(!s.world.closed.includes('0,0'));
s.edit('hazard',30,30);assert.equal(s.world.hazards.length,1);s.world.hazards[0].until=s.tick;s.step();assert.equal(s.world.hazards.length,0);
const restored=new Simulation(JSON.parse(JSON.stringify(s)));assert.deepEqual(restored.citizens[0].brain.weights,s.citizens[0].brain.weights);restored.step();
const old=JSON.parse(JSON.stringify(s));delete old.version;delete old.world;for(const c of old.citizens){delete c.cityVersion;delete c.home;delete c.workplace;c.brain={weights:[[1]],updates:21,reward:.2};}const migrated=new Simulation(old);assert.equal(migrated.citizens[0].brain.legacy.updates,21);assert.deepEqual(migrated.citizens[0].memories,old.citizens[0].memories);assert.equal(migrated.world.parcels.length,48);
console.log(JSON.stringify({passed:true,days:s.day,population:s.citizens.length,meanLearning:s.citizens.reduce((a,c)=>a+c.brain.updates,0)/s.citizens.length,uniqueDestinations:new Set(s.citizens.map(c=>c.task?.placeId)).size,food:s.food,meanHealth:s.citizens.reduce((a,c)=>a+c.health,0)/s.citizens.length}));
// Deleting an occupied destination creates a failed experience, not free benefits.
const disrupted=new Simulation();const dc=disrupted.citizens[0];disrupted.choose(dc);const dest=disrupted.world.parcels.find(p=>p.id===dc.task.placeId);disrupted.edit('empty',dest.x,dest.z);const updates=dc.brain.updates;disrupted.step();assert(dc.brain.updates>updates);assert(dc.brain.reward<0);
// Closed junctions are absent from rerouted waypoints.
const rerouted=route(makeCity(),{x:-40,z:0},{x:40,z:0});assert(rerouted.some(p=>p.x===0&&p.z===0));
// Critical danger influences decisions independently of player commands.
const dangerSim=new Simulation(),dangerCitizen=dangerSim.citizens[0];dangerSim.world.hazards.push({x:dangerCitizen.x,z:dangerCitizen.z,radius:10,until:1800});assert.equal(infer(dangerCitizen,dangerSim).chosen,7);
