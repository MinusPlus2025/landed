/* Private order collaboration: local service or the configured Supabase edge endpoint. */
(() => {
  let active = null;
  const drafts = new Map(), memorySessions = new Map();
  // Same-tab, account/network/order scoped; server still checks every request.
  const sessions = {
    get(key) { const cached=memorySessions.get(key); if(cached?.expires>Date.now())return cached.token; try { const v=JSON.parse(sessionStorage.getItem('landed.chat.'+key)||'null'); if(v?.expires>Date.now()&&/^[a-f0-9]{64}$/.test(v.token))return v.token; this.delete(key); } catch {} },
    has(key) { return !!this.get(key); },
    set(key,token) { const value={token,expires:Date.now()+29*60000}; memorySessions.set(key,value); try { sessionStorage.setItem('landed.chat.'+key,JSON.stringify(value)); } catch {} },
    delete(key) { memorySessions.delete(key); try { sessionStorage.removeItem('landed.chat.'+key); } catch {} }
  };
  const endpointFor=o=>o.apiBase||'/api/orders';
  const allowed=endpoint=>['/api/orders','https://niovryyussrxzdwyxtks.supabase.co/functions/v1/order-chat'].includes(endpoint);
  const keyFor=o=>`${endpointFor(o)}:${o.chain}:${o.job}:${o.wallet.toLowerCase()}`;
  async function summary(o) {
    const endpoint=endpointFor(o), key=keyFor(o), token=sessions.get(key);
    if(!allowed(endpoint))throw Error('项目沟通服务地址无效');
    if(!token)return {locked:true};
    const r=await fetch(`${endpoint}/${o.chain}/${o.job}/messages`,{headers:{Authorization:`Bearer ${token}`},signal:AbortSignal.timeout(15000)});
    if(r.status===401||r.status===403){sessions.delete(key);return {locked:true};}
    if(!r.ok)throw Error('消息暂未更新，请重试');
    const d=await r.json();return {unread:d.unread||0,last:d.messages.filter(m=>m.sender.toLowerCase()!==o.wallet.toLowerCase()).at(-1)};
  }
  function clearSessions() { memorySessions.clear(); try { Object.keys(sessionStorage).filter(k=>k.startsWith('landed.chat.')).forEach(k=>sessionStorage.removeItem(k)); } catch {} active?.stop(); }

  const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  window.LandedMessages = { summary, clearSessions, mount(options) {
    active?.stop();
    const {host,chain,job,wallet,client,signer,contract,isCurrent}=options;
    const endpoint = options.apiBase || "/api/orders";
    if (!allowed(endpoint)) throw new Error("项目沟通服务地址无效");
    const key=`${endpoint}:${chain}:${job}:${wallet.toLowerCase()}`,base=`${endpoint}/${chain}/${job}`;
    let live=true,timer,versions=[],feedback=null,rows=[],busy=false,pendingId=null,loading=false,hasOlder=false;
    const current=()=>live&&host.isConnected&&isCurrent();
    active={stop(){live=false;clearTimeout(timer);}};
    host.innerHTML=`<section class="panel order-chat"><header class="chat-header"><h3>项目沟通 <span class="chat-unread" aria-live="polite"></span></h3><button class="btn quiet sm chat-refresh" hidden>刷新消息</button></header><p class="note">仅本订单双方可见，沟通内容不上链、不产生 Gas 费用。验收与付款需在对应阶段确认。</p><button class="btn quiet sm chat-login">验证身份，查看历史消息</button><div class="chat-content"><button class="btn quiet sm chat-older" hidden>查看更早消息</button><div class="chat-list" role="log" aria-label="订单消息"></div><div class="chat-context" hidden></div><label class="f">消息或修改意见<textarea class="chat-input" rows="4" maxlength="2000" placeholder="直接写下需求或修改意见"></textarea></label><p class="chat-draft note"></p><button class="btn ink block chat-send">发送消息</button><p class="note chat-help">Enter 换行，Ctrl / ⌘ + Enter 发送。首次发送需钱包签名验证身份，不涉及付款。</p></div><p class="chat-status note" role="status"></p></section>`;
    const q=s=>host.querySelector(s),status=q('.chat-status'),input=q('.chat-input');input.value=drafts.get(key)||'';
    const message=s=>{if(current())status.textContent=s;};
    async function api(route,body){const token=sessions.get(key);const res=await fetch(base+route,{signal:AbortSignal.timeout(15000),method:body?'POST':'GET',headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},...(body?{body:JSON.stringify(body)}:{})});const data=await res.json();if(!res.ok){if(res.status===401||res.status===403){sessions.delete(key);clearTimeout(timer);if(current()){q('.chat-login').hidden=false;q('.chat-content').hidden=false;q('.chat-refresh').hidden=true;rows=[];q('.chat-list').innerHTML='<p class="note">验证身份后可查看历史消息。你可以先写下内容，再点击发送。</p>';}}throw Object.assign(new Error(res.status===401?'登录已过期，请重新签名。输入的草稿仍保留。':data.error||'请求失败，请稍后重试'),{status:res.status});}return data;}
    function identity(sender) {
      const profile=options.profileFor?.(sender)||{};
      const role=sender.toLowerCase()===client.toLowerCase()?'需求方':'接单人';
      const name=profile.name||`${sender.slice(0,6)}…${sender.slice(-4)}`;
      const candidate=profile.avatar||'';
      const avatar=/^https:\/\//i.test(candidate)||/^data:image\/(png|jpeg|webp);base64,/i.test(candidate)?candidate:options.fallbackAvatar?.(sender);
      return `<span class="chat-person">${avatar?`<img src="${esc(avatar)}" alt="" referrerpolicy="no-referrer">`:''}<span><b>${esc(name)}</b><small>${role}${sender.toLowerCase()===wallet.toLowerCase()?' · 我':''}</small></span></span>`;
    }
    function draw(){if(!current())return;q('.chat-list').innerHTML=rows.length?rows.map(m=>`<article class="chat-message ${m.sender===wallet.toLowerCase()?'mine':''}"><div class="chat-meta">${identity(m.sender)}<time>${new Date(m.created).toLocaleString()}</time></div>${m.kind==='feedback'?`<a href="#" class="chat-version" data-stage="${m.stage}" data-version="${esc(m.version)}">阶段 ${m.stage+1} · ${esc(versions.find(v=>v.hash===m.version)?.label||'交付版本')} 的修改意见</a>`:''}<p>${esc(m.body)}</p></article>`).join(''):'<p class="note">还没有消息。可以先确认本阶段的交付要求。</p>';q('.chat-list').querySelectorAll('[data-stage]').forEach(a=>a.onclick=e=>{e.preventDefault();const el=document.querySelector(`[data-history="${Number(a.dataset.stage)}"]`);if(el){el.open=true;el.scrollIntoView({block:'center'});}});}
    async function load(older=false){
      if(loading||!current())return;
      loading=true;const scroll=q('.chat-list'),bottom=scroll.scrollHeight-scroll.scrollTop-scroll.clientHeight<40,top=scroll.scrollTop,height=scroll.scrollHeight;
      q('.chat-refresh').disabled=q('.chat-older').disabled=true;
      try{
        const data=await api('/messages'+(older&&rows.length?'?before='+rows[0].id:''));if(!current())return;
        if(older||!rows.length)hasOlder=data.more;
        const merged=new Map(rows.map(m=>[m.id,m]));data.messages.forEach(m=>merged.set(m.id,m));rows=[...merged.values()].sort((a,b)=>a.id-b.id);
        draw();q('.chat-older').hidden=!hasOlder;q('.chat-unread').textContent=data.unread?`${data.unread} 条未读`:'';
        scroll.scrollTop=older?top+(scroll.scrollHeight-height):bottom?scroll.scrollHeight:top;
      }finally{loading=false;if(current())q('.chat-refresh').disabled=q('.chat-older').disabled=false;}
    }
    async function markRead(){if(!current()||document.hidden||!rows.length)return;const list=q('.chat-list');if(list.scrollHeight-list.scrollTop-list.clientHeight>40)return;await api('/read',{id:rows.at(-1).id});if(current()){q('.chat-unread').textContent='';window.dispatchEvent(new Event('landed-chat-read'));}}
    async function updateVersions(){const events=await contract.queryFilter(contract.filters.Delivered(job),0,'latest');const counts={};versions=events.map(e=>({stage:Number(e.args.milestone),hash:e.transactionHash,label:`V${counts[Number(e.args.milestone)]=(counts[Number(e.args.milestone)]||0)+1}`}));}
    async function start(){if(!current())return;q('.chat-login').hidden=true;q('.chat-content').hidden=false;q('.chat-refresh').hidden=false;await load();message('');schedule();try{await updateVersions();if(current())draw();}catch{message('消息已加载；交付版本暂未加载，稍后可重试修改反馈。');}}
    function schedule(){clearTimeout(timer);timer=setTimeout(async()=>{if(!current())return;try{if(!document.hidden)await load();}catch(e){message(e.message);}if(sessions.has(key))schedule();},12000);}
    async function authenticate(){
      if(sessions.has(key))return true;
      const button=q('.chat-login');button.disabled=true;
      try{message('请在钱包验证身份，不涉及转账或付款。');const c=await api('/challenge',{address:wallet});if(!current())return false;const signature=await signer.signMessage(c.message);if(!current())return false;const s=await api('/session',{nonce:c.nonce,signature});sessions.set(key,s.token);await start();return current();}
      catch(e){message((e.code===4001||e.code==='ACTION_REJECTED'||e.info?.error?.code===4001)?'已取消身份验证，输入内容仍保留。':e.message);return false;}
      finally{if(current())button.disabled=false;}
    }
    q('.chat-login').onclick=authenticate;
    if(!sessions.has(key))q('.chat-list').innerHTML='<p class="note">你可以直接写下内容并发送；历史消息将在身份验证后显示。</p>';
    input.oninput=()=>{drafts.set(key,input.value);pendingId=null;q('.chat-send').disabled=!input.value.trim();q('.chat-draft').textContent=input.value?'草稿仅保留在当前页面会话，刷新后不保留。':'';};
    q('.chat-send').disabled=!input.value.trim();
    input.onkeydown=e=>{if(!e.isComposing&&e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();if(!q('.chat-send').disabled)q('.chat-send').click();}};
    q('.chat-list').onclick=()=>markRead().catch(e=>message(e.message));input.onfocus=()=>markRead().catch(e=>message(e.message));
    q('.chat-refresh').onclick=()=>load().then(()=>message('消息已更新')).catch(e=>message(e.message));q('.chat-older').onclick=()=>load(true).catch(e=>message(e.message));
    q('.chat-send').onclick=async()=>{if(busy||!current()||!input.value.trim())return;busy=true;input.disabled=true;q('.chat-send').disabled=true;q('.chat-send').textContent='发送中…';pendingId ||= crypto.randomUUID();try{if(!await authenticate())return;if(!current())return;await api('/messages',{body:input.value,...(feedback?{kind:'feedback',stage:feedback.stage,version:feedback.hash}:{kind:'message'}),clientId:pendingId});if(!current())return;input.value='';drafts.delete(key);pendingId=null;feedback=null;q('.chat-context').hidden=true;q('.chat-send').textContent='发送消息';q('.chat-draft').textContent='';message('已发送并保存');try{await load();await markRead();}catch{message('消息已保存，但列表刷新失败。请点刷新消息，不必重复发送。');}}catch(e){message(e.status===401||e.status===403?e.message:'发送未确认，内容已保留。请重试；重复请求不会重复保存。');}finally{busy=false;if(current()){input.disabled=false;q('.chat-send').disabled=!input.value.trim();q('.chat-send').textContent=feedback?'发送修改意见':'发送消息';}}};
    // Feedback is a durable discussion record; it never changes the escrow state or timer.
    async function beginFeedback(stage){try{await updateVersions();if(!current())return;const candidates=versions.filter(v=>v.stage===stage);if(!candidates.length)throw new Error('该阶段尚无交付版本');feedback=candidates.at(-1);q('.chat-content').hidden=false;const box=q('.chat-context');box.hidden=false;box.innerHTML=`<label class="f">针对哪个交付版本<select class="chat-version-select">${candidates.map(v=>`<option value="${esc(v.hash)}" ${v===feedback?'selected':''}>阶段 ${v.stage+1} · ${v.label}</option>`).join('')}</select></label><p class="note">修改意见不会暂停链上验收计时，也不会自动拒收。请与接单人确认重交安排。</p><button class="btn quiet sm chat-cancel">改为普通消息</button>`;box.querySelector('select').onchange=e=>{feedback=candidates.find(v=>v.hash===e.target.value);pendingId=null;};box.querySelector('.chat-cancel').onclick=()=>{feedback=null;pendingId=null;box.hidden=true;q('.chat-send').textContent='发送消息';};q('.chat-send').textContent='发送修改意见';host.scrollIntoView({block:'center'});input.focus({preventScroll:true});}catch(e){message(e.message);}}
    if(sessions.has(key))start().catch(e=>{message(e.message);q('.chat-login').hidden=false;});
    return {beginFeedback};
  }};
})();
