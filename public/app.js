/* 落袋 Landed — single-page app. Reads everything from the Landed contract; no backend database. */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const app = $("#app");

  // ------------------------------------------------------------------ i18n
  const T = {
    zh: {
      "nav.jobs": "需求广场", "nav.post": "发布需求", "nav.me": "我的",
      "wallet.connect": "连接钱包",
      "foot.line": "资金由 Avalanche 上的智能合约托管，任何人都无法冻结或挪用。",
      "hero.eyebrow": "跨境接单 · 链上托管",
      "hero.title": "活干完，<br><span class='accent'>钱落袋。</span>",
      "hero.lead": "接海外单最怕两件事：做完不给钱，被平台封号冻结。落袋把客户的预算先锁进 Avalanche 合约，按里程碑验收放款；客户失联，到期自动结算给你。0 平台抽成，几秒到账。",
      "hero.cta1": "发布带钱的需求", "hero.cta2": "浏览需求广场",
      "hero.p1": "平台抽成", "hero.p2": "放款到账", "hero.p3": "可被冻结",
      "env.title": "品牌视觉设计 · 柏林咖啡馆", "env.locked": "已锁定在合约中", "env.ms": "里程碑", "env.window": "验收期", "env.auto": "超时未验收自动放款",
      "env.note": "客户付的钱，在你交付前谁都动不了",
      "cmp.eyebrow": "为什么不用现有平台", "cmp.title": "补上它们做不到的部分",
      "cmp.h1": "痛点", "cmp.h2": "Upwork / Fiverr 等平台", "cmp.h3": "落袋 Landed",
      "how.eyebrow": "怎么用", "how.title": "四步，钱稳稳落袋",
      "how.1t": "客户锁定预算", "how.1d": "发需求或私单直发时，整笔预算进入合约托管，需求卡片显示「已锁定」。",
      "how.2t": "接单与交付", "how.2d": "创作者免费申请，被选中后按里程碑提交作品链接。",
      "how.3t": "验收即放款", "how.3d": "客户点验收，这一阶段的钱几秒到你钱包。客户不回应，验收期满你可自行领取。",
      "how.4t": "信用永久归你", "how.4d": "每完成一单，记录写在链上，换任何平台都带得走。",
      "stats.locked": "当前托管中", "stats.paid": "累计已放款", "stats.jobs": "订单总数", "stats.done": "已完成订单",
      "board.title": "需求广场", "board.sub": "每一条需求的预算都已锁在合约里。申请免费，不存在白嫖方案。",
      "cat.all": "全部", "cat.Design": "设计", "cat.Development": "开发", "cat.Music": "音乐", "cat.Video": "视频", "cat.Translation": "翻译", "cat.Writing": "写作", "cat.Other": "其他",
      "job.locked": "预算已锁定", "job.ms": "个里程碑", "job.apps": "人申请", "job.window": "天验收期",
      "st.0": "招募中", "st.1": "进行中", "st.2": "争议处理中", "st.3": "已完成", "st.4": "已撤回", "st.5": "已裁决",
      "ms.pending": "待交付", "ms.submitted": "待验收", "ms.paid": "已落袋",
      "d.client": "客户", "d.freelancer": "接单人", "d.budget": "总预算", "d.released": "已放款", "d.escrow": "托管中", "d.window": "验收期", "d.posted": "发布于",
      "d.share": "把链接发给对方，对方打开就能看到托管状态",
      "d.apply": "申请接单", "d.pitch": "简单介绍你自己和相关作品", "d.applySend": "提交申请",
      "d.applicants": "申请人", "d.hire": "选定 TA", "d.noApps": "还没有人申请",
      "d.deliver": "提交本阶段作品", "d.deliverPh": "作品链接，例如 Figma、Google Drive", "d.deliverSend": "提交交付",
      "d.approve": "验收并放款", "d.claim": "验收期已过，领取款项", "d.claimIn": "后可自行领取",
      "d.dispute": "发起争议", "d.cancel": "撤回需求并退款", "d.resolve": "仲裁：判给接单人的金额",
      "d.resolveSend": "执行裁决", "d.yourTurn": "轮到你", "d.waitClient": "等待客户验收", "d.waitFree": "等待接单人交付",
      "d.connect": "连接钱包后可操作",
      "new.title": "发布需求", "new.sub": "预算会在发布时锁进合约，接单人看到的是真金白银。",
      "new.public": "公开需求", "new.direct": "私单直发",
      "new.directHint": "已经谈好的单：填入接单人的钱包地址，生成托管链接发给对方。",
      "new.fl": "接单人钱包地址", "new.t": "标题", "new.tPh": "例如：咖啡品牌视觉设计", "new.d": "需求描述", "new.dPh": "交付内容、风格、时间要求……",
      "new.cat": "类别", "new.ms": "里程碑", "new.msHint": "按阶段拆分，每阶段验收后放款", "new.msName": "阶段名称", "new.add": "添加阶段",
      "new.window": "验收期", "new.windowHint": "交付后客户在这段时间内未验收，接单人可自行领取该阶段款项",
      "new.total": "锁定总额", "new.submit": "锁定预算并发布", "new.faucet": "领取 1 万测试 USDC",
      "new.bal": "钱包余额", "new.preview": "预览",
      "p.title": "链上信用", "p.verified": "链上可验证", "p.done": "完成订单", "p.earned": "累计收入", "p.posted": "发布需求", "p.paidout": "按时付清", "p.disputes": "争议次数",
      "p.asF": "作为接单人", "p.asC": "作为客户", "p.none": "暂无记录",
      "tx.approve": "授权 USDC…", "tx.wait": "等待链上确认…", "tx.ok": "已上链", "tx.copy": "已复制",
      "err.wallet": "请先安装 Core 或 MetaMask 钱包",
      "day": "天", "hour": "小时", "min": "分钟",
      "_me": "我", "_nobody": "没有人", "_applied": "已申请，等待客户选择", "_fill": "请填写标题和至少一个里程碑", "_cancelled": "已取消",
    },
    en: {
      "nav.jobs": "Jobs", "nav.post": "Post a job", "nav.me": "Me",
      "wallet.connect": "Connect wallet",
      "foot.line": "Funds are held by a smart contract on Avalanche. Nobody can freeze or move them.",
      "hero.eyebrow": "Cross-border freelance · On-chain escrow",
      "hero.title": "Work done.<br><span class='accent'>Money landed.</span>",
      "hero.lead": "Freelancers fear two things: clients who never pay, and platforms that freeze accounts. Landed locks the client's budget in an Avalanche contract and releases it milestone by milestone. If the client goes silent, it pays out automatically. Zero platform fee, settled in seconds.",
      "hero.cta1": "Post a funded job", "hero.cta2": "Browse jobs",
      "hero.p1": "platform fee", "hero.p2": "to get paid", "hero.p3": "can freeze it",
      "env.title": "Brand identity · Berlin coffee roastery", "env.locked": "Locked in contract", "env.ms": "Milestones", "env.window": "Review window", "env.auto": "Auto-release if client is silent",
      "env.note": "Once it's locked, nobody can touch it until you deliver",
      "cmp.eyebrow": "Why not the usual platforms", "cmp.title": "We fix what they can't",
      "cmp.h1": "Pain", "cmp.h2": "Upwork / Fiverr & co.", "cmp.h3": "Landed",
      "how.eyebrow": "How it works", "how.title": "Four steps to getting paid",
      "how.1t": "Client locks the budget", "how.1d": "The full budget goes into escrow when the job is posted. Every card shows “Locked”.",
      "how.2t": "Apply & deliver", "how.2d": "Applying is free. Once hired, submit a link for each milestone.",
      "how.3t": "Approve = paid", "how.3d": "The client approves and the milestone lands in seconds. If they go silent, claim it after the review window.",
      "how.4t": "Your record is yours", "how.4d": "Every finished job is recorded on-chain. Take your reputation anywhere.",
      "stats.locked": "In escrow now", "stats.paid": "Paid out", "stats.jobs": "Jobs", "stats.done": "Completed",
      "board.title": "Job board", "board.sub": "Every budget here is already locked in the contract. Applying is free.",
      "cat.all": "All", "cat.Design": "Design", "cat.Development": "Development", "cat.Music": "Music", "cat.Video": "Video", "cat.Translation": "Translation", "cat.Writing": "Writing", "cat.Other": "Other",
      "job.locked": "Budget locked", "job.ms": "milestones", "job.apps": "applied", "job.window": "-day review",
      "st.0": "Hiring", "st.1": "In progress", "st.2": "In dispute", "st.3": "Completed", "st.4": "Withdrawn", "st.5": "Resolved",
      "ms.pending": "To deliver", "ms.submitted": "In review", "ms.paid": "Landed",
      "d.client": "Client", "d.freelancer": "Freelancer", "d.budget": "Budget", "d.released": "Released", "d.escrow": "In escrow", "d.window": "Review window", "d.posted": "Posted",
      "d.share": "Send this link to the other side to track the escrow",
      "d.apply": "Apply", "d.pitch": "A short intro and relevant work", "d.applySend": "Send application",
      "d.applicants": "Applicants", "d.hire": "Hire", "d.noApps": "No applicants yet",
      "d.deliver": "Deliver this milestone", "d.deliverPh": "Link to your work (Figma, Drive…)", "d.deliverSend": "Submit delivery",
      "d.approve": "Approve & release", "d.claim": "Review window passed — claim payment", "d.claimIn": "until you can claim",
      "d.dispute": "Raise a dispute", "d.cancel": "Withdraw job & refund", "d.resolve": "Arbiter: amount to freelancer",
      "d.resolveSend": "Resolve", "d.yourTurn": "Your turn", "d.waitClient": "Waiting for client review", "d.waitFree": "Waiting for delivery",
      "d.connect": "Connect a wallet to act",
      "new.title": "Post a job", "new.sub": "The budget is locked when you post, so freelancers know it's real.",
      "new.public": "Public job", "new.direct": "Direct deal",
      "new.directHint": "Already agreed? Enter the freelancer's wallet and send them the escrow link.",
      "new.fl": "Freelancer wallet", "new.t": "Title", "new.tPh": "e.g. Brand identity for a coffee shop", "new.d": "Description", "new.dPh": "Deliverables, style, timeline…",
      "new.cat": "Category", "new.ms": "Milestones", "new.msHint": "Split the work; each one is paid on approval", "new.msName": "Milestone name", "new.add": "Add milestone",
      "new.window": "Review window", "new.windowHint": "If the client doesn't review within this time, the freelancer can claim the milestone",
      "new.total": "Total to lock", "new.submit": "Lock budget & post", "new.faucet": "Get 10,000 test USDC",
      "new.bal": "Wallet balance", "new.preview": "Preview",
      "p.title": "On-chain record", "p.verified": "Verifiable on-chain", "p.done": "Jobs completed", "p.earned": "Earned", "p.posted": "Jobs posted", "p.paidout": "Paid in full", "p.disputes": "Disputes",
      "p.asF": "As freelancer", "p.asC": "As client", "p.none": "Nothing yet",
      "tx.approve": "Approving USDC…", "tx.wait": "Waiting for confirmation…", "tx.ok": "Confirmed on-chain", "tx.copy": "Copied",
      "err.wallet": "Please install Core or MetaMask",
      "day": "d", "hour": "h", "min": "m",
      "_me": "You", "_nobody": "Nobody", "_applied": "Applied — waiting for the client", "_fill": "Add a title and at least one milestone", "_cancelled": "Cancelled",
    },
  };
  Object.assign(T, window.LANDED_I18N || {});
  const LANGS = [["zh", "中文"], ["en", "English"], ["es", "Español"], ["ja", "日本語"]];
  const detectLang = () => {
    const n = (navigator.language || "en").toLowerCase();
    return n.startsWith("zh") ? "zh" : n.startsWith("es") ? "es" : n.startsWith("ja") ? "ja" : "en";
  };
  let lang = (() => { try { return localStorage.getItem("landed.lang") || detectLang(); } catch { return detectLang(); } })();
  if (!T[lang]) lang = "en";
  const t = (k) => T[lang][k] ?? T.en[k] ?? k;
  const applyStatic = () => {
    document.documentElement.lang = { zh: "zh-CN", en: "en", es: "es", ja: "ja" }[lang];
    $$("[data-i18n]").forEach((el) => (el.innerHTML = t(el.dataset.i18n)));
    $("#lang").value = lang;
    if (S.me) $("#wallet").textContent = short(S.me);
  };

  const COMPARE = {
    zh: [
      ["封号冻钱", "因 VPN、平台外收款等原因封号，约 80% 被封账户无法恢复，余额一起卡住", "钱在合约里，没有人能封号或冻结，包括我们"],
      ["抽成", "Upwork 约 10%–20%，Braintrust 向客户收 15%", "0 平台抽成，只付几分钱链上手续费"],
      ["放款速度", "托管款常压 1–2 周", "点验收，几秒到账"],
      ["客户失联", "钱挂在平台，只能等客服", "验收期满，接单人自行领取"],
      ["假需求", "投标要买 Connects，需求可能只是白嫖方案", "每条需求预算已锁定，申请免费"],
      ["老客户", "禁止平台外收款，老客户也要抽成", "私单直发，一个链接搞定"],
      ["信用", "好评锁在平台，换平台清零", "完成记录写在链上，永远归你"],
    ],
    en: [
      ["Frozen funds", "Accounts suspended for VPN use or off-platform pay; ~80% are never restored, balance included", "Funds sit in a contract. Nobody can freeze them, us included"],
      ["Fees", "Upwork ~10–20%, Braintrust charges clients 15%", "Zero platform fee, just cents of gas"],
      ["Payout speed", "Escrow often held 1–2 weeks", "Approve and it lands in seconds"],
      ["Silent client", "Money stuck until support replies", "Claim it yourself after the review window"],
      ["Fake jobs", "Pay to bid with Connects; some jobs are free-work traps", "Every job is pre-funded. Applying is free"],
      ["Your own clients", "Off-platform payment is banned", "Direct deal: one escrow link"],
      ["Reputation", "Locked in the platform", "On-chain and portable"],
    ],
  };
  Object.assign(COMPARE, window.LANDED_COMPARE || {});
  const CATS = ["Design", "Development", "Music", "Video", "Translation", "Writing", "Other"];

  // ------------------------------------------------------------------ chain
  const S = { cfg: null, rp: null, L: null, U: null, signer: null, me: null, wL: null, wU: null, cache: null, cacheAt: 0 };

  async function boot() {
    S.cfg = await (await fetch("config.json")).json();
    S.rp = new ethers.JsonRpcProvider(S.cfg.rpc, S.cfg.chainId, { staticNetwork: true });
    S.L = new ethers.Contract(S.cfg.landed, S.cfg.landedAbi, S.rp);
    S.U = new ethers.Contract(S.cfg.usdc, S.cfg.usdcAbi, S.rp);
    $("#netinfo").innerHTML = `${S.cfg.name} · <a class="addr" target="_blank" href="${explorer("address", S.cfg.landed)}">${short(S.cfg.landed)}</a>`;
    applyStatic();
    if (window.ethereum) {
      try { const accts = await window.ethereum.request({ method: "eth_accounts" }); if (accts?.length) await connect(true); } catch {}
      window.ethereum.on?.("accountsChanged", () => connect(true).then(route));
    }
    route();
  }

  async function connect(silent) {
    if (!window.ethereum) { if (!silent) toast(t("err.wallet"), true); return false; }
    const hex = "0x" + S.cfg.chainId.toString(16);
    try { await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: hex }] }); }
    catch (e) {
      if (e.code === 4902) await window.ethereum.request({ method: "wallet_addEthereumChain", params: [{ chainId: hex, chainName: S.cfg.name, nativeCurrency: { name: "AVAX", symbol: "AVAX", decimals: 18 }, rpcUrls: [S.cfg.rpc], blockExplorerUrls: S.cfg.explorer ? [S.cfg.explorer] : [] }] });
      else if (!silent) throw e;
    }
    const bp = new ethers.BrowserProvider(window.ethereum);
    S.signer = await bp.getSigner();
    S.me = await S.signer.getAddress();
    S.wL = S.L.connect(S.signer);
    S.wU = S.U.connect(S.signer);
    $("#wallet").textContent = short(S.me);
    $("#wallet").classList.replace("ink", "quiet");
    return true;
  }
  const needWallet = async () => S.me || (await connect(false));

  async function loadJobs(force) {
    if (!force && S.cache && Date.now() - S.cacheAt < 4000) return S.cache;
    const n = Number(await S.L.jobCount());
    const ids = [...Array(n).keys()];
    const rows = await Promise.all(ids.map(async (id) => {
      const [j, ms, apps] = await Promise.all([S.L.getJob(id), S.L.getMilestones(id), S.L.getApplications(id)]);
      return { id, ...plainJob(j), ms: ms.map((m) => ({ name: m.name, amount: m.amount, state: Number(m.state), submittedAt: Number(m.submittedAt), delivery: m.delivery })), apps: apps.map((a) => ({ freelancer: a.freelancer, pitch: a.pitch, at: Number(a.at) })) };
    }));
    S.cache = rows.reverse();
    S.cacheAt = Date.now();
    return S.cache;
  }
  const plainJob = (j) => ({ client: j.client, freelancer: j.freelancer, token: j.token, budget: j.budget, released: j.released, createdAt: Number(j.createdAt), reviewWindow: Number(j.reviewWindow), current: Number(j.current), status: Number(j.status), title: j.title, details: j.details, category: j.category });

  async function send(btn, fn) {
    const label = btn?.innerHTML;
    try {
      if (!(await needWallet())) return false;
      if (btn) { btn.disabled = true; btn.innerHTML = `<span class="spin"></span> ${t("tx.wait")}`; }
      const tx = await fn();
      await tx.wait();
      toast(`${t("tx.ok")} · ${tx.hash.slice(0, 10)}…`);
      S.cacheAt = 0;
      return true;
    } catch (e) {
      toast(decodeErr(e), true);
      return false;
    } finally {
      if (btn) { btn.disabled = false; btn.innerHTML = label; }
    }
  }
  function decodeErr(e) {
    const data = e?.data || e?.info?.error?.data || e?.error?.data;
    if (data && typeof data === "string") try { const p = S.L.interface.parseError(data); if (p) return p.name; } catch {}
    if (e?.revert?.name) return e.revert.name;
    if (e?.code === "ACTION_REJECTED") return t("_cancelled");
    return e?.shortMessage || e?.message || String(e);
  }

  // ------------------------------------------------------------------ helpers
  const fmt = (v) => Number(ethers.formatUnits(v, 6)).toLocaleString("en-US", { maximumFractionDigits: 2 });
  const short = (a) => (a ? a.slice(0, 6) + "…" + a.slice(-4) : "");
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const explorer = (kind, v) => (S.cfg.explorer ? `${S.cfg.explorer}/${kind}/${v}` : "#");
  const same = (a, b) => a && b && a.toLowerCase() === b.toLowerCase();
  const ZERO = "0x0000000000000000000000000000000000000000";
  const days = (s) => Math.round(s / 86400);
  const dur = (s) => {
    s = Math.max(0, s);
    const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60);
    return d ? `${d}${t("day")} ${h}${t("hour")}` : h ? `${h}${t("hour")} ${m}${t("min")}` : `${m}${t("min")}`;
  };
  const date = (ts) => new Date(ts * 1000).toLocaleDateString({ zh: "zh-CN", en: "en-US", es: "es-ES", ja: "ja-JP" }[lang], { month: "short", day: "numeric" });
  function avatar(addr) {
    const h = parseInt(addr.slice(2, 8), 16), h2 = parseInt(addr.slice(8, 14), 16);
    const c1 = `hsl(${h % 360} 55% 55%)`, c2 = `hsl(${h2 % 360} 60% 38%)`;
    const cells = [...Array(9)].map((_, i) => (parseInt(addr[10 + i], 16) % 2 ? `<rect x="${(i % 3) * 20 + 12}" y="${Math.floor(i / 3) * 20 + 12}" width="16" height="16" rx="4" fill="rgba(255,255,255,.55)"/>` : "")).join("");
    return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 84 84"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="84" height="84" fill="url(#g)"/>${cells}</svg>`)}`;
  }
  const who = (addr) => `<a class="addr" href="#/u/${addr}">${same(addr, S.me) ? t("_me") : short(addr)}</a>`;
  const statusPill = (st) => `<span class="pill ${["red", "wait", "red", "paid", "", "dark"][st]}">${t("st." + st)}</span>`;
  const catLabel = (c) => t("cat." + c) === "cat." + c ? c : t("cat." + c);
  function toast(msg, err) {
    const el = $("#toast");
    el.textContent = msg;
    el.className = "toast show" + (err ? " err" : "");
    clearTimeout(toast.h);
    toast.h = setTimeout(() => (el.className = "toast"), 3200);
  }
  const seal = (cls = "") => `<span class="seal ${cls}"><span>落</span></span>`;

  // ------------------------------------------------------------------ routing
  async function route() {
    const [, page, arg] = (location.hash.replace(/^#/, "") || "/").split("/");
    $$(".nav a").forEach((a) => a.classList.toggle("on", a.getAttribute("href") === `#/${page}`));
    $$("#tabbar a").forEach((a) => a.classList.toggle("on", a.dataset.tab === (page || "") || (page === "u" && a.dataset.tab === "me")));
    window.scrollTo(0, 0);
    try {
      if (!page) await home();
      else if (page === "jobs") await board(arg);
      else if (page === "new") await newJob();
      else if (page === "job") await detail(Number(arg));
      else if (page === "u") await profile(arg);
      else if (page === "me") { if (await needWallet()) location.hash = `#/u/${S.me}`; else location.hash = "#/"; }
      else await home();
    } catch (e) {
      console.error(e);
      app.innerHTML = `<div class="wrap empty">${esc(e.shortMessage || e.message)}</div>`;
    }
  }
  window.addEventListener("hashchange", route);

  // ------------------------------------------------------------------ visuals
  const PAL = { Design: ["#f6c9b9", "#FF5A1F"], Development: ["#cfdcf3", "#2949c4"], Music: ["#e4d9f6", "#5b2bbf"], Video: ["#f7e3a3", "#111110"], Translation: ["#cfe9d7", "#1f7a4d"], Writing: ["#efe5d6", "#8a5a2b"], Other: ["#e5e5df", "#111110"] };
  // generative cover: a Truchet-style tile seeded by the job's on-chain id + title.
  // Orange cells grow with the share of milestones already paid out.
  function rng(seed) { let h = 2166136261; for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296; }
  function genArt(seed, w, h, cols, progress, cls = "cover") {
    const r = rng(seed), size = w / cols, rows = Math.ceil(h / size);
    const BG = "#F2EEE6", INK = "#151515", OR = "#FF5A1F";
    let out = "";
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const px = x * size, py = y * size, k = Math.floor(r() * 7), rot = Math.floor(r() * 4) * 90, hot = r() < progress * 0.55 + 0.06;
      const fg = hot ? OR : INK, cell = r() < 0.18 ? INK : BG, c2 = cell === INK ? BG : fg;
      const g = (inner) => `<g transform="translate(${px} ${py}) rotate(${rot} ${size / 2} ${size / 2})"><rect width="${size}" height="${size}" fill="${cell}"/>${inner}</g>`;
      const s = size;
      out += g([
        `<path d="M0 0H${s}A${s} ${s} 0 0 1 0 ${s}Z" fill="${c2}"/>`,
        `<circle cx="${s / 2}" cy="${s / 2}" r="${s * 0.34}" fill="${c2}"/>`,
        `<path d="M0 ${s / 2}A${s / 2} ${s / 2} 0 0 1 ${s} ${s / 2}Z" fill="${c2}"/>`,
        `<path d="M0 ${s / 2}A${s / 2} ${s / 2} 0 0 0 ${s / 2} 0M${s / 2} ${s}A${s / 2} ${s / 2} 0 0 1 ${s} ${s / 2}" fill="none" stroke="${c2}" stroke-width="${s * 0.16}"/>`,
        `<rect x="${s * 0.2}" y="${s * 0.2}" width="${s * 0.6}" height="${s * 0.6}" rx="${s * 0.3}" fill="none" stroke="${c2}" stroke-width="${s * 0.12}"/>`,
        `<circle cx="${s / 2}" cy="${s / 2}" r="${s * 0.1}" fill="${c2}"/>`,
        ``,
      ][k]);
    }
    return `<svg class="${cls}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice">${out}</svg>`;
  }
  // Each cover is a small looping scene that matches the job's category.
  const SCENES = {
    Music: () => `<g class="sc-eq">${[0, 1, 2, 3, 4, 5, 6].map((i) => `<rect x="${150 + i * 22}" y="40" width="12" height="90" rx="6" style="animation-delay:${(i * 0.13) % 0.9}s"/>`).join("")}</g>`,
    Video: () => `<rect x="120" y="34" width="200" height="104" rx="18" class="sc-glass"/><circle cx="220" cy="80" r="22" fill="#fff"/><path d="M213 69l18 11-18 11z" fill="#FF6A00"/><rect x="136" y="122" width="168" height="4" rx="2" fill="rgba(26,26,26,.12)"/><rect x="136" y="122" width="168" height="4" rx="2" fill="#FF6A00" class="sc-scrub"/>`,
    Translation: () => `<rect x="130" y="40" width="90" height="70" rx="22" class="sc-glass"/><rect x="230" y="70" width="90" height="70" rx="22" fill="#1A1A1A"/><text x="175" y="88" text-anchor="middle" font-size="34" font-family="Noto Sans SC,sans-serif" fill="#1A1A1A" class="sc-a">文</text><text x="275" y="118" text-anchor="middle" font-size="32" font-family="Lexend,sans-serif" fill="#FF6A00" class="sc-b">A</text>`,
    Design: () => `<path d="M130 120C170 30 230 150 300 50" fill="none" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round" class="sc-draw"/><line x1="130" y1="120" x2="170" y2="30" stroke="#B5ACA2" stroke-width="1.2"/><line x1="300" y1="50" x2="230" y2="150" stroke="#B5ACA2" stroke-width="1.2"/><rect x="124" y="114" width="12" height="12" fill="#fff" stroke="#1A1A1A" stroke-width="2"/><rect x="294" y="44" width="12" height="12" fill="#fff" stroke="#1A1A1A" stroke-width="2"/><circle cx="170" cy="30" r="5" fill="#FF6A00"/><circle cx="230" cy="150" r="5" fill="#FF6A00"/>`,
    Development: () => `<rect x="120" y="30" width="210" height="116" rx="18" class="sc-glass"/>${[[140, 60, 90], [156, 52, 120], [156, 70, 72], [140, 40, 140]].map(([x, w, y2], i) => `<rect x="${x}" y="${54 + i * 20}" width="${w + y2 / 2}" height="8" rx="4" fill="${i === 1 ? "#FF6A00" : "#1A1A1A"}" opacity="${i === 1 ? 1 : 0.75}" class="sc-type" style="animation-delay:${i * 0.5}s"/>`).join("")}<rect x="300" y="114" width="3" height="14" fill="#1A1A1A" class="sc-blink"/>`,
    Writing: () => `<rect x="140" y="26" width="160" height="128" rx="14" fill="#fff" class="sc-paper"/>${[0, 1, 2, 3, 4].map((i) => `<rect x="160" y="${50 + i * 18}" width="${[110, 120, 90, 116, 60][i]}" height="6" rx="3" fill="#1A1A1A" opacity=".7" class="sc-type" style="animation-delay:${i * 0.4}s"/>`).join("")}`,
    Other: () => `<circle cx="220" cy="84" r="40" class="sc-glass"/>`,
  };
  // Real photos (Unsplash, free licence) matched to each category; falls back to the soft scene if offline.
  const U = (id, w = 900) => `https://images.unsplash.com/photo-${id}?w=${w}&q=70&auto=format&fit=crop`;
  const PHOTOS = {
    Music: ["1598488035139-bdbb2231ce04", "1632582204758-5ac65783517a"],
    Video: ["1574717024653-61fd2cf4d44d", "1614963326505-843868e1d83a"],
    Design: ["1561070791-2526d30994b5", "1572044162444-ad60f128bdea"],
    Development: ["1461749280684-dccba630e2f6", "1515879218367-8466d910aaa4"],
    Translation: ["1484788984921-03950022c9ef", "1534430071631-854ff55eec78"],
    Writing: ["1517971071642-34a2d3ecc9cd", "1579017308347-e53e0d2fc5e9"],
    Other: ["1522202176988-66273c2fd55f","1499951360447-b19be8fe80f5"],
  };
  function cover(j) {
    const list = PHOTOS[j.category] || PHOTOS.Other, id = list[j.id % list.length];
    const scene = (SCENES[j.category] || SCENES.Other)();
    return `<div class="orb-cover photo"><svg class="sc" viewBox="0 0 400 180" preserveAspectRatio="xMidYMid meet">${scene}</svg><img src="${U(id)}" alt="" loading="lazy" onerror="this.remove()"><span class="shade"></span><span class="oc-id">${esc(catLabel(j.category))} · №${String(j.id).padStart(3, "0")}</span><span class="oc-amt">${fmt(j.budget)}<small>USDC</small></span></div>`;
  }
  const STEPIC = [0, `<svg viewBox="0 0 40 40"><rect x="8" y="18" width="24" height="16" rx="3"/><path d="M13 18v-4a7 7 0 0 1 14 0v4" fill="none"/></svg>`, `<svg viewBox="0 0 40 40"><path d="M8 30l6-2 16-16-4-4-16 16z"/></svg>`, `<svg viewBox="0 0 40 40"><rect x="9" y="15" width="22" height="18" rx="6"/><path d="M16 24h8"/><circle cx="20" cy="9" r="3.5" class="f"/></svg>`, `<svg viewBox="0 0 40 40"><circle cx="20" cy="16" r="6" fill="none"/><path d="M14 22l-3 12 9-4 9 4-3-12" fill="none"/></svg>`];
  const segs = (j) => `<div class="segs">${j.ms.map((m) => `<i class="${m.state === 2 ? "paid" : m.state === 1 ? "wait" : ""}" style="flex:${Number(m.amount) || 1}"></i>`).join("")}</div>`;
  const POCKET = `<svg class="pocket-art" viewBox="0 0 200 200"><g class="coins"><circle class="c1" cx="100" cy="30" r="18"/><circle class="c2" cx="100" cy="30" r="18"/><circle class="c3" cx="100" cy="30" r="18"/></g><rect x="30" y="74" width="140" height="116" rx="34" fill="#151515"/><rect x="70" y="118" width="60" height="14" rx="7" fill="#F2EEE6"/></svg>`;
  const heroArt = () => `
    <div class="hero-art">
      <div class="ha-top"><span class="label">${t("env.title")}</span><span class="tag ok"><span class="d"></span>${t("env.locked")}</span></div>
      <div class="hero-orb photo"><img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=70&auto=format&fit=crop" alt="" onerror="this.remove()"></div>
      <div class="ha-amt"><span class="count">1,200</span><small>USDC</small></div>
      <div class="segs anim"><i style="flex:300"></i><i style="flex:500"></i><i style="flex:400"></i></div>
      <div class="ha-legend"><span>01 · 300</span><span>02 · 500</span><span>03 · 400</span></div>
      <p class="note">${t("env.note")}</p>
    </div>`;
  const jcard = (j) => `
    <a class="jcard" href="#/job/${j.id}">
      ${cover(j)}
      <div class="jc-body">
        <div class="row small muted"><span>${esc(catLabel(j.category))}</span><span class="spacer"></span><span>${j.apps.length} ${t("job.apps")}</span></div>
        <div class="jc-t">${esc(j.title)}</div>
        <div class="jc-foot"><span class="tag ok"><span class="d"></span>${t("job.locked")}</span><span class="go">→</span></div>
        ${segs(j)}
      </div>
    </a>`;

  const X = (o) => o[lang] || o.en;
  const FLOW = () => `
    <section class="flow-sec">
      <div class="wrap">
        <div class="label" class="label">${X({ zh: "钱怎么走", en: "Where the money goes", es: "Cómo fluye el dinero", ja: "お金の流れ" })}</div>
        <h2>${X({ zh: "客户付的钱，先锁进合约，<br>验收一段，落袋一段。", en: "The client's money is locked first,<br>then lands one milestone at a time.", es: "El dinero se bloquea primero<br>y se libera por hitos.", ja: "まずロック、<br>検収ごとに着金。" })}</h2>
        <svg class="flow" viewBox="0 0 900 220">
          <path id="fp" d="M150 110 H750" stroke="#CDBFB1" stroke-width="2" stroke-dasharray="4 8" fill="none"/>
          ${[0, 1, 2].map((i) => `<circle r="9" fill="#FF7A1A"><animateMotion dur="3.6s" begin="-${i * 1.2}s" repeatCount="indefinite" keyPoints="0;0.5;0.5;1" keyTimes="0;0.4;0.6;1" calcMode="linear"><mpath href="#fp"/></animateMotion></circle>`).join("")}
          <g transform="translate(150 110)"><circle r="62" fill="#F3EDE6" stroke="#E6DCD0"/><circle cy="-14" r="16" fill="none" stroke="#1A1A1A" stroke-width="2.5"/><path d="M-28 30a28 22 0 0 1 56 0" fill="none" stroke="#1A1A1A" stroke-width="2.5"/></g>
          <defs><radialGradient id="fo"><stop offset="0" stop-color="#FF7A1A"/><stop offset=".45" stop-color="#FF8C3C" stop-opacity=".8"/><stop offset="1" stop-color="#FFB27A" stop-opacity="0"/></radialGradient></defs><g transform="translate(450 110)"><circle r="105" fill="url(#fo)"/><rect x="-26" y="-6" width="52" height="40" rx="8" fill="#151515"/><path d="M-15 -6v-12a15 15 0 0 1 30 0v12" fill="none" stroke="#151515" stroke-width="6"/><circle cy="14" r="5" fill="#FF7A1A"/></g>
          <g transform="translate(750 110)"><circle r="62" fill="#F3EDE6" stroke="#E6DCD0"/><path d="M-24 -4h10v8a14 14 0 0 0 28 0v-8h10v8a24 24 0 0 1-48 0z" fill="#1A1A1A"/><circle cy="-6" r="10" fill="#FF7A1A"/></g>
        </svg>
        <div class="flow-labels">
          <div><b>${X({ zh: "客户", en: "Client", es: "Cliente", ja: "クライアント" })}</b><span>${X({ zh: "发需求时全额锁款", en: "Locks the full budget", es: "Bloquea todo el presupuesto", ja: "予算を全額ロック" })}</span></div>
          <div><b>Avalanche ${X({ zh: "合约", en: "contract", es: "contrato", ja: "コントラクト" })}</b><span>${X({ zh: "谁都动不了，平台也不行", en: "Nobody can touch it, not even us", es: "Nadie puede tocarlo", ja: "誰も動かせない" })}</span></div>
          <div><b>${X({ zh: "创作者", en: "Creator", es: "Creador", ja: "クリエイター" })}</b><span>${X({ zh: "验收或超时，几秒到账", en: "Paid in seconds on approval or timeout", es: "Cobra en segundos", ja: "数秒で着金" })}</span></div>
        </div>
      </div>
    </section>`;
  function ticker(jobs) {
    const ev = [];
    for (const j of jobs) {
      j.ms.forEach((m) => { if (m.state === 2) ev.push(`<span><i class="d ok"></i><a href="#/u/${j.freelancer}">${short(j.freelancer)}</a> ${X({ zh: "刚收到", en: "received", es: "recibió", ja: "受取" })} <b>${fmt(m.amount)} USDC</b> · ${esc(m.name)}</span>`); });
      ev.push(`<span><i class="d"></i>${X({ zh: "新需求", en: "New job", es: "Nuevo trabajo", ja: "新着" })} · ${esc(j.title)} · <b>${fmt(j.budget)} USDC ${X({ zh: "已锁定", en: "locked", es: "bloqueado", ja: "ロック済" })}</b></span>`);
    }
    const row = ev.join("");
    return `<div class="ticker"><div class="tk">${row}${row}</div></div>`;
  }
  const CATIC = {
    Design: `<svg viewBox="0 0 24 24"><path d="M12 3l7 7-7 11-7-11z"/><circle cx="12" cy="11" r="1.6"/><path d="M12 3v6.4"/></svg>`,
    Development: `<svg viewBox="0 0 24 24"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 5l-3 14"/></svg>`,
    Music: `<svg viewBox="0 0 24 24"><path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/></svg>`,
    Video: `<svg viewBox="0 0 24 24"><rect x="3" y="6" width="13" height="12" rx="2.5"/><path d="M16 10.5l5-3v9l-5-3z"/></svg>`,
    Translation: `<svg viewBox="0 0 24 24"><path d="M3 5h9M7.5 3v2M5 5c.8 3.5 3 6 6 7.5M10 5c-.8 3.5-3 6-6 7.5"/><path d="M13 21l4-9 4 9M14.5 18h5"/></svg>`,
    Writing: `<svg viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4M4 20h16"/></svg>`,
    Other: `<svg viewBox="0 0 24 24"><rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><circle cx="16.5" cy="16.5" r="3.5"/></svg>`,
  };
  const NAVIC = {
    jobs: `<svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="14" rx="3"/><path d="M4 10h16"/></svg>`,
    new: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/></svg>`,
    me: `<svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="4"/><path d="M5 20a7 7 0 0 1 14 0"/></svg>`,
    home: `<svg viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="13" rx="4"/><circle cx="12" cy="5" r="2.5" fill="currentColor" stroke="none"/></svg>`,
  };
  // ------------------------------------------------------------------ pages
  const tagFor = (st) => `<span class="tag ${["open", "wait", "open", "ok", "", "ok"][st]}"><span class="d"></span>${t("st." + st)}</span>`;
  const row = (j, mine) => `
    <a class="item" href="#/job/${j.id}">
      <div><div class="t">${esc(j.title)}</div><div class="s">${esc(catLabel(j.category))} · ${date(j.createdAt)} · ${esc(j.details)}</div></div>
      <div class="small muted">${j.ms.length} ${t("job.ms")}</div>
      <div>${mine ? tagFor(j.status) : `<span class="small muted">${j.apps.length} ${t("job.apps")}</span>`}</div>
      <div class="amt">${fmt(j.budget)}<small>USDC</small></div>
    </a>`;

  async function home() {
    const jobs = await loadJobs();
    let locked = 0n, paid = 0n, done = 0;
    for (const j of jobs) {
      if (j.status <= 2) locked += j.budget - j.released;
      paid += j.released;
      if (j.status === 3) done++;
    }
    const cmp = COMPARE[lang].map((r) => `<tr><td>${r[0]}</td><td class="them">${r[1]}</td><td class="us">${r[2]}</td></tr>`).join("");
    const open = jobs.filter((j) => j.status === 0).slice(0, 3);

    app.innerHTML = `
      <div class="scene" aria-hidden="true"><img class="hero-photo" src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=1800&q=70&auto=format&fit=crop" alt="" onerror="this.remove()"><i class="s-glow"></i><div class="pings">${jobs.flatMap((j) => j.ms.filter((m) => m.state === 2).map((m) => `<span>+${fmt(m.amount)} USDC · ${esc(m.name)}</span>`)).slice(0, 4).join("")}</div></div>
      <div class="wrap fade-in">
        <section class="hero"><div class="glass hero-copy">
          <div class="label">${t("hero.eyebrow")}</div>
          <h1 style="margin-top:20px" class="hero-h">${t("hero.title")}<svg class="hero-drop" viewBox="0 0 32 40" aria-hidden="true"><defs><radialGradient id="hd" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#FFC27A"/><stop offset=".55" stop-color="#FF7A1A"/><stop offset="1" stop-color="#E5480C"/></radialGradient></defs><circle class="hd-coin" cx="16" cy="18" r="6.2" fill="url(#hd)"/><path class="hd-cup" d="M3 20h7v6a6 6 0 0 0 12 0v-6h7v6a13 13 0 0 1-26 0z" fill="#111"/></svg></h1>
          <p class="lead">${t("hero.lead")}</p>
          <div class="ctas"><a class="btn ink pill" href="#/new">${t("hero.cta1")}<span class="arr">→</span></a><a class="btn ghost" href="#/jobs">${t("hero.cta2")}</a></div>
        </div>${heroArt()}</section>
      </div>${ticker(jobs)}<div class="wrap">
        <section class="facts">
          ${(() => {
            const L = Number(locked) || 0, P = Number(paid) || 0, N = jobs.length || 0, D = Number(done) || 0;
            const ring = (f, c) => `<svg class="f-ring" viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" stroke="#EDEDEA"/><circle cx="22" cy="22" r="18" stroke="${c}" stroke-dasharray="${(113 * Math.min(1, f)).toFixed(1)} 113" transform="rotate(-90 22 22)"/></svg>`;
            const IC = {
              lock: `<svg viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="10" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15" r="1.3"/></svg>`,
              out: `<svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="5"/><path d="M12 7v4M4 16c2 3 5 4 8 4s6-1 8-4"/></svg>`,
              doc: `<svg viewBox="0 0 24 24"><rect x="6" y="3" width="12" height="16" rx="2.5"/><path d="M9 8h6M9 12h6M9 16h3"/></svg>`,
              ok: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M8 12.3l2.6 2.6L16 9.5"/></svg>`,
            };
            const card = (ic, tone, v, k, viz, ph) => `<div class="fact fx"><img class="f-ph" src="https://images.unsplash.com/photo-${ph}?w=700&q=70&auto=format&fit=crop" alt="" loading="lazy" onerror="this.remove()"><div class="f-top"><span class="f-ic" style="--t:${tone}">${IC[ic]}</span>${viz}</div><div class="v">${v}</div><div class="k">${k}</div></div>`;
            const bars = [...Array(Math.max(N, 1))].map((_, i) => `<i class="${i < D ? "d" : ""}" style="animation-delay:${i * 60}ms"></i>`).join("");
            return card("lock", "#FF6A00", fmt(locked), `USDC · ${t("stats.locked")}`, ring(L / (L + P || 1), "#FF6A00"), "1499951360447-b19be8fe80f5")
              + card("out", "#1F8A5B", fmt(paid), `USDC · ${t("stats.paid")}`, ring(P / (L + P || 1), "#1F8A5B"), "1522202176988-66273c2fd55f")
              + card("doc", "#3B5BDB", N, t("stats.jobs"), `<span class="f-bars">${bars}</span>`, "1561070791-2526d30994b5")
              + card("ok", "#111", D, t("stats.done"), ring(D / (N || 1), "#111"), "1598488035139-bdbb2231ce04");
          })()}
        </section>
      </div>${FLOW()}<div class="wrap">
        <section class="block">
          <div class="row" style="align-items:flex-end;margin-bottom:28px"><div><div class="label">${t("board.title")}</div><h2 style="margin-top:10px;font-size:30px">${t("board.sub")}</h2></div><span class="spacer"></span><a class="btn ghost sm" href="#/jobs">${t("hero.cta2")} →</a></div>
          <div class="cards">${open.map(jcard).join("") || `<div class="empty">${t("p.none")}</div>`}</div>
        </section>
        <section class="block">
          <div class="block-head"><div><div class="label">${t("how.eyebrow")}</div><h2 style="margin-top:10px">${t("how.title")}</h2></div>
          <div class="steps">${[1, 2, 3, 4].map((i) => `<div class="step"><div class="ic">${STEPIC[i]}</div><div class="n">0${i}</div><h3>${t(`how.${i}t`)}</h3><p>${t(`how.${i}d`)}</p></div>`).join("")}</div></div>
        </section>
        <section class="block">
          <div class="block-head"><div><div class="label">${t("cmp.eyebrow")}</div><h2 style="margin-top:10px">${t("cmp.title")}</h2></div>
          <div style="overflow:auto"><table class="compare"><tr><th>${t("cmp.h1")}</th><th>${t("cmp.h2")}</th><th>${t("cmp.h3")}</th></tr>${cmp}</table></div></div>
        </section>
      </div>`;
  }

  async function board(cat) {
    const jobs = (await loadJobs()).filter((j) => j.status === 0);
    const sel = cat ? decodeURIComponent(cat) : "";
    const list = jobs.filter((j) => !sel || j.category === sel);
    const chips = ["", ...CATS].map((c) => `<a class="chip ${c === sel ? "on" : ""}" href="#/jobs${c ? "/" + c : ""}">${c ? catLabel(c) : t("cat.all")}</a>`).join("");
    app.innerHTML = `
      <div class="wrap fade-in">
        <div class="page-head"><div><h1>${t("board.title")}</h1><p>${t("board.sub")}</p></div><span class="spacer"></span><a class="btn ink pill" href="#/new">${t("hero.cta1")}<span class="arr">→</span></a></div>
        <div class="filters">${chips}</div>
        <div class="cards">${list.map(jcard).join("") || `<div class="empty">${t("p.none")}</div>`}</div>
      </div>`;
  }

  async function detail(id) {
    const j = (await loadJobs(true)).find((x) => x.id === id);
    if (!j) { app.innerHTML = `<div class="wrap empty">Not found</div>`; return; }
    const isClient = same(S.me, j.client), isFree = same(S.me, j.freelancer), isArb = same(S.me, S.cfg.arbiter);
    const now = Math.floor(Date.now() / 1000);
    const cur = j.ms[j.current];
    const pct = Number((j.released * 1000n) / (j.budget || 1n)) / 10;
    const url = location.href;

    const msHtml = j.ms.map((m, i) => {
      const cls = m.state === 2 ? "ok" : m.state === 1 ? "wait" : "";
      const label = m.state === 2 ? t("ms.paid") : m.state === 1 ? t("ms.submitted") : t("ms.pending");
      const sub = m.delivery ? `<a href="${esc(m.delivery)}" target="_blank" rel="noopener">${esc(m.delivery)}</a> · ${date(m.submittedAt)}` : j.status === 1 && i === j.current ? t("d.waitFree") : "";
      return `<div class="ms ${m.state === 2 ? "paid" : m.state === 1 ? "wait" : ""}"><span class="i node">${m.state === 2 ? "✓" : String(i + 1).padStart(2, "0")}</span><div><h4>${esc(m.name)}</h4>${sub ? `<div class="sub">${sub}</div>` : ""}</div><span class="st"><span class="tag ${cls}"><span class="d"></span>${label}</span></span><span class="amt">${fmt(m.amount)}</span></div>`;
    }).join("");

    let act = "";
    if (!S.me) act = `<button class="btn ink block" id="a-connect">${t("wallet.connect")}</button><p class="note">${t("d.connect")}</p>`;
    else if (j.status === 0 && isClient) {
      act = `<h3>${t("d.applicants")} · ${j.apps.length}</h3>${j.apps.map((a) => `<div class="app-item"><div class="row"><img class="avatar" style="width:24px;height:24px" src="${avatar(a.freelancer)}">${who(a.freelancer)}<span class="spacer"></span><button class="btn ink sm" data-hire="${a.freelancer}">${t("d.hire")}</button></div><p>${esc(a.pitch)}</p></div>`).join("") || `<p class="note">${t("d.noApps")}</p>`}
        <button class="btn quiet sm" id="a-cancel" style="margin-top:14px">${t("d.cancel")}</button>`;
    } else if (j.status === 0) {
      act = j.apps.some((a) => same(a.freelancer, S.me)) ? `<span class="tag ok"><span class="d"></span>${t("_applied")}</span>`
        : `<h3>${t("d.apply")}</h3><textarea id="pitch" placeholder="${t("d.pitch")}"></textarea><button class="btn ink block" id="a-apply" style="margin-top:12px">${t("d.applySend")}</button>`;
    } else if (j.status === 1 && isFree) {
      if (cur.state === 0) act = `<h3>${t("d.deliver")}</h3><input id="dlv" placeholder="${t("d.deliverPh")}"><button class="btn ink block" id="a-deliver" style="margin-top:12px">${t("d.deliverSend")}</button>`;
      else {
        const left = cur.submittedAt + j.reviewWindow - now;
        act = `<h3>${t("d.waitClient")}</h3>` + (left > 0 ? `<p class="countdown">${dur(left)} ${t("d.claimIn")}</p><p class="note">${t("new.windowHint")}</p>` : `<button class="btn ink block" id="a-claim">${t("d.claim")}</button>`);
      }
      act += `<button class="btn quiet sm" id="a-dispute" style="margin-top:14px">${t("d.dispute")}</button>`;
    } else if (j.status === 1 && isClient) {
      if (cur.state === 1) {
        const left = cur.submittedAt + j.reviewWindow - now;
        act = `<h3>${esc(cur.name)}</h3><p class="note" style="word-break:break-all;margin:0 0 10px"><a href="${esc(cur.delivery)}" target="_blank" rel="noopener">${esc(cur.delivery)}</a></p><p class="countdown">${dur(left)}</p><button class="btn ink block" id="a-approve">${t("d.approve")} · ${fmt(cur.amount)} USDC</button>`;
      } else act = `<h3>${t("d.waitFree")}</h3><p class="note">${esc(cur.name)}</p>`;
      act += `<button class="btn quiet sm" id="a-dispute" style="margin-top:14px">${t("d.dispute")}</button>`;
    } else if (j.status === 2 && isArb) {
      act = `<h3>${t("d.resolve")}</h3><input id="res" type="number" min="0" step="0.01" placeholder="0 – ${fmt(j.budget - j.released)}"><button class="btn ink block" id="a-resolve" style="margin-top:12px">${t("d.resolveSend")}</button>`;
    }

    app.innerHTML = `
      <div class="wrap fade-in">
        <div class="detail">
          <div>
            <div class="d-cover">${cover(j)}</div>
            <div class="crumb"><a href="#/jobs">${t("board.title")}</a> / ${esc(catLabel(j.category))} / #${j.id}</div>
            <h1>${esc(j.title)}</h1>
            <div class="row" style="margin-bottom:22px">${tagFor(j.status)}<span class="small muted">${t("d.posted")} ${date(j.createdAt)}</span></div>
            <p class="body">${esc(j.details)}</p>
            <div class="ms-list">${msHtml}</div>
          </div>
          <aside class="side">
            <div class="panel">
              <div class="label">${t("d.budget")}</div>
              <div class="big" style="margin-top:8px">${fmt(j.budget)}<small>USDC</small></div>
              <div style="margin:16px 0 10px">${segs(j)}</div>
              <div class="row small"><span>${t("d.released")} ${fmt(j.released)}</span><span class="spacer"></span><span class="muted">${t("d.escrow")} ${fmt(j.status <= 2 ? j.budget - j.released : 0n)}</span></div>
              <div style="margin-top:14px">
                <div class="kv"><span>${t("d.client")}</span><span>${who(j.client)}</span></div>
                <div class="kv"><span>${t("d.freelancer")}</span><span>${j.freelancer === ZERO ? "—" : who(j.freelancer)}</span></div>
                <div class="kv"><span>${t("d.window")}</span><span>${days(j.reviewWindow) || 1} ${t("day")}</span></div>
              </div>
            </div>
            ${act ? `<div class="panel">${act}</div>` : ""}
            <div class="panel"><div class="label" style="margin-bottom:10px">${t("d.share")}</div><div class="share"><span>${esc(url)}</span><button class="btn quiet sm" id="copy">Copy</button></div></div>
          </aside>
        </div>
      </div>`;

    const on = (sel, fn) => $(sel) && ($(sel).onclick = fn);
    const after = () => detail(id);
    on("#a-connect", async () => { if (await connect(false)) after(); });
    on("#copy", () => { navigator.clipboard?.writeText(url); toast(t("tx.copy")); });
    on("#a-apply", async (e) => { if (await send(e.currentTarget, () => S.wL.applyTo(id, $("#pitch").value.trim() || "—"))) after(); });
    $$("[data-hire]").forEach((b) => (b.onclick = async (e) => { if (await send(e.currentTarget, () => S.wL.hire(id, b.dataset.hire))) after(); }));
    on("#a-cancel", async (e) => { if (await send(e.currentTarget, () => S.wL.cancel(id))) after(); });
    on("#a-deliver", async (e) => { const v = $("#dlv").value.trim(); if (!v) return $("#dlv").focus(); if (await send(e.currentTarget, () => S.wL.deliver(id, v))) after(); });
    on("#a-approve", async (e) => { if (await send(e.currentTarget, () => S.wL.approve(id))) after(); });
    on("#a-claim", async (e) => { if (await send(e.currentTarget, () => S.wL.claimAfterTimeout(id))) after(); });
    on("#a-dispute", async (e) => { if (await send(e.currentTarget, () => S.wL.dispute(id))) after(); });
    on("#a-resolve", async (e) => { if (await send(e.currentTarget, () => S.wL.resolve(id, ethers.parseUnits($("#res").value || "0", 6)))) after(); });
  }

  async function newJob() {
    const st = { direct: false, ms: [["", ""]] };
    const sum = () => st.ms.reduce((a, m) => a + (Number(m[1]) || 0), 0);
    const updateLight = () => {
      const total = sum().toLocaleString("en-US");
      $("#total").textContent = total;
      $("#pv-amt").innerHTML = `${total}<small>USDC</small>`;
      $("#pv-ms").textContent = st.ms.map((m) => m[1] || 0).join(" / ") + " USDC";
    };
    const render = () => {
      $("#ms-list").innerHTML = st.ms.map((m, i) => `<div class="ms-row"><span class="idx">${String(i + 1).padStart(2, "0")}</span><input data-i="${i}" data-k="0" value="${esc(m[0])}" placeholder="${t("new.msName")}"><input data-i="${i}" data-k="1" value="${esc(m[1])}" type="number" min="0" step="0.01" placeholder="USDC"><button class="icon-btn" data-del="${i}" ${st.ms.length === 1 ? "disabled" : ""}>×</button></div>`).join("");
      $("#fl-wrap").style.display = st.direct ? "" : "none";
      $$(".seg [data-m]").forEach((b) => b.classList.toggle("on", (b.dataset.m === "d") === st.direct));
      $("#pv-title").textContent = $("#f-title").value || t("new.tPh");
      $("#pv-win").textContent = $("#f-win").selectedOptions[0].textContent;
      updateLight();
      $$("[data-i]").forEach((el) => (el.oninput = () => { st.ms[el.dataset.i][el.dataset.k] = el.value; updateLight(); }));
      $$("[data-del]").forEach((b) => (b.onclick = () => { st.ms.splice(Number(b.dataset.del), 1); render(); }));
    };
    app.innerHTML = `
      <div class="wrap fade-in">
        <div class="page-head"><div><h1>${t("new.title")}</h1><p>${t("new.sub")}</p></div></div>
        <div class="new-layout">
          <div class="form">
            <div class="seg"><button data-m="p">${t("new.public")}</button><button data-m="d">${t("new.direct")}</button></div>
            <label class="f" id="fl-wrap">${t("new.fl")}<span class="hint">${t("new.directHint")}</span><input id="f-fl" placeholder="0x…"></label>
            <label class="f">${t("new.t")}<input id="f-title" placeholder="${t("new.tPh")}"></label>
            <label class="f">${t("new.d")}<textarea id="f-desc" placeholder="${t("new.dPh")}"></textarea></label>
            <div class="f"><span class="fl">${t("new.cat")}</span>
              <div class="pick" id="cat-pick">${CATS.map((c, i) => `<button type="button" data-v="${c}" class="${i ? "" : "on"}"><span class="pk-ic" style="--c:${(PAL[c] || PAL.Other)[1]};--b:${(PAL[c] || PAL.Other)[0]}">${CATIC[c] || CATIC.Other}</span>${catLabel(c)}</button>`).join("")}</div>
              <select id="f-cat" hidden>${CATS.map((c) => `<option value="${c}">${catLabel(c)}</option>`).join("")}</select>
            </div>
            <div class="f"><span class="fl">${t("new.window")}</span>
              <div class="seg wide" id="win-pick">${[[86400, 1], [259200, 3], [604800, 7], [1209600, 14]].map(([v, d]) => `<button type="button" data-v="${v}" class="${d === 3 ? "on" : ""}">${d} ${t("day")}</button>`).join("")}<button type="button" data-v="custom">${X({zh:"自定义",en:"Custom",es:"Otro",ja:"カスタム"})}</button></div>
              <div class="win-custom" id="win-custom" hidden><input id="f-wn" type="number" min="1" max="720" value="5" inputmode="numeric"><div class="seg" id="f-wu"><button type="button" data-u="3600">${X({zh:"小时",en:"hours",es:"horas",ja:"時間"})}</button><button type="button" data-u="86400" class="on">${t("day")}</button></div><small>${X({zh:"1 小时 – 30 天",en:"1 hour – 30 days",es:"1 hora – 30 días",ja:"1時間〜30日"})}</small></div>
              <span class="hint">${t("new.windowHint")}</span>
              <select id="f-win" hidden><option value="86400">1 ${t("day")}</option><option value="259200" selected>3 ${t("day")}</option><option value="604800">7 ${t("day")}</option><option value="1209600">14 ${t("day")}</option></select>
            </div>
            <div style="display:flex;flex-direction:column;gap:10px"><label class="f">${t("new.ms")}<span class="hint">${t("new.msHint")}</span></label><div id="ms-list" style="display:flex;flex-direction:column;gap:8px"></div><button class="btn quiet sm" id="add-ms" style="align-self:flex-start">+ ${t("new.add")}</button></div>
          </div>
          <aside class="summary panel">
            <div class="label">${t("new.preview")}</div>
            <div class="small" id="pv-title" style="margin-top:10px;font-weight:500"></div>
            <div class="big" id="pv-amt" style="margin:6px 0 12px"></div>
            <div class="kv"><span>${t("env.ms")}</span><span id="pv-ms"></span></div>
            <div class="kv"><span>${t("env.window")}</span><span id="pv-win"></span></div>
            <div class="kv"><span>${t("env.auto")}</span><span class="tag ok"><span class="d"></span>✓</span></div>
            <div class="kv"><span>${t("new.total")}</span><span><b id="total">0</b> USDC</span></div>
            <button class="btn ink block" id="submit" style="margin-top:18px">${t("new.submit")}</button>
            <div class="row" style="margin-top:12px"><span class="small muted" id="bal"></span><span class="spacer"></span><button class="btn quiet sm" id="faucet">${t("new.faucet")}</button></div>
          </aside>
        </div>
      </div>`;
    $$(".seg [data-m]").forEach((b) => (b.onclick = () => { st.direct = b.dataset.m === "d"; render(); }));
    $("#add-ms").onclick = () => { if (st.ms.length < 10) { st.ms.push(["", ""]); render(); } };
    $("#f-title").oninput = () => ($("#pv-title").textContent = $("#f-title").value || t("new.tPh"));
    $("#f-win").onchange = render;
    $$("#cat-pick button").forEach((b) => (b.onclick = () => { $$("#cat-pick button").forEach((x) => x.classList.toggle("on", x === b)); $("#f-cat").value = b.dataset.v; }));
    const setCustom = () => {
      const u = +($("#f-wu .on")?.dataset.u || 86400), n = Math.max(1, +$("#f-wn").value || 1);
      const sec = Math.min(2592000, Math.max(3600, Math.round(n * u)));
      let o = $("#f-win option.cus"); if (!o) { o = document.createElement("option"); o.className = "cus"; $("#f-win").appendChild(o); }
      o.value = String(sec); o.textContent = sec % 86400 ? `${sec / 3600} ${$("#f-wu button").textContent}` : `${sec / 86400} ${t("day")}`;
      $("#f-win").value = o.value; render();
    };
    $$("#win-pick button").forEach((b) => (b.onclick = () => { $$("#win-pick button").forEach((x) => x.classList.toggle("on", x === b)); const c = b.dataset.v === "custom"; $("#win-custom").hidden = !c; if (c) setCustom(); else { $("#f-win").value = b.dataset.v; render(); } }));
    $("#f-wn").oninput = setCustom;
    $$("#f-wu button").forEach((b) => (b.onclick = () => { $$("#f-wu button").forEach((x) => x.classList.toggle("on", x === b)); setCustom(); }));
    const showBal = async () => { if (S.me) $("#bal").textContent = `${t("new.bal")} ${fmt(await S.U.balanceOf(S.me))} USDC`; };
    $("#faucet").onclick = async (e) => { if (await send(e.currentTarget, () => S.wU.faucet())) showBal(); };
    $("#submit").onclick = async (e) => {
      const title = $("#f-title").value.trim(), details = $("#f-desc").value.trim();
      const ms = st.ms.filter((m) => m[0].trim() && Number(m[1]) > 0);
      if (!title || !ms.length) { toast(t("_fill"), true); return; }
      if (!(await needWallet())) return;
      const names = ms.map((m) => m[0].trim()), amounts = ms.map((m) => ethers.parseUnits(String(m[1]), 6));
      const total = amounts.reduce((a, b) => a + b, 0n);
      const btn = e.currentTarget;
      if ((await S.U.allowance(S.me, S.cfg.landed)) < total) {
        toast(t("tx.approve"));
        if (!(await send(btn, () => S.wU.approve(S.cfg.landed, ethers.MaxUint256)))) return;
      }
      const args = [title, details, $("#f-cat").value, S.cfg.usdc, names, amounts, BigInt($("#f-win").value)];
      let newId;
      const ok = await send(btn, async () => {
        newId = Number(await S.L.jobCount());
        return st.direct ? S.wL.postDirect($("#f-fl").value.trim(), ...args) : S.wL.postJob(...args);
      });
      if (ok) location.hash = `#/job/${newId}`;
    };
    render();
    showBal();
  }

  async function profile(addr) {
    if (!ethers.isAddress(addr)) { location.hash = "#/"; return; }
    const [r, jobs] = await Promise.all([S.L.records(addr), loadJobs()]);
    const asF = jobs.filter((j) => same(j.freelancer, addr)), asC = jobs.filter((j) => same(j.client, addr));
    const rate = Number(r.jobsPosted) ? Math.round((Number(r.jobsPaidOut) / Number(r.jobsPosted)) * 100) : null;
    app.innerHTML = `
      <div class="wrap fade-in">
        <div class="profile-head">
          <img class="avatar" src="${avatar(addr)}" alt="">
          <div><div class="row"><h1 style="font-size:32px" class="mono">${short(addr)}</h1><span class="verified">✓ ${t("p.verified")}</span></div>
          <div class="small muted" style="margin-top:4px;word-break:break-all"><a class="addr" target="_blank" href="${explorer("address", addr)}">${addr}</a></div></div>
        </div>
        <section class="facts">
          <div class="fact"><div class="v">${r.jobsCompleted}</div><div class="k">${t("p.done")}</div></div>
          <div class="fact"><div class="v">${fmt(r.earned)}</div><div class="k">USDC · ${t("p.earned")}</div></div>
          <div class="fact"><div class="v">${r.jobsPosted}</div><div class="k">${t("p.posted")}${rate !== null ? ` · ${rate}% ${t("p.paidout")}` : ""}</div></div>
          <div class="fact"><div class="v" style="color:${Number(r.disputes) ? "var(--accent)" : "var(--ok)"}">${r.disputes}</div><div class="k">${t("p.disputes")}</div></div>
        </section>
        <div class="sec-title">${t("p.asF")}</div>
        <div class="list">${asF.map((j) => row(j, true)).join("") || `<div class="empty">${t("p.none")}</div>`}</div>
        <div class="sec-title">${t("p.asC")}</div>
        <div class="list">${asC.map((j) => row(j, true)).join("") || `<div class="empty">${t("p.none")}</div>`}</div>
      </div>`;
  }

  // ------------------------------------------------------------------ chrome
  $$("#tabbar [data-ic]").forEach((el) => (el.innerHTML = NAVIC[el.dataset.ic]));
  $("#lang").innerHTML = LANGS.map(([k, v]) => `<option value="${k}">${v}</option>`).join("");
  $("#lang").onchange = () => { lang = $("#lang").value; try { localStorage.setItem("landed.lang", lang); } catch {} applyStatic(); route(); };
  $("#wallet").onclick = async () => { if (S.me) location.hash = `#/u/${S.me}`; else if (await connect(false)) route(); };
  boot().catch((e) => { app.innerHTML = `<div class="wrap empty">${esc(e.message)}</div>`; });
})();

;(function navFx(){
  const nav=document.querySelector(".nav"); if(!nav) return;
  const ind=document.createElement("i"); ind.className="nav-ind"; nav.prepend(ind);
  const sync=()=>{const h=location.hash||"#/";let a=[...nav.querySelectorAll("a")].find(x=>h.startsWith(x.getAttribute("href")));nav.querySelectorAll("a").forEach(x=>x.classList.toggle("cur",x===a));
    if(a){ind.style.opacity=1;ind.style.width=a.offsetWidth+"px";ind.style.transform=`translateX(${a.offsetLeft}px)`}else ind.style.opacity=0};
  addEventListener("hashchange",()=>setTimeout(sync,30));addEventListener("resize",sync);setTimeout(sync,300);
  nav.addEventListener("mousemove",e=>{const a=e.target.closest("a");if(a){ind.style.opacity=1;ind.style.width=a.offsetWidth+"px";ind.style.transform=`translateX(${a.offsetLeft}px)`}});
  nav.addEventListener("mouseleave",sync);
  const top=document.querySelector(".top");addEventListener("scroll",()=>top.classList.toggle("scrolled",scrollY>12),{passive:true});
})();
