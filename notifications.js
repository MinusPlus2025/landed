/* Read-only notifications. Private messages retain their per-order authorization. */
(() => {
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let context=null, identity='', rows=[], busy=false, again=false, error='', updated=0;
  const seenKey=()=>`landed.notices.${identity}`;
  function readSeen(){try{return new Set(JSON.parse(localStorage.getItem(seenKey())||'[]'));}catch{return new Set();}}
  function acknowledge(id){const seen=readSeen();seen.add(id);try{localStorage.setItem(seenKey(),JSON.stringify([...seen].slice(-500)));}catch{} render();}
  function count(){const seen=readSeen();return rows.reduce((n,r)=>n+(r.kind==='message'?r.unread:!['locked','error'].includes(r.kind)&&!seen.has(r.id)?1:0),0);}
  let filter='all';
  const icon=kind=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">${kind==='message'?'<path d="M4 4h16v12H8l-4 4V4Z"/><path d="M8 8h8M8 12h5"/>':kind==='paid'?'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18M7 15h4"/>':kind==='dispute'?'<path d="M12 3 2 20h20L12 3Z"/><path d="M12 9v5M12 17v1"/>':'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="m8 12 3 3 5-6"/>'}</svg>`;
  function render(){
    const bell=document.querySelector('#notice-bell'), total=count();
    if(bell){bell.hidden=!context;bell.setAttribute('aria-label',`通知${total?'，'+total+' 条未读':''}`);bell.querySelector('span').textContent=total>99?'99+':total||'';}
    document.querySelectorAll('[data-order-notice]').forEach(el=>{const room=rows.find(r=>String(r.job)===el.dataset.orderNotice&&r.kind==='message'&&r.unread);const pending=rows.find(r=>String(r.job)===el.dataset.orderNotice&&['dispute','delivery'].includes(r.kind));el.textContent=room?`${room.unread} 条未读消息`:pending?.title||'';el.hidden=!el.textContent;});
    document.querySelectorAll('[data-notice-host]').forEach(host=>{
      if(!context){host.innerHTML='<p class="note">连接钱包后查看你的订单通知。</p>';return;}
      const seen=readSeen(), compact=host.dataset.noticeHost==='compact', expanded=host.querySelector('.notice-locked')?.open;
      const unread=r=>r.kind==='message'?r.unread>0:!['locked','error'].includes(r.kind)&&!seen.has(r.id);
      const rank=r=>r.kind==='dispute'?0:r.actionable?1:r.kind==='message'&&r.unread?2:unread(r)?3:4;
      const actual=rows.filter(r=>!['locked','error'].includes(r.kind)).sort((a,b)=>rank(a)-rank(b)||b.job-a.job);
      const locked=rows.filter(r=>['locked','error'].includes(r.kind));
      const eligible=compact?actual.filter(r=>r.kind==='dispute'||r.actionable||unread(r)):actual.filter(r=>filter==='unread'?unread(r):filter==='read'?!unread(r):filter==='chat'?r.kind==='message':filter==='activity'?r.kind!=='message':true);
      const items=compact?eligible.slice(0,3):eligible;
      const row=r=>`<a class="notice-item ${unread(r)?'unread':''}" href="#/job/${r.job}" data-notice-id="${esc(r.id)}" data-notice-job="${r.job}"><span class="notice-icon ${r.kind}">${icon(r.kind)}</span><div class="notice-copy"><strong>${esc(r.order)}</strong><span class="notice-event">${esc(r.title)}${r.kind==='message'&&r.unread?` · ${r.unread} 条未读`:''}</span><small>${esc(r.text)}</small></div><span class="notice-action">${unread(r)?'<i aria-label="未读"></i>':''}<span aria-hidden="true">→</span></span></a>`;
      host.innerHTML=`<div class="notice-heading"><div><h3>${compact?'待办与消息':'通知'}</h3><p>${compact?(eligible.length?`${eligible.length} 项提醒，优先处理需要你回应的订单`:'暂时没有待处理提醒'):'查看合作进展，不错过重要消息'}</p></div>${compact?'<a href="#/notifications">查看全部 →</a>':`<button class="btn quiet sm" data-notice-refresh>${busy?'更新中…':'刷新'}</button>`}</div>${!compact?`<div class="notice-toolbar"><div class="notice-tabs" role="group" aria-label="通知分类">${[['all','全部'],['unread','未读'],['read','已读']].map(([key,label])=>`<button type="button" data-notice-filter="${key}" aria-pressed="${filter===key}">${label}</button>`).join('')}</div><span class="notice-network">${esc(context.network)}</span></div>`:''}${error?`<p class="notice-error" role="status">${esc(error)}</p>`:''}<div class="notice-list">${items.map(row).join('')||(!compact?`<p class="notice-empty">${busy||!updated?'正在检查…':'这里暂时没有通知。'}</p>`:'')}</div>${locked.length?compact?`<a class="notice-private-link" href="#/notifications">另有 ${locked.length} 个订单的私密消息待验证查看 →</a>`:filter==='all'||filter==='chat'?`<details class="notice-locked" ${expanded?'open':''}><summary>私密沟通 <span>${locked.length} 个订单待验证</span></summary><p>首次查看需在订单内签名，仅验证身份，不涉及付款。</p>${locked.map(r=>`<a href="#/job/${r.job}" data-notice-id="${esc(r.id)}" data-notice-job="${r.job}"><span>${esc(r.order)} <small>#${r.job}</small></span><span>${r.kind==='error'?'重试':'验证后查看'} →</span></a>`).join('')}</details>`:'':''}${!compact?`<p class="notice-footer">${updated?'更新于 '+new Date(updated).toLocaleTimeString():'尚未完成检查'} · 页面打开时自动更新</p>`:''}`;
      host.querySelector('[data-notice-refresh]')?.addEventListener('click',()=>refresh());
      host.querySelectorAll('[data-notice-filter]').forEach(b=>b.onclick=()=>{filter=b.dataset.noticeFilter;render();});
      host.querySelectorAll('[data-notice-id]').forEach(a=>a.onclick=()=>{const row=rows.find(r=>r.id===a.dataset.noticeId);if(row&&row.kind!=='message')acknowledge(row.id);if(row&&['message','locked','error'].includes(row.kind))window.LandedNotices.focusOrder=Number(a.dataset.noticeJob);});
    });
  }
  async function refresh(){
    if(!context||document.hidden)return;
    if(busy){again=true;return;}
    const c=context, stamp=identity;busy=true;error='';render();
    try{
      const jobs=(await c.loadJobs()).filter(j=>c.same(j.client,c.wallet)||c.same(j.freelancer,c.wallet));
      if(context!==c)return;
      const next=[];
      for(const j of jobs){
        const base={job:j.id,order:j.title};
        if(j.status===2)next.push({...base,id:`dispute:${j.id}`,kind:'dispute',title:'订单有争议',text:'需要双方核对处理进度'});
        for(let i=0;i<j.ms.length;i++){
          const m=j.ms[i];
          if(m.state===1)next.push({...base,id:`delivery:${j.id}:${i}:${m.submittedAt}`,kind:'delivery',actionable:c.same(j.client,c.wallet),title:c.same(j.client,c.wallet)?'作品待你验收':'等待对方验收',text:`阶段 ${i+1} · ${m.name}`});
          if(m.state===2)next.push({...base,id:`paid:${j.id}:${i}`,kind:'paid',title:c.same(j.freelancer,c.wallet)?'阶段款已到账':'阶段款已放款',text:`阶段 ${i+1} · ${m.name} · ${c.amount(m.amount)} 测试 USDC`});
        }
        if(c.chat&&j.freelancer!=='0x0000000000000000000000000000000000000000'){
          const messageRow={...base,id:`message:${j.id}`,kind:'locked',title:'项目沟通',text:'先进入本订单签名验证，再检查私密消息。'};
          next.unshift(messageRow);
        }
      }
      // Limit each pass to avoid overloading the free service. Unknown is never displayed as zero.
      const chats=next.filter(r=>r.kind==='locked');
      for(const r of chats.slice(0,20)){
        if(context!==c)return;
        try{
          const d=await window.LandedMessages.summary({apiBase:c.apiBase,chain:c.chain,job:r.job,wallet:c.wallet});
          if(!d.locked){r.kind='message';r.unread=d.unread;r.title=d.unread?'收到对方消息':'项目沟通';r.text=d.last?`${c.name(d.last.sender)}：${d.last.body.slice(0,100)}`:'暂无对方消息';}
        }catch{r.kind='error';r.text='消息暂未更新，进入订单后重试。';}
      }
      if(context!==c||identity!==stamp)return;
      rows=next.sort((a,b)=>(b.unread||0)-(a.unread||0));updated=Date.now();
    }catch{if(context===c)error='暂时无法更新通知，保留上次结果；请稍后刷新。';}
    finally{busy=false;render();if(again){again=false;queueMicrotask(refresh);}}
  }
  window.LandedNotices={focusOrder:null,configure(c){const next=c?`${c.chain}:${c.wallet.toLowerCase()}`:'';if(next!==identity){identity=next;context=c;rows=[];updated=0;error='';render();if(c)refresh();}else{render();}},render,refresh};
  setInterval(()=>refresh(),30000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
  window.addEventListener('landed-chat-read',()=>refresh());
})();
