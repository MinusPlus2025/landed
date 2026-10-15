import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { ethers } from 'npm:ethers@6.17.0';
const ORIGIN='https://minusplus2025.github.io';
const db=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false,autoRefreshToken:false}});
const abi=['function getJob(uint256) view returns ((address client,address freelancer,address token,uint256 budget,uint256 released,uint64 createdAt,uint64 reviewWindow,uint32 current,uint8 status,string title,string details,string category))','event Delivered(uint256 indexed jobId,uint256 milestone,string delivery)'];
const nets={43113:['https://api.avax-test.network/ext/bc/C/rpc','0x05d5A6b00eC5eFcE7bAE65504543c75f3795Dfa8'],11230:['https://nodes-prod.43.207.73.245.sslip.io/ext/bc/5QhziTvT346pzpwrA6WiDshkMTAGgaKYJJ5mqou6hBxGPPxKM/rpc','0x8F716e4cEc7e336af78b44e738c013e4ff1b908a']};
const contracts=new Map(Object.entries(nets).map(([chain,[rpc,address]])=>{const r=new ethers.FetchRequest(rpc);r.timeout=8000;return[Number(chain),new ethers.Contract(address,abi,new ethers.JsonRpcProvider(r,Number(chain),{staticNetwork:true}))]}));
const headers={'Access-Control-Allow-Origin':ORIGIN,'Access-Control-Allow-Headers':'Content-Type, Authorization, apikey, x-client-info','Access-Control-Allow-Methods':'GET, POST, OPTIONS','Cache-Control':'no-store','Vary':'Origin','Content-Type':'application/json'};
const reply=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers});
const fail=(status:number,message:string)=>Object.assign(new Error(message),{status});
const random=()=>ethers.hexlify(ethers.randomBytes(32)).slice(2);
const hash=(s:string)=>ethers.sha256(ethers.toUtf8Bytes(s));
async function checked(q:any){const r=await q;if(r.error)throw fail(r.error.message?.includes('RATE_LIMIT')?429:503,r.error.message?.includes('RATE_LIMIT')?'发送过于频繁，请稍后重试':'项目沟通暂不可用，请稍后重试');return r;}
async function authorize(contract:any,job:number,wallet:string){const j=await contract.getJob(job);if(j.freelancer===ethers.ZeroAddress||![j.client.toLowerCase(),j.freelancer.toLowerCase()].includes(wallet.toLowerCase()))throw fail(403,'仅已确定合作的订单双方可访问');return j;}
Deno.serve(async(req:Request)=>{
 try{
  if(req.headers.get('origin')&&req.headers.get('origin')!==ORIGIN)return reply({error:'来源不匹配'},403);
  if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
  const url=new URL(req.url);
  if(url.pathname.endsWith('/health')&&req.method==='GET')return reply({ok:true,service:'Landed testnet order chat'});
  const match=url.pathname.match(/\/order-chat\/(43113|11230)\/(\d+)\/(challenge|session|messages|read)$/);
  if(!match)return reply({error:'接口不存在'},404);
  const chain=Number(match[1]),job=Number(match[2]),action=match[3],contract=contracts.get(chain);
  if(!Number.isSafeInteger(job)||job<0)throw fail(400,'订单无效');
  if(!((action==='messages'&&req.method==='GET')||req.method==='POST'))throw fail(405,'请求方式无效');
  // Durable limiter across edge instances, address stored only as a digest.
  const ip=req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown';
  if(!(await checked(db.rpc('landed_chat_rate',{k:hash(ip),max_count:120}))).data)throw fail(429,'操作过于频繁，请稍后重试');
  let body:any={};
  if(req.method==='POST'){if(Number(req.headers.get('content-length')||0)>12288)throw fail(413,'内容过长');const text=await req.text();if(text.length>12288)throw fail(413,'内容过长');try{body=JSON.parse(text)}catch{throw fail(400,'请求格式无效')}}
  if(action==='challenge'){
   if(!ethers.isAddress(body.address))throw fail(400,'钱包地址无效');const wallet=ethers.getAddress(body.address);await authorize(contract,job,wallet);
   const nonce=random(),expires=Date.now()+300000,message=`Landed 项目沟通登录\nOrigin: ${ORIGIN}\nWallet: ${wallet}\nChain: ${chain}\nOrder: ${job}\nNonce: ${nonce}\nExpires: ${new Date(expires).toISOString()}\n仅验证身份，不授权转账或付款。`;
   await checked(db.from('landed_chat_auth').insert({id:hash(nonce),kind:'challenge',data:{wallet,chain,job,message},expires}));return reply({nonce,message});
  }
  if(action==='session'){
   if(typeof body.nonce!=='string'||!/^[0-9a-f]{64}$/.test(body.nonce)||typeof body.signature!=='string')throw fail(401,'登录请求无效');
   // DELETE RETURNING consumes the nonce atomically, even across concurrent calls.
   const {data}=await checked(db.from('landed_chat_auth').delete().eq('id',hash(body.nonce)).eq('kind','challenge').gt('expires',Date.now()).select('data'));const c=data?.[0]?.data;
   if(!c||c.chain!==chain||c.job!==job)throw fail(401,'登录请求已失效，请重试');
   let signer;try{signer=ethers.verifyMessage(c.message,body.signature)}catch{throw fail(401,'签名无效')}
   if(signer!==c.wallet)throw fail(401,'签名账户不匹配');await authorize(contract,job,signer);
   const token=random();await checked(db.from('landed_chat_auth').insert({id:hash(token),kind:'session',data:{wallet:signer.toLowerCase(),chain,job},expires:Date.now()+1800000}));return reply({token});
  }
  const token=(req.headers.get('authorization')||'').replace(/^Bearer /,'');if(!/^[0-9a-f]{64}$/.test(token))throw fail(401,'请用钱包签名登录项目沟通');
  const session=(await checked(db.from('landed_chat_auth').select('data').eq('id',hash(token)).eq('kind','session').gt('expires',Date.now()))).data?.[0]?.data;
  if(!session||session.chain!==chain||session.job!==job)throw fail(401,'登录已过期，请重新签名');const wallet=session.wallet,j=await authorize(contract,job,wallet);
  if(action==='messages'&&req.method==='GET'){
   const before=Number(url.searchParams.get('before')||Number.MAX_SAFE_INTEGER);if(!Number.isSafeInteger(before)||before<1)throw fail(400,'分页参数无效');
   const rows=(await checked(db.from('landed_chat_messages').select('*').eq('chain',chain).eq('job',job).lt('id',before).order('id',{ascending:false}).limit(101))).data;
   const last=(await checked(db.from('landed_chat_reads').select('last_id').eq('chain',chain).eq('job',job).eq('wallet',wallet))).data?.[0]?.last_id||0;
   const unread=(await checked(db.from('landed_chat_messages').select('id',{count:'exact',head:true}).eq('chain',chain).eq('job',job).gt('id',last).neq('sender',wallet))).count;
   return reply({messages:rows.slice(0,100).reverse(),more:rows.length>100,unread});
  }
  if(action==='messages'){
   const {body:text,kind='message',stage=null,version=null,clientId}=body;
   if(typeof text!=='string'||!text.trim()||text.length>2000||!['message','feedback'].includes(kind)||!/^[-a-zA-Z0-9]{16,64}$/.test(clientId||''))throw fail(400,'请输入1–2000字的消息');
   if(kind==='feedback'){
    if(wallet!==j.client.toLowerCase())throw fail(403,'仅需求方可提交修改反馈');
    if(!Number.isSafeInteger(stage)||stage<0||!/^0x[0-9a-fA-F]{64}$/.test(version||''))throw fail(400,'请选择具体交付版本');
    const receipt=await contract!.runner!.provider!.getTransactionReceipt(version);
    if(!(receipt?.status===1&&receipt.logs.some(log=>{if(log.address.toLowerCase()!==String(contract!.target).toLowerCase())return false;try{const e=contract!.interface.parseLog(log);return e?.name==='Delivered'&&Number(e.args.jobId)===job&&Number(e.args.milestone)===stage}catch{return false}})))throw fail(400,'交付版本与阶段不匹配');
   }else if(stage!==null||version!==null)throw fail(400,'普通消息不附交付凭据');
   const message=(await checked(db.rpc('landed_chat_send',{c:chain,j:job,w:wallet,k:kind,s:stage,v:version,b:text.trim(),cid:clientId}))).data;
   return reply({message},201);
  }
  const id=Number(body.id);if(!Number.isSafeInteger(id)||id<1)throw fail(400,'消息无效');
  if(!(await checked(db.rpc('landed_chat_read',{c:chain,j:job,w:wallet,i:id}))).data)throw fail(400,'消息无效');return reply({ok:true});
 }catch(error:any){return reply({error:error.status?error.message:'项目沟通暂不可用，请稍后重试；消息草稿仍保留'},error.status||503)}
});
