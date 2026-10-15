/* Read-only notifications. Private messages retain their per-order authorization. */
(() => {
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let context=null, identity='', rows=[], busy=false, again=false, error='', updated=0;
  const seenKey=()=>`landed.notices.${identity}`;
  function readSeen(){try{return new Set(JSON.parse(localStorage.getItem(seenKey())||'[]'));}catch{return new Set();}}
  function acknowledge(id){const seen=readSeen();seen.add(id);try{localStorage.setItem(seenKey(),JSON.stringify([...seen].slice(-500)));}catch{} render();}
  function count(){const seen=readSeen();return rows.reduce((n,r)=>n+(r.kind==='message'?r.unread:!['locked','error'].includes(r.kind)&&!seen.has(r.id)?1:0),0);}
  function render(){
    const bell=document.querySelector('#notice-bell');
    const total=count();
    if(bell){bell.hidden=!context;bell.setAttribute('aria-label',`通知${total?'，'+total+' 条未读':''}`);bell.querySelector('span').textContent=total>99?'99+':total||'';}
    document.querySelectorAll('[data-order-notice]').forEach(el=>{const room=rows.find(r=>String(r.job)===el.dataset.orderNotice&&r.kind==='message'&&r.unread);const pending=rows.find(r=>String(r.job)===el.dataset.orderNotice&&['dispute','delivery'].includes(r.kind));el.textContent=room?`${room.unread} 条未读消息`:pending?.title||'';el.hidden=!el.textContent;});
    document.querySelectorAll('[data-notice-host]').forEach(host=>{
      if(!context){host.innerHTML='<p class="note">连接钱包后查看你的订单通知。</p>';return;}
      const seen=readSeen(), compact=host.dataset.noticeHost==='compact', items=compact?rows.slice(0,5):rows;
      host.innerHTML=`<div class="notice-heading"><h3>${compact?'订单提醒':'通知中心'}</h3>${compact?'<a href="#/notifications">查看全部通知 →</a>':'<button class="btn quiet sm" data-notice-refresh>刷新通知</button>'}</div><p class="note notice-explainer">${esc(context.network)} · 站内每 30 秒检查。私密消息需先在对应订单签名验证；查看提醒不等于验收。</p>${error?`<p class="notice-error" role="status">${esc(error)}</p>`:''}<div class="notice-list">${items.map(r=>`<a class="notice-item ${r.kind==='message'&&r.unread||!['locked','error','message'].includes(r.kind)&&!seen.has(r.id)?'unread':''}" href="#/job/${r.job}" data-notice-id="${esc(r.id)}" data-notice-job="${r.job}"><div><strong>${esc(r.title)}</strong><span>${esc(r.text)}</span><small>${esc(r.order)} · #${r.job}</small></div><span class="notice-action">${r.kind==='locked'?'验证后查看':r.kind==='message'&&r.unread?r.unread+' 条未读':'查看'} →</span></a>`).join('')||`<p class="note">${busy||!updated?'正在检查订单通知…':'当前没有需要提醒的订单。'}</p>`}</div>${!compact?`<p class="note notice-footer">${updated?'更新于 '+new Date(updated).toLocaleTimeString():'尚未完成检查'}。关闭页面后不会发送系统推送；暂无平台公告。</p>`:''}`;
      host.querySelector('[data-notice-refresh]')?.addEventListener('click',()=>refresh());
      host.querySelectorAll('[data-notice-id]').forEach(a=>a.onclick=()=>{const row=rows.find(r=>r.id===a.dataset.noticeId);if(row&&row.kind!=='message')acknowledge(row.id);if(row&&['message','locked'].includes(row.kind))window.LandedNotices.focusOrder=Number(a.dataset.noticeJob);});
    });
  }
  async function refresh(){
    if(!context||document.hidden)return;
    if(busy){again=true;return;}
    const c=context, stamp=identity;busy=true;error='';
    try{
      const jobs=(await c.loadJobs()).filter(j=>c.same(j.client,c.wallet)||c.same(j.freelancer,c.wallet));
      if(context!==c)return;
      const next=[];
      for(const j of jobs){
        const base={job:j.id,order:j.title};
        if(j.status===2)next.push({...base,id:`dispute:${j.id}`,kind:'dispute',title:'订单有争议',text:'请查看争议状态并与对方核对处理进度。'});
        for(let i=0;i<j.ms.length;i++){
          const m=j.ms[i];
          if(m.state===1)next.push({...base,id:`delivery:${j.id}:${i}:${m.submittedAt}`,kind:'delivery',title:c.same(j.client,c.wallet)?'作品待你验收':'等待对方验收',text:`阶段 ${i+1} · ${m.name}，查看交付与验收期限。`});
          if(m.state===2)next.push({...base,id:`paid:${j.id}:${i}`,kind:'paid',title:c.same(j.freelancer,c.wallet)?'阶段款已到账':'阶段款已放款',text:`阶段 ${i+1} · ${m.name} · ${c.amount(m.amount)} 测试 USDC。链上状态已确认，详情内可核对付款记录。`});
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
