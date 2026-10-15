/* Optional same-origin collaboration service. Static exports never advertise it. */
(() => {
  let active = null;
  const sessions = new Map(), drafts = new Map();
  const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  window.LandedMessages = { mount(options) {
    active?.stop();
    const {host,chain,job,wallet,client,signer,contract,isCurrent}=options;
    const key=`${chain}:${job}:${wallet.toLowerCase()}`,base=`/api/orders/${chain}/${job}`;
    let live=true,timer,versions=[],feedback=null,rows=[],busy=false,pendingId=null,loading=false,hasOlder=false;
    const current=()=>live&&host.isConnected&&isCurrent();
    active={stop(){live=false;clearTimeout(timer);}};
    host.innerHTML=`<section class="panel order-chat"><h3>项目沟通 <span class="chat-unread" aria-live="polite"></span></h3><p class="note">仅本订单双方可见。消息保存在项目服务中；聊天确认不等于验收或付款。</p><button class="btn ink block chat-login">钱包签名，进入沟通</button><div class="chat-content" hidden><button class="btn quiet sm chat-refresh">刷新消息</button><button class="btn quiet sm chat-older" hidden>查看更早消息</button><div class="chat-list" role="log" aria-label="订单消息"></div><div class="chat-context" hidden></div><label class="f">消息或修改意见<textarea class="chat-input" rows="4" maxlength="2000" placeholder="说明需求、反馈或需要确认的问题"></textarea></label><p class="chat-draft note"></p><button class="btn ink block chat-send">发送消息</button><p class="note">Enter 换行，Ctrl / ⌘ + Enter 发送。消息不代替正式验收。</p></div><p class="chat-status note" role="status"></p></section>`;
    const q=s=>host.querySelector(s),status=q('.chat-status'),input=q('.chat-input');input.value=drafts.get(key)||'';
    const message=s=>{if(current())status.textContent=s;};
    async function api(route,body){const token=sessions.get(key);const res=await fetch(base+route,{signal:AbortSignal.timeout(15000),method:body?'POST':'GET',headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},...(body?{body:JSON.stringify(body)}:{})});const data=await res.json();if(!res.ok){if(res.status===401){sessions.delete(key);if(current()){q('.chat-login').hidden=false;message('登录已过期，请重新签名。输入的草稿仍保留。');}}throw new Error(data.error||'请求失败，请稍后重试');}return data;}
    function draw(){if(!current())return;q('.chat-list').innerHTML=rows.length?rows.map(m=>`<article class="chat-message ${m.sender===wallet.toLowerCase()?'mine':''}"><div class="chat-meta"><b>${m.sender===client.toLowerCase()?'需求方':'接单人'}${m.sender===wallet.toLowerCase()?' · 我':''}</b><time>${new Date(m.created).toLocaleString()}</time></div>${m.kind==='feedback'?`<a href="#" class="chat-version" data-stage="${m.stage}" data-version="${esc(m.version)}">阶段 ${m.stage+1} · ${esc(versions.find(v=>v.hash===m.version)?.label||'交付版本')} 的修改意见</a>`:''}<p>${esc(m.body)}</p></article>`).join(''):'<p class="note">还没有消息。可以先确认本阶段的交付要求。</p>';q('.chat-list').querySelectorAll('[data-stage]').forEach(a=>a.onclick=e=>{e.preventDefault();const el=document.querySelector(`[data-history="${Number(a.dataset.stage)}"]`);if(el){el.open=true;el.scrollIntoView({block:'center'});}});}
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
    async function markRead(){if(!current()||document.hidden||!rows.length)return;const list=q('.chat-list');if(list.scrollHeight-list.scrollTop-list.clientHeight>40)return;await api('/read',{id:rows.at(-1).id});if(current())q('.chat-unread').textContent='';}
    async function updateVersions(){const events=await contract.queryFilter(contract.filters.Delivered(job),0,'latest');const counts={};versions=events.map(e=>({stage:Number(e.args.milestone),hash:e.transactionHash,label:`V${counts[Number(e.args.milestone)]=(counts[Number(e.args.milestone)]||0)+1}`}));}
    async function start(){if(!current())return;q('.chat-login').hidden=true;q('.chat-content').hidden=false;await updateVersions();await load();message('');schedule();}
    function schedule(){clearTimeout(timer);timer=setTimeout(async()=>{if(!current())return;try{if(!document.hidden)await load();}catch(e){message(e.message);}if(sessions.has(key))schedule();},12000);}
    q('.chat-login').onclick=async()=>{const button=q('.chat-login');button.disabled=true;try{const c=await api('/challenge',{address:wallet});const signature=await signer.signMessage(c.message);if(!current())return;const s=await api('/session',{nonce:c.nonce,signature});sessions.set(key,s.token);await start();}catch(e){message(e.code===4001?'你取消了签名，可以稍后重试。':e.message);}finally{if(current())button.disabled=false;}};
    input.oninput=()=>{drafts.set(key,input.value);pendingId=null;q('.chat-send').disabled=!input.value.trim();q('.chat-draft').textContent=input.value?'草稿仅保留在当前页面会话，刷新后不保留。':'';};
    q('.chat-send').disabled=!input.value.trim();
    input.onkeydown=e=>{if(!e.isComposing&&e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();if(!q('.chat-send').disabled)q('.chat-send').click();}};
    q('.chat-list').onclick=()=>markRead().catch(e=>message(e.message));input.onfocus=()=>markRead().catch(e=>message(e.message));
    q('.chat-refresh').onclick=()=>load().then(()=>message('消息已更新')).catch(e=>message(e.message));q('.chat-older').onclick=()=>load(true).catch(e=>message(e.message));
    q('.chat-send').onclick=async()=>{if(busy||!input.value.trim())return;busy=true;input.disabled=true;q('.chat-send').disabled=true;q('.chat-send').textContent='发送中…';pendingId ||= crypto.randomUUID();try{await api('/messages',{body:input.value,...(feedback?{kind:'feedback',stage:feedback.stage,version:feedback.hash}:{kind:'message'}),clientId:pendingId});if(!current())return;input.value='';drafts.delete(key);pendingId=null;feedback=null;q('.chat-context').hidden=true;q('.chat-send').textContent='发送消息';q('.chat-draft').textContent='';message('已发送并保存');try{await load();await markRead();}catch{message('消息已保存，但列表刷新失败。请点刷新消息，不必重复发送。');}}catch(e){message('发送未确认，内容已保留。请重试；重复请求不会重复保存。');}finally{busy=false;if(current()){input.disabled=false;q('.chat-send').disabled=!input.value.trim();q('.chat-send').textContent=feedback?'发送修改意见':'发送消息';}}};
    // Feedback is a durable discussion record; it never changes the escrow state or timer.
    async function beginFeedback(stage){try{await updateVersions();if(!current())return;const candidates=versions.filter(v=>v.stage===stage);if(!candidates.length)throw new Error('该阶段尚无交付版本');if(!sessions.has(key)){message('请先用钱包签名进入沟通，再选择修改版本。');host.scrollIntoView({block:'center'});return;}feedback=candidates.at(-1);q('.chat-content').hidden=false;const box=q('.chat-context');box.hidden=false;box.innerHTML=`<label class="f">针对哪个交付版本<select class="chat-version-select">${candidates.map(v=>`<option value="${esc(v.hash)}" ${v===feedback?'selected':''}>阶段 ${v.stage+1} · ${v.label}</option>`).join('')}</select></label><p class="note">修改意见不会暂停链上验收计时，也不会自动拒收。请与接单人确认重交安排。</p><button class="btn quiet sm chat-cancel">改为普通消息</button>`;box.querySelector('select').onchange=e=>{feedback=candidates.find(v=>v.hash===e.target.value);pendingId=null;};box.querySelector('.chat-cancel').onclick=()=>{feedback=null;pendingId=null;box.hidden=true;q('.chat-send').textContent='发送消息';};q('.chat-send').textContent='发送修改意见';host.scrollIntoView({block:'center'});input.focus({preventScroll:true});}catch(e){message(e.message);}}
    if(sessions.has(key))start().catch(e=>{message(e.message);q('.chat-login').hidden=false;});
    return {beginFeedback};
  }};
})();
