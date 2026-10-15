const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const source=fs.readFileSync('public/notifications.js','utf8');
const tick=()=>new Promise(r=>setImmediate(r));
function setup(){const host={dataset:{noticeHost:'full'},innerHTML:'',querySelector:()=>null,querySelectorAll:()=>[]};const window={addEventListener(){},LandedMessages:{summary:async()=>({locked:true})}};vm.runInNewContext(source,{window,document:{hidden:false,querySelector:()=>null,querySelectorAll:s=>s==='[data-notice-host]'?[host]:[],addEventListener(){}},localStorage:{getItem:()=>null,setItem(){}},setInterval(){},queueMicrotask});return {host,api:window.LandedNotices};}
const job={id:1,title:'音乐需求',client:'a',freelancer:'b',status:2,ms:[{state:2,name:'小样',amount:20n},{state:1,name:'成品',submittedAt:10}]};
const config=(wallet,loadJobs)=>({wallet,chain:43113,network:'Fuji',chat:true,same:(a,b)=>a===b,amount:String,name:String,loadJobs});
test('notifications show chain states and do not invent unread for locked orders',async()=>{const s=setup();s.api.configure(config('a',async()=>[job]));await tick();assert.match(s.host.innerHTML,/阶段款已放款/);assert.match(s.host.innerHTML,/订单有争议/);assert.match(s.host.innerHTML,/验证后查看/);assert.doesNotMatch(s.host.innerHTML,/0 条未读/)});
test('switching wallet during refresh discards old data and queues the new check',async()=>{const s=setup();let resolve;const pending=new Promise(r=>resolve=r);s.api.configure(config('a',()=>pending));s.api.configure(config('c',async()=>[]));resolve([job]);await tick();await tick();assert.doesNotMatch(s.host.innerHTML,/音乐需求/);assert.match(s.host.innerHTML,/这里暂时没有通知/)});
test('opening an activity reduces bell count and moves it to read filter',async()=>{
 const storage=new Map(), badge={textContent:''},bell={setAttribute(){},querySelector:()=>badge};
 let links=[],tabs=[];
 const host={dataset:{noticeHost:'full'},innerHTML:'',querySelector:()=>null,querySelectorAll(selector){
  if(selector==='[data-notice-id]')return links=[...this.innerHTML.matchAll(/data-notice-id="([^"]+)" data-notice-job="([^"]+)"/g)].map(m=>({dataset:{noticeId:m[1],noticeJob:m[2]}}));
  if(selector==='[data-notice-filter]')return tabs=[...this.innerHTML.matchAll(/data-notice-filter="([^"]+)"/g)].map(m=>({dataset:{noticeFilter:m[1]}}));
  return [];
 }};
 const window={addEventListener(){}};
 vm.runInNewContext(source,{window,document:{hidden:false,querySelector:()=>bell,querySelectorAll:s=>s==='[data-notice-host]'?[host]:[],addEventListener(){}},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},setInterval(){},queueMicrotask});
 window.LandedNotices.configure({...config('a',async()=>[job]),chat:false});await tick();assert.equal(badge.textContent,3);
 links.find(a=>a.dataset.noticeId==='paid:1:0').onclick();assert.equal(badge.textContent,2);
 tabs.find(t=>t.dataset.noticeFilter==='read').onclick();assert.match(host.innerHTML,/阶段款已放款/);assert.doesNotMatch(host.innerHTML,/作品待你验收/);
 tabs.find(t=>t.dataset.noticeFilter==='unread').onclick();assert.doesNotMatch(host.innerHTML,/阶段款已放款/);assert.match(host.innerHTML,/作品待你验收/);
});
