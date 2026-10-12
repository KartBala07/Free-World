const MAX_BYTES = 32 * 1024 * 1024;
const headers = {'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'};
const json = (data,status=200,extra={}) => new Response(JSON.stringify(data),{status,headers:{...headers,...extra}});
export function username(value){
  if(typeof value !== 'string') return null;
  const name=value.trim().toLowerCase();
  return /^[a-z0-9][a-z0-9_-]{2,23}$/.test(name)?name:null;
}
export function validWorld(w){
  return w && w.version===3 && Number.isFinite(w.day) && Number.isSafeInteger(w.tick) && w.tick>=0 &&
    Array.isArray(w.citizens) && w.citizens.length<=1000 && Array.isArray(w.archived) && w.archived.length<=5000 &&
    w.world && Array.isArray(w.world.parcels) && [48,120].includes(w.world.parcels.length) &&
    Array.isArray(w.world.closed) && Array.isArray(w.events) && Number.isFinite(w.food) && Number.isFinite(w.treasury) &&
    [...w.citizens,...w.archived].every(c=>c && Number.isSafeInteger(c.id) && typeof c.name==='string' &&
      Array.isArray(c.memories) && c.brain && typeof c.brain==='object');
}
async function readLimited(request){
  if(Number(request.headers.get('content-length'))>MAX_BYTES) throw Object.assign(Error('Save exceeds the 32 MB limit. Export a backup.'),{status:413});
  const reader=request.body?.getReader(); if(!reader) throw Object.assign(Error('Missing save.'),{status:400});
  let size=0;const chunks=[];
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>MAX_BYTES){await reader.cancel();throw Object.assign(Error('Save exceeds the 32 MB limit. Export a backup.'),{status:413});}chunks.push(value);}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
  return new TextDecoder().decode(bytes);
}
export async function api(request,env){
  const url=new URL(request.url);
  if(url.pathname==='/api/health')return json({ok:!!env.BUCKET});
  const match=url.pathname.match(/^\/api\/worlds\/([^/]+)$/);
  const name=match&&username(match[1]);
  if(!name)return json({error:'Use 3–24 letters, numbers, underscores or hyphens.'},400);
  if(!env.BUCKET)return json({error:'Cloud saves are temporarily unavailable.'},503);
  const key=`worlds/${name}.json`;
  try{
    if(request.method==='GET'){
      const object=await env.BUCKET.get(key);
      if(!object)return json({username:name,world:null,revision:null});
      return new Response(object.body,{headers:{...headers,'x-save-revision':object.httpEtag}});
    }
    if(request.method!=='PUT')return json({error:'Method not allowed.'},405,{allow:'GET, PUT'});
    const origin=request.headers.get('origin');
    if((origin&&origin!==url.origin)||request.headers.get('sec-fetch-site')==='cross-site')return json({error:'Use the game to save your city.'},403);
    if(!request.headers.get('content-type')?.startsWith('application/json'))return json({error:'Expected JSON.'},415);
    const revision=request.headers.get('if-match'),create=request.headers.get('if-none-match')==='*';
    if(!revision&&!create)return json({error:'Load the latest save before saving.'},428);
    const text=await readLimited(request);let world;
    try{world=JSON.parse(text)}catch{return json({error:'Invalid save JSON.'},400)}
    if(/"(?:__proto__|constructor|prototype)"\s*:/.test(text)||!validWorld(world))return json({error:'This is not a supported Free City save.'},400);
    const savedAt=new Date().toISOString();
    const result=await env.BUCKET.put(key,JSON.stringify({username:name,world,savedAt}),{
      onlyIf:new Headers(revision?{'if-match':revision}:{'if-none-match':'*'}),
      httpMetadata:{contentType:'application/json',cacheControl:'no-store'}
    });
    if(!result)return json({error:'This city was saved on another device. Export your local copy, then reload the latest cloud save.'},409);
    return json({savedAt},200,{'x-save-revision':result.httpEtag});
  }catch(error){return json({error:error.status?error.message:'Cloud saves are temporarily unavailable. Export a backup before leaving.'},error.status||503)}
}
