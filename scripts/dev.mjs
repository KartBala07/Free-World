import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {api} from '../backend/api.mjs';
import {LocalBucket} from '../backend/local-bucket.mjs';
const env={BUCKET:new LocalBucket('.local-data')};
createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://localhost:8080');let response;
    if(url.pathname.startsWith('/api/'))response=await api(new Request(url,{method:req.method,headers:req.headers,...(['GET','HEAD'].includes(req.method)?{}:{body:req,duplex:'half'})}),env);
    else{
      const path=url.pathname==='/'?'/index.html':url.pathname;
      if(!/^\/[a-zA-Z0-9/_.-]+$/.test(path)||path.includes('..')||path.startsWith('/server/')||path.startsWith('/.'))throw Error('Not found');
      const body=await readFile('dist'+path);response=new Response(body,{headers:{'content-type':path.endsWith('.js')?'text/javascript':path.endsWith('.css')?'text/css':path.endsWith('.html')?'text/html':'text/plain'}});
    }
    res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
  }catch{res.writeHead(404);res.end('Not found');}
}).listen(8080,'127.0.0.1',()=>console.log('Free City: http://localhost:8080'));
