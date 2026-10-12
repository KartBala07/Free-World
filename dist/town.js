import {avatarCanvas} from './avatars.js';
import {activityIcons} from './life.js';
import {typeNames,nearestParcel} from './city.js';

// Original canvas art: no sprites or map assets are copied from the reference demo.
export function createTown(container){
  const canvas=document.createElement('canvas');canvas.id='townCanvas';canvas.setAttribute('aria-label','Top-down living town. Drag to pan; click a citizen to inspect.');container.append(canvas);
  const g=canvas.getContext('2d');let width=innerWidth,height=innerHeight,scale=8,cx=0,cz=0,people=[],hover=null;
  function resize(){width=innerWidth;height=innerHeight;canvas.width=width*devicePixelRatio;canvas.height=height*devicePixelRatio;canvas.style.width=width+'px';canvas.style.height=height+'px';}
  resize();
  const screen=(x,z)=>({x:width/2+(x-cx)*scale,y:height/2+(z-cz)*scale});
  const ground=e=>({x:cx+(e.clientX-width/2)/scale,z:cz+(e.clientY-height/2)/scale});
  function rect(x,z,w,h,color){const p=screen(x,z);g.fillStyle=color;g.fillRect(Math.round(p.x),Math.round(p.y),Math.ceil(w*scale),Math.ceil(h*scale));}
  function text(label,x,z,color='#344d48',size=10){const p=screen(x,z);g.fillStyle=color;g.font=`bold ${size}px monospace`;g.textAlign='center';g.fillText(label,p.x,p.y);}
  function tree(x,z){rect(x-.25,z,.5,1.2,'#9c7451');rect(x-1,z-1,2,2,'#356c50');rect(x-1.3,z-1.5,2.6,1.5,'#559c60');rect(x-.8,z-2,1.6,1.2,'#81b86d');rect(x-.7,z-1.7,.6,.4,'#a4cd7d');}
  function bed(x,z,col='#c393b7'){rect(x-.7,z-1,1.4,2.5,'#765d50');rect(x-.6,z-.8,1.2,2.1,col);rect(x-.5,z-.7,1,.5,'#fff8df');rect(x-.6,z+.7,1.2,.35,'#e9cdd2');}
  function table(x,z){rect(x-1,z-.7,2,1.4,'#846544');rect(x-.9,z-.7,1.8,1.1,'#cda772');rect(x-.3,z+.8,.6,.5,'#836946');}
  function shelf(x,z){rect(x-1,z-.4,2,.8,'#725f51');for(let i=0;i<6;i++)rect(x-.9+i*.3,z-.3,.2,.5,['#9b78a9','#df9a69','#76a8a1'][i%3]);}
  function parcel(p){const {x,z,type}=p;
    if(x+8<cx-width/scale/2||x-8>cx+width/scale/2||z+8<cz-height/scale/2||z-8>cz+height/scale/2)return;
    rect(x-8,z-8,16,16,'#a1c779');rect(x-1,z+6,2,4,'#dfd5ac');
    if(['park','forest','empty','pond','farm'].includes(type)){
      if(type==='farm'){for(let j=0;j<6;j++){rect(x-6+j*2,z-5,1.2,10,'#a17b51');for(let k=0;k<6;k++){rect(x-5.9+j*2,z-4.8+k*1.7,.9,.7,'#598f4e');rect(x-5.7+j*2,z-4.6+k*1.7,.4,.3,j%2?'#e2ae58':'#9fc566');}}}
      if(type==='pond'){rect(x-5,z-4,10,8,'#629dad');rect(x-4.7,z-3.7,9.4,7.4,'#8dc9c5');rect(x-3,z-2,2,.15,'#d2e5c5');rect(x+1,z+1,2,.15,'#d2e5c5');}
      if(type==='park'){rect(x-1,z-7,2,14,'#e0d8af');rect(x-7,z-1,14,2,'#e0d8af');rect(x-4,z+2,2,.5,'#997650');rect(x+2,z-3,2,.5,'#997650');rect(x-1.2,z-1.2,2.4,2.4,'#b8bfae');rect(x-.8,z-.8,1.6,1.6,'#8ac9c4');}
      if(type==='park'||type==='forest')for(let i=0;i<(type==='forest'?9:4);i++)tree(x-5+(i*7)%11,z-4+(i*3)%10);
    }else{
      rect(x-6.7,z-6.7,13.7,13.7,'#6c806750');rect(x-6.5,z-6.5,13,13,'#655f58');rect(x-6,z-6,12,12,type==='clinic'?'#e6ede0':type==='library'?'#e4d6bd':'#eee4be');
      for(let n=0;n<12;n++){rect(x-6,z-6+n,12,.05,'#d8cca6');if(n%2===0)for(let m=0;m<6;m++)rect(x-6+m*2,z-6+n,.05,1,'#d8cca6');}
      rect(x-6.5,z-6.5,13,.5,'#e8e7dc');rect(x-6.5,z-6,.5,12,'#ebe7d6');rect(x+6,z-6,.5,12,'#ebe7d6');
      // Rooms stay roofless so daily life is visible from above.
      if(type==='home'){
        rect(x-6,z-1,4.5,.25,'#918779');rect(x-1.5,z-6,.25,3,'#918779');bed(x-4,z-4,p.id%2?'#9fb9cd':'#c393b7');rect(x+1,z-5,4,1,'#a1b4ae');rect(x+2,z-4.8,.7,.6,'#e7eddd');table(x+3,z);rect(x-5,z+3,3,1,'#b48b9a');rect(x-4.7,z+2.8,2.4,.5,'#d5acb8');shelf(x+4,z+4);
      }else if(type==='library'){for(let n=0;n<3;n++){shelf(x-4+n*4,z-4);shelf(x-4+n*4,z-2);}table(x-3,z+2);table(x+3,z+2);}
      else if(type==='clinic'||type==='shelter'){for(let n=0;n<3;n++)bed(x-4+n*4,z-3,type==='clinic'?'#b1d0c9':'#d3b693');table(x+3,z+3);if(type==='clinic'){rect(x-.8,z+3,.5,1.8,'#c96b73');rect(x-1.45,z+3.65,1.8,.5,'#c96b73');}}
      else if(type==='market'){rect(x-5,z-4,10,1.5,'#ad835e');for(let n=0;n<9;n++)rect(x-4.6+n,z-3.8,.6,.6,['#d6786c','#abc76e','#f1c66a'][n%3]);table(x-3,z+2);table(x+3,z+2);rect(x-5,z-6,10,.6,'#f3c877');}
      else{for(let n=0;n<3;n++){table(x-4+n*4,z-3);rect(x-4.5+n*4,z-3.5,1,.6,'#567888');}table(x,z+2);shelf(x+4,z+4);}
      rect(x-5,z+6,3,.5,'#eee6d4');rect(x+2,z+6,3,.5,'#eee6d4');
    }
    if(scale>4){const label=type==='home'?`HOME ${p.id+1}`:typeNames[type].toUpperCase();const pos=screen(x,z-7.2);g.font='bold 9px monospace';const w=g.measureText(label).width+10;g.fillStyle='#fffbe5ed';g.fillRect(pos.x-w/2,pos.y-10,w,14);g.fillStyle='#40554c';g.textAlign='center';g.fillText(label,pos.x,pos.y);}
  }
  function draw(sim,selected,target,distance,time,tool){
    cx=target.x;cz=target.z;scale=Math.max(2.4,height/(distance*.8));people=sim.citizens;
    g.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);g.imageSmoothingEnabled=false;g.fillStyle='#83bfb7';g.fillRect(0,0,width,height);
    rect(-96,-72,184,144,'#a5cd7d');rect(88,-72,8,144,'#77bdc8');
    for(let i=0;i<350;i++){const x=(i*37%181)-94,z=(i*23%140)-70;rect(x,z,.2,.35,i%3?'#93be70':'#badd8e');}
    for(let x=-80;x<=80;x+=20){rect(x-2.5,-64,5,128,'#ded4ad');rect(x-2.5,-64,.25,128,'#f5e8c2');}
    for(let z=-60;z<=60;z+=20){rect(-84,z-2.5,168,5,'#ded4ad');rect(-84,z-2.5,168,.25,'#f5e8c2');}
    for(const p of sim.world.parcels)parcel(p);
    for(let x=-91;x<88;x+=7){tree(x,-67);tree(x,69);}
    for(const k of sim.world.closed){const [x,z]=k.split(',').map(Number);rect(x-2,z-.5,4,1,'#cf7764');for(let i=0;i<4;i++)rect(x-1.8+i,z-.5,.4,1,'#ffe6ac');}
    for(const h of sim.world.hazards){const pos=screen(h.x,h.z);g.beginPath();g.arc(pos.x,pos.y,h.radius*scale,0,Math.PI*2);g.fillStyle='#dc686633';g.fill();}
    const current=people.find(c=>c.id===selected);
    if(current?.route.length){g.strokeStyle='#fff9cf';g.lineWidth=3;g.setLineDash([4,4]);g.beginPath();let p=screen(current.x,current.z);g.moveTo(p.x,p.y);for(const point of current.route){p=screen(point.x,point.z);g.lineTo(p.x,p.y);}g.stroke();g.setLineDash([]);}
    for(const c of [...people].sort((a,b)=>a.z-b.z)){
      const p=screen(c.x,c.z);if(p.x<-40||p.x>width+40||p.y<-40||p.y>height+40)continue;
      const size=Math.max(15,Math.min(38,scale*2.4)),bounce=c.phase==='Traveling'?Math.sin(time*.012+c.id)*1.2:0;
      if(c.id===selected){g.strokeStyle='#fff7cc';g.lineWidth=3;g.strokeRect(p.x-size*.5-3,p.y-size+1,size+6,size*1.25);}
      g.drawImage(avatarCanvas(c.id),Math.round(p.x-size/2),Math.round(p.y-size+bounce),size,size*1.25);
      if(scale>4||c.id===selected){const chatting=(c.chatUntil||0)>sim.tick;const label=`${c.name.split(' ').map(v=>v[0]).slice(0,2).join('')} ${chatting?'💬':activityIcons[c.action]||'…'}`;g.font='bold 10px monospace';const w=g.measureText(label).width+10;g.fillStyle=chatting?'#ffe6ba':'#fffdf0';g.strokeStyle='#596b5c';g.lineWidth=1;g.fillRect(p.x-w/2,p.y-size-20,w,16);g.strokeRect(p.x-w/2,p.y-size-20,w,16);g.fillStyle='#334f48';g.textAlign='center';g.fillText(label,p.x,p.y-size-8);}
    }
    if(tool){const p=nearestParcel(sim.world,(hover||target).x,hover?hover.z:target.z);rect(p.x-7,p.z-7,14,14,'#f5d47c55');}
    if(sim.light==='Night'||(sim.light==='Cycle'&&(sim.day%1<.25||sim.day%1>.8))){g.fillStyle='#233e6638';g.fillRect(0,0,width,height);}
    if(['Rain','Storm'].includes(sim.weather)){g.strokeStyle='#d9eff099';g.lineWidth=1;for(let i=0;i<100;i++){const x=(i*137+time*.04)%width,y=(i*79+time*.2)%height;g.beginPath();g.moveTo(x,y);g.lineTo(x-3,y+9);g.stroke();}}
  }
  return {canvas,resize,draw,ground,setHover(p){hover=p},pick(e){const p=ground(e);return [...people].sort((a,b)=>Math.hypot(a.x-p.x,a.z-p.z)-Math.hypot(b.x-p.x,b.z-p.z)).find(c=>Math.hypot(c.x-p.x,c.z-p.z)<Math.max(2,18/scale))?.id}};
}
