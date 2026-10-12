import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {api,username} from '../backend/api.mjs';
import {LocalBucket} from '../backend/local-bucket.mjs';
import {Simulation} from '../dist/sim.js';
const dir=await mkdtemp(tmpdir()+'/free-city-test-'),env={BUCKET:new LocalBucket(dir)};
const request=(name,method='GET',world,revision)=>api(new Request(`https://game.test/api/worlds/${name}`,{method,headers:{'content-type':'application/json',origin:'https://game.test',...(revision?{'if-match':revision}:{'if-none-match':'*'})},...(world?{body:JSON.stringify(world)}:{})}),env);
try{
  assert.equal(username(' River-Town '),'river-town');assert.equal(username('../../bad'),null);
  const world=JSON.parse(JSON.stringify(new Simulation()));
  assert.equal((await request('player-one')).status,200);
  let save=await request('player-one','PUT',world);assert.equal(save.status,200,await save.clone().text());const rev=save.headers.get('x-save-revision');assert.ok(rev);
  const read=await request('player-one');assert.deepEqual((await read.json()).world,world);
  assert.equal((await (await request('player-two')).json()).world,null);
  assert.equal((await request('player-one','PUT',world)).status,409);
  world.tick++;assert.equal((await request('player-one','PUT',world,rev)).status,200);
  assert.equal((await request('player-one','PUT',world,rev)).status,409);
  assert.equal((await request('bad!','PUT',world)).status,400);
  assert.equal((await request('invalid-world','PUT',{version:3})).status,400);
  const cross=await api(new Request('https://game.test/api/worlds/player-one',{method:'PUT',headers:{origin:'https://evil.test','content-type':'application/json'},body:JSON.stringify(world)}),env);assert.equal(cross.status,403);
  const missingCondition=await api(new Request('https://game.test/api/worlds/player-one',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(world)}),env);assert.equal(missingCondition.status,428);
  const tooLarge=await api(new Request('https://game.test/api/worlds/player-one',{method:'PUT',headers:{'content-type':'application/json','if-none-match':'*','content-length':String(33*1024*1024)},body:'{}'}),env);assert.equal(tooLarge.status,413);
  console.log('PASS: profile isolation, world round-trip, concurrent creation, stale saves, validation, origin and size limits.');
}finally{await rm(dir,{recursive:true,force:true});}
