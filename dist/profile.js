export let profile=null;
let revision=null,conflicted=false;
const sessionKey='freecity-shared-profile';
export const isDemo=new URLSearchParams(location.search).get('demo')==='1';
export function backupKey(){return profile?`profile:${profile}`:'active'}
async function request(path,options={}){
  const response=await fetch(path,{...options,cache:'no-store',signal:AbortSignal.timeout(30000)});
  const data=await response.json();
  if(!response.ok){const e=Error(data.error||'Cloud save failed.');e.status=response.status;throw e;}
  return {response,data};
}
export async function cloudLoad(){
  const {response,data}=await request(`/api/worlds/${encodeURIComponent(profile)}`);
  revision=response.headers.get('etag');conflicted=false;return data.world;
}
export async function cloudSave(world){
  if(conflicted)throw Object.assign(Error('Another device saved this city. Export your copy and reload before saving.'),{status:409});
  try{
    const {response}=await request(`/api/worlds/${encodeURIComponent(profile)}`,{method:'PUT',headers:{'content-type':'application/json',...(revision?{'if-match':revision}:{'if-none-match':'*'})},body:JSON.stringify(world)});
    revision=response.headers.get('etag');
  }catch(e){if(e.status===409)conflicted=true;throw e;}
}
export function logOut(){sessionStorage.removeItem(sessionKey);location.reload()}
export async function chooseProfile(loadLegacy,exportBackup){
  if(isDemo)return null;
  const gate=document.createElement('dialog');gate.id='profileGate';
  gate.innerHTML=`<form id="profileForm"><div class="eyebrow">FREE CITY · PLAYER LOBBY</div><h2>A name for your world.</h2><p>Enter your username to open your city on any device. New names start a new city.</p><label for="profileName">USERNAME</label><input id="profileName" name="username" minlength="3" maxlength="24" pattern="[A-Za-z0-9][A-Za-z0-9_-]{2,23}" autocomplete="username" required placeholder="e.g. river-town"><small>3–24 letters, numbers, underscores or hyphens. Names ignore capitals.</small><div class="shared-notice"><b>This is a shared save, not a protected account.</b><p>Anyone who knows this username can open and change its city. Do not store personal information here.</p></div><label class="import-choice"><input id="copyLegacy" type="checkbox"> Copy my existing browser city if this username is new</label><p id="profileError" role="status" aria-live="polite"></p><button id="profileSubmit" type="submit" class="wide">Enter Free City →</button><button id="backupExport" type="button" class="wide">Export a browser backup</button></form>`;
  document.body.append(gate);gate.addEventListener('cancel',e=>e.preventDefault());gate.showModal();
  const name=gate.querySelector('#profileName'),error=gate.querySelector('#profileError'),button=gate.querySelector('#profileSubmit');
  name.value=sessionStorage.getItem(sessionKey)||'';
  gate.querySelector('#backupExport').onclick=async()=>{try{await exportBackup(name.value.trim().toLowerCase());}catch(e){error.textContent=e.message;}};
  return new Promise(resolve=>{
    gate.querySelector('form').onsubmit=async e=>{
      e.preventDefault();button.disabled=true;name.disabled=true;error.textContent='Opening your city…';
      try{
        profile=name.value.trim().toLowerCase();const world=await cloudLoad();
        const initial=world||(gate.querySelector('#copyLegacy').checked?await loadLegacy():null);
        sessionStorage.setItem(sessionKey,profile);gate.close();gate.remove();resolve(initial);
      }catch(e){profile=null;error.textContent=e.message||'Could not reach cloud saves. Please retry.';button.disabled=false;name.disabled=false;}
    };
  });
}
