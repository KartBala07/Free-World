import {WIDTH,DEPTH,clamp,nearestParcel} from './city.js';
export function ensurePlayer(sim){return sim.player??={x:-70,z:-40,heading:0,money:50,socialCredit:10,energy:100,home:null,job:null,cooldowns:{},history:[],visited:[],name:'You'};}
export function reputation(p){return p.socialCredit>=75?'Town hero':p.socialCredit>=40?'Trusted neighbor':p.socialCredit>=20?'Friendly face':'New arrival'}
export function record(p,sim,text){p.history.unshift({day:sim.day,text});p.history=p.history.slice(0,20);}
export function canStand(sim,x,z){if(Math.abs(x)>WIDTH/2-9||Math.abs(z)>DEPTH/2-7)return false;return !sim.world.parcels.some(p=>!['empty','park','forest','pond','farm'].includes(p.type)&&Math.abs(x-p.x)<4.4&&Math.abs(z-p.z)<4.4)&&!sim.world.parcels.some(p=>p.type==='pond'&&Math.abs(x-p.x)<5&&Math.abs(z-p.z)<4.5);}
export function movePlayer(sim,dx,dz,dt){const p=ensurePlayer(sim);if(p.job||!dt)return;const length=Math.hypot(dx,dz);if(!length)return;const step=Math.min(dt,.1)*(p.energy<10?3:7),x=p.x+dx/length*step,z=p.z+dz/length*step;if(canStand(sim,x,p.z))p.x=x;if(canStand(sim,p.x,z))p.z=z;p.heading=Math.atan2(dx,dz);p.energy=clamp(p.energy-dt*.08);}
export function nearby(sim){const p=ensurePlayer(sim),lot=nearestParcel(sim.world,p.x,p.z),distance=Math.hypot(lot.x-p.x,lot.z-p.z);return distance<11?lot:null;}
export function playerOptions(sim){const p=ensurePlayer(sim),lot=nearby(sim);if(!lot)return [];const options=[];
  if(['work','farm','market'].includes(lot.type))options.push({id:'work',label:p.socialCredit>=40?'Skilled shift · +¤40':'Work a shift · +¤25',seconds:10});
  if(lot.type==='park'||lot.type==='forest')options.push({id:'help',label:'Care for the grounds · +¤8, +5 credit',seconds:6});
  if(lot.type==='market')options.push({id:'meal',label:'Buy a meal · ¤8, +30 energy',seconds:0});
  if(['home','shelter','park'].includes(lot.type))options.push({id:'rest',label:'Rest here · +40 energy',seconds:5});
  if(lot.type==='home'&&p.home===null)options.push({id:'rent',label:'Rent a home · ¤60',seconds:0});
  if(lot.type==='library')options.push({id:'study',label:'Community study · +4 credit',seconds:8});
  return options;
}
export function startPlayerAction(sim,id){const p=ensurePlayer(sim);if(p.job)return {ok:false,message:'Finish or cancel your current activity first.'};const lot=nearby(sim),option=playerOptions(sim).find(o=>o.id===id);if(!lot||!option)return {ok:false,message:'Walk closer to a suitable place.'};const key=`${id}:${lot.id}`;
  if((p.cooldowns[key]||0)>sim.tick)return {ok:false,message:'Come back a little later. Explore another place meanwhile.'};
  if(id==='meal'){if(p.money<8)return {ok:false,message:'You need ¤8 for a meal.'};if(sim.food<1)return {ok:false,message:'The town has no food available.'};p.money-=8;sim.food--;p.energy=clamp(p.energy+30);record(p,sim,'Bought a meal for ¤8.');return {ok:true,message:'A warm meal. +30 energy.'};}
  if(id==='rent'){if(p.money<60)return {ok:false,message:'Save ¤60 to rent this home.'};p.money-=60;p.home=lot.id;record(p,sim,`Rented ${lot.name}.`);return {ok:true,message:'You have a home in Free World!'};}
  if(id!=='rest'&&p.energy<10)return {ok:false,message:'Rest or buy a meal to recover energy first.'};
  p.job={id,placeId:lot.id,seconds:option.seconds,remaining:option.seconds,key};return {ok:true,message:option.label};
}
export function stepPlayer(sim,dt){const p=ensurePlayer(sim),job=p.job;if(!job)return null;const lot=nearby(sim);if(lot?.id!==job.placeId||!playerOptions(sim).some(o=>o.id===job.id)){p.job=null;return 'Activity cancelled: the place is out of reach.';}job.remaining-=dt;if(job.remaining>0)return null;
  let text='';if(job.id==='work'){const pay=p.socialCredit>=40?40:25;p.money+=pay;p.socialCredit=clamp(p.socialCredit+2);p.energy=clamp(p.energy-12);text=`Shift complete: +¤${pay}, +2 social credit.`;}
  if(job.id==='help'){p.money+=8;p.socialCredit=clamp(p.socialCredit+5);p.energy=clamp(p.energy-6);text='Grounds cared for: +¤8, +5 social credit.';}
  if(job.id==='study'){p.socialCredit=clamp(p.socialCredit+4);p.energy=clamp(p.energy-5);text='Community study complete: +4 social credit.';}
  if(job.id==='rest'){p.energy=clamp(p.energy+40);text='Rested: +40 energy.';}
  p.cooldowns[job.key]=sim.tick+250;p.job=null;record(p,sim,text);return text;
}
export function talkToNeighbor(sim){const p=ensurePlayer(sim),c=sim.citizens.filter(c=>Math.hypot(c.x-p.x,c.z-p.z)<9).sort((a,b)=>Math.hypot(a.x-p.x,a.z-p.z)-Math.hypot(b.x-p.x,b.z-p.z))[0];if(!c)return {ok:false,message:'Walk closer to a citizen to say hello.'};const key=`talk:${c.id}`;if((p.cooldowns[key]||0)>sim.tick)return {ok:false,message:`You just spoke with ${c.name}. Give them some time.`};p.cooldowns[key]=sim.tick+500;p.socialCredit=clamp(p.socialCredit+3);c.social=clamp(c.social+3);sim.memory(c,'Met a friendly visitor in the neighborhood.');const message=`${c.name}: “${c.thought}” (+3 social credit)`;record(p,sim,`Met ${c.name}. +3 social credit.`);return {ok:true,message};}
