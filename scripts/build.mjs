import {readFile,writeFile,mkdir,readdir,copyFile} from 'node:fs/promises';
const assets={};
async function collect(dir,prefix=''){
  for(const file of await readdir(dir,{withFileTypes:true})){
    if(['server','.openai'].includes(file.name))continue;
    const path=`${dir}/${file.name}`,url=`${prefix}/${file.name}`;
    if(file.isDirectory())await collect(path,url);
    else assets[url]={body:await readFile(path,'utf8'),type:file.name.endsWith('.js')?'text/javascript; charset=utf-8':file.name.endsWith('.css')?'text/css; charset=utf-8':file.name.endsWith('.html')?'text/html; charset=utf-8':'text/plain; charset=utf-8'};
  }
}
await collect('dist');
const api=await readFile('backend/api.mjs','utf8');
const worker=`${api}\nconst assets=${JSON.stringify(assets)};\nexport default {async fetch(request,env){const path=new URL(request.url).pathname;if(path.startsWith('/api/'))return api(request,env);if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405});const a=assets[path==='/'?'/index.html':path];if(!a)return new Response('Not found',{status:404});return new Response(request.method==='HEAD'?null:a.body,{headers:{'content-type':a.type,'cache-control':'no-cache','x-content-type-options':'nosniff','content-security-policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; object-src 'none'; base-uri 'self'"}})}};`;
await mkdir('dist/server',{recursive:true});await mkdir('dist/.openai',{recursive:true});
await writeFile('dist/server/index.js',worker);
await copyFile('.openai/hosting.json','dist/.openai/hosting.json');
console.log(`Built Worker with ${Object.keys(assets).length} embedded assets.`);
