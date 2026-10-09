// Landed x402 Worker: AI 助手付 0.01 USDC（Fuji）后才能通过接口发布需求
// 部署：Cloudflare Workers，粘贴本文件即可。不含任何私钥。
const FACILITATORS = ['https://facilitator.payai.network', 'https://facilitator.ultravioletadao.xyz'];
const PAY_TO = '0xBd66aFC8701f4c2F961A873ECc8e74614d2C985e'; // Landed 收款地址
const USDC = '0x5425890298aed601595a70AB815c96711a31Bc65';   // Circle Fuji USDC
const PRICE = '10000';                                       // 0.01 USDC（6 位小数）

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, X-PAYMENT',
  'Access-Control-Expose-Headers': 'X-PAYMENT-RESPONSE',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};
const json = (body, status = 200, extra = {}) =>
  new Response(JSON.stringify(body, null, 2), { status, headers: { 'Content-Type': 'application/json', ...CORS, ...extra } });

function requirements(url) {
  return {
    scheme: 'exact', network: 'avalanche-fuji', maxAmountRequired: PRICE,
    resource: url, description: 'Landed: post a job via API', mimeType: 'application/json',
    payTo: PAY_TO, maxTimeoutSeconds: 300, asset: USDC,
    extra: { name: 'USD Coin', version: '2' },
  };
}

export default {
  async fetch(req) {
    if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
    const url = new URL(req.url);
    if (url.pathname !== '/api/jobs') return json({ ok: true, service: 'Landed x402', endpoint: '/api/jobs' });

    const reqs = requirements(url.origin + url.pathname);
    const header = req.headers.get('X-PAYMENT');
    if (!header) return json({ x402Version: 1, error: 'X-PAYMENT header is required', accepts: [reqs] }, 402);

    let payment;
    try { payment = JSON.parse(atob(header)); } catch { return json({ x402Version: 1, error: 'bad X-PAYMENT', accepts: [reqs] }, 402); }
    const body = JSON.stringify({ x402Version: 1, paymentPayload: payment, paymentRequirements: reqs });
    const post = (f, p) => fetch(f + p, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
      .then(async r => { const t = await r.text(); try { return JSON.parse(t); } catch { return { error: r.status + ' ' + t.slice(0, 200) }; } })
      .catch(e => ({ error: String(e) }));

    // 依次尝试结算服务，第一个成功的就用
    let s = null; const errors = [];
    for (const f of FACILITATORS) {
      const v = await post(f, '/verify');
      if (!v.isValid) { errors.push({ facilitator: f, step: 'verify', detail: v.invalidReason || v.error || v }); continue; }
      const r = await post(f, '/settle');
      if (r.success) { s = { ...r, facilitator: f }; break; }
      errors.push({ facilitator: f, step: 'settle', detail: r.errorReason || r.error || r });
    }
    if (!s) return json({ x402Version: 1, error: 'payment failed', errors, accepts: [reqs] }, 402);

    let job = {};
    try { job = await req.json(); } catch {}
    return json({
      ok: true,
      job: { title: String(job.title || '').slice(0, 120), budget: job.budget, deadline: job.deadline, from: payment.payload?.authorization?.from },
      paidTx: s.transaction, facilitator: s.facilitator, explorer: 'https://testnet.snowtrace.io/tx/' + s.transaction,
    }, 200, { 'X-PAYMENT-RESPONSE': btoa(JSON.stringify(s)) });
  },
};
