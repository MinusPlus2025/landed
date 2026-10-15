const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm'),fs=require('node:fs');
const source=fs.readFileSync('public/order-messages.js','utf8');
const endpoint='/api/orders', wallet='0x1111111111111111111111111111111111111111';
function setup(status=200){const store=new Map(),calls=[];const window={};const sessionStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)};const context={window,sessionStorage,AbortSignal,fetch:async(url,options)=>{calls.push({url,options});return{ok:status===200,status,json:async()=>({unread:2,messages:[{sender:'0x2222',body:'hello'}]})}}};vm.runInNewContext(source,context);return {store,calls,api:window.LandedMessages,save(chain,job,expires=Date.now()+60000){store.set(`landed.chat.${endpoint}:${chain}:${job}:${wallet}`,JSON.stringify({token:'a'.repeat(64),expires}));}};}
test('chat summary restores valid same-tab session without signing',async()=>{const s=setup();s.save(43113,11);const r=await s.api.summary({chain:43113,job:11,wallet});assert.equal(r.unread,2);assert.equal(s.calls.length,1);assert.match(s.calls[0].options.headers.Authorization,/Bearer /)});
test('chat session never crosses wallet, chain, or order',async()=>{const s=setup();s.save(43113,11);for(const o of [{chain:11230,job:11,wallet},{chain:43113,job:12,wallet},{chain:43113,job:11,wallet:'0x3333'}])assert.equal((await s.api.summary(o)).locked,true);assert.equal(s.calls.length,0)});
test('expired persisted chat session is removed before request',async()=>{const s=setup();s.save(43113,11,Date.now()-1);assert.equal((await s.api.summary({chain:43113,job:11,wallet})).locked,true);assert.equal(s.calls.length,0);assert.equal(s.store.size,0)});
test('server authorization failure clears persisted token',async()=>{const s=setup(401);s.save(43113,11);assert.equal((await s.api.summary({chain:43113,job:11,wallet})).locked,true);assert.equal(s.store.size,0)});
