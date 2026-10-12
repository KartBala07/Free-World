import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
// Development-only R2 adapter; production uses the provisioned R2 binding.
export class LocalBucket{
  constructor(directory){this.directory=directory;this.queue=Promise.resolve();}
  async get(key){try{const body=await readFile(`${this.directory}/${key}`,'utf8');return {body,httpEtag:'"'+createHash('sha256').update(body).digest('hex')+'"'};}catch(e){if(e.code==='ENOENT')return null;throw e;}}
  async put(key,value,options={}){
    const result=this.queue.then(async()=>{
      const old=await this.get(key),condition=options.onlyIf;
      if(condition?.get('if-match')&&old?.httpEtag!==condition.get('if-match'))return null;
      if(condition?.get('if-none-match')==='*'&&old)return null;
      await mkdir(`${this.directory}/worlds`,{recursive:true});await writeFile(`${this.directory}/${key}`,value);
      return this.get(key);
    });this.queue=result.catch(()=>{});return result;
  }
}
