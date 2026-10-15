const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const ethers=require('ethers');
const source=fs.readFileSync('public/app.js','utf8').split('  // ------------------------------------------------------------------ x402 agent demo')[1].split('  // ------------------------------------------------------------------ visuals')[0];
async function run({chain=43113,balance=0n,asset='0x5425890298aed601595a70AB815c96711a31Bc65'}={}) {
 const els=new Map();const $=key=>{if(!els.has(key))els.set(key,{style:{},value:key==='#ag-budget'?'120':'test',className:'',textContent:''});return els.get(key)};
 let signed=0,requests=0,toasts=0; const address='0x11EAFFE4103Cb577327FF4939D04146F6AD49bC8';
 const signer={getAddress:async()=>address,provider:{},signTypedData:async()=>{signed++;throw Error('unexpected signature')}};
 const context={app:{},$, $$:()=>[],X:o=>o.zh,esc:x=>x,toast:()=>{toasts++},same:(a,b)=>String(a).toLowerCase()===String(b).toLowerCase(),S:{cfg:{chainId:chain},signer,me:address},EP:{request:async()=> '0xa869'},ethers:{...ethers,Contract:class{async balanceOf(){return balance}}},fetch:async()=>{requests++;return{status:402,json:async()=>({accepts:[{scheme:'exact',network:'avalanche-fuji',asset,payTo:'0xBd66aFC8701f4c2F961A873ECc8e74614d2C985e',maxAmountRequired:'10000',maxTimeoutSeconds:300,extra:{name:'USD Coin',version:'2'}}]})}}};
 vm.runInNewContext(source+'\nagentDemo();',context);await $('#ag-go').onclick();return{signed,requests,toasts,faucetHidden:$('#ag-faucet').hidden,error:$('#ag-error').textContent,disabled:$('#ag-go').disabled};
}
test('x402 zero Circle balance stops before signing and explains different faucet token',async()=>{const r=await run();assert.equal(r.signed,0);assert.match(r.error,/不是此代币/);assert.equal(r.disabled,false);assert.equal(r.toasts,0);assert.equal(r.faucetHidden,false)});
test('x402 L1 cannot start a Fuji payment',async()=>{const r=await run({chain:11230});assert.equal(r.requests,0);assert.equal(r.signed,0);assert.match(r.error,/只支持 Avalanche Fuji/)});
test('x402 altered payment asset fails closed before signing',async()=>{const r=await run({asset:ethers.ZeroAddress});assert.equal(r.signed,0);assert.match(r.error,/配置不符/)});
