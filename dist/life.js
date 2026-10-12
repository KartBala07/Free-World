export const activityIcons={Eating:'🍎',Resting:'💤',Socializing:'💬',Working:'🛠',Learning:'📚',Exploring:'🌿',Healing:'♥','Seeking shelter':'☂'};
export function routine(c){const shift=(c.id%3)*.5;return [
  {hour:0,action:'Resting',label:'Sleep and recover'},
  {hour:6+shift,action:'Eating',label:'Breakfast in the neighborhood'},
  {hour:8+shift,action:c.age<18?'Learning':'Working',label:c.age<18?'Study at the learning center':`A shift as ${c.job.toLowerCase()}`},
  {hour:12+shift,action:'Eating',label:'Lunch break'},
  {hour:14+shift,action:c.curiosity>60?'Learning':'Exploring',label:c.curiosity>60?'Make time for a new idea':'Explore the neighborhood'},
  {hour:17+shift,action:'Socializing',label:'Meet neighbors and catch up'},
  {hour:20+shift,action:'Eating',label:'An evening meal'},
  {hour:22+shift,action:'Resting',label:'Return home and unwind'}];}
export function currentPlan(c,sim){const h=sim.day%1*24;return [...routine(c)].reverse().find(p=>h>=p.hour)||routine(c)[0]}
export function prepareLife(c){c.observations??=[];c.conversations??=[];c.relationships??={};c.reflections??=[];c.lastChat??=-1000;}
export function observe(c,sim,text,kind='experience'){
  prepareLife(c);c.observations.unshift({tick:sim.tick,day:sim.day,text,kind});c.observations=c.observations.slice(0,40);
}
export function reflect(c,sim,p,reward){
  prepareLife(c);observe(c,sim,`${c.action} at ${p?.name||'the streets'} ${reward>0?'helped me':'did not go as hoped'}.`);
  if(c.brain.updates%4===0){const best=Object.values(c.brain.places).sort((a,b)=>b.value-a.value)[0];c.reflections.unshift({day:sim.day,text:best?`After ${c.brain.updates} experiences, ${best.name} stands out ${best.value>0?'as a helpful place. I may return.':'as a place I still need to understand.'}`:'I need to explore more before forming an opinion.'});c.reflections=c.reflections.slice(0,12);}
}
export function lifeStep(sim){
  if(sim.tick%30)return;
  const busy=new Set();
  for(const a of sim.citizens){prepareLife(a);if(a.phase!=='Doing'||a.action==='Resting'||sim.tick-a.lastChat<360||busy.has(a.id))continue;
    const b=sim.citizens.find(b=>b.id!==a.id&&!busy.has(b.id)&&b.phase==='Doing'&&b.action!=='Resting'&&b.task?.placeId===a.task?.placeId&&sim.tick-(b.lastChat??-1000)>=360&&Math.hypot(a.x-b.x,a.z-b.z)<9);
    if(!b)continue;prepareLife(b);const p=sim.world.parcels.find(p=>p.id===a.task.placeId);if(!p)continue;
    const topic=sim.weather==='Storm'?'weather':sim.food<80?'food':a.action==='Learning'||b.action==='Learning'?'learning':a.action==='Working'?'work':'neighborhood';
    const familiar=!!a.relationships[b.id];const learned=Object.values(b.brain.places).filter(p=>p.value>.1).sort((a,b)=>b.value-a.value)[0];
    const lines=[{speaker:a.name,text:familiar?`Good to see you again, ${b.name.split(' ')[0]}.`:`Hello, I'm ${a.name}. Have we met around here?`},
      {speaker:b.name,text:topic==='weather'?'This storm worries me. I am keeping an eye on the shelters.':topic==='food'?'Food is running low. I hope the farms recover soon.':topic==='learning'?'I came here to learn something new today.':topic==='work'?`I have been busy with my work as a ${b.job.toLowerCase()}.`:`I like seeing familiar faces at ${p.name}.`},
      {speaker:a.name,text:a.hunger<40?'I will need to find a meal soon.':a.energy<35?'I could use some rest after this.':`My routine for this part of the day is: ${currentPlan(a,sim).label.toLowerCase()}.`},
      {speaker:b.name,text:learned?`${learned.name} helped me recently. You might like it too.`:'Let us catch up when we cross paths again.'}];
    const chat={id:`${sim.tick}-${a.id}-${b.id}`,day:sim.day,tick:sim.tick,place:p.name,placeId:p.id,participants:[a.id,b.id],lines,topic};
    for(const [c,other] of [[a,b],[b,a]]){c.lastChat=sim.tick;c.chatUntil=sim.tick+60;c.conversations.unshift(chat);c.conversations=c.conversations.slice(0,16);const r=c.relationships[other.id]??={name:other.name,meetings:0,affinity:0};r.meetings++;r.affinity=Math.min(100,r.affinity+5);r.lastMet=sim.day;c.social=Math.min(100,c.social+4);observe(c,sim,`Talked with ${other.name} about ${topic} at ${p.name}.`,'conversation');c.thought=`I just talked with ${other.name} about ${topic}. ${familiar?'It is good to see a familiar face.':'I am getting to know my neighbors.'}`;busy.add(c.id);}
    sim.socialFeed??=[];sim.socialFeed.unshift(chat);sim.socialFeed=sim.socialFeed.slice(0,24);
  }
}
