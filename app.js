/* Landed — single-page app. Reads everything from the Landed contract; no backend database. */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const app = $("#app");

  // ------------------------------------------------------------------ i18n
  const T = {
    zh: {
      "nav.jobs": "需求广场", "nav.post": "发布需求", "nav.skills": "技能广场", "nav.home": "首页", "nav.me": "我的", "nav.about": "关于",
      "wallet.connect": "登录 / 注册",
      "foot.line": "资金由 Avalanche 上的智能合约托管，任何人都无法冻结或挪用。",
      "hero.eyebrow": "跨境找人 · 跨境接单 · 链上托管",
      "hero.title": "活干完，<br><span class='accent'>钱到手。</span>",
      "hero.lead": "找人的怕付了钱拿不到活，接单的怕干完活拿不到钱。谈妥价格后，预算先锁进 Avalanche 合约，验收一段放一段，客户失联也会自动结算。0 平台抽成，几秒到账。",
      "hero.cta1": "我要找人", "hero.cta2": "我要接单",
      "hero.p1": "平台抽成", "hero.p2": "放款到账", "hero.p3": "可被冻结",
      "env.title": "品牌视觉设计 · 柏林咖啡馆", "env.locked": "已锁定在合约中", "env.ms": "里程碑", "env.window": "验收期", "env.auto": "超时未验收自动放款",
      "env.note": "客户付的钱，在你交付前谁都动不了",
      "cmp.eyebrow": "为什么不用现有平台", "cmp.title": "补上它们做不到的部分",
      "cmp.h1": "痛点", "cmp.h2": "Upwork / Fiverr 等平台", "cmp.h3": "Landed",
      "how.eyebrow": "怎么用", "how.title": "四步，钱稳稳到手",
      "how.1t": "客户锁定预算", "how.1d": "发需求或私单直发时，整笔预算进入合约托管，需求卡片显示「已锁定」。",
      "how.2t": "接单与交付", "how.2d": "创作者免费申请，被选中后按里程碑提交作品链接。",
      "how.3t": "验收即放款", "how.3d": "客户点验收，这一阶段的钱几秒到你钱包。客户不回应，验收期满你可自行领取。",
      "how.4t": "信用永久归你", "how.4d": "每完成一单，记录写在链上，换任何平台都带得走。",
      "stats.locked": "当前托管中", "stats.paid": "累计已放款", "stats.jobs": "订单总数", "stats.done": "已完成订单",
      "board.title": "需求广场", "board.sub": "每一条需求的预算都已锁在合约里。申请免费，不存在白嫖方案。",
      "cat.all": "全部", "cat.Design": "设计", "cat.Development": "开发", "cat.Music": "音乐", "cat.Video": "视频", "cat.Translation": "翻译", "cat.Writing": "写作", "cat.Other": "其他",
      "job.locked": "预算已锁定", "job.ms": "个里程碑", "job.apps": "人申请", "job.window": "天验收期",
      "st.0": "招募中", "st.1": "进行中", "st.2": "争议处理中", "st.3": "已完成", "st.4": "已撤回", "st.5": "已裁决",
      "ms.pending": "待交付", "ms.submitted": "待验收", "ms.paid": "已到账",
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
      "nav.jobs": "Jobs", "nav.post": "Post a job", "nav.skills": "Skills", "nav.home": "Home", "nav.me": "Me", "nav.about": "About",
      "wallet.connect": "Log in / Sign up",
      "foot.line": "Funds are held by a smart contract on Avalanche. Nobody can freeze or move them.",
      "hero.eyebrow": "Hire or freelance across borders · On-chain escrow",
      "hero.title": "Work done.<br><span class='accent'>Money landed.</span>",
      "hero.lead": "Clients fear paying for nothing; freelancers fear working for nothing. Agree a price, lock the budget in an Avalanche contract, and get paid milestone by milestone, automatically if the client goes silent. Zero platform fee, settled in seconds.",
      "hero.cta1": "I want to hire", "hero.cta2": "I want to work",
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
    if (S.me) acctBtn();
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
    S.net = (() => { try { return localStorage.getItem("landed.net") === "l1" ? "l1" : "fuji"; } catch { return "fuji"; } })();
    S.cfg = await (await fetch(S.net === "l1" ? "config-l1.json" : "config.json")).json();
    S.cfg.symbol = S.cfg.symbol || "AVAX";
    S.rp = new ethers.JsonRpcProvider(S.cfg.rpc, S.cfg.chainId, { staticNetwork: true });
    S.L = new ethers.Contract(S.cfg.landed, S.cfg.landedAbi, S.rp);
    S.U = new ethers.Contract(S.cfg.usdc, S.cfg.usdcAbi, S.rp);
    $("#netinfo").innerHTML = `<span class="netsw">${[["fuji", "Fuji C-Chain"], ["l1", "Landed L1"]].map(([k, n]) => `<button type="button" data-net="${k}" class="${S.net === k ? "on" : ""}">${n}</button>`).join("")}</span> · ${S.cfg.explorer ? `<a class="addr" target="_blank" href="${explorer("address", S.cfg.landed)}">${short(S.cfg.landed)}</a>` : `<span class="addr" title="${S.cfg.landed}">${short(S.cfg.landed)}</span>`}`;
    $("#netinfo").querySelectorAll("[data-net]").forEach((b) => (b.onclick = () => { if (b.dataset.net === S.net) return; try { localStorage.setItem("landed.net", b.dataset.net); } catch {} location.reload(); }));
    applyStatic();
    await new Promise((r) => setTimeout(r, 150));
    const p0 = pickProvider((()=>{try{return localStorage.getItem("landed.wallet")}catch{return null}})());
    if (p0) {
      try { await connect(true); } catch {}
      p0.on?.("accountsChanged", async (a) => {
        const prev = S.me;
        if (!a?.length || !(await connect(true).catch(() => false))) {
          S.me = null; S.signer = null; const w = $("#wallet"); w.classList.remove("acct"); w.classList.replace("quiet", "ink"); w.innerHTML = t("wallet.connect");
          toast(X({ zh: "钱包已切换账户，请重新登录这个账户", en: "Wallet account changed. Log in again with this account.", es: "Cambiaste de cuenta. Vuelve a entrar con esta cuenta.", ja: "アカウントが切り替わりました。もう一度ログインしてください。" }));
        }
        // Viewing your own profile when the wallet switches: follow the new account instead of staying on the old one.
        if (prev && S.me && !same(prev, S.me) && location.hash.toLowerCase() === `#/u/${prev.toLowerCase()}`) { location.hash = `#/u/${S.me}`; return; }
        route();
      });
    }
    route();
  }

  // ---- Wallet discovery (EIP-6963) so Core and MetaMask can both be installed without clashing ----
  const WALLETS = {};
  addEventListener("eip6963:announceProvider", (e) => { const i = e.detail?.info || {}, n = (i.rdns || i.name || "").toLowerCase(); if (n.includes("avax") || n.includes("avalanche") || n.includes("core")) WALLETS.core = e.detail.provider; else if (n.includes("metamask")) WALLETS.mm = e.detail.provider; });
  dispatchEvent(new Event("eip6963:requestProvider"));
  const pickProvider = (w) => {
    if (w === "core") return WALLETS.core || window.avalanche || (window.ethereum?.isAvalanche ? window.ethereum : null);
    if (w === "mm") return WALLETS.mm || (window.ethereum?.providers || []).find((p) => p.isMetaMask && !p.isAvalanche) || (window.ethereum?.isMetaMask && !window.ethereum.isAvalanche ? window.ethereum : null);
    return window.ethereum || WALLETS.core || WALLETS.mm || null;
  };
  let EP = null;
  async function connect(silent, which) {
    const prov = which ? pickProvider(which) : (EP || pickProvider((()=>{try{return localStorage.getItem("landed.wallet")}catch{return null}})()));
    if (!prov) { if (!silent) toast(t("err.wallet"), true); return false; }
    EP = prov; try { if (which) localStorage.setItem("landed.wallet", which); } catch {}
    if (silent) { try { if (localStorage.getItem("landed.out")) return false; } catch {} } else { try { localStorage.removeItem("landed.out"); } catch {} }
    const accts = await prov.request({ method: silent ? "eth_accounts" : "eth_requestAccounts" });
    if (!accts?.length) return false;
    const hex = "0x" + S.cfg.chainId.toString(16);
    try { await prov.request({ method: "wallet_switchEthereumChain", params: [{ chainId: hex }] }); }
    catch (e) {
      if (e.code === 4902 || e.data?.originalError?.code === 4902) await prov.request({ method: "wallet_addEthereumChain", params: [{ chainId: hex, chainName: S.cfg.name, nativeCurrency: { name: S.cfg.symbol, symbol: S.cfg.symbol, decimals: 18 }, rpcUrls: [S.cfg.rpc], blockExplorerUrls: S.cfg.explorer ? [S.cfg.explorer] : [] }] });
      else if (!silent) throw e;
    }
    const bp = new ethers.BrowserProvider(prov);
    S.signer = await bp.getSigner();
    S.me = await S.signer.getAddress();
    S.wL = S.L.connect(S.signer);
    S.wU = S.U.connect(S.signer);
    acctBtn();
    $("#wallet").classList.replace("ink", "quiet");
    starterKit();
    return true;
  }
  // ---- Starter kit: a public, testnet-only drip wallet sends new users gas AVAX + test USDC automatically ----
  // This key holds only worthless Fuji test AVAX. It is public on purpose (approved by the project owner) so anyone can try the demo.
  const DRIP_KEY = "0xad270b8a68f8a6524e35e2360da8c3c6d3fc6b0e8fc546e588346f51fe7cb736";
  let dripping = false;
  async function acctBtn() {
    const w = $("#wallet"); if (!S.me || !w) return;
    const P = getProf(S.me), me = S.me;
    w.classList.add("acct"); w.removeAttribute("data-i18n"); w.title = me;
    const draw = (bal) => { if (S.me !== me) return; w.innerHTML = `<img src="${P.avatar ? esc(P.avatar) : avatar(me)}" alt=""><span class="ac-t"><b>${P.name ? esc(P.name) : short(me)}</b><small>${bal == null ? "…" : bal + " USDC"}</small></span>`; };
    draw(null);
    try { draw(fmt(await S.U.balanceOf(me))); } catch { draw("—"); }
  }
  async function starterKit() {
    if (dripping || !S.me || S.cfg.chainId !== 43113) return;
    const me = S.me, key = "landed.drip." + me.toLowerCase();
    try { if (localStorage.getItem(key)) return; } catch {}
    dripping = true;
    try {
      const [avax, usdc] = await Promise.all([S.rp.getBalance(me), S.U.balanceOf(me)]);
      const needGas = avax < ethers.parseEther("0.003"), needUsd = usdc < 100n * 1000000n;
      if (!needGas && !needUsd) { try { localStorage.setItem(key, "1"); } catch {} return; }
      const w = new ethers.Wallet(DRIP_KEY, S.rp);
      if ((await S.rp.getBalance(w.address)) < ethers.parseEther("0.008")) { toast(X({ zh: "测试币发放钱包余额不足，稍后重新登录即可领取", en: "The test-token wallet is empty right now. Log in again later to claim.", es: "La billetera de tokens de prueba está vacía. Vuelve a entrar más tarde.", ja: "配布用ウォレットの残高不足です。後でもう一度ログインしてください。" }), 1); return; }
      toast(X({ zh: "正在为你发放测试币…", en: "Sending you test tokens…", es: "Enviándote tokens de prueba…", ja: "テストトークンを送っています…" }));
      if (needGas) await (await w.sendTransaction({ to: me, value: ethers.parseEther("0.004") })).wait();
      if (needUsd) { const u = S.U.connect(w); await (await u.faucet()).wait(); await (await u.transfer(me, 10000n * 1000000n)).wait(); }
      try { localStorage.setItem(key, "1"); } catch {}
      toast(X({ zh: "已到账：0.004 测试 AVAX + 1 万测试 USDC，可以开始体验了", en: "Received 0.004 test AVAX + 10,000 test USDC — you're ready to try it", es: "Recibido: 0,004 AVAX + 10.000 USDC de prueba", ja: "受け取りました：テスト AVAX 0.004 ＋ テスト USDC 1 万" }));
      try { acctBtn(); showBal(); } catch {}
    } catch (e) { console.warn("starter kit", e); }
    finally { dripping = false; }
  }
  // ---- Login / sign-up: the wallet is the account; first login prompts for a profile ----
  const loginModal = () => new Promise((resolve) => {
    const L = (o) => X(o), has = !!pickProvider();
    const isCore = !!pickProvider("core"), isMM = !!pickProvider("mm");
    const el = document.createElement("div"); el.className = "lg-back";
    el.innerHTML = `<div class="lg glass" role="dialog" aria-modal="true">
      <button class="lg-x" aria-label="close">×</button>
      <div class="lg-tabs"><button class="on" data-t="in">${L({ zh: "登录", en: "Log in", es: "Entrar", ja: "ログイン" })}</button><button data-t="up">${L({ zh: "注册", en: "Sign up", es: "Registrarse", ja: "登録" })}</button><i class="lg-ind"></i></div>
      <h2 id="lg-h">${L({ zh: "欢迎回来", en: "Welcome back", es: "Bienvenido de nuevo", ja: "おかえりなさい" })}</h2>
      <p class="lg-sub" id="lg-sub">${L({ zh: "用钱包登录。钱包地址就是你的账号，不用密码，也不会被封号。", en: "Log in with your wallet. Your address is your account: no password, no account freezes.", es: "Entra con tu billetera. Tu dirección es tu cuenta: sin contraseña ni bloqueos.", ja: "ウォレットでログイン。アドレスがアカウントです。パスワード不要、凍結もありません。" })}</p>
      <div class="lg-opts">
        <button class="lg-opt" data-w="core"><span class="lg-ic core">C</span><span><b>Core</b><small>${L({ zh: "Avalanche 官方钱包，推荐", en: "Avalanche's own wallet, recommended", es: "Billetera oficial de Avalanche", ja: "Avalanche公式ウォレット（推奨）" })}</small></span><em>${has && isCore ? L({ zh: "已检测到", en: "Detected", es: "Detectada", ja: "検出済み" }) : ""}</em></button>
        <button class="lg-opt" data-w="mm"><span class="lg-ic mm">M</span><span><b>MetaMask</b><small>${L({ zh: "最常用的浏览器钱包", en: "The most popular browser wallet", es: "La billetera más usada", ja: "最も一般的なウォレット" })}</small></span><em>${has && isMM ? L({ zh: "已检测到", en: "Detected", es: "Detectada", ja: "検出済み" }) : ""}</em></button>
      </div>
      <ol class="lg-steps" id="lg-steps" hidden>
        <li>${L({ zh: "安装 Core 或 MetaMask 浏览器插件（约 1 分钟）", en: "Install the Core or MetaMask browser extension (about 1 minute)", es: "Instala la extensión Core o MetaMask (1 minuto)", ja: "Core か MetaMask の拡張機能をインストール（約1分）" })}</li>
        <li>${L({ zh: "在插件里创建钱包，记好助记词", en: "Create a wallet and keep your recovery phrase safe", es: "Crea una billetera y guarda tu frase de recuperación", ja: "ウォレットを作成し、リカバリーフレーズを保管" })}</li>
        <li>${L({ zh: "回到这里点上面的钱包，连接即完成注册", en: "Come back and pick your wallet above: connecting signs you up", es: "Vuelve y elige tu billetera: al conectar te registras", ja: "戻って上のウォレットを選択すると登録完了" })}</li>
      </ol>
      <p class="lg-foot">${L({ zh: "第一次连接即自动注册。登录后可以在个人页填写昵称、头像和作品集。", en: "Your first connection creates your account. Add a name, avatar and portfolio on your profile afterwards.", es: "La primera conexión crea tu cuenta. Luego completa tu perfil.", ja: "初回接続でアカウントが作成されます。その後プロフィールを設定できます。" })}</p>
    </div>`;
    document.body.appendChild(el);
    const close = (v) => { el.remove(); resolve(v); };
    el.onclick = (e) => { if (e.target === el) close(false); };
    el.querySelector(".lg-x").onclick = () => close(false);
    el.querySelectorAll(".lg-tabs button").forEach((b) => (b.onclick = () => {
      el.querySelectorAll(".lg-tabs button").forEach((x) => x.classList.toggle("on", x === b));
      const up = b.dataset.t === "up";
      el.querySelector(".lg-tabs").classList.toggle("up", up);
      const lg = el.querySelector(".lg"); lg.classList.remove("swap", "swap-l"); void lg.offsetWidth; lg.classList.add(up ? "swap" : "swap-l");
      el.querySelector("#lg-h").textContent = up ? L({ zh: "创建账号", en: "Create your account", es: "Crea tu cuenta", ja: "アカウント作成" }) : L({ zh: "欢迎回来", en: "Welcome back", es: "Bienvenido de nuevo", ja: "おかえりなさい" });
      el.querySelector("#lg-steps").hidden = !up && has;
    }));
    if (!has) el.querySelector("#lg-steps").hidden = false;
    el.querySelectorAll(".lg-opt").forEach((b) => (b.onclick = async () => {
      if (!pickProvider(b.dataset.w)) { window.open(b.dataset.w === "core" ? "https://core.app/" : "https://metamask.io/download/", "_blank", "noopener"); return; }
      b.classList.add("busy");
      try {
        const ok = await connect(false, b.dataset.w);
        if (!ok) { b.classList.remove("busy"); return; }
        const first = !getProf(S.me).name;
        close(true);
        if (first) { toast(L({ zh: "注册成功！先完善一下个人资料吧", en: "You're in! Add your profile details", es: "¡Listo! Completa tu perfil", ja: "登録完了！プロフィールを設定しましょう" })); location.hash = `#/u/${S.me}`; setTimeout(() => $("#p-edit")?.click(), 900); }
        else toast(L({ zh: "已登录", en: "Logged in", es: "Sesión iniciada", ja: "ログインしました" }));
      } catch (e) { b.classList.remove("busy"); toast(e.shortMessage || e.message, true); }
    }));
  });
  const needWallet = async () => S.me || (await loginModal());

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
    const BG = [["#FBF3E8", "#F4DCC2"], ["#F7EEE3", "#EED3BC"], ["#FFF4E6", "#FAD9B8"], ["#F5F0E8", "#E6D8C6"], ["#FDF0E4", "#F6CFB3"], ["#F8F1EA", "#EBDCCB"]];
    const CO = [["#FFC27A", "#FF7A1A", "#E5480C"], ["#FFD08A", "#FF9230", "#E8601A"], ["#FFB98A", "#FF6E3A", "#D9431A"], ["#FFD9A0", "#FFA040", "#E57412"]];
    const n = parseInt(String(addr).slice(2, 10), 16) || 0, [a, b] = BG[n % BG.length], [c1, c2, c3] = CO[(n >> 4) % CO.length], r = 30 + ((n >> 8) % 6) * 20;
    return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 84 84"><defs><linearGradient id="b" gradientTransform="rotate(${r} .5 .5)"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient><radialGradient id="c" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="${c1}"/><stop offset=".55" stop-color="${c2}"/><stop offset="1" stop-color="${c3}"/></radialGradient></defs><rect width="84" height="84" fill="url(#b)"/><path d="M17 44h12v6a13 13 0 0 0 26 0v-6h12v6a25 25 0 0 1-50 0z" fill="#141414"/><circle cx="42" cy="42" r="12" fill="url(#c)"/></svg>`)}`;
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
      else if (page === "skills") await skills(arg);
      else if (page === "skill") skillView(arg);
      else if (page === "newskill") await newSkill();
      else if (page === "offer") offerView(arg);
      else if (page === "job") await detail(Number(arg));
      else if (page === "u") await profile(arg);
      else if (page === "agent") agentDemo();
      else if (page === "about") about();
      else if (page === "me") { if (S.me) location.hash = `#/u/${S.me}`; else await profile(DEMO_SKILLS[0].addr, null, true); }
      else await home();
    } catch (e) {
      console.error(e);
      app.innerHTML = `<div class="wrap empty">${esc(e.shortMessage || e.message)}</div>`;
    }
  }
  window.addEventListener("hashchange", route);



  // ------------------------------------------------------------------ about
  function about() {
    const L = (zh, en, es, ja) => X({ zh, en, es, ja });
    const addr = (a, link) => link ? `<a class="ab-addr" target="_blank" rel="noopener" href="https://testnet.snowtrace.io/address/${a}">${short(a)}</a>` : `<code class="ab-addr" title="${a}">${short(a)}</code>`;
    const IC = {
      user: '<path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>',
      lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/><path d="M12 14.5v2.5"/>',
      work: '<path d="M4 8.5h16v10.5H4z"/><path d="M9 8.5V6.5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6.5v2"/><path d="M4 13h16"/>',
    };
    const svgIc = (k, x, y, s = 26, c = "currentColor") => `<g transform="translate(${x - s / 2},${y - s / 2}) scale(${s / 24})" fill="none" stroke="${c}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${IC[k]}</g>`;
    // Hero: budget moves client -> contract (locked) -> freelancer (released)
    const hero = `<svg class="ab-hero-svg" viewBox="0 0 520 250" role="img" aria-label="${L("需求方把预算锁进合约，验收后合约放款给接单人", "Client locks budget in the contract, which pays the freelancer on approval", "El cliente bloquea el presupuesto; el contrato paga al aprobar", "依頼者が予算をロックし、承認後に契約が支払う")}">
      <path class="ab-wire" d="M118 112 H206"/><path class="ab-wire" d="M314 112 H402"/>
      <circle r="9" fill="#FF6A00"><animateMotion dur="4.8s" repeatCount="indefinite" path="M118 112 H402" keyPoints="0;0.31;0.31;1;1" keyTimes="0;0.28;0.55;0.85;1" calcMode="linear"/><animate attributeName="opacity" dur="4.8s" repeatCount="indefinite" values="0;1;1;1;0" keyTimes="0;0.05;0.8;0.9;1"/></circle>
      <circle cx="74" cy="112" r="44" class="ab-node"/>${svgIc("user", 74, 112, 30, "#2A2420")}
      <circle cx="446" cy="112" r="44" class="ab-node"/>${svgIc("work", 446, 112, 30, "#2A2420")}
      <rect x="206" y="58" width="108" height="108" rx="30" class="ab-vault"/><rect x="206" y="58" width="108" height="108" rx="30" class="ab-vault-glow"/>${svgIc("lock", 260, 112, 38, "#fff")}
      <text x="162" y="98" class="ab-tag">${L("锁定预算", "Lock budget", "Bloquear", "予算ロック")}</text>
      <text x="358" y="98" class="ab-tag">${L("验收放款", "Pay out", "Pagar", "支払い")}</text>
      <text x="74" y="186" class="ab-cap">${L("需求方", "Client", "Cliente", "依頼者")}</text>
      <text x="260" y="196" class="ab-cap b">${L("智能合约", "Smart contract", "Contrato", "スマートコントラクト")}</text>
      <text x="446" y="186" class="ab-cap">${L("接单人", "Freelancer", "Freelancer", "フリーランス")}</text>
      <text x="260" y="222" class="ab-sub">${L("谁都动不了这笔钱，包括 Landed", "Nobody can touch the money, not even Landed", "Nadie puede tocar el dinero, ni Landed", "誰も触れない（Landed も）")}</text>
    </svg>`;
    // Architecture: AI agent / wallet -> x402 API / website -> Fuji C-Chain <-ICM-> Landed L1
    const box = (x, y, w, h, t, s, cls = "") => `<g class="ab-box ${cls}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16"/><text x="${x + w / 2}" y="${y + h / 2 - (s ? 4 : -5)}" class="t">${t}</text>${s ? `<text x="${x + w / 2}" y="${y + h / 2 + 16}" class="s">${s}</text>` : ""}</g>`;
    const arch = `<svg class="ab-arch" viewBox="0 0 760 360" role="img" aria-label="${L("系统架构图", "Architecture diagram", "Arquitectura", "構成図")}">
      <path class="ab-flow" d="M140 84 V146"/><path class="ab-flow" d="M500 84 V146"/>
      <path class="ab-flow" d="M140 206 C140 250 220 250 230 270"/><path class="ab-flow" d="M470 206 C470 240 330 240 320 270"/><path class="ab-flow" d="M530 206 C530 240 590 240 600 270"/>
      <path class="ab-icm" d="M380 305 H470"/>
      <circle r="5" fill="#FF6A00"><animateMotion dur="2.4s" repeatCount="indefinite" path="M380 305 H470"/></circle>
      <text x="425" y="292" class="ab-tag">ICM</text>
      <text x="196" y="236" class="ab-mini">0.01 USDC / ${L("次", "call", "llamada", "回")}</text>
      ${box(40, 24, 200, 60, L("AI 助手", "AI assistant", "Asistente IA", "AI アシスタント"), L("按次付费", "pays per call", "paga por uso", "従量課金"))}
      ${box(400, 24, 200, 60, L("用户钱包", "User wallet", "Billetera", "ウォレット"), "Core · MetaMask")}
      ${box(40, 146, 200, 60, L("x402 接口", "x402 API", "API x402", "x402 API"), "Cloudflare Worker")}
      ${box(400, 146, 200, 60, L("Landed 网站", "Landed web app", "App Landed", "Landed アプリ"), L("无后台 · 无数据库", "no backend · no database", "sin backend", "サーバーなし"))}
      ${box(150, 270, 230, 70, "Avalanche C-Chain", L("托管合约 · USDC（Fuji）", "Escrow · USDC (Fuji)", "Custodia · USDC", "預託 · USDC"), "hl")}
      ${box(470, 270, 250, 70, "Landed L1", L("托管合约 · LUSD 付手续费", "Escrow · fees in LUSD", "Custodia · comisión LUSD", "預託 · 手数料 LUSD"), "hl")}
    </svg>`;
    const steps = (arr) => `<ol class="ab-steps">${arr.map((s, i) => `<li class="rv" style="--d:${i * 90}ms"><span class="ab-n">${i + 1}</span><span>${s}</span></li>`).join("")}</ol>`;
    const STATS = [
      [0, L("个中间人经手资金", "middlemen holding funds", "intermediarios con fondos", "資金を預かる仲介者"), ""],
      [3, L("天无回应自动放款（可调）", "days to auto-release (adjustable)", "días para liberar (ajustable)", "日で自動支払い（調整可）"), ""],
      [4, L("种界面语言", "languages", "idiomas", "言語"), ""],
      [2, L("条 Avalanche 链", "Avalanche chains", "cadenas Avalanche", "Avalanche チェーン"), ""],
    ];
    const LOG = [
      ["10.09", L("Landed 专属链上线（Chain ID 111230），页面底部可切换网络；AI 助手可通过 x402 按次付费发需求；新增本页", "Landed L1 live (chain 111230) with a network switch; AI assistants post jobs via x402; this page", "L1 de Landed (111230) con selector de red; publicación vía x402; esta página", "Landed L1 公開（111230）・ネットワーク切替・x402 投稿・本ページ")],
      ["10.08", L("首次登录自动领测试币；修改需求；交付文件指纹上链；演示视频", "Auto test tokens on first login; edit job; delivery fingerprint on-chain; demo video", "Tokens automáticos; editar trabajo; huella en cadena; video", "テストトークン自動配布・依頼編集・納品指紋・デモ動画")],
      ["10.07", L("首个版本：预算锁定、分阶段托管、议价、自动放款、仲裁、链上信誉、技能广场", "First release: locked budgets, milestones, negotiation, auto-release, arbitration, reputation, skills board", "Primera versión: presupuesto bloqueado, hitos, negociación, arbitraje, reputación", "初版：予算ロック・マイルストーン・交渉・自動支払い・仲裁・評価・スキル広場")],
    ];
    const FAQ = [
      [L("钱真的安全吗？", "Is the money really safe?", "¿El dinero está seguro?", "お金は本当に安全？"), L("钱锁在公开的智能合约里，平台和任何个人都无法挪用。只有需求方确认、审核期到了自动放款，或仲裁裁决，钱才会转出。", "Funds sit in a public smart contract that neither the platform nor anyone else can take. Money only moves when the client approves, the review window expires, or an arbiter rules.", "Los fondos están en un contrato público que nadie puede tomar. Solo se mueven si el cliente aprueba, vence el plazo o decide el árbitro.", "資金は公開スマートコントラクトに保管され、誰も持ち出せません。承認・審査期限・仲裁のときだけ動きます。")],
      [L("需要注册账号吗？", "Do I need an account?", "¿Necesito una cuenta?", "アカウントは必要？"), L("不需要。钱包就是账号，第一次连接钱包就自动注册，没有密码。", "No. Your wallet is your account; connecting it the first time signs you up. No password.", "No. Tu billetera es tu cuenta; al conectarla te registras.", "不要です。ウォレットがアカウントで、初回接続で登録完了。")],
      [L("对方不付钱或不交付怎么办？", "What if the other side doesn't pay or deliver?", "¿Y si la otra parte no paga o no entrega?", "相手が払わない・納品しないときは？"), L("预算在开工前已经锁定，需求方无法赖账；需求方一直不确认，审核期结束后自动放款；有分歧可以申请仲裁。", "The budget is locked before work starts; if the client never responds, payment auto-releases after the review window; disputes go to arbitration.", "El presupuesto se bloquea antes; si el cliente no responde, se libera automáticamente; las disputas van a arbitraje.", "予算は着手前にロック済み。応答がなければ自動支払い、揉めたら仲裁へ。")],
      [L("现在用的是真钱吗？", "Is this real money?", "¿Es dinero real?", "本物のお金？"), L("不是。现在运行在测试网上，用的是没有实际价值的测试 USDC。", "No. It runs on testnet with test USDC that has no real value.", "No. Funciona en testnet con USDC de prueba.", "いいえ。テストネット上のテスト USDC です。")],
      [L("为什么有两条链？", "Why two networks?", "¿Por qué dos redes?", "なぜネットワークが 2 つ？"), L("Fuji C-Chain 是 Avalanche 公共测试网；Landed L1 是我们自己的专属链，手续费用 LUSD 付，未来可以由平台替用户付。页面底部可以切换。", "Fuji C-Chain is Avalanche's public testnet; Landed L1 is our own chain where fees are paid in LUSD and can later be sponsored. Switch in the footer.", "Fuji es la testnet pública; Landed L1 es nuestra cadena con comisiones en LUSD.", "Fuji は公開テストネット、Landed L1 は手数料 LUSD の専用チェーン。")],
      [L("钱包弹窗里有红色提示「Transaction pre-execution is unavailable」，安全吗？", "The wallet shows a red “Transaction pre-execution is unavailable”. Is it safe?", "La billetera muestra “pre-execution unavailable” en rojo. ¿Es seguro?", "ウォレットに赤字「pre-execution is unavailable」と出ます。安全？"), L("安全。这句话的意思是钱包无法提前模拟这笔交易。Core 只为大链提供模拟服务，Landed 专属链是新链还不支持，所以每笔都会显示。确认网络、合约地址和手续费没问题，就可以点 Approve。", "Yes. It only means the wallet can't simulate the transaction in advance; Core doesn't support new chains like Landed L1 yet. Check the network, contract and fee, then approve.", "Sí. Solo indica que la billetera no puede simular la transacción en una cadena nueva. Revisa red, contrato y comisión.", "安全です。新しいチェーンでは事前シミュレーションができないだけです。ネットワーク・コントラクト・手数料を確認して承認してください。")],
      [L("Core 提示网站「malicious」（恶意）是怎么回事？", "Core flags the site as “malicious”. Why?", "Core marca el sitio como “malicioso”. ¿Por qué?", "Core がサイトを「malicious」と表示します"), L("这是误报。AI 按次付费功能会请求一种付款签名，Core 的安全服务对新网站的这类签名比较敏感。我们已经向 Blockaid 提交了误报申诉。你可以确认签名内容只是 0.01 测试 USDC 后继续，或者换用 MetaMask。", "A false positive: the pay-per-call feature asks for a payment signature, which Core's security service treats cautiously on new sites. We've filed a report with Blockaid. Check it's only 0.01 test USDC, or use MetaMask.", "Es un falso positivo; ya lo reportamos a Blockaid. Comprueba que sean 0.01 USDC de prueba o usa MetaMask.", "誤検知です（Blockaid に報告済み）。0.01 テスト USDC だけか確認するか、MetaMask をご利用ください。")],
      [L("按钮一直显示「等待链上确认」不动？", "A button is stuck on “Waiting for confirmation”?", "¿Un botón se queda en “Esperando confirmación”?", "「確認待ち」のまま動かない"), L("多半是钱包自动退出登录了（一段时间不操作就会锁定），交易其实没有发出去。打开钱包重新登录，刷新网页后再操作一次。", "Usually the wallet locked itself after inactivity, so nothing was sent. Unlock the wallet, refresh the page and try again.", "Normalmente la billetera se bloqueó por inactividad. Desbloquéala, recarga y reintenta.", "多くはウォレットが自動ロックされ送信されていません。ロック解除後、再読み込みしてやり直してください。")],
      [L("在钱包里切换了账户，页面显示的还是上一个账户？", "I switched wallet accounts but the page still shows the old one?", "Cambié de cuenta pero la página muestra la anterior", "アカウントを切り替えても前のまま"), L("刷新一下网页即可。网页会重新读取钱包当前的账户。如果弹出登录框，点 Core 或 MetaMask 重新连接就行，不需要密码。", "Refresh the page so it reads the wallet's current account. If a login box appears, pick Core or MetaMask to reconnect; no password needed.", "Recarga la página; si aparece el inicio de sesión, vuelve a conectar la billetera.", "ページを再読み込みしてください。ログイン画面が出たらウォレットを選んで再接続します。")],
      [L("切换到 Landed L1 后余额变成 0？", "My balance is 0 after switching to Landed L1?", "¿Saldo 0 al cambiar a Landed L1?", "Landed L1 に切り替えると残高が 0？"), L("两条链的余额是分开的。在 Landed L1 上需要一点 LUSD 付手续费（可以从有 LUSD 的账户转一点过来），然后在「我的」页面点「领取测试币」领 1 万测试 USDC。", "Each chain has its own balances. On Landed L1 you need a little LUSD for fees (send some from an account that has it), then tap “Get test tokens” on your profile for 10,000 test USDC.", "Cada cadena tiene su saldo. Necesitas algo de LUSD para comisiones y luego pide USDC de prueba en tu perfil.", "残高はチェーンごとに別です。手数料用の LUSD を少し用意し、プロフィールでテスト USDC を受け取ってください。")],
    ];
    app.innerHTML = `<div class="wrap fade-in about">
      <section class="ab-hero">
        <div class="ab-hero-t">
          <div class="label">${L("关于 Landed", "About Landed", "Acerca de Landed", "Landed について")}</div>
          <h2 class="ab-h">${L("先锁钱，再干活，<br>验收了再放款。", "Lock the money first.<br>Get paid on approval.", "Primero se bloquea.<br>Se cobra al aprobar.", "先にロック、<br>承認で支払い。")}</h2>
          <p class="muted ab-lead">${L("海外客户怕付了钱拿不到活，自由职业者怕交了活收不到钱。Landed 把预算锁进 Avalanche 上的智能合约，按阶段验收放款，双方都不用再靠信任。", "Clients fear paying and getting nothing; freelancers fear delivering and never getting paid. Landed locks the budget in an Avalanche smart contract and pays out milestone by milestone.", "Clientes y freelancers ya no dependen de la confianza: Landed bloquea el presupuesto en un contrato de Avalanche y paga por hitos.", "依頼者も受注者も信頼に頼る必要はありません。Landed は予算を Avalanche のコントラクトにロックし、段階ごとに支払います。")}</p>
        </div>
        <div class="ab-hero-v glass">${hero}</div>
      </section>
      <section class="ab-stats">${STATS.map(([n, t], i) => `<div class="ab-stat glass rv" style="--d:${i * 80}ms"><b data-count="${n}">${n}</b><span>${t}</span></div>`).join("")}</section>
      <div class="ab-grid">
        <section class="ab-sec glass rv"><div class="ab-sh"><span class="ab-ic">${`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${IC.user}</svg>`}</span><h3>${L("我要找人做事", "I need work done", "Necesito un trabajo", "仕事を頼みたい")}</h3></div>${steps([
          L("用钱包登录，第一次即注册", "Log in with your wallet (first time signs you up)", "Entra con tu billetera", "ウォレットでログイン"),
          L("发布需求，按阶段填金额，预算锁进合约", "Post a job with milestones; the budget locks in the contract", "Publica con hitos; el presupuesto se bloquea", "マイルストーン付きで投稿、予算をロック"),
          L("从申请人里选人，价格可以先谈", "Pick a freelancer; negotiate first if needed", "Elige freelancer; negocia si hace falta", "応募者を選ぶ（交渉も可）"),
          L("每阶段交付后确认，这部分钱自动打给对方", "Approve each delivery and that milestone pays out", "Aprueba cada entrega y se paga el hito", "納品を承認するとその分が支払われる"),
        ])}</section>
        <section class="ab-sec glass rv" style="--d:120ms"><div class="ab-sh"><span class="ab-ic">${`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${IC.work}</svg>`}</span><h3>${L("我要接单赚钱", "I want to earn", "Quiero ganar", "仕事を受けたい")}</h3></div>${steps([
          L("在需求广场看预算已锁定的需求", "Browse jobs whose budget is already locked", "Mira trabajos con presupuesto bloqueado", "予算ロック済みの依頼を探す"),
          L("申请或报价，也可以在技能广场挂出服务", "Apply or quote, or list your service on the skills board", "Postula o publica tu servicio", "応募・見積もり、スキル掲載も可"),
          L("按阶段交付，文件指纹记录在链上", "Deliver by milestone; a file fingerprint goes on-chain", "Entrega por hitos con huella en cadena", "段階ごとに納品、指紋をチェーンに記録"),
          L("对方确认或审核期结束，钱直接到你钱包", "Paid on approval or when the review window ends", "Cobras al aprobar o al vencer el plazo", "承認または期限で自動入金"),
        ])}</section>
      </div>
      <section class="ab-sec glass rv"><h3>${L("用到的 Avalanche 技术", "How it runs on Avalanche", "Cómo funciona en Avalanche", "Avalanche での構成")}</h3>
        <p class="muted ab-note">${L("网站没有后台和数据库，所有钱和记录都在链上。", "The web app has no backend or database; money and records live on-chain.", "La app no tiene backend; todo está en cadena.", "サーバーもデータベースもなく、資金と記録はすべてチェーン上。")}</p>
        <div class="ab-arch-wrap">${arch}</div>
        <div class="ab-tech">
          <div class="rv"><b>C-Chain (Fuji)</b><p>${L("托管合约和测试 USDC。", "Escrow contract and test USDC.", "Contrato y USDC de prueba.", "預託コントラクトとテスト USDC。")}</p><small>${addr("0x05d5A6b00eC5eFcE7bAE65504543c75f3795Dfa8", 1)} ${addr("0x1Df84cC053e61AA5AF7B674e79BA2854388378f6", 1)}</small></div>
          <div class="rv" style="--d:80ms"><b>Landed L1</b><p>${L("自己的专属链，手续费用 LUSD，将来可由平台代付。", "Our own chain; fees in LUSD, sponsorable later.", "Cadena propia; comisiones en LUSD.", "専用チェーン、手数料は LUSD。")}</p><small>${addr("0x8F716e4cEc7e336af78b44e738c013e4ff1b908a")} ${addr("0x493d63523A852836D081E876553C63330E5aB306")}</small></div>
          <div class="rv" style="--d:160ms"><b>ICM</b><p>${L("跨链消息，让 C-Chain 的 USDC 进入专属链。", "Interchain messaging to move USDC from the C-Chain into the L1.", "Mensajería para mover USDC a la L1.", "C-Chain の USDC を L1 へ。")}</p></div>
          <div class="rv" style="--d:240ms"><b>x402</b><p>${L("AI 助手签名即付款，不需要账号和密钥。", "AI assistants pay by signing; no account or key.", "Los asistentes IA pagan firmando.", "AI は署名だけで支払い。")} <a href="#/agent">${L("去试试", "Try it", "Probar", "試す")} →</a></p></div>
        </div>
      </section>
      <section class="ab-sec glass rv"><h3>${L("更新记录", "Changelog", "Novedades", "更新履歴")}</h3>
        <ul class="ab-tl">${LOG.map(([d, t], i) => `<li class="rv" style="--d:${i * 100}ms"><time>${d}</time><span>${t}</span></li>`).join("")}</ul>
      </section>
      <section class="ab-sec glass rv"><h3>${L("常见问题", "FAQ", "Preguntas frecuentes", "よくある質問")}</h3>${FAQ.map(([q, a]) => `<details class="ab-faq"><summary>${q}</summary><p>${a}</p></details>`).join("")}</section>
      <p class="muted ab-foot">${L("开源代码：", "Source code: ", "Código fuente: ", "ソースコード：")}<a target="_blank" rel="noopener" href="https://github.com/MinusPlus2025/landed">github.com/MinusPlus2025/landed</a></p>
    </div>`;
    // Reveal on scroll + count-up
    const els = app.querySelectorAll(".about .rv");
    const show = (el) => { el.classList.add("in"); const b = el.querySelector("[data-count]"); if (b && !b.dataset.done) { b.dataset.done = 1; const n = +b.dataset.count; let i = 0; const tick = () => { b.textContent = Math.round((n * ++i) / 20); if (i < 20) requestAnimationFrame(tick); }; if (n) { b.textContent = 0; tick(); } } };
    if ("IntersectionObserver" in window) { const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } }), { threshold: 0.12 }); els.forEach((el) => io.observe(el)); }
    else els.forEach(show);
  }

  // ------------------------------------------------------------------ x402 agent demo
  const X402_API = "https://landed-x402.aero-works.workers.dev/api/jobs";
  const FUJI_USDC = "0x5425890298aed601595a70AB815c96711a31Bc65";
  function agentDemo() {
    const step = (n, zh, en) => `<li id="ag-s${n}" class="ag-step"><span class="ag-dot">${n}</span><span>${X({ zh, en, es: en, ja: en })}</span></li>`;
    app.innerHTML = `<div class="wrap fade-in" style="max-width:760px">
      <div class="label">x402 · Avalanche Fuji</div>
      <h2 style="margin:10px 0 8px;font-size:30px">${X({ zh: "AI 助手替你发需求，按次付费", en: "Your AI assistant posts the job, pays per call", es: "Tu asistente IA publica el trabajo y paga por uso", ja: "AIアシスタントが依頼を投稿、1回ごとに支払い" })}</h2>
      <p class="muted" style="margin-bottom:24px">${X({ zh: "接口先回复“请付 0.01 USDC”（HTTP 402），助手用钱包签名付款，链上结算后需求才会创建。不需要账号或 API 密钥。", en: "The API first answers “pay 0.01 USDC” (HTTP 402). The assistant signs a payment with its wallet; once it settles on-chain, the job is created. No account or API key.", es: "La API responde “paga 0.01 USDC” (HTTP 402); el asistente firma el pago y, al liquidarse en cadena, se crea el trabajo.", ja: "APIはまず「0.01 USDCを支払って」(HTTP 402)と返し、署名・決済後に依頼が作成されます。" })}</p>
      <div class="card" style="padding:24px">
        <label class="label">${X({ zh: "需求标题", en: "Job title", es: "Título", ja: "タイトル" })}</label>
        <input id="ag-title" class="input" style="margin:8px 0 16px;width:100%" value="${esc(X({ zh: "为播客做 30 秒片头音乐", en: "30-second intro music for a podcast", es: "Música de intro de 30 s para un podcast", ja: "ポッドキャスト用30秒イントロ曲" }))}">
        <label class="label">${X({ zh: "预算（USDC）", en: "Budget (USDC)", es: "Presupuesto (USDC)", ja: "予算 (USDC)" })}</label>
        <input id="ag-budget" class="input" type="number" style="margin:8px 0 20px;width:100%" value="120">
        <button id="ag-go" class="btn ink">${X({ zh: "让 AI 助手发布（付 0.01 USDC）", en: "Let the assistant post it (pay 0.01 USDC)", es: "Publicar con el asistente (0.01 USDC)", ja: "アシスタントに投稿させる (0.01 USDC)" })}</button>
      </div>
      <ol class="ag-steps" style="list-style:none;padding:0;margin:24px 0">
        ${step(1, "调用接口，收到 402：请付 0.01 USDC", "Call API, get 402: pay 0.01 USDC")}
        ${step(2, "钱包签名付款授权（不花手续费）", "Wallet signs a payment authorization (no gas)")}
        ${step(3, "带上付款重新调用，结算服务验证并上链", "Retry with payment; facilitator verifies and settles on-chain")}
        ${step(4, "需求创建成功", "Job created")}
      </ol>
      <pre id="ag-log" class="card" style="padding:16px;font-size:12px;white-space:pre-wrap;display:none"></pre>
    </div>`;
    const mark = (n, cls) => $("#ag-s" + n).className = "ag-step " + cls;
    const log = (o) => { const el = $("#ag-log"); el.style.display = "block"; el.textContent = typeof o === "string" ? o : JSON.stringify(o, null, 2); };
    $("#ag-go").onclick = async () => {
      const btn = $("#ag-go"); btn.disabled = true;
      [1, 2, 3, 4].forEach((n) => mark(n, ""));
      try {
        if (!S.signer && !(await loginModal())) { btn.disabled = false; return; }
        const job = { title: $("#ag-title").value, budget: $("#ag-budget").value };
        mark(1, "run");
        const r1 = await fetch(X402_API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(job) });
        const req = (await r1.json()).accepts?.[0];
        if (r1.status !== 402 || !req) throw new Error("API did not return 402");
        mark(1, "ok"); mark(2, "run"); log({ status: 402, accepts: req });
        toast(X({ zh: "等待钱包确认…没看到弹窗的话，点浏览器右上角的钱包图标", en: "Waiting for your wallet… if no popup appears, click the wallet icon in your browser toolbar", es: "Esperando tu billetera… si no aparece, haz clic en el icono de la billetera", ja: "ウォレットの確認待ち…表示されない場合はツールバーのウォレットをクリック" }));
        const from = await S.signer.getAddress();
        const now = Math.floor(Date.now() / 1000);
        const auth = { from, to: req.payTo, value: req.maxAmountRequired, validAfter: String(now - 60), validBefore: String(now + req.maxTimeoutSeconds), nonce: ethers.hexlify(ethers.randomBytes(32)) };
        const TYPES = { TransferWithAuthorization: [{ name: "from", type: "address" }, { name: "to", type: "address" }, { name: "value", type: "uint256" }, { name: "validAfter", type: "uint256" }, { name: "validBefore", type: "uint256" }, { name: "nonce", type: "bytes32" }] };
        const DOMAIN = { name: req.extra.name, version: req.extra.version, chainId: 43113, verifyingContract: FUJI_USDC };
        const rawSig = await S.signer.signTypedData(
          { name: req.extra.name, version: req.extra.version, chainId: 43113, verifyingContract: FUJI_USDC },
          { TransferWithAuthorization: [{ name: "from", type: "address" }, { name: "to", type: "address" }, { name: "value", type: "uint256" }, { name: "validAfter", type: "uint256" }, { name: "validBefore", type: "uint256" }, { name: "nonce", type: "bytes32" }] },
          auth);
        // 有些钱包返回 v=0/1，合约只认 27/28，这里统一规范化，并在本地先核对签名人
        const signature = ethers.Signature.from(rawSig).serialized;
        const signer = ethers.verifyTypedData(DOMAIN, TYPES, auth, signature);
        if (signer.toLowerCase() !== from.toLowerCase()) throw new Error("signature mismatch: " + signer);
        mark(2, "ok"); mark(3, "run");
        const payment = btoa(JSON.stringify({ x402Version: 1, scheme: "exact", network: "avalanche-fuji", payload: { signature, authorization: auth } }));
        const r2 = await fetch(X402_API, { method: "POST", headers: { "Content-Type": "application/json", "X-PAYMENT": payment }, body: JSON.stringify(job) });
        const out = await r2.json();
        log(out);
        if (!r2.ok) throw new Error(out.error || "payment failed");
        mark(3, "ok"); mark(4, "ok");
        $("#ag-log").insertAdjacentHTML("afterend", `<a class="btn ghost sm" target="_blank" rel="noopener" href="${esc(out.explorer)}">${X({ zh: "在区块浏览器查看付款", en: "View payment on explorer", es: "Ver pago en el explorador", ja: "エクスプローラーで確認" })} ↗</a>`);
      } catch (e) {
        $$(".ag-step.run").forEach((el) => el.className = "ag-step err");
        toast(e.shortMessage || e.message);
      }
      btn.disabled = false;
    };
  }

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
  const FLOWIC = [0,
    `<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V7.5a4 4 0 0 1 8 0V11"/><circle cx="12" cy="16" r="1.3" class="dot"/></svg>`,
    `<svg viewBox="0 0 24 24"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M12 18v-6M9.5 14.5 12 12l2.5 2.5"/></svg>`,
    `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="m8.5 12.2 2.4 2.4 4.8-5"/></svg>`,
    `<svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="5.5"/><path d="m9 13.5-1.5 7.5 4.5-2.5 4.5 2.5L15 13.5"/><path d="m10.2 9 1.3 1.3 2.4-2.6"/></svg>`];
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
  // Demo clients behind the seeded jobs (all seeded from the deployer wallet); real users fall back to their address
  const DEMO_CLIENTS = [
    ["Hanna Weber", "Kaffeehaus Mitte · Berlin", "photo-1573496359142-b8d87734a5a2"],
    ["Ethan Brooks", "Noted AI · San Francisco", "photo-1472099645785-5658abf4ff4e"],
    ["Priya Shah", "The Long Run Podcast · London", "photo-1580489944761-15a19d654956"],
    ["Carlos Ruiz", "FitPulse · Mexico City", "photo-1506794778202-cad84cf45f1d"],
    ["Sophie Martin", "Ledgerly · Paris", "photo-1487412720507-e7ab37603c6f"],
    ["Jake Miller", "YouTube creator · Toronto", "photo-1519085360753-af0119f7cbe7"],
    ["Emma Wilson", "Little Fox Books · Sydney", "photo-1531123897727-8f129e1688ce"],
  ];
  const CITIES = [["Shanghai","上海","上海","Shanghái"],["Beijing","北京","北京","Pekín"],["Shenzhen","深圳","深セン","Shenzhen"],["Guangzhou","广州","広州","Cantón"],["Hangzhou","杭州","杭州","Hangzhou"],["Chengdu","成都","成都","Chengdu"],["Hong Kong","香港","香港","Hong Kong"],["Taipei","台北","台北","Taipéi"],["Tokyo","东京","東京","Tokio"],["Seoul","首尔","ソウル","Seúl"],["Singapore","新加坡","シンガポール","Singapur"],["London","伦敦","ロンドン","Londres"],["Paris","巴黎","パリ","París"],["Berlin","柏林","ベルリン","Berlín"],["Madrid","马德里","マドリード","Madrid"],["New York","纽约","ニューヨーク","Nueva York"],["San Francisco","旧金山","サンフランシスコ","San Francisco"],["Los Angeles","洛杉矶","ロサンゼルス","Los Ángeles"],["Toronto","多伦多","トロント","Toronto"],["Sydney","悉尼","シドニー","Sídney"],["Mexico City","墨西哥城","メキシコシティ","Ciudad de México"]];
  const cityL = (c) => { c = String(c || "").trim(); const k = c.toLowerCase(); const r = CITIES.find((x) => x.some((v) => v.toLowerCase() === k)); return r ? r[{ en: 0, zh: 1, ja: 2, es: 3 }[lang] ?? 0] : c; };
  const tzCity = (tz) => { if (!/\//.test(tz || "")) return ""; return cityL(String(tz).split("/").pop().replace(/_/g, " ")); };
  const orgL = (o) => { const a = String(o || "").split(" · "); if (a.length > 1) a[a.length - 1] = cityL(a[a.length - 1]); return a.join(" · "); };
  const parseDl = (d) => { const m = /\s*#fp=sha256:([0-9a-f]{64}):?(.*)$/.exec(d || ""); return m ? { link: d.slice(0, m.index).trim(), hash: m[1], fname: (() => { try { return decodeURIComponent(m[2] || ""); } catch { return m[2]; } })() } : { link: (d || "").trim(), hash: "", fname: "" }; };
  const sha256File = async (f) => [...new Uint8Array(await crypto.subtle.digest("SHA-256", await f.arrayBuffer()))].map((x) => x.toString(16).padStart(2, "0")).join("");
  const FP_IC = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 11c0 3-1 6-3 8M8 6.5A6 6 0 0 1 18 11c0 2-.3 4-1 5.5M6 9a6 6 0 0 0-.5 2.5c0 2-.5 3.5-1.5 4.5M12 11a2 2 0 0 0-4 0c0 2.5-.6 4.6-1.8 6.3M16 11a4 4 0 0 0-8 0"/></svg>`;
  const fpChip = (h, fname) => `<button type="button" class="fp-chip" data-fp="${h}" title="${esc(fname || "")}">${FP_IC}${X({ zh: "文件指纹", en: "File fingerprint", es: "Huella del archivo", ja: "ファイル指紋" })} <code>${h.slice(0, 6)}…${h.slice(-4)}</code></button>`;
  const dlLink = (l) => l ? `<a href="${esc(/^https?:/.test(l) ? l : "https://" + l)}" target="_blank" rel="noopener">${esc(l)}</a>` : "";
  const fpVerify = (hash, fname) => {
    const el = document.createElement("div"); el.className = "lg-back";
    el.innerHTML = `<div class="lg glass fpv" role="dialog"><button class="lg-x" aria-label="close">×</button><h2>${X({ zh: "核对交付文件", en: "Verify delivered file", es: "Verificar archivo", ja: "納品ファイルを照合" })}</h2><p class="lg-sub">${X({ zh: "把你手里的文件拖进来，和链上记录的指纹比对。一致就证明这正是当时交付的文件，没被替换过。文件不会上传。", en: "Drop the file you have to compare it with the fingerprint recorded on-chain. A match proves it's exactly what was delivered. Nothing is uploaded.", es: "Suelta el archivo para compararlo con la huella en cadena. Nada se sube.", ja: "手元のファイルをドロップしてオンチェーンの指紋と照合します。アップロードはされません。" })}</p><div class="fpv-rec"><small>${X({ zh: "链上记录", en: "On-chain record", es: "Registro en cadena", ja: "オンチェーン記録" })}${fname ? ` · ${esc(fname)}` : ""}</small><code>${hash}</code></div><label class="fp-drop" id="fpv-drop"><input type="file" hidden><span>${X({ zh: "点击选择或拖入文件", en: "Click or drop a file", es: "Haz clic o suelta un archivo", ja: "クリックまたはドロップ" })}</span></label><div class="fpv-res" id="fpv-res"></div></div>`;
    document.body.appendChild(el);
    const close = () => el.remove(); el.onclick = (e) => { if (e.target === el) close(); }; el.querySelector(".lg-x").onclick = close;
    const drop = el.querySelector("#fpv-drop"), inp = drop.querySelector("input");
    const check = async (f) => { if (!f) return; const r = el.querySelector("#fpv-res"); r.className = "fpv-res"; r.textContent = "…"; const h = await sha256File(f); const ok = h === hash; r.className = "fpv-res " + (ok ? "ok" : "bad"); r.innerHTML = `<b>${ok ? X({ zh: "✓ 一致：这就是当时交付的文件", en: "✓ Match: this is the delivered file", es: "✓ Coincide", ja: "✓ 一致" }) : X({ zh: "✗ 不一致：文件和交付时的不同", en: "✗ No match: this file differs from the delivery", es: "✗ No coincide", ja: "✗ 不一致" })}</b><code>${esc(f.name)} · ${h.slice(0, 10)}…${h.slice(-6)}</code>`; };
    inp.onchange = () => check(inp.files[0]);
    drop.ondragover = (e) => { e.preventDefault(); drop.classList.add("over"); }; drop.ondragleave = () => drop.classList.remove("over");
    drop.ondrop = (e) => { e.preventDefault(); drop.classList.remove("over"); check(e.dataTransfer.files[0]); };
  };
  document.addEventListener("click", (e) => { const b = e.target.closest(".fp-chip"); if (b) { e.preventDefault(); fpVerify(b.dataset.fp, b.title); } });
  // Demo jobs are posted on-chain in English; show them in the reader's language.
  const DEMO_TX = {
    "咖啡店品牌 Logo 设计": { en: "Coffee shop brand logo design", es: "Diseño de logo para una cafetería", ja: "カフェのブランドロゴデザイン" },
    "做一首电子乐": { en: "Produce an electronic music track", es: "Producir un tema de música electrónica", ja: "エレクトロ楽曲を 1 曲制作" },
    "Brand identity for a Berlin coffee roastery": { zh: "柏林咖啡烘焙店品牌设计", es: "Identidad de marca para un tostador de café en Berlín", ja: "ベルリンのコーヒー焙煎所のブランドデザイン" },
    "We are opening our second shop and need a full identity: logo, colour palette, cup and bag packaging. Warm, hand-made feel. Please share 2-3 past identity projects.": { zh: "我们要开第二家店，需要一整套品牌形象：Logo、配色、杯子和包装袋。风格温暖、有手作感。请附 2–3 个过往品牌案例。", es: "Abrimos nuestra segunda tienda y necesitamos una identidad completa: logo, paleta, vasos y bolsas. Estilo cálido y artesanal. Comparte 2-3 proyectos previos.", ja: "2 号店のオープンに向け、ロゴ・配色・カップと袋のパッケージ一式を依頼します。温かみのある手作り感で。過去の事例を 2〜3 件添えてください。" },
    "Marketing site for an AI note-taking app": { zh: "AI 笔记应用的官网", es: "Sitio web para una app de notas con IA", ja: "AI メモアプリの紹介サイト" },
    "Next.js + Tailwind landing page with pricing, blog and waitlist. Figma is ready. Must be fast and responsive.": { zh: "用 Next.js + Tailwind 做落地页，包含价格、博客和等候名单。Figma 设计稿已就绪，要求加载快、适配手机。", es: "Landing en Next.js + Tailwind con precios, blog y lista de espera. Figma listo. Rápida y adaptable.", ja: "Next.js + Tailwind で料金・ブログ・ウェイトリスト付きの LP。Figma あり。高速・レスポンシブ必須。" },
    "30-second podcast intro music": { zh: "30 秒播客片头音乐", es: "Música de intro de 30 s para un pódcast", ja: "ポッドキャスト用 30 秒イントロ曲" },
    "Upbeat lo-fi intro and outro for a weekly tech podcast. Need stems and full commercial rights.": { zh: "为每周科技播客做轻快的 lo-fi 片头和片尾，需要分轨文件和完整商用版权。", es: "Intro y cierre lo-fi alegres para un pódcast tecnológico semanal. Con pistas separadas y derechos comerciales.", ja: "週刊テック番組向けの軽快な lo-fi オープニングとエンディング。ステムと商用権込み。" },
    "Localise a fitness app UI into Simplified Chinese": { zh: "健身 App 界面翻译成简体中文", es: "Localizar la interfaz de una app de fitness al chino simplificado", ja: "フィットネスアプリ UI の簡体字中国語化" },
    "About 2,400 strings, natural tone for mainland users. Glossary provided.": { zh: "约 2,400 条文案，语气要贴近大陆用户，提供术语表。", es: "Unas 2.400 cadenas, tono natural para China continental. Glosario incluido.", ja: "約 2,400 文字列。中国本土ユーザー向けの自然な表現で。用語集あり。" },
    "Product explainer video, 60s, motion graphics": { zh: "60 秒产品介绍动画视频", es: "Video explicativo de 60 s con motion graphics", ja: "60 秒の製品紹介モーショングラフィックス" },
    "Explain our invoicing product in 60 seconds. Script is done, need storyboard and animation.": { zh: "用 60 秒讲清楚我们的开票产品。脚本已写好，需要分镜和动画。", es: "Explica nuestro producto de facturación en 60 s. Guion listo; falta storyboard y animación.", ja: "請求書サービスを 60 秒で紹介。台本は完成済み、絵コンテとアニメーションを依頼。" },
    "YouTube channel editing · 4 episodes": { zh: "YouTube 频道剪辑 · 4 期", es: "Edición para YouTube · 4 episodios", ja: "YouTube チャンネル編集・4 本" },
    "Edit four 15-minute episodes: cuts, captions in EN/ZH, thumbnail.": { zh: "剪辑 4 期 15 分钟的视频：粗剪精剪、中英字幕、封面图。", es: "Editar cuatro episodios de 15 min: cortes, subtítulos EN/ZH y miniatura.", ja: "15 分×4 本の編集：カット、英中字幕、サムネイル。" },
    "Illustration set for a children's book cover": { zh: "儿童绘本封面插画", es: "Ilustraciones para la portada de un libro infantil", ja: "絵本の表紙イラスト一式" },
    "Cover plus 6 spot illustrations.": { zh: "封面加 6 张内页小插图。", es: "Portada y 6 ilustraciones interiores.", ja: "表紙と挿絵 6 点。" },
    "Moodboard & 3 logo directions": { zh: "情绪板 + 3 个 Logo 方向", es: "Moodboard y 3 propuestas de logo", ja: "ムードボードとロゴ案 3 つ" },
    "Final logo + palette": { zh: "定稿 Logo + 配色", es: "Logo final y paleta", ja: "最終ロゴと配色" },
    "Packaging (cup, bag, sticker)": { zh: "包装（杯子、袋子、贴纸）", es: "Empaque (vaso, bolsa, pegatina)", ja: "パッケージ（カップ・袋・ステッカー）" },
    "Home + pricing pages": { zh: "首页 + 价格页", es: "Inicio y precios", ja: "トップと料金ページ" },
    "Blog, waitlist, launch": { zh: "博客、等候名单、上线", es: "Blog, lista de espera y lanzamiento", ja: "ブログ・ウェイトリスト・公開" },
    "Two demo directions": { zh: "两个小样方向", es: "Dos demos", ja: "デモ 2 案" },
    "Final mix + stems": { zh: "最终混音 + 分轨", es: "Mezcla final y pistas", ja: "最終ミックスとステム" },
    "Full translation": { zh: "全部翻译", es: "Traducción completa", ja: "全文翻訳" },
    "Storyboard": { zh: "分镜", es: "Storyboard", ja: "絵コンテ" },
    "Animation v1": { zh: "动画初版", es: "Animación v1", ja: "アニメーション初稿" },
    "Final with voiceover": { zh: "加配音的成片", es: "Versión final con locución", ja: "ナレーション付き完成版" },
    "Episode 1": { zh: "第 1 期", es: "Episodio 1", ja: "第 1 話" }, "Episode 2": { zh: "第 2 期", es: "Episodio 2", ja: "第 2 話" },
    "Episode 3": { zh: "第 3 期", es: "Episodio 3", ja: "第 3 話" }, "Episode 4": { zh: "第 4 期", es: "Episodio 4", ja: "第 4 話" },
    "Sketches": { zh: "草图", es: "Bocetos", ja: "ラフ" }, "Final artwork": { zh: "最终画稿", es: "Arte final", ja: "完成稿" },
  };
  const TT = (s) => (s && DEMO_TX[s.trim()] && DEMO_TX[s.trim()][lang]) || s;
  const clientOf = (j) => { const d = /^0xbd66afc8701f4c2f961a873ecc8e74614d2c985e$/i.test(j.client) && DEMO_CLIENTS[Number(j.id) % DEMO_CLIENTS.length]; return d ? { name: d[0], org: orgL(d[1]), av: `https://images.unsplash.com/${d[2]}?w=120&h=120&q=70&auto=format&fit=crop&crop=faces` } : (() => { const P = getProf(j.client); return { name: P.name || short(j.client), org: [P.org, cityL(P.city) || tzCity(P.tz)].filter(Boolean).join(" · ") || X({ zh: "Landed 新用户", en: "New on Landed", es: "Nuevo en Landed", ja: "Landed 新規ユーザー" }), av: P.avatar || avatar(j.client) }; })(); };
  const clientRow = (j, big) => { const c = clientOf(j); return `<div class="jc-client${big ? " big" : ""}"><img src="${esc(c.av)}" alt=""><div><b>${esc(c.name)}</b>${c.org ? `<span>${esc(c.org)}</span>` : ""}</div></div>`; };
  const jcard = (j, self) => `
    <a class="jcard" href="#/job/${j.id}">
      ${cover(j)}
      <div class="jc-body">
        <div class="row small muted"><span>${esc(catLabel(j.category))}</span><span class="spacer"></span><span>${j.apps.length} ${t("job.apps")}</span></div>
        <div class="jc-t">${esc(TT(j.title))}</div>
        ${self === "self" ? "" : clientRow(j)}
        <div class="jc-foot"><span class="tag ok"><span class="d"></span>${t("job.locked")}</span><span class="go">→</span></div>
        ${segs(j)}
      </div>
    </a>`;

  const X = (o) => o[lang] || o.en;
  const FLOW = () => `
    <section class="flow-sec">
      <div class="wrap">
        <div class="label" class="label">${X({ zh: "钱怎么走", en: "Where the money goes", es: "Cómo fluye el dinero", ja: "お金の流れ" })}</div>
        <h2>${X({ zh: "客户付的钱，先锁进合约，<br>验收一段，到账一段。", en: "The client's money is locked first,<br>then lands one milestone at a time.", es: "El dinero se bloquea primero<br>y se libera por hitos.", ja: "まずロック、<br>検収ごとに着金。" })}</h2>
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
      ev.push(`<span><i class="d"></i>${X({ zh: "新需求", en: "New job", es: "Nuevo trabajo", ja: "新着" })} · ${esc(TT(j.title))} · <b>${fmt(j.budget)} USDC ${X({ zh: "已锁定", en: "locked", es: "bloqueado", ja: "ロック済" })}</b></span>`);
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
    jobs: `<svg viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="17" rx="3"/><path d="M9 4h6v2.5H9zM9 11h6M9 15h4"/></svg>`,
    skills: `<svg viewBox="0 0 24 24"><rect x="3.5" y="7.5" width="17" height="12" rx="3"/><path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5M3.5 13h17"/></svg>`,
    new: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/></svg>`,
    me: `<svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="4"/><path d="M5 20a7 7 0 0 1 14 0"/></svg>`,
    ai: `<svg viewBox="0 0 24 24"><rect x="5" y="7" width="14" height="12" rx="4"/><path d="M12 7V4M9.5 12.5h.01M14.5 12.5h.01M9.5 16h5"/></svg>`,
    about: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/></svg>`,
    home: `<svg viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="13" rx="4"/><circle cx="12" cy="5" r="2.5" fill="currentColor" stroke="none"/></svg>`,
  };
  // ------------------------------------------------------------------ pages
  const tagFor = (st) => `<span class="tag ${["open", "wait", "open", "ok", "", "ok"][st]}"><span class="d"></span>${t("st." + st)}</span>`;
  const row = (j, mine) => `
    <a class="item" href="#/job/${j.id}">
      <div><div class="t">${esc(TT(j.title))}</div><div class="s">${esc(catLabel(j.category))} · ${date(j.createdAt)} · ${esc(TT(j.details))}</div></div>
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
    const cmp = COMPARE[lang].map((r, i) => `<div class="vs-row" style="--i:${i}"><div class="vs-pain">${r[0]}</div><div class="vs-them"><span class="vs-x">✕</span>${r[1]}</div><div class="vs-us"><span class="vs-ok">✓</span>${r[2]}</div></div>`).join("");
    const open = jobs.filter((j) => j.status === 0).slice(0, 3);

    app.innerHTML = `
      <div class="scene" aria-hidden="true"><img class="hero-photo" src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=1800&q=70&auto=format&fit=crop" alt="" onerror="this.remove()"><i class="s-glow"></i><div class="pings">${jobs.flatMap((j) => j.ms.filter((m) => m.state === 2).map((m) => `<span>+${fmt(m.amount)} USDC · ${esc(m.name)}</span>`)).slice(0, 4).join("")}</div></div>
      <div class="wrap fade-in">
        <section class="hero"><div class="glass hero-copy">
          <div class="label">${t("hero.eyebrow")}</div>
          <h1 style="margin-top:20px" class="hero-h">${t("hero.title")}</h1><svg class="hero-story" viewBox="0 0 260 340" aria-hidden="true"><defs><radialGradient id="hs" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#FFC27A"/><stop offset=".55" stop-color="#FF7A1A"/><stop offset="1" stop-color="#E5480C"/></radialGradient></defs>
<g class="hs-card"><rect x="40" y="16" width="150" height="110" rx="16" fill="#fff" stroke="#E6E6E3"/><rect x="58" y="36" width="60" height="8" rx="4" fill="#111"/><rect class="hs-l1" x="58" y="58" width="110" height="6" rx="3" fill="#D8D8D4"/><rect class="hs-l2" x="58" y="74" width="90" height="6" rx="3" fill="#D8D8D4"/><rect class="hs-l3" x="58" y="90" width="70" height="6" rx="3" fill="#D8D8D4"/>
<g class="hs-chk"><circle cx="186" cy="24" r="16" fill="#111"/><path d="M179 24l5 5 9-10" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g></g>
<text class="hs-t1" x="115" y="150" text-anchor="middle" font-size="13" fill="#8A8A86" font-family="Lexend,sans-serif">${X({zh:"活干完 · 已交付",en:"Work done · delivered",es:"Trabajo entregado",ja:"納品完了"})}</text>
<circle class="hs-coin" cx="115" cy="70" r="15" fill="url(#hs)"/>
<path class="hs-cup" d="M60 220h30v26a25 25 0 0 0 50 0v-26h30v26a55 55 0 0 1-110 0z" fill="#111"/>
<text class="hs-amt" x="115" y="200" text-anchor="middle" font-size="22" font-weight="500" fill="#FF6A00" font-family="Lexend,sans-serif">+300 USDC</text>
<text class="hs-t2" x="115" y="332" text-anchor="middle" font-size="13" fill="#8A8A86" font-family="Lexend,sans-serif">${X({zh:"钱到手 · 已到账",en:"Money landed",es:"Dinero recibido",ja:"着金しました"})}</text></svg>
          <p class="lead">${t("hero.lead")}</p>
          <div class="ctas"><a class="btn ink pill" href="#/new">${t("hero.cta1")}<span class="arr">→</span></a><a class="btn ghost pill cta2" href="#/jobs">${t("hero.cta2")}<span class="arr">→</span></a></div>
        </div>${heroArt()}</section>
      </div>${ticker(jobs)}<div class="wrap">
        <section class="facts">
          ${(() => {
            const L = Number(locked) || 0, P = Number(paid) || 0, N = jobs.length || 0, D = Number(done) || 0;
            setTimeout(vzCount, 0);
            const IC = {
              lock: '<rect x="4" y="5" width="16" height="15" rx="3"/><circle cx="12" cy="12.5" r="3.2"/><path d="M12 9.3v1.2M12 14.5v1.2M8.8 12.5h1.2M14 12.5h1.2M7 20v1.5M17 20v1.5"/>',
              out: '<circle cx="13" cy="6.5" r="3.5"/><path d="M3 14h3l3.5-1.5h4a1.5 1.5 0 0 1 0 3H10M6 20h8.5l6-4.5a1.6 1.6 0 0 0-2.2-2.3L14.5 16"/><path d="M3 14v6h3"/>',
              doc: '<rect x="5" y="4" width="14" height="17" rx="2.5"/><path d="M9 4h6v2.5H9zM8.5 11h7M8.5 14.5h7M8.5 18h4"/>',
              ok: '<path d="M12 3l2.4 1.7 2.9-.1.9 2.8 2.3 1.8-.9 2.8.9 2.8-2.3 1.8-.9 2.8-2.9-.1L12 21l-2.4-1.7-2.9.1-.9-2.8-2.3-1.8.9-2.8-.9-2.8 2.3-1.8.9-2.8 2.9.1z"/><path d="M8.6 12.2l2.3 2.3 4.5-4.6"/>',
              sk: '<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18M11 12.5v2h2v-2"/>',
            };
            const ic = (k) => `<span class="h-ic"><svg viewBox="0 0 24 24">${IC[k]}</svg></span>`;
            const curve = (seed, tone) => { const R = vzSeed(seed); let y = 50; const pts = Array.from({ length: 13 }, (_, i) => { y = Math.max(10, y - (0.2 + R()) * 4.4); return [i * 25, y]; }); let d = `M0 ${pts[0][1].toFixed(1)}`; for (let i = 1; i < 13; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], cx = (x0 + x1) / 2; d += ` C${cx} ${y0.toFixed(1)} ${cx} ${y1.toFixed(1)} ${x1} ${y1.toFixed(1)}`; } const id = "hg" + seed; return `<svg class="h-curve" viewBox="0 0 300 64" preserveAspectRatio="none"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${tone}" stop-opacity=".2"/><stop offset="1" stop-color="${tone}" stop-opacity="0"/></linearGradient></defs><path class="ar" d="${d} L300 64 L0 64Z" fill="url(#${id})"/><path class="ln" d="${d}" pathLength="1" stroke="${tone}" vector-effect="non-scaling-stroke"/></svg>`; };
            const byCat = {}; jobs.forEach((j) => (byCat[j.category] = (byCat[j.category] || 0) + 1));
            const catBar = `<div class="h-cat"><div class="h-catbar">${Object.entries(byCat).map(([c, n], i) => `<i style="flex:${n};background:${(PAL[c] || PAL.Other)[1]};animation-delay:${i * 90}ms"></i>`).join("")}</div><div class="h-catleg">${Object.entries(byCat).slice(0, 4).map(([c, n]) => `<span><b style="background:${(PAL[c] || PAL.Other)[1]}"></b>${catLabel(c)} ${n}</span>`).join("")}</div></div>`;
            const prog = `<div class="h-prog"><div class="h-track"><i style="--p:${Math.round((D / (N || 1)) * 100)}%"></i></div><span>${Math.round((D / (N || 1)) * 100)}%</span></div>`;
            const ks = [...mySkills(), ...DEMO_SKILLS];
            const who = `<div class="h-who"><div class="h-av">${ks.slice(0, 4).map((k, i) => k.av ? `<img src="${esc(k.av)}" alt="" style="animation-delay:${i * 90}ms" onerror="this.remove()">` : `<i>${esc((k.name || "?")[0])}</i>`).join("")}</div><span>${X({ zh: "价格可议", en: "Negotiable", es: "Negociable", ja: "交渉可" })}</span></div>`;
            const card = (k, tone, v, lab, foot) => `<div class="fact hx" style="--t:${tone}">${ic(k)}<div class="v" data-n="${v}">${v}</div><div class="k">${lab}</div><div class="h-foot">${foot}</div></div>`;
            return card("lock", "#FF6A00", fmt(locked), `USDC · ${t("stats.locked")}`, curve(3, "#FF6A00"))
              + card("out", "#1F8A5B", fmt(paid), `USDC · ${t("stats.paid")}`, curve(5, "#1F8A5B"))
              + card("doc", "#3B5BDB", N, t("stats.jobs"), catBar)
              + card("ok", "#111111", D, t("stats.done"), prog)
              + `<a href="#/skills" class="h-link">` + card("sk", "#7A3FD1", ks.length, X({ zh: "可直接雇佣的技能服务", en: "Skill listings you can hire", es: "Servicios para contratar", ja: "依頼できるスキル" }), who) + `</a>`;
          })()}
        </section>
      </div>${FLOW()}<div class="wrap">
        <section class="block">
          <div class="row" style="align-items:flex-end;margin-bottom:28px"><div><div class="label">${t("board.title")}</div><h2 style="margin-top:10px;font-size:30px">${t("board.sub")}</h2></div><span class="spacer"></span><a class="btn ghost sm" href="#/jobs">${t("hero.cta2")} →</a></div>
          <div class="cards">${open.map(jcard).join("") || emptyBox(emptyNet())}</div>
        </section>
        <section class="block">
          <div class="row" style="align-items:flex-end;margin-bottom:28px"><div><div class="label">${L_SK()}</div><h2 style="margin-top:10px;font-size:30px">${X({ zh: "也可以反过来：挑一个人，谈好价再锁钱", en: "Or the other way: pick a freelancer, agree a price, then lock funds", es: "O al revés: elige un freelancer, acuerda el precio y bloquea el pago", ja: "逆も可能：人を選び、価格を合意してから資金をロック" })}</h2></div><span class="spacer"></span><a class="btn ghost sm" href="#/skills">${X({ zh: "浏览技能", en: "Browse skills", es: "Ver talentos", ja: "スキルを見る" })} →</a></div>
          <div class="skgrid">${[...mySkills(), ...DEMO_SKILLS].slice(0, 3).map(skillCard).join("")}</div>
        </section>
        <section class="block">
          <div class="how-head"><div class="label">${t("how.eyebrow")}</div><h2>${t("how.title")}</h2></div>
          <div class="hwf">
            <div class="hwf-track"><i class="hwf-fill"></i><span class="hwf-coin"></span></div>
            <div class="hwf-steps">${[1, 2, 3, 4].map((i) => `<div class="fs" style="--i:${i - 1}"><div class="fs-node">${FLOWIC[i]}</div><div class="fs-n">0${i}</div><h3>${t(`how.${i}t`)}</h3><p>${t(`how.${i}d`)}</p></div>`).join("")}</div>
          </div>
        </section>
        <section class="block">
          <div class="how-head"><div class="label">${t("cmp.eyebrow")}</div><h2>${t("cmp.title")}</h2></div>
          <div class="vs"><div class="vs-hd"><span></span><span>${t("cmp.h2")}</span><span class="vs-brand">${t("cmp.h3")}</span></div>${cmp}</div>
        </section>
      </div>`;
  }

  const emptyBox = (msg) => `<div class="empty board-empty"><p>${msg}</p></div>`;
  const emptyNet = () => S.net === "l1"
    ? X({ zh: "Landed 专属链上还没有需求。点右上角「发布需求」，成为第一个发布的人。", en: "No jobs on the Landed L1 yet. Use “Post a job” at the top right to be the first.", es: "Aún no hay trabajos en la L1 de Landed. Usa «Publicar trabajo» arriba a la derecha.", ja: "Landed L1 にはまだ依頼がありません。右上の「案件を投稿」から最初の依頼をどうぞ。" })
    : X({ zh: "暂时没有开放中的需求，新需求发布后会出现在这里。", en: "No open jobs right now. New ones will show up here.", es: "No hay trabajos abiertos ahora. Los nuevos aparecerán aquí.", ja: "現在募集中の依頼はありません。新しい依頼はここに表示されます。" });
  const emptyCat = (c) => X({ zh: `还没有「${catLabel(c)}」类的需求，可以先看看其他分类。`, en: `No ${catLabel(c)} jobs yet. Try another category.`, es: `Aún no hay trabajos de ${catLabel(c)}. Prueba otra categoría.`, ja: `「${catLabel(c)}」の依頼はまだありません。ほかのカテゴリもご覧ください。` });
  async function board(cat) {
    const jobs = (await loadJobs()).filter((j) => j.status === 0);
    const sel = cat ? decodeURIComponent(cat) : "";
    const list = jobs.filter((j) => !sel || j.category === sel);
    const chips = ["", ...CATS].map((c) => `<a class="chip ${c === sel ? "on" : ""}" href="#/jobs${c ? "/" + c : ""}">${c ? catLabel(c) : t("cat.all")}</a>`).join("");
    app.innerHTML = `
      <div class="wrap fade-in">
        <div class="page-head"><div><h1>${t("board.title")}</h1><p>${t("board.sub")}</p></div><span class="spacer"></span><a class="btn ink pill" href="#/new">${t("nav.post")}<span class="arr">→</span></a></div>
        <div class="filters">${chips}</div>
        <div class="cards">${list.map(jcard).join("") || emptyBox(!jobs.length ? emptyNet() : emptyCat(sel))}</div>
      </div>`;
  }


  // ---- Skills: freelancers list services; hiring opens a direct funded deal (postDirect) ----
  const DEMO_SKILLS = [
    { addr: "0xBd66aFC8701f4c2F961A873ECc8e74614d2C985e", name: "Lin Zhou", av: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&q=70&auto=format&fit=crop&crop=faces", done: 38, city: "上海", pf: ["https://images.unsplash.com/photo-1626785774573-4b799315345d?w=900&q=65&auto=format&fit=crop", "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=900&q=65&auto=format&fit=crop", "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=900&q=65&auto=format&fit=crop"], cat: "Design", price: 800, days: 7, img: "photo-1561070791-2526d30994b5",
      title: { zh: "品牌 Logo + VI 全套", en: "Logo + full brand identity", es: "Logo + identidad de marca", ja: "ロゴ＋ブランドVI一式" },
      desc: { zh: "3 版方案，2 轮修改，交付源文件。", en: "3 concepts, 2 revisions, source files.", es: "3 propuestas, 2 revisiones, archivos fuente.", ja: "3案・修正2回・元データ納品。" } },
    { addr: "0xBd66aFC8701f4c2F961A873ECc8e74614d2C985e", name: "Kai Nakamura", av: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&q=70&auto=format&fit=crop&crop=faces", done: 24, city: "東京", pf: ["synth:kai-theme", "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=900&q=65&auto=format&fit=crop", "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=900&q=65&auto=format&fit=crop"], cat: "Music", price: 450, days: 5, img: "photo-1511379938547-c1f69419868d",
      title: { zh: "游戏 / 视频配乐 60 秒", en: "60s game / video score", es: "Música para juego o vídeo (60 s)", ja: "ゲーム・動画BGM 60秒" },
      desc: { zh: "原创编曲，含商用授权与分轨。", en: "Original, with commercial license and stems.", es: "Original, con licencia comercial y pistas.", ja: "オリジナル、商用ライセンス・パラデータ付き。" } },
    { addr: "0xBd66aFC8701f4c2F961A873ECc8e74614d2C985e", name: "Mei Chen", av: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&q=70&auto=format&fit=crop&crop=faces", done: 17, city: "深圳", pf: ["https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&q=65&auto=format&fit=crop", "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=65&auto=format&fit=crop", "https://github.com/MinusPlus2025/landed"], cat: "Development", price: 1500, days: 14, img: "photo-1498050108023-c5249f4df085",
      title: { zh: "落地页 + Web3 钱包接入", en: "Landing page + wallet connect", es: "Landing + conexión de billetera", ja: "LP制作＋ウォレット連携" },
      desc: { zh: "响应式、多语言，部署上线。", en: "Responsive, multilingual, deployed.", es: "Responsive, multilingüe, publicada.", ja: "レスポンシブ・多言語・公開まで。" } },
    { addr: "0xBd66aFC8701f4c2F961A873ECc8e74614d2C985e", name: "Yu Sato", av: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&q=70&auto=format&fit=crop&crop=faces", done: 52, city: "大阪", pf: ["https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=900&q=65&auto=format&fit=crop"], cat: "Translation", price: 120, days: 3, img: "photo-1456513080510-7bf3a84b82f8",
      title: { zh: "中英日本地化翻译 3000 字", en: "ZH/EN/JA localization, 3k words", es: "Localización ZH/EN/JA, 3000 palabras", ja: "中英日ローカライズ 3000字" },
      desc: { zh: "母语校对，游戏和 App 文案优先。", en: "Native proofreading, games and apps.", es: "Revisión nativa, juegos y apps.", ja: "ネイティブ校正、ゲーム・アプリ歓迎。" } },
  ];

  // ---- Portfolio: images, videos, articles and social links attached to a skill ----
  const PLAT = [[/^synth:/, "Demo track", "au"], [/\.(mp3|wav|ogg|m4a|flac|aac)(\?|$)/i, "Audio", "au"], [/youtube\.com|youtu\.be/, "YouTube", "v"], [/bilibili\.com|b23\.tv/, "Bilibili", "v"], [/vimeo\.com/, "Vimeo", "v"], [/\.(mp4|webm|mov)(\?|$)/i, "Video", "v"],
    [/\.(jpe?g|png|webp|gif|avif)(\?|$)/i, "Image", "i"], [/images\.unsplash\.com/, "Image", "i"],
    [/instagram\.com/, "Instagram", "s"], [/(^|\.)x\.com|twitter\.com/, "X", "s"], [/xiaohongshu\.com|xhslink\.com/, "小红书", "s"], [/douyin\.com/, "抖音", "s"], [/tiktok\.com/, "TikTok", "s"], [/weibo\.com/, "微博", "s"],
    [/behance\.net/, "Behance", "s"], [/dribbble\.com/, "Dribbble", "s"], [/github\.com/, "GitHub", "s"], [/linkedin\.com/, "LinkedIn", "s"], [/soundcloud\.com/, "SoundCloud", "s"], [/spotify\.com/, "Spotify", "s"], [/artstation\.com/, "ArtStation", "s"]];
  const pfType = (u) => { for (const [re, name, kind] of PLAT) if (re.test(u)) return { name, kind }; let host = ""; try { host = new URL(u).hostname.replace(/^www\./, ""); } catch {} return { name: host || "Link", kind: "a" }; };
  const safeUrl = (u) => (/^https?:\/\//i.test(u) ? u : "https://" + u);
  const embedOf = (u) => {
    let m = /(?:youtu\.be\/|v=|shorts\/)([\w-]{11})/.exec(u); if (m) return `https://www.youtube.com/embed/${m[1]}`;
    m = /(BV[\w]{10})/.exec(u); if (m) return `https://player.bilibili.com/player.html?bvid=${m[1]}&autoplay=0`;
    m = /vimeo\.com\/(\d+)/.exec(u); if (m) return `https://player.vimeo.com/video/${m[1]}`;
    return null;
  };
  const skCover = (k) => k.cover || (k.pf || []).find((u) => pfType(u).kind === "i") || (k.img ? `https://images.unsplash.com/${k.img}?w=900&q=65&auto=format&fit=crop` : "");
  const pfGallery = (pf) => {
    if (!pf || !pf.length) return "";
    const by = (k) => pf.filter((u) => pfType(u).kind === k);
    const imgs = by("i"), vids = by("v"), links = [...by("s"), ...by("a")];
    const L = (o) => X(o);
    return `<section class="pf glass"><h3>${L({ zh: "作品集", en: "Portfolio", es: "Portafolio", ja: "ポートフォリオ" })}<small>${pf.length}</small></h3>
      ${by("au").length ? `<div class="pf-aus">${by("au").map((u) => `<div class="pf-au" data-au="${esc(u)}"><button type="button" class="au-play" aria-label="play"><svg viewBox="0 0 24 24"><path class="i-pl" d="M8 5v14l11-7z"/><path class="i-pa" d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg></button><div class="au-main"><b>${esc(u.startsWith("synth:") ? L({ zh: "试听 · 原创 Demo", en: "Listen · Original demo", es: "Escuchar · Demo original", ja: "試聴 · オリジナルデモ" }) : decodeURIComponent(u.split("/").pop().split("?")[0]))}</b><canvas></canvas></div></div>`).join("")}</div>` : ""}
      ${vids.length ? `<div class="pf-vids">${vids.map((u) => { const e = embedOf(u); return e ? `<div class="pf-vid"><iframe src="${esc(e)}" allowfullscreen loading="lazy"></iframe></div>` : /\.(mp4|webm|mov)/i.test(u) ? `<div class="pf-vid"><video src="${esc(safeUrl(u))}" controls preload="metadata"></video></div>` : `<a class="pf-link" target="_blank" rel="noopener" href="${esc(safeUrl(u))}"><b>▶ ${pfType(u).name}</b><span>${esc(u)}</span></a>`; }).join("")}</div>` : ""}
      ${imgs.length ? `<div class="pf-imgs">${imgs.map((u) => `<a href="${esc(safeUrl(u))}" target="_blank" rel="noopener"><img src="${esc(safeUrl(u))}" alt="" loading="lazy" onerror="this.parentNode.classList.add('broken')"></a>`).join("")}</div>` : ""}
      ${links.length ? `<div class="pf-links">${links.map((u) => { const p = pfType(u); return `<a class="pf-link" target="_blank" rel="noopener" href="${esc(safeUrl(u))}"><i>${esc(p.name[0])}</i><b>${esc(p.name)}</b><span>${esc(u.replace(/^https?:\/\/(www\.)?/, ""))}</span></a>`; }).join("")}</div>` : ""}
    </section>`;
  };
  // Sound-reactive portfolio player: bars follow the live spectrum (Web Audio AnalyserNode)
  const AU = { ctx: null, an: null, el: null, stop: null, raf: 0 };
  const auSynth = (ctx, out) => {
    const bpm = 96, b = 60 / bpm, chords = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]];
    const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
    const noise = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate); const nd = noise.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1800; lp.connect(out);
    const env = (node, t, a, d, peak) => { node.gain.setValueAtTime(0.0001, t); node.gain.exponentialRampToValueAtTime(peak, t + a); node.gain.exponentialRampToValueAtTime(0.0001, t + a + d); };
    const tone = (type, f, t, d, peak, dest) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.value = f; env(g, t, 0.02, d, peak); o.connect(g).connect(dest); o.start(t); o.stop(t + d + 0.1); };
    let step = 0, next = ctx.currentTime + 0.05, alive = true;
    const tick = () => {
      if (!alive) return;
      while (next < ctx.currentTime + 0.2) {
        const bar = Math.floor(step / 8) % 4, s8 = step % 8, ch = chords[bar];
        if (s8 % 2 === 0) { const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(140, next); o.frequency.exponentialRampToValueAtTime(40, next + 0.25); env(g, next, 0.005, 0.3, s8 % 4 === 0 ? 0.9 : 0.5); o.connect(g).connect(out); o.start(next); o.stop(next + 0.4); }
        const n = ctx.createBufferSource(), hp = ctx.createBiquadFilter(), ng = ctx.createGain(); n.buffer = noise; hp.type = "highpass"; hp.frequency.value = 7000; env(ng, next, 0.002, 0.05, s8 % 2 ? 0.25 : 0.12); n.connect(hp).connect(ng).connect(out); n.start(next);
        tone("triangle", hz(ch[0] - 24), next, b * 0.45, 0.35, out);
        if (s8 === 0) ch.forEach((m) => tone("sawtooth", hz(m), next, b * 3.6, 0.07, lp));
        tone("sine", hz(ch[(step * 5) % 3] + 12 + (s8 === 7 ? 2 : 0)), next, b * 0.3, 0.12, out);
        next += b / 2; step++;
      }
      setTimeout(tick, 50);
    };
    tick();
    return () => { alive = false; };
  };
  const auStop = () => { if (AU.stop) AU.stop(); AU.stop = null; cancelAnimationFrame(AU.raf); if (AU.el) AU.el.classList.remove("on"); AU.el = null; };
  // p5.js-style generative visual: a breathing ring of noise-warped lines driven by the spectrum, with fading trails
  const auDraw = (box) => {
    const cv = box.querySelector("canvas"), g = cv.getContext("2d"), data = new Uint8Array(AU.an.frequencyBinCount), wave = new Uint8Array(AU.an.fftSize);
    let t = 0; const w = (cv.width = cv.clientWidth * 2), h = (cv.height = cv.clientHeight * 2);
    const loop = () => {
      AU.an.getByteFrequencyData(data); AU.an.getByteTimeDomainData(wave);
      let bass = 0; for (let i = 0; i < 12; i++) bass += data[i]; bass /= 12 * 255;
      g.fillStyle = "rgba(20,20,19,0.18)"; g.fillRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2, R = Math.min(w, h) * (0.22 + bass * 0.12), N = 160;
      for (let k = 0; k < 3; k++) {
        g.beginPath();
        for (let i = 0; i <= N; i++) {
          const a = (i / N) * Math.PI * 2, f = data[Math.floor((i % (N / 2)) / (N / 2) * data.length * 0.5)] / 255;
          const r = R + f * Math.min(w, h) * (0.16 + k * 0.05) + Math.sin(a * (3 + k) + t * (1 + k * 0.4)) * 10 * (1 + bass * 3);
          const x = cx + Math.cos(a + t * 0.1 * (k + 1)) * r * (w / h > 2 ? 2.4 : 1), y = cy + Math.sin(a + t * 0.1 * (k + 1)) * r;
          i ? g.lineTo(x, y) : g.moveTo(x, y);
        }
        g.strokeStyle = ["#FF6A00", "#FFB37A", "rgba(255,255,255,.55)"][k]; g.lineWidth = 3 - k * 0.6; g.stroke();
      }
      g.beginPath(); for (let i = 0; i < wave.length; i += 4) { const x = (i / wave.length) * w, y = h - 18 - (wave[i] - 128) * 0.25; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = 2; g.stroke();
      t += 0.02 + bass * 0.06; AU.raf = requestAnimationFrame(loop);
    };
    g.fillStyle = "#141413"; g.fillRect(0, 0, w, h); loop();
  };
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".au-play"); if (!btn) return;
    const box = btn.closest(".pf-au"); if (AU.el === box) return auStop();
    auStop();
    if (!AU.ctx) { AU.ctx = new (window.AudioContext || window.webkitAudioContext)(); AU.an = AU.ctx.createAnalyser(); AU.an.fftSize = 512; AU.an.smoothingTimeConstant = 0.78; AU.an.connect(AU.ctx.destination); }
    AU.ctx.resume(); const src = box.dataset.au;
    if (src.startsWith("synth:")) { const mix = AU.ctx.createGain(); mix.gain.value = 0.6; mix.connect(AU.an); const end = auSynth(AU.ctx, mix); AU.stop = () => { end(); setTimeout(() => mix.disconnect(), 600); }; }
    else { const a = new Audio(); a.crossOrigin = "anonymous"; a.src = src; a.loop = true; const node = AU.ctx.createMediaElementSource(a); node.connect(AU.an); a.play().catch(() => auStop()); AU.stop = () => { a.pause(); node.disconnect(); }; }
    AU.el = box; box.classList.add("on"); auDraw(box);
  });
  window.addEventListener("hashchange", auStop);
  const durL = (k) => `${k.days}${k.unit === "h" ? " " + X({zh:"小时",en:"hours",es:"horas",ja:"時間"}) : " " + t("day")}`;
  const mySkills = () => { try { return JSON.parse(localStorage.getItem("landed.skills") || "[]"); } catch { return []; } };
  const tx = (v) => (typeof v === "string" ? v : v[lang] || v.en);
  const enc = (o) => btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, "-").replace(/\//g, "_");
  const dec = (s) => JSON.parse(decodeURIComponent(escape(atob(s.replace(/-/g, "+").replace(/_/g, "/")))));
  const L_SK = () => X({ zh: "技能广场", en: "Skills", es: "Talentos", ja: "スキル" });
  const L_LIST = () => X({ zh: "发布我的技能", en: "List my skill", es: "Publicar mi servicio", ja: "スキルを掲載" });
  const skImg = (k, w) => `<div class="sk-img" style="--c:${(PAL[k.cat] || PAL.Other)[1]};--b:${(PAL[k.cat] || PAL.Other)[0]}">${skCover(k) ? `<img src="${esc(skCover(k))}" alt="" onerror="this.remove()">` : `<span class="sk-ic">${CATIC[k.cat] || CATIC.Other}</span>`}${(k.pf || []).length ? `<span class="sk-pfn">${(k.pf || []).length} ${X({ zh: "件作品", en: (k.pf || []).length === 1 ? "work" : "works", es: (k.pf || []).length === 1 ? "obra" : "obras", ja: "件" })}</span>` : ""}<span class="sk-cat">${catLabel(k.cat)}</span></div>`;
  const skAv = (k, cls = "") => k.av ? `<img class="sk-av ${cls}" src="${esc(k.av)}" alt="">` : `<i class="sk-av-ph ${cls}"><svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="3.6"/><path d="M5 20a7 7 0 0 1 14 0"/></svg></i>`;
  const skillCard = (k) => `
    <a class="skcard" href="#/skill/${enc(k)}">${skImg(k, 600)}
      <div class="sk-body"><h3>${esc(tx(k.title))}</h3><p>${esc(tx(k.desc))}</p>
      <div class="sk-foot"><span class="sk-who">${skAv(k)}${esc(k.name || (/^0x0+$/.test(k.addr) ? "" : short(k.addr)))}</span><span class="spacer"></span><b>${Number(k.price).toLocaleString("en-US")}</b><small>USDC · ${durL(k)}</small></div></div>
    </a>`;
  async function skills(sel) {
    const list = [...mySkills(), ...DEMO_SKILLS].filter((k) => !sel || k.cat === sel);
    const chips = ["", ...CATS].map((c) => `<a class="chip ${c === (sel || "") ? "on" : ""}" href="#/skills${c ? "/" + c : ""}">${c ? catLabel(c) : t("cat.all")}</a>`).join("");
    app.innerHTML = `<div class="wrap fade-in">
      <div class="page-head"><div><h1>${L_SK()}</h1><p>${X({ zh: "接单的人挂出服务和报价。看中了直接雇佣，钱先锁进合约，交付验收后放款。", en: "Freelancers list services with a price. Hire directly: the budget locks in the contract and releases on approval.", es: "Los freelancers publican servicios con precio. Contrata directo: el pago se bloquea en el contrato y se libera al aprobar.", ja: "フリーランサーがサービスと価格を掲載。依頼すると予算がコントラクトにロックされ、承認後に支払われます。" })}</p></div><span class="spacer"></span><a class="btn ink pill" href="#/newskill">${L_LIST()}<span class="arr">→</span></a></div>
      <div class="filters">${chips}</div>
      <div class="skgrid">${list.map(skillCard).join("") || emptyBox(X({ zh: `还没有人发布「${catLabel(sel)}」类的技能。你会这个？点右上角「发布我的技能」。`, en: `No ${catLabel(sel)} skills listed yet. Good at it? Use “List my skill” at the top right.`, es: `Aún no hay servicios de ${catLabel(sel)}. ¿Lo dominas? Usa «Publicar mi servicio».`, ja: `「${catLabel(sel)}」のスキルはまだありません。得意なら右上の「スキルを掲載」へ。` }))}</div></div>`;
  }
  function skillView(code) {
    let k; try { k = dec(code); } catch { location.hash = "#/skills"; return; }
    app.innerHTML = `<div class="wrap fade-in"><div class="crumb"><a href="#/skills">${L_SK()}</a> / ${esc(catLabel(k.cat))}</div>
      <div class="skview glass">${skImg(k, 1000)}
        <div class="sk-info"><h1>${esc(tx(k.title))}</h1>
          <div class="sk-seller">${skAv(k, "sk-av-lg")}<div><b>${esc(k.name || short(k.addr))}</b><span>${k.done ? `✓ ${X({ zh: `已完成 ${k.done} 单`, en: `${k.done} jobs done`, es: `${k.done} trabajos`, ja: `${k.done}件完了` })} · ` : ""}${k.city ? esc(cityL(k.city)) + " · " : ""}${who(k.addr)}</span></div></div>
          <p class="lead">${esc(tx(k.desc))}</p>
          <div class="sk-price"><span>${X({ zh: "参考价", en: "From", es: "Desde", ja: "参考価格" })}</span> <b>${Number(k.price).toLocaleString("en-US")}</b> USDC <span>· ${durL(k)}</span></div>
          <div class="ctas acts"><button class="btn ink pill" id="hire">${X({ zh: "按此价雇佣", en: "Hire at this price", es: "Contratar a este precio", ja: "この価格で依頼" })}<span class="arr">→</span></button><button class="btn ghost pill cta2" id="nego">${X({ zh: "议价 / 谈需求", en: "Negotiate", es: "Negociar", ja: "交渉する" })}<span class="arr">→</span></button></div>${negoForm(k.price, k.days)}
          <p class="hint">${X({ zh: "雇佣会生成一张指定此人的托管单：预算先锁进合约，验收后才放款。", en: "Hiring creates a direct escrow deal with this freelancer: funds lock first and release on approval.", es: "Contratar crea un acuerdo directo en garantía: el pago se bloquea y se libera al aprobar.", ja: "依頼するとこの人宛てのエスクロー案件が作成され、承認後に支払われます。" })}</p>
        </div></div>${pfGallery(k.pf)}</div>`;
    $("#hire").onclick = () => { S.prefill = { addr: k.addr, title: tx(k.title), desc: tx(k.desc), price: k.price, cat: k.cat }; location.hash = "#/new"; };
    $("#nego").onclick = () => { $("#nego-box").hidden = false; $("#n-note").focus(); };
    $("#n-send").onclick = () => goOffer({ k, h: [{ by: "c", ...readNego() }] });
  }

  // ---- Negotiation: offers travel as links between client and freelancer until both agree ----
  const L_C = () => X({ zh: "客户", en: "Client", es: "Cliente", ja: "クライアント" });
  const L_F = () => X({ zh: "接单人", en: "Freelancer", es: "Freelancer", ja: "フリーランサー" });
  const negoForm = (price, days) => `<div class="nego-box glass" id="nego-box" hidden>
      <div class="quote-row"><label class="f">${X({ zh: "出价 (USDC)", en: "Offer (USDC)", es: "Oferta (USDC)", ja: "提示額 (USDC)" })}<input id="n-price" type="number" min="1" value="${price}"></label><label class="f">${X({ zh: "交付天数", en: "Days", es: "Días", ja: "日数" })}<input id="n-days" type="number" min="1" value="${days}"></label></div>
      <label class="f">${X({ zh: "具体需求 / 说明", en: "Scope / note", es: "Alcance / nota", ja: "要件・メモ" })}<textarea id="n-note" placeholder="${X({ zh: "例如：只要 Logo，不要 VI；希望 5 天内交付第一版。", en: "e.g. Logo only, no brand guide; first draft in 5 days.", es: "p. ej. Solo logo, sin manual; primer borrador en 5 días.", ja: "例：ロゴのみ、VI不要。5日以内に初稿希望。" })}"></textarea></label>
      <button class="btn ink pill" id="n-send">${X({ zh: "生成议价链接", en: "Create offer link", es: "Crear enlace de oferta", ja: "交渉リンクを作成" })}<span class="arr">→</span></button>
      <p class="hint">${X({ zh: "把链接发给对方。对方可以同意，或者改价改需求后发回给你，来回直到谈妥。谈妥前钱不会被锁。", en: "Send the link. They can accept, or change the price or scope and send it back, until you agree. Nothing is locked before that.", es: "Envía el enlace. Pueden aceptar o contraofertar hasta que acuerden. Nada se bloquea antes.", ja: "相手にリンクを送ります。合意するまで金額や内容を修正して送り返せます。合意前は資金はロックされません。" })}</p></div>`;
  const readNego = () => ({ price: Number($("#n-price").value) || 0, days: Number($("#n-days").value) || 0, note: $("#n-note").value.trim(), at: Date.now() });
  const goOffer = (o) => { const code = enc(o), last = o.h[o.h.length - 1]; try { const list = myOffers().filter((x) => x.key !== o.h[0].at); list.unshift({ key: o.h[0].at, code, title: tx(o.k.title), price: last.price, ok: !!last.ok, at: Date.now() }); localStorage.setItem("landed.offers", JSON.stringify(list.slice(0, 30))); } catch {} location.hash = `#/offer/${code}`; };
  function offerView(code) {
    let o; try { o = dec(code); } catch { location.hash = "#/skills"; return; }
    const k = o.k, last = o.h[o.h.length - 1], next = last.by === "c" ? "f" : "c";
    const agreed = last.ok;
    app.innerHTML = `<div class="wrap fade-in"><div class="crumb"><a href="#/skills">${L_SK()}</a> / ${X({ zh: "议价", en: "Negotiation", es: "Negociación", ja: "交渉" })}</div>
      <div class="offer glass">
        <div class="of-head">${skImg(k, 400)}<div><h2>${esc(tx(k.title))}</h2><div class="sk-who">${skAv(k)}${esc(k.name || "")} · ${who(k.addr)}</div><p class="hint">${X({ zh: "参考价", en: "Listed at", es: "Precio base", ja: "参考価格" })} ${Number(k.price).toLocaleString("en-US")} USDC · ${durL(k)}</p></div></div>
        <div class="of-log">${o.h.map((r, i) => `<div class="of-msg ${r.by}"><div class="of-who">${r.by === "c" ? L_C() : L_F()} · ${r.ok ? X({ zh: "同意", en: "accepted", es: "aceptó", ja: "合意" }) : i ? X({ zh: "还价", en: "counter", es: "contraoferta", ja: "再提示" }) : X({ zh: "出价", en: "offer", es: "oferta", ja: "提示" })}</div><div class="of-amt"><b>${Number(r.price).toLocaleString("en-US")}</b> USDC · ${r.days} ${t("day")}</div>${r.note ? `<p>${esc(r.note)}</p>` : ""}</div>`).join("")}</div>
        ${agreed ? `<div class="of-done">${X({ zh: "双方已谈妥", en: "Both sides agreed", es: "Ambas partes acordaron", ja: "双方合意済み" })}: <b>${Number(last.price).toLocaleString("en-US")} USDC · ${last.days} ${t("day")}</b></div>
          <div class="ctas acts"><button class="btn ink pill" id="o-lock">${X({ zh: "客户：锁定预算，开始干活", en: "Client: lock budget & start", es: "Cliente: bloquear y empezar", ja: "クライアント：予算をロックして開始" })}<span class="arr">→</span></button><button class="btn ghost pill cta2" id="o-copy">${X({ zh: "复制链接", en: "Copy link", es: "Copiar enlace", ja: "リンクをコピー" })}<span class="arr">→</span></button></div>`
        : `<p class="of-turn">${X({ zh: "现在轮到", en: "Waiting for", es: "Turno de", ja: "次は" })} <b>${next === "c" ? L_C() : L_F()}</b> ${X({ zh: "回应", en: "to respond", es: "", ja: "の返答" })}</p>
          <div class="ctas acts"><button class="btn ink pill" id="o-ok">${X({ zh: "同意这个价格", en: "Accept", es: "Aceptar", ja: "合意する" })}<span class="arr">→</span></button><button class="btn ghost pill cta2" id="o-counter">${X({ zh: "改价 / 改需求", en: "Counter", es: "Contraofertar", ja: "条件を変更" })}<span class="arr">→</span></button></div>
          ${negoForm(last.price, last.days)}
          <button class="linkbtn" id="o-copy"><svg viewBox="0 0 24 24"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>${X({ zh: "复制当前链接发给对方", en: "Copy link to send", es: "Copiar enlace", ja: "リンクをコピー" })}</button>`}
      </div></div>`;
    const on = (sel, fn) => $(sel) && ($(sel).onclick = fn);
    const copy = (e) => { navigator.clipboard?.writeText(location.href); e.currentTarget.classList.add("done"); e.currentTarget.textContent = "✓ " + e.currentTarget.textContent; };
    on("#o-copy", copy);
    on("#o-ok", () => goOffer({ k, h: [...o.h, { by: next, price: last.price, days: last.days, note: "", ok: true, at: Date.now() }] }));
    on("#o-counter", () => { $("#nego-box").hidden = false; $("#n-note").focus(); });
    on("#n-send", () => goOffer({ k, h: [...o.h, { by: next, ...readNego() }] }));
    on("#o-lock", () => { const notes = o.h.map((r) => r.note).filter(Boolean).join("\n"); S.prefill = { addr: k.addr, title: tx(k.title), desc: [tx(k.desc), notes].filter(Boolean).join("\n\n"), price: last.price, cat: k.cat }; location.hash = "#/new"; });
  }
  async function newSkill() {
    const L = (o) => X(o);
    app.innerHTML = `<div class="wrap fade-in"><div class="page-head"><div><h1>${L_LIST()}</h1><p>${L({ zh: "写清楚做什么、多少钱、几天交付，再放几件作品。发布后会得到一个技能链接，可以直接发给客户。", en: "Say what you do, your price and turnaround, and add a few works. You get a skill link to send to clients.", es: "Indica qué haces, precio y plazo, y añade algunos trabajos. Obtendrás un enlace para enviar a clientes.", ja: "内容・価格・納期を書き、作品を追加。クライアントに送れるリンクが作成されます。" })}</p></div></div>
      <div class="new-layout">
        <div class="form">
          <label class="f">${L({ zh: "服务标题", en: "Service title", es: "Título del servicio", ja: "サービス名" })}<input id="s-title" maxlength="60" placeholder="${L({ zh: "例如：品牌 Logo 设计", en: "e.g. Brand logo design", es: "p. ej. Diseño de logo", ja: "例：ブランドロゴ制作" })}"></label>
          <label class="f">${L({ zh: "服务内容", en: "What's included", es: "Qué incluye", ja: "内容" })}<textarea id="s-desc" maxlength="240" placeholder="${L({ zh: "包含几版方案、几轮修改、交付什么文件", en: "Concepts, revisions, files delivered", es: "Propuestas, revisiones, archivos", ja: "案の数・修正回数・納品物" })}"></textarea></label>
          <div class="f"><span class="fl">${t("new.cat")}</span>
            <div class="pick" id="cat-pick">${CATS.map((c, i) => `<button type="button" data-v="${c}" class="${i ? "" : "on"}"><span class="pk-ic" style="--c:${(PAL[c] || PAL.Other)[1]};--b:${(PAL[c] || PAL.Other)[0]}">${CATIC[c] || CATIC.Other}</span>${catLabel(c)}</button>`).join("")}</div>
            <select id="s-cat" hidden>${CATS.map((c) => `<option value="${c}">${catLabel(c)}</option>`).join("")}</select></div>
          <div class="f"><span class="fl">${L({ zh: "参考报价", en: "Starting price", es: "Precio base", ja: "参考価格" })}</span><span class="hint">${L({ zh: "客户可以按这个价直接雇你，也可以发起议价。", en: "Clients can hire at this price or negotiate.", es: "Pueden contratarte a este precio o negociar.", ja: "この価格で依頼も、交渉もできます。" })}</span>
            <div class="seg wide" id="price-pick">${[100, 300, 500, 1000, 2000].map((v) => `<button type="button" data-v="${v}" class="${v === 300 ? "on" : ""}">${v.toLocaleString("en-US")}</button>`).join("")}<button type="button" data-v="custom">${X({zh:"自定义",en:"Custom",es:"Otro",ja:"カスタム"})}</button></div>
            <div class="price-in" id="price-custom" hidden><input id="s-price-n" type="number" min="1" value="800" inputmode="decimal"><span>USDC</span></div>
            <input id="s-price" type="hidden" value="300"></div>
          <div class="f"><span class="fl">${L({ zh: "交付时间", en: "Delivery time", es: "Plazo de entrega", ja: "納期" })}</span>
            <div class="seg wide" id="days-pick">${[1, 3, 5, 7, 14, 30].map((d) => `<button type="button" data-v="${d}" class="${d === 5 ? "on" : ""}">${d} ${t("day")}</button>`).join("")}<button type="button" data-v="custom">${X({zh:"自定义",en:"Custom",es:"Otro",ja:"カスタム"})}</button></div>
            <div class="price-in dur-in" id="days-custom" hidden><input id="s-days-n" type="number" min="1" step="1" value="48" inputmode="numeric" placeholder="1 – 720"><span>${X({zh:"小时",en:"hours",es:"horas",ja:"時間"})}</span></div>
            <input id="s-unit-v" type="hidden" value="h">
            <input id="s-days" type="hidden" value="5"></div>
          <div class="f"><span class="fl">${L({ zh: "作品集", en: "Portfolio", es: "Portafolio", ja: "ポートフォリオ" })}</span><span class="hint">${L({ zh: "贴链接即可：图片、视频（YouTube / B站 / mp4）、图文文章、社媒主页（小红书、抖音、Instagram、Behance、GitHub…），自动识别。第一张图是封面。", en: "Paste links: images, videos (YouTube / Bilibili / mp4), articles, social profiles. Detected automatically. First image is the cover.", es: "Pega enlaces: imágenes, vídeos, artículos, redes. Se detectan solos. La primera imagen es la portada.", ja: "画像・動画・記事・SNSのリンクを貼るだけ。最初の画像がカバーです。" })}</span>
            <div class="pf-add"><input id="s-pf" placeholder="https://"><button type="button" class="btn ghost pill cta2" id="s-pf-add">${L({ zh: "添加", en: "Add", es: "Añadir", ja: "追加" })}<span class="arr">+</span></button></div>
            <div class="pf-chips" id="s-pf-list"></div></div>
          
        </div>
        <aside class="summary panel sk-preview">
          <div class="label">${t("new.preview")}</div>
          <div id="sk-pv"></div>
          <button class="btn ink pill block" id="s-go" style="margin-top:16px">${L({ zh: "发布技能", en: "Publish", es: "Publicar", ja: "掲載する" })}<span class="arr">→</span></button>
          <p class="hint" style="margin-top:10px">${L({ zh: "发布不收费，也不锁钱。客户雇佣或谈妥后，钱才会锁进合约。", en: "Listing is free and locks nothing. Funds lock only when a client hires you.", es: "Publicar es gratis y no bloquea nada. Los fondos se bloquean al contratar.", ja: "掲載は無料。依頼が決まった時点で資金がロックされます。" })}</p>
        </aside>
      </div></div>`;
    const cur = () => ({ addr: S.me || "0x0000000000000000000000000000000000000000", name: (S.me && getProf(S.me).name) || "", av: (S.me && getProf(S.me).avatar) || "", cat: $("#s-cat").value, price: Number($("#s-price").value) || 0, days: Number($("#s-days").value) || 1, unit: $("#days-custom").hidden ? "d" : $("#s-unit-v").value, title: $("#s-title").value.trim() || L({ zh: "你的服务标题", en: "Your service title", es: "Título del servicio", ja: "サービス名" }), desc: $("#s-desc").value.trim() || L({ zh: "这里会显示你的服务内容", en: "Your service details appear here", es: "Aquí aparecerán los detalles", ja: "ここにサービス内容が表示されます" }), pf: [...pf] });
    const preview = () => { $("#sk-pv").innerHTML = skillCard(cur()).replace(/^\s*<a /, "<div ").replace(/<\/a>\s*$/, "</div>"); };
    $$("#cat-pick button").forEach((b) => (b.onclick = () => { $$("#cat-pick button").forEach((x) => x.classList.toggle("on", x === b)); $("#s-cat").value = b.dataset.v; preview(); }));
    $$("#price-pick button").forEach((b) => (b.onclick = () => { $$("#price-pick button").forEach((x) => x.classList.toggle("on", x === b)); const c = b.dataset.v === "custom"; $("#price-custom").hidden = !c; $("#s-price").value = c ? $("#s-price-n").value : b.dataset.v; if (c) $("#s-price-n").focus(); preview(); }));
    $("#s-price-n").oninput = () => { $("#s-price").value = Math.max(1, Number($("#s-price-n").value) || 1); preview(); };
    $$("#days-pick button").forEach((b) => (b.onclick = () => { $$("#days-pick button").forEach((x) => x.classList.toggle("on", x === b)); const c = b.dataset.v === "custom"; $("#days-custom").hidden = !c; $("#s-days").value = c ? $("#s-days-n").value : b.dataset.v; if (c) $("#s-days-n").focus(); preview(); }));
    $("#s-days-n").oninput = () => { $("#s-days").value = Math.min(720, Math.max(1, Math.round(Number($("#s-days-n").value) || 1))); preview(); };
    ["#s-title", "#s-desc"].forEach((id) => ($(id).oninput = preview));
    const pf = [];
    const drawPf = () => { $("#s-pf-list").innerHTML = pf.map((u, i) => { const p = pfType(u); return `<span class="pf-chip k-${p.kind}">${p.kind === "i" ? `<img src="${esc(safeUrl(u))}" alt="">` : `<i>${esc(p.name[0])}</i>`}<b>${esc(p.name)}</b><button type="button" data-rm="${i}">×</button></span>`; }).join(""); $$("#s-pf-list [data-rm]").forEach((b) => (b.onclick = () => { pf.splice(Number(b.dataset.rm), 1); drawPf(); })); preview(); };
    const addPf = () => { $("#s-pf").value.split(/[\s,]+/).map((x) => x.trim()).filter(Boolean).forEach((u) => pf.length < 12 && pf.push(u)); $("#s-pf").value = ""; drawPf(); };
    $("#s-pf-add").onclick = addPf; preview(); $("#s-pf").onkeydown = (e) => { if (e.key === "Enter") { e.preventDefault(); addPf(); } };
    $("#s-go").onclick = async () => {
      if (!(await needWallet())) return;
      const k = { addr: S.me, name: getProf(S.me).name || "", av: getProf(S.me).avatar || "", cat: $("#s-cat").value, price: Number($("#s-price").value) || 0, days: Number($("#s-days").value) || 1, unit: $("#days-custom").hidden ? "d" : $("#s-unit-v").value, title: $("#s-title").value.trim(), desc: $("#s-desc").value.trim(), pf: [...pf] };
      if (!k.title || !k.price) return;
      try { localStorage.setItem("landed.skills", JSON.stringify([k, ...mySkills()])); } catch {}
      location.hash = `#/skill/${enc(k)}`;
    };
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
      const sub = m.delivery ? (() => { const d = parseDl(m.delivery); return [dlLink(d.link), d.hash ? fpChip(d.hash, d.fname) : "", date(m.submittedAt)].filter(Boolean).join(" · "); })() : j.status === 1 && i === j.current ? t("d.waitFree") : "";
      return `<div class="ms ${m.state === 2 ? "paid" : m.state === 1 ? "wait" : ""}"><span class="i node">${m.state === 2 ? "✓" : String(i + 1).padStart(2, "0")}</span><div><h4>${esc(TT(m.name))}</h4>${sub ? `<div class="sub">${sub}</div>` : ""}</div><span class="st"><span class="tag ${cls}"><span class="d"></span>${label}</span></span><span class="amt">${fmt(m.amount)}</span></div>`;
    }).join("");

    let act = "";
    if (!S.me) act = `<button class="btn ink block" id="a-connect">${t("wallet.connect")}</button><p class="note">${t("d.connect")}</p>`;
    else if (j.status === 0 && isClient) {
      act = `<h3>${t("d.applicants")} · ${j.apps.length}</h3>${j.apps.map((a) => `<div class="app-item"><div class="row"><a class="app-who" href="#/u/${a.freelancer}"><img class="avatar" src="${esc(getProf(a.freelancer).avatar || avatar(a.freelancer))}" alt=""><span><b>${esc(getProf(a.freelancer).name || short(a.freelancer))}</b><small>${esc([getProf(a.freelancer).org, cityL(getProf(a.freelancer).city) || tzCity(getProf(a.freelancer).tz)].filter(Boolean).join(" · ") || short(a.freelancer))}</small></span></a><span class="spacer"></span><button class="btn ink sm" data-hire="${a.freelancer}">${t("d.hire")}</button></div>${(() => { const m = /^\[Q:(\d+(?:\.\d+)?)(?:\/(\d+))?\] ?/.exec(a.pitch || ""); const body = m ? a.pitch.slice(m[0].length) : a.pitch; const b = Number(ethers.formatUnits(j.budget, 6)); const q = m ? Number(m[1]) : 0; return (m ? `<div class="quote-chip ${q !== b ? "diff" : ""}">${X({zh:"报价",en:"Quote",es:"Oferta",ja:"見積"})} <b>${q.toLocaleString("en-US")} USDC</b>${m[2] ? ` · ${m[2]} ${t("day")}` : ""}${q !== b ? ` <span>${q > b ? "+" : ""}${(q - b).toLocaleString("en-US")}</span>` : ""}</div>` : "") + (body && body.trim() && body.trim() !== "—" ? `<p>${esc(body)}</p>` : "") + (m && q !== b ? `<button class="btn ghost pill cta2 sm" data-reissue="${a.freelancer}|${q}">${X({zh:"同意报价，按此价改单",en:"Accept quote & re-issue",es:"Aceptar oferta y rehacer",ja:"見積もりで発注し直す"})}</button>` : ""); })()}</div>`).join("") || `<p class="note">${t("d.noApps")}</p>`}
        <div class="own-acts"><button class="oa oa-edit" id="a-edit"><svg viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/></svg><span><b>${X({ zh: "修改需求", en: "Edit job", es: "Editar", ja: "編集" })}</b><small>${X({ zh: "改完重新发布", en: "Refund, then re-post with edits", es: "Reembolso y republicar", ja: "返金して再投稿" })}</small></span></button><button class="oa oa-cancel" id="a-cancel"><svg viewBox="0 0 24 24"><path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/></svg><span><b>${X({ zh: "撤回需求", en: "Withdraw job", es: "Retirar", ja: "取り下げ" })}</b><small>${X({ zh: "预算原路退回", en: "Budget returned to you", es: "Se devuelve el presupuesto", ja: "予算を返金" })}</small></span></button></div>`;
    } else if (j.status === 0) {
      act = j.apps.some((a) => same(a.freelancer, S.me)) ? `<span class="tag ok"><span class="d"></span>${t("_applied")}</span>${(() => { const my = j.apps.find((a) => same(a.freelancer, S.me)); const m = /^\[Q:(\d+(?:\.\d+)?)(?:\/(\d+))?\] ?/.exec(my.pitch || ""); return m ? `<div class="my-app"><span>${X({ zh: "我的报价", en: "My quote", es: "Mi oferta", ja: "自分の見積" })}</span><b>${Number(m[1]).toLocaleString("en-US")} USDC</b>${m[2] ? `<span>${m[2]} ${t("day")}</span>` : ""}</div>` : ""; })()}`
        : `<h3>${t("d.apply")}</h3><div class="quote-row"><label class="f">${X({zh:"我的报价 (USDC)",en:"My quote (USDC)",es:"Mi oferta (USDC)",ja:"見積もり (USDC)"})}<input id="q-price" type="number" min="1" value="${Number(ethers.formatUnits(j.budget,6))}"></label><label class="f">${X({zh:"交付天数",en:"Days",es:"Días",ja:"日数"})}<input id="q-days" type="number" min="1" placeholder="7"></label></div><p class="hint" style="margin:0 0 8px">${X({zh:"预算可以商量：报价和客户预算不同，客户可以按你的报价改单。",en:"Budgets are negotiable: if your quote differs, the client can re-issue the job at your price.",es:"El presupuesto es negociable: si tu oferta difiere, el cliente puede rehacer el trabajo a tu precio.",ja:"予算は交渉可能。見積もりが異なる場合、クライアントはその金額で発注し直せます。"})}</p><textarea id="pitch" placeholder="${t("d.pitch")}"></textarea><button class="btn ink block" id="a-apply" style="margin-top:12px">${t("d.applySend")}</button>`;
    } else if (j.status === 1 && isFree) {
      if (cur.state === 0) act = `<h3>${t("d.deliver")}</h3><input id="dlv" placeholder="${t("d.deliverPh")}"><label class="fp-drop" id="dlv-drop"><input type="file" id="dlv-file" hidden>${FP_IC}<span id="dlv-fp">${X({ zh: "拖入成品文件，生成文件指纹（可选，文件不会上传）", en: "Drop the final file to fingerprint it (optional, not uploaded)", es: "Suelta el archivo final para generar su huella (opcional, no se sube)", ja: "完成ファイルをドロップして指紋を生成（任意・アップロードなし）" })}</span></label><button class="btn ink block" id="a-deliver" style="margin-top:12px">${t("d.deliverSend")}</button>`;
      else {
        const left = cur.submittedAt + j.reviewWindow - now;
        act = `<h3>${t("d.waitClient")}</h3>` + (left > 0 ? `<p class="countdown">${dur(left)} ${t("d.claimIn")}</p><p class="note">${t("new.windowHint")}</p>` : `<button class="btn ink block" id="a-claim">${t("d.claim")}</button>`);
      }
      act += `<button class="btn quiet sm" id="a-dispute" style="margin-top:14px">${t("d.dispute")}</button>`;
    } else if (j.status === 1 && isClient) {
      if (cur.state === 1) {
        const left = cur.submittedAt + j.reviewWindow - now;
        act = `<h3>${esc(TT(cur.name))}</h3><p class="note" style="word-break:break-all;margin:0 0 10px">${(() => { const d = parseDl(cur.delivery); return [dlLink(d.link), d.hash ? fpChip(d.hash, d.fname) : ""].filter(Boolean).join(" "); })()}</p><p class="countdown">${dur(left)}</p><button class="btn ink block" id="a-approve">${t("d.approve")} · ${fmt(cur.amount)} USDC</button>`;
      } else act = `<h3>${t("d.waitFree")}</h3><p class="note">${esc(TT(cur.name))}</p>`;
      act += `<button class="btn quiet sm" id="a-dispute" style="margin-top:14px">${t("d.dispute")}</button>`;
    } else if (j.status === 2 && !isArb) {
      act = `<div class="dsp"><span class="dsp-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg></span><div><h3>${X({ zh: "争议处理中", en: "Dispute in progress", es: "Disputa en curso", ja: "紛争処理中" })}</h3><p class="note">${X({ zh: `剩余 ${fmt(j.budget - j.released)} USDC 已冻结在合约里，客户和接单人都无法单方面取走。仲裁人会按比例裁决，合约自动分账。`, en: `The remaining ${fmt(j.budget - j.released)} USDC is frozen in the contract. Neither side can take it alone. The arbiter decides the split and the contract pays out.`, es: `Los ${fmt(j.budget - j.released)} USDC restantes están congelados. El árbitro decide el reparto y el contrato paga.`, ja: `残りの ${fmt(j.budget - j.released)} USDC は凍結中。仲裁人が配分を決め、コントラクトが自動で支払います。` })}</p><p class="dsp-by" id="dsp-by"></p></div></div>`;
      setTimeout(async () => { try { const ev = await S.L.queryFilter(S.L.filters.Disputed(id), -2000); const by = ev.at(-1)?.args?.by; if (by && $("#dsp-by")) $("#dsp-by").textContent = X({ zh: "发起人：", en: "Raised by: ", es: "Iniciada por: ", ja: "申立人：" }) + (getProf(by).name || short(by)) + (same(by, j.client) ? X({ zh: "（客户）", en: " (client)", es: " (cliente)", ja: "（クライアント）" }) : X({ zh: "（接单人）", en: " (freelancer)", es: " (freelancer)", ja: "（フリーランサー）" })); } catch {} }, 0);
    } else if (j.status === 2 && isArb) {
      act = `<h3>${t("d.resolve")}</h3><input id="res" type="number" min="0" step="0.01" placeholder="0 – ${fmt(j.budget - j.released)}"><button class="btn ink block" id="a-resolve" style="margin-top:12px">${t("d.resolveSend")}</button>`;
    }

    app.innerHTML = `
      <div class="wrap fade-in">
        <div class="detail">
          <div>
            <div class="d-cover">${cover(j)}</div>
            <div class="crumb"><a href="#/jobs">${t("board.title")}</a> / ${esc(catLabel(j.category))} / #${j.id}</div>
            <h1>${esc(TT(j.title))}</h1>
            <div class="row" style="margin-bottom:22px">${tagFor(j.status)}<span class="small muted">${t("d.posted")} ${date(j.createdAt)}</span></div>
            <p class="body">${esc(TT(j.details))}</p>
            <div class="ms-list">${msHtml}</div>
          </div>
          <aside class="side">
            <div class="panel">
              <div class="label">${t("d.budget")}</div>
              <div class="big" style="margin-top:8px">${fmt(j.budget)}<small>USDC</small></div>
              <div style="margin:16px 0 10px">${segs(j)}</div>
              <div class="row small"><span>${t("d.released")} ${fmt(j.released)}</span><span class="spacer"></span><span class="muted">${t("d.escrow")} ${fmt(j.status <= 2 ? j.budget - j.released : 0n)}</span></div>
              <div style="margin-top:14px">
                <div class="kv"><span>${t("d.client")}</span><a href="#/u/${j.client}">${clientRow(j, 1)}</a></div>
                <div class="kv"><span>${t("d.freelancer")}</span><span>${j.freelancer === ZERO ? `<span class="muted">${X({ zh: "待选定", en: "Not hired yet", es: "Sin asignar", ja: "未選定" })}</span>` : `<a href="#/u/${j.freelancer}">${(() => { const P = getProf(j.freelancer); return `<div class="jc-client big"><img src="${esc(P.avatar || avatar(j.freelancer))}" alt=""><div><b>${esc(P.name || short(j.freelancer))}</b><span>${esc([P.org, cityL(P.city) || tzCity(P.tz)].filter(Boolean).join(" · ") || short(j.freelancer))}</span></div></div>`; })()}</a>`}</span></div>
                <div class="kv"><span>${t("d.window")}</span><span>${days(j.reviewWindow) || 1} ${t("day")}</span></div>
              </div>
            </div>
            ${act ? `<div class="panel">${act}</div>` : ""}
            <div class="panel"><div class="label" style="margin-bottom:10px">${t("d.share")}</div><div class="share"><span>${esc(url)}</span><button class="btn ink sm" id="copy">${X({ zh: "复制链接", en: "Copy link", es: "Copiar enlace", ja: "リンクをコピー" })}</button></div></div>
          </aside>
        </div>
      </div>`;

    const on = (sel, fn) => $(sel) && ($(sel).onclick = fn);
    const after = () => detail(id);
    on("#a-connect", async () => { if (await loginModal()) after(); });
    on("#copy", () => { navigator.clipboard?.writeText(url); toast(t("tx.copy")); });
    $$("[data-reissue]").forEach((b) => (b.onclick = () => { const [addr, q] = b.dataset.reissue.split("|"); S.prefill = { addr, title: j.title, desc: j.details, price: Number(q), cat: j.category, note: true }; location.hash = "#/new"; }));
    on("#a-apply", async (e) => { if (await send(e.currentTarget, () => S.wL.applyTo(id, (() => { const q = Number($("#q-price").value) || 0, d = Number($("#q-days").value) || 0; return (q ? `[Q:${q}${d ? "/" + d : ""}] ` : "") + ($("#pitch").value.trim() || "—"); })()))) after(); });
    $$("[data-hire]").forEach((b) => (b.onclick = async (e) => { if (await send(e.currentTarget, () => S.wL.hire(id, b.dataset.hire))) after(); }));
    on("#a-edit", async (e) => { if (await send(e.currentTarget, () => S.wL.cancel(id))) { S.prefill = { edit: true, title: j.title, desc: j.details, cat: j.category, win: j.reviewWindow, ms: j.ms.map((m) => [m.name, ethers.formatUnits(m.amount, 6)]) }; location.hash = "#/new"; } });
    on("#a-cancel", async (e) => { if (await send(e.currentTarget, () => S.wL.cancel(id))) after(); });
    let FP = null;
    if ($("#dlv-drop")) { const dz = $("#dlv-drop"), fi = $("#dlv-file"); const take = async (f) => { if (!f) return; $("#dlv-fp").textContent = "…"; const h = await sha256File(f); FP = { h, n: f.name }; dz.classList.add("done"); $("#dlv-fp").innerHTML = `${esc(f.name)} · <code>${h.slice(0, 8)}…${h.slice(-6)}</code>`; }; fi.onchange = () => take(fi.files[0]); dz.ondragover = (e) => { e.preventDefault(); dz.classList.add("over"); }; dz.ondragleave = () => dz.classList.remove("over"); dz.ondrop = (e) => { e.preventDefault(); dz.classList.remove("over"); take(e.dataTransfer.files[0]); }; }
    on("#a-deliver", async (e) => { const l = $("#dlv").value.trim(); if (!l && !FP) return $("#dlv").focus(); const v = l + (FP ? ` #fp=sha256:${FP.h}:${encodeURIComponent(FP.n).slice(0, 80)}` : ""); if (await send(e.currentTarget, () => S.wL.deliver(id, v.trim()))) after(); });
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
              <div class="price-in dur-in" id="win-custom" hidden><input id="f-wn" type="number" min="1" max="720" value="48" inputmode="numeric" placeholder="1 – 720"><div id="f-wu" hidden><button type="button" data-u="3600" class="on"></button></div><span>${X({zh:"小时",en:"hours",es:"horas",ja:"時間"})}</span></div><span class="hint" id="win-range">${X({zh:"可设 1 – 720 小时（30 天）",en:"1 – 720 hours (30 days)",es:"1 – 720 horas (30 días)",ja:"1〜720時間（30日）"})}</span>
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
            <div class="row" style="margin-top:12px"><span class="small muted" id="bal"></span><span class="spacer"></span><button class="btn quiet sm" id="faucet" hidden>${t("new.faucet")}</button></div>
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
      o.value = String(sec); o.textContent = sec % 86400 ? `${sec / 3600} ${X({zh:"小时",en:"hours",es:"horas",ja:"時間"})}` : `${sec / 86400} ${t("day")}`;
      $("#f-win").value = o.value; render();
    };
    $$("#win-pick button").forEach((b) => (b.onclick = () => { $$("#win-pick button").forEach((x) => x.classList.toggle("on", x === b)); const c = b.dataset.v === "custom"; $("#win-custom").hidden = !c; if (c) setCustom(); else { $("#f-win").value = b.dataset.v; render(); } }));
    $("#f-wn").oninput = setCustom;
    $$("#f-wu button").forEach((b) => (b.onclick = () => { $$("#f-wu button").forEach((x) => x.classList.toggle("on", x === b)); setCustom(); }));
    const showBal = async () => { if (!S.me) return; const b = await S.U.balanceOf(S.me); $("#bal").textContent = `${t("new.bal")} ${fmt(b)} USDC`; if ($("#faucet")) $("#faucet").hidden = b >= 100n * 1000000n; };
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
    if (S.prefill?.edit) { const pf = S.prefill; S.prefill = null; st.direct = false; render(); $("#f-title").value = pf.title; $("#f-desc").value = pf.desc || ""; st.ms = pf.ms.map((m) => [m[0], String(Number(m[1]))]); const cb = $(`#cat-pick [data-v="${pf.cat}"]`); if (cb) cb.click(); const wb = $(`#win-pick [data-v="${pf.win}"]`); if (wb) wb.click(); else { $("#f-wn").value = Math.round(pf.win / 3600); $(`#win-pick [data-v="custom"]`)?.click(); } $("#pv-title").textContent = pf.title; $(".page-head p").textContent = X({ zh: "原需求已撤销，预算已退回。改好后重新锁定发布。", en: "The original job was cancelled and refunded. Edit and lock again to re-post.", es: "El trabajo original se canceló y reembolsó. Edita y vuelve a publicar.", ja: "元の案件は取り消され返金されました。編集して再投稿してください。" }); }
    if (S.prefill) { const pf = S.prefill; S.prefill = null; st.direct = true; $("#f-fl").value = pf.addr; $("#f-title").value = pf.title; $("#f-desc").value = pf.desc || ""; st.ms = [[pf.title, String(pf.price)]]; const cb = $(`#cat-pick [data-v="${pf.cat}"]`); if (cb) cb.click(); if (pf.note) $(".page-head p").textContent = X({ zh: "按商定的价格给这位接单人发一张新托管单。原需求可以在详情页取消，预算会原路退回。", en: "Issue a new escrow deal to this freelancer at the agreed price. Cancel the original job from its page to get the budget back.", es: "Crea un nuevo acuerdo con este freelancer al precio pactado. Cancela el trabajo original para recuperar el presupuesto.", ja: "合意した金額でこの方宛ての新しい案件を作成します。元の案件は詳細ページから取り消すと予算が返金されます。" }); }
    render();
    showBal();
  }

  const getProf = (a) => { try { return JSON.parse(localStorage.getItem("landed.profile." + a.toLowerCase()) || "{}"); } catch { return {}; } };
  const myOffers = () => { try { return JSON.parse(localStorage.getItem("landed.offers") || "[]"); } catch { return []; } };
  const on2 = (sel, fn) => $(sel) && ($(sel).onclick = fn);
  const vzSeed = (n) => { let x = n * 9301 + 49297; return () => ((x = (x * 9301 + 49297) % 233280) / 233280); };
  const vzIc = (k) => `<span class="vz-ic vz-ic-${k}"><svg viewBox="0 0 24 24">${{'done': '<rect x="5" y="4" width="14" height="17" rx="2.5"/><path d="M9 4h6v2.5H9z"/><path d="M8.5 13l2.5 2.5 4.5-5"/>', 'earned': '<ellipse cx="12" cy="7" rx="7" ry="3"/><path d="M5 7v5c0 1.7 3.1 3 7 3s7-1.3 7-3V7"/><path d="M5 12v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5"/>', 'posted': '<path d="M4 10v4a1 1 0 0 0 1 1h2l6 4V5L7 9H5a1 1 0 0 0-1 1z"/><path d="M17 9a4 4 0 0 1 0 6"/><path d="M19.5 6.5a7.5 7.5 0 0 1 0 11"/>', 'disputes': '<path d="M12 4v16M7 20h10M5 8h14"/><path d="M5 8l-3 6a3 3 0 0 0 6 0z"/><path d="M19 8l-3 6a3 3 0 0 0 6 0z"/>'}[k]}</svg></span>`;
  const vzBars = (n) => { const R = vzSeed(n + 1); const a = Array.from({ length: 24 }, (_, i) => n ? 0.18 + 0.82 * Math.pow(i / 23, 1.3) * (0.6 + 0.4 * R()) : 0.08); return `<svg class="vz vz-bars" viewBox="0 0 240 40" preserveAspectRatio="none">${a.map((h, i) => `<rect x="${i * 10 + 3}" y="${40 - h * 38}" width="4" height="${h * 38}" rx="2" class="${i > 20 ? "hot" : ""}" style="--d:${i * 25}ms"/>`).join("")}</svg>`; };
  const vzLine = (n) => { const R = vzSeed(Math.round(n) + 7); let y = 36; const pts = Array.from({ length: 13 }, (_, i) => { y = n ? Math.max(6, y - (0.3 + R()) * 3.2) : 38; return [i * 20, y]; }); let d = `M0 ${pts[0][1].toFixed(1)}`; for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], cx = (x0 + x1) / 2; d += ` C${cx} ${y0.toFixed(1)} ${cx} ${y1.toFixed(1)} ${x1} ${y1.toFixed(1)}`; } return `<svg class="vz vz-line" viewBox="0 0 240 40" preserveAspectRatio="none"><defs><linearGradient id="vzg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF6A00" stop-opacity=".22"/><stop offset="1" stop-color="#FF6A00" stop-opacity="0"/></linearGradient></defs><path class="ar" d="${d} L240 40 L0 40Z" fill="url(#vzg)"/><path class="ln" d="${d}" pathLength="1" vector-effect="non-scaling-stroke"/></svg>`; };
  const vzRing = (p) => `<div class="vz vz-prog"><i style="--p:${p}%"></i></div>`;
  const vzShield = (ok) => `<div class="vz vz-badge ${ok ? "ok" : "bad"}"><b></b>${ok ? X({ zh: "记录良好", en: "Clean record", es: "Historial limpio", ja: "問題なし" }) : X({ zh: "有争议记录", en: "Has disputes", es: "Con disputas", ja: "紛争あり" })}</div>`;
  const vzCount = () => $$(".facts .v[data-n]").forEach((el) => { const raw = el.dataset.n, num = parseFloat(raw.replace(/,/g, "")); if (!num) return; const dec = (raw.split(".")[1] || "").length, t0 = performance.now(), D = 1100; const f = (now) => { const k = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - k, 3); el.textContent = (num * e).toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }); if (k < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); });
  async function profile(addr, tab, demo) {
    if (!ethers.isAddress(addr)) { location.hash = "#/"; return; }
    const Z = { jobsCompleted: 0n, earned: 0n, jobsPosted: 0n, jobsPaidOut: 0n, disputes: 0n };
    let [r, jobs] = await Promise.all([S.L.records(addr).catch(() => Z), loadJobs().catch(() => [])]);
    if (demo) r = { jobsCompleted: 38n, earned: 18600000000n, jobsPosted: 2n, jobsPaidOut: 2n, disputes: 0n };
    const me = demo || same(addr, S.me), P = demo ? { name: "Lin Zhou", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&q=70&auto=format&fit=crop&crop=faces", bio: X({ zh: "品牌设计师，做过 40+ 个海外小品牌的 Logo 和 VI。", en: "Brand designer, 40+ logos and identities for overseas brands.", es: "Diseñadora de marca, más de 40 identidades.", ja: "ブランドデザイナー。海外ブランドのロゴ・VIを40件以上。" }), tz: "Asia/Shanghai", langs: "中文 / English", link: "github.com/MinusPlus2025/landed", ...getProf(addr) } : getProf(addr);
    let asF = jobs.filter((j) => same(j.freelancer, addr) || (j.apps || []).some((x) => same(x.freelancer, addr))), asC = jobs.filter((j) => same(j.client, addr));
    if (demo) { asC = asC.filter((j) => ["Video", "Translation"].includes(j.category)).slice(0, 2); asF = jobs.filter((j) => j.category === "Design").slice(0, 2); }
    const sk = [...mySkills().filter((k) => same(k.addr, addr)), ...DEMO_SKILLS.filter((k) => same(k.addr, addr) && P && k.name === P.name)];
    const offers = me ? myOffers() : [];
    const rate = Number(r.jobsPosted) ? Math.round((Number(r.jobsPaidOut) / Number(r.jobsPosted)) * 100) : null;
    const T2 = [
      ["c", X({ zh: "我发的需求", en: "Jobs I posted", es: "Trabajos publicados", ja: "投稿した案件" }), asC.length],
      ["f", X({ zh: "我接的单", en: "Jobs I work on", es: "Trabajos que hago", ja: "受注した案件" }), asF.length],
      ["s", X({ zh: "我的技能", en: "My skills", es: "Mis servicios", ja: "マイスキル" }), sk.length],
      ...(me ? [["o", X({ zh: "议价记录", en: "Negotiations", es: "Negociaciones", ja: "交渉履歴" }), offers.length]] : []),
    ];
    tab = tab || (demo ? "s" : asC.length >= asF.length ? "c" : "f");
    const roles = [asC.length || Number(r.jobsPosted) ? X({ zh: "发需求", en: "Hires", es: "Contrata", ja: "発注者" }) : "", asF.length || sk.length || Number(r.jobsCompleted) ? X({ zh: "接单", en: "Freelances", es: "Freelance", ja: "受注者" }) : ""].filter(Boolean);
    const body = {
      c: () => `<div class="cards">${asC.map((j) => jcard(j, "self")).join("")}${me ? `<a class="skcard sk-add" href="#/new"><span>＋</span>${X({ zh: "发布需求", en: "Post a job", es: "Publicar trabajo", ja: "案件を投稿" })}</a>` : ""}</div>${!asC.length && !me ? `<div class="empty">${t("p.none")}</div>` : ""}`,
      f: () => asF.length ? `<div class="cards">${asF.map((j) => jcard(j)).join("")}</div>` : `<div class="empty">${me ? X({ zh: "还没有接过单。", en: "No jobs taken yet. ", es: "Aún no has tomado trabajos. ", ja: "まだ受注した依頼はありません。" }) + ` <a href="#/jobs">${X({ zh: "去需求广场看看", en: "Browse jobs", es: "Ver trabajos", ja: "依頼を探す" })} →</a>` : t("p.none")}</div>`,
      s: () => `<div class="skgrid">${sk.map((k, i) => `<div class="sk-wrap">${skillCard(k)}${me && !DEMO_SKILLS.includes(k) ? `<button class="btn quiet sm sk-del" data-del="${i}">${X({ zh: "下架", en: "Remove", es: "Retirar", ja: "掲載終了" })}</button>` : ""}</div>`).join("") || (me ? "" : `<div class="empty">${t("p.none")}</div>`)}${me ? `<a class="skcard sk-add" href="#/newskill"><span>＋</span>${L_LIST()}</a>` : ""}</div>`,
      o: () => `<div class="list">${offers.map((o) => `<a class="item" href="#/offer/${o.code}"><div><b>${esc(o.title)}</b><div class="small muted">${o.ok ? X({ zh: "已谈妥", en: "Agreed", es: "Acordado", ja: "合意済み" }) : X({ zh: "谈判中", en: "In progress", es: "En curso", ja: "交渉中" })} · ${new Date(o.at).toLocaleString()}</div></div><span class="spacer"></span><b>${Number(o.price).toLocaleString("en-US")} USDC</b></a>`).join("") || `<div class="empty">${t("p.none")}</div>`}</div>`,
    };
    app.innerHTML = `
      <div class="wrap fade-in">
        <div class="profile-head glass prof">
          ${me ? `<label class="av-edit" title="${X({ zh: "更换头像", en: "Change photo", es: "Cambiar foto", ja: "写真を変更" })}">` : ""}<img class="avatar" src="${P.avatar ? esc(P.avatar) : avatar(addr)}" alt="" onerror="this.src='${avatar(addr)}'">${me ? `<span class="av-cam"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg></span><input type="file" id="av-file" accept="image/*" hidden></label>` : ""}
          <div class="prof-main"><div class="row" style="gap:10px;flex-wrap:wrap"><h1 style="font-size:32px;margin:0">${P.name ? esc(P.name) : `<span class="mono">${short(addr)}</span>`}</h1><span class="verified">✓ ${t("p.verified")}</span><span class="roles">${roles.map((x) => `<span class="role-tag">${x}</span>`).join("")}</span></div>
            ${P.bio ? `<p class="prof-bio">${esc(P.bio)}</p>` : me ? `<p class="prof-bio muted">${X({ zh: "还没有介绍。写一句话，让对方知道你是谁。", en: "No intro yet. Add one line about who you are.", es: "Sin presentación. Añade una línea sobre ti.", ja: "自己紹介はまだありません。" })}</p>` : ""}
            <div class="prof-meta">${[P.org, cityL(P.city) || tzCity(P.tz)].filter(Boolean).length ? `<span class="pm-loc"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>${esc([P.org, cityL(P.city) || tzCity(P.tz)].filter(Boolean).join(" · "))}</span>` : ""}${P.langs ? `<span>💬 ${esc(P.langs)}</span>` : ""}${P.link ? `<a target="_blank" rel="noopener" href="${esc(/^https?:/.test(P.link) ? P.link : "https://" + P.link)}">↗ ${X({ zh: "作品集", en: "Portfolio", es: "Portafolio", ja: "ポートフォリオ" })}</a>` : ""}<a class="addr ${P.name ? "mono" : ""}" target="_blank" rel="noopener" href="${explorer("address", addr)}">${P.name ? short(addr) : X({ zh: "在链上查看 ↗", en: "View on chain ↗", es: "Ver en la cadena ↗", ja: "チェーンで確認 ↗" })}</a></div>
          </div>
          ${me ? `<button class="btn ghost pill cta2" id="p-edit">${X({ zh: "编辑资料", en: "Edit profile", es: "Editar perfil", ja: "プロフィール編集" })}<span class="arr">→</span></button>` : ""}
        </div>
        ${me ? `<div class="wbal glass"><span class="wb-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H18v4"/><path d="M3 7.5V17a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-3"/><path d="M20 9h-4a3 3 0 0 0 0 6h4z"/></svg></span><div class="wb-main"><small>${X({ zh: "钱包余额", en: "Wallet balance", es: "Saldo", ja: "ウォレット残高" })}</small><div class="wb-v"><b id="wb-usdc">…</b> <span>USDC</span></div><small class="wb-sub" id="wb-avax"></small></div><span class="spacer"></span>${S.cfg.chainId === 43113 || S.net === "l1" ? `<button class="btn ink pill p-drip" id="p-drip" hidden>${X({ zh: "领取测试币", en: "Get test tokens", es: "Obtener tokens de prueba", ja: "テストトークンを受け取る" })}<span class="arr"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="8"/><path d="M12 8.5v7M8.5 12h7"/></svg></span></button>` : ""}</div>` : ""}
        ${me ? `<div class="form glass prof-form" id="p-form" hidden>
          <div><label class="f">${X({ zh: "昵称", en: "Name", es: "Nombre", ja: "名前" })}<input id="pf-name" class="pf-name" maxlength="24" value="${esc(P.name || "")}" placeholder="${X({ zh: "比如：小林 · 插画师", en: "e.g. Lin · Illustrator", es: "p. ej. Lin · Ilustradora", ja: "例：リン · イラストレーター" })}"></label><input type="hidden" id="pf-avatar" value="${esc(P.avatar || "")}"></div>
          <div class="quote-row"><label class="f">${X({ zh: "身份或公司", en: "Role or company", es: "Rol o empresa", ja: "肩書き・会社" })}<input id="pf-org" maxlength="30" value="${esc(P.org || "")}" placeholder="${X({ zh: "比如：独立音乐人", en: "e.g. Indie musician", es: "p. ej. Músico independiente", ja: "例：インディー音楽家" })}"></label><label class="f">${X({ zh: "所在城市", en: "City", es: "Ciudad", ja: "都市" })}<input id="pf-city" maxlength="30" value="${esc(P.city || "")}" placeholder="${esc(tzCity(P.tz || Intl.DateTimeFormat().resolvedOptions().timeZone) || "")}"></label></div>
          <label class="f">${X({ zh: "一句话介绍", en: "One-line intro", es: "Presentación breve", ja: "ひとこと紹介" })}<span class="pf-bio-w"><textarea id="pf-bio" class="pf-bio" maxlength="120" rows="3" placeholder="${X({ zh: "你擅长什么、做过什么，让对方一眼了解你", en: "What you're good at and what you've done", es: "En qué eres bueno y qué has hecho", ja: "得意なことや実績を一言で" })}">${esc(P.bio || "")}</textarea><small class="pf-cnt"><b id="pf-bio-n">${(P.bio || "").length}</b>/120</small></span></label>
          <div class="quote-row"><label class="f">${X({ zh: "作品集链接", en: "Portfolio link", es: "Enlace al portafolio", ja: "ポートフォリオ" })}<input id="pf-link" value="${esc(P.link || "")}"></label><label class="f">${X({ zh: "时区", en: "Time zone", es: "Zona horaria", ja: "タイムゾーン" })}<input id="pf-tz" value="${esc(P.tz || Intl.DateTimeFormat().resolvedOptions().timeZone)}"></label><label class="f">${X({ zh: "语言", en: "Languages", es: "Idiomas", ja: "言語" })}<input id="pf-langs" value="${esc(P.langs || "")}" placeholder="中文 / English"></label></div>
          <div class="pf-actions"><button class="btn quiet pf-cancel" id="pf-cancel">${X({ zh: "取消", en: "Cancel", es: "Cancelar", ja: "キャンセル" })}</button><button class="btn ink pill pf-save" id="pf-save">${X({ zh: "保存", en: "Save", es: "Guardar", ja: "保存" })}<span class="arr">→</span></button></div>
        </div>` : ""}
        <section class="facts viz">
          <div class="fact">${vzIc("done")}<div class="v" data-n="${r.jobsCompleted}">${r.jobsCompleted}</div><div class="k">${t("p.done")}</div>${Number(r.jobsCompleted) ? vzBars(Number(r.jobsCompleted)) : ""}</div>
          <div class="fact">${vzIc("earned")}<div class="v" data-n="${fmt(r.earned)}">${fmt(r.earned)}</div><div class="k">USDC · ${t("p.earned")}</div>${Number(r.earned) ? vzLine(Number(r.earned) / 1e6) : ""}</div>
          <div class="fact">${vzIc("posted")}<div class="v" data-n="${r.jobsPosted}">${r.jobsPosted}</div><div class="k">${t("p.posted")}${rate ? ` · ${rate}% ${t("p.paidout")}` : ""}</div>${rate ? vzRing(rate === null ? 0 : rate) : ""}</div>
          <div class="fact">${vzIc("disputes")}<div class="v" data-n="${r.disputes}" style="color:${Number(r.disputes) ? "var(--accent)" : "var(--ok)"}">${r.disputes}</div><div class="k">${t("p.disputes")}</div>${vzShield(!Number(r.disputes))}</div>
        </section>
        <div class="ptabs"><div class="seg">${["s", "f", "c", "o"].map((k) => { const x = T2.find((r) => r[0] === k); return x ? `<button class="${k === tab ? "on" : ""}" data-tab="${k}">${x[1]}<i>${x[2]}</i></button>` : ""; }).join("")}</div></div>
        <div id="ptab-body">${body[tab]()}</div>
      </div>`;
    vzCount();
    $$(".ptabs button").forEach((b) => (b.onclick = () => { $$(".ptabs button").forEach((x) => x.classList.toggle("on", x === b)); $("#ptab-body").innerHTML = body[b.dataset.tab](); wireDel(); }));
    const wireDel = () => $$(".sk-del").forEach((b) => (b.onclick = () => { const k = sk[Number(b.dataset.del)]; const left = mySkills().filter((x) => JSON.stringify(x) !== JSON.stringify(k)); try { localStorage.setItem("landed.skills", JSON.stringify(left)); } catch {} profile(addr, "s", demo); }));
    wireDel();
    on2("#demo-login", async () => { if (await loginModal()) route(); });
    if (me) {
      $("#p-edit").onclick = () => { $("#p-form").hidden = false; $("#pf-name").focus(); };
      $("#pf-cancel").onclick = () => { $("#p-form").hidden = true; };
      const wbFill = async () => { try { $("#wb-usdc").textContent = fmt(await S.U.balanceOf(S.me)); const av = Number(ethers.formatEther(await S.rp.getBalance(S.me))); if ($("#p-drip")) $("#p-drip").hidden = av >= 0.003 && (await S.U.balanceOf(S.me)) >= 100n * 1000000n; $("#wb-avax").textContent = `${av.toFixed(4)} ${S.cfg.symbol} · ${X({ zh: "用于支付链上手续费", en: "for network fees", es: "para comisiones de red", ja: "ネットワーク手数料用" })}`; } catch {} };
      if ($("#wb-usdc")) wbFill();
      if ($("#p-drip") && S.net === "l1") $("#p-drip").onclick = async (e) => { const b = e.currentTarget; b.disabled = true; try { await (await S.wU.faucet()).wait(); toast(X({ zh: "已到账 1 万测试 USDC", en: "Received 10,000 test USDC", es: "Recibido: 10.000 USDC de prueba", ja: "テスト USDC 1 万を受け取りました" })); } catch (err) { console.warn("faucet", err); const rej = err?.code === "ACTION_REJECTED" || err?.code === 4001; toast(rej ? X({ zh: "你取消了这次领取", en: "You cancelled the claim", es: "Cancelaste la solicitud", ja: "受け取りをキャンセルしました" }) : X({ zh: "领取失败：", en: "Claim failed: ", es: "Error: ", ja: "失敗：" }) + (err?.shortMessage || err?.info?.error?.message || err?.message || "").slice(0, 120), 1); } b.disabled = false; wbFill(); acctBtn(); };
      else if ($("#p-drip")) $("#p-drip").onclick = async (e) => { const b = e.currentTarget; b.disabled = true; try { localStorage.removeItem("landed.drip." + S.me.toLowerCase()); } catch {} const before = await S.U.balanceOf(S.me).catch(() => 0n); await starterKit(); const after = await S.U.balanceOf(S.me).catch(() => 0n); b.disabled = false; wbFill(); acctBtn(); if (after === before && after >= 100n * 1000000n) wbFill(); toast(X({ zh: "你的测试币还够用，暂时不需要领取", en: "You still have enough test tokens", es: "Aún tienes suficientes tokens de prueba", ja: "テストトークンはまだ十分あります" })); };
      $("#av-file").onchange = (e) => { const f = e.target.files[0]; if (!f) return; const im = new Image(); im.onload = () => { const c = document.createElement("canvas"), z = 256, m = Math.min(im.width, im.height); c.width = c.height = z; c.getContext("2d").drawImage(im, (im.width - m) / 2, (im.height - m) / 2, m, m, 0, 0, z, z); URL.revokeObjectURL(im.src); try { const k = "landed.profile." + addr.toLowerCase(); localStorage.setItem(k, JSON.stringify({ ...getProf(addr), avatar: c.toDataURL("image/jpeg", 0.85) })); } catch {} profile(addr, tab, demo); acctBtn(); toast(X({ zh: "头像已更新", en: "Photo updated", es: "Foto actualizada", ja: "写真を更新しました" })); }; im.src = URL.createObjectURL(f); };
      $("#pf-bio").oninput = (e) => ($("#pf-bio-n").textContent = e.target.value.length);
      $("#pf-save").onclick = () => { const v = (id) => $(id).value.trim(); try { localStorage.setItem("landed.profile." + addr.toLowerCase(), JSON.stringify({ name: v("#pf-name"), avatar: v("#pf-avatar"), bio: v("#pf-bio"), link: v("#pf-link"), tz: v("#pf-tz"), langs: v("#pf-langs"), org: v("#pf-org"), city: v("#pf-city") })); } catch {} profile(addr, tab, demo); acctBtn(); };
    }
  }


  // ------------------------------------------------------------------ chrome
  $$("#tabbar [data-ic]").forEach((el) => (el.innerHTML = NAVIC[el.dataset.ic]));
  $("#lang").innerHTML = LANGS.map(([k, v]) => `<option value="${k}">${v}</option>`).join("");
  $("#lang").onchange = () => { lang = $("#lang").value; try { localStorage.setItem("landed.lang", lang); } catch {} applyStatic(); route(); };
  const logout = async () => {
    try { await EP?.request?.({ method: "wallet_revokePermissions", params: [{ eth_accounts: {} }] }); } catch {}
    try { localStorage.removeItem("landed.wallet"); localStorage.setItem("landed.out", "1"); } catch {}
    S.me = null; S.signer = null; EP = null;
    const w = $("#wallet"); w.classList.remove("acct"); w.classList.replace("quiet", "ink"); w.innerHTML = t("wallet.connect");
    toast(X({ zh: "已退出登录", en: "Logged out", es: "Sesión cerrada", ja: "ログアウトしました" })); route();
  };
  const acctMenu = () => {
    let m = $("#acct-menu"); if (m) { m.remove(); return; }
    m = document.createElement("div"); m.id = "acct-menu"; m.className = "acct-menu glass";
    const ic = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
    m.innerHTML = `<div class="am-h"><small>${X({ zh: "已连接钱包", en: "Connected wallet", es: "Billetera conectada", ja: "接続中のウォレット" })}</small><span>${short(S.me)}</span></div><button data-a="me">${ic('<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>')}${X({ zh: "我的主页", en: "My profile", es: "Mi perfil", ja: "マイページ" })}</button><button data-a="sw">${ic('<path d="M7 7h13l-3-3M17 17H4l3 3"/>')}${X({ zh: "切换账户", en: "Switch account", es: "Cambiar cuenta", ja: "アカウント切替" })}</button><i class="am-sep"></i><button data-a="out" class="out">${ic('<path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3M15 17l5-5-5-5M20 12H9"/>')}${X({ zh: "退出登录", en: "Log out", es: "Cerrar sesión", ja: "ログアウト" })}</button>`;
    const r = $("#wallet").getBoundingClientRect(); m.style.top = r.bottom + 8 + "px"; m.style.right = Math.max(12, innerWidth - r.right) + "px";
    document.body.appendChild(m);
    m.onclick = async (e) => { const b = e.target.closest("button"); if (!b) return; m.remove();
      if (b.dataset.a === "me") location.hash = `#/u/${S.me}`;
      else if (b.dataset.a === "out") logout();
      else { try { await EP.request({ method: "wallet_requestPermissions", params: [{ eth_accounts: {} }] }); } catch {} if (await connect(false).catch(() => false)) route(); } };
    setTimeout(() => document.addEventListener("click", function h(e) { if (!m.contains(e.target)) { m.remove(); document.removeEventListener("click", h); } }), 0);
  };
  $("#wallet").onclick = async () => { if (S.me) acctMenu(); else if (await loginModal()) route(); };
  boot().catch((e) => { app.innerHTML = `<div class="wrap empty">${esc(e.message)}</div>`; });
})();

;(function navFx(){
  const nav=document.querySelector(".nav"); if(!nav) return;
  const ind=document.createElement("i"); ind.className="nav-ind"; nav.prepend(ind);
  const sync=()=>{const h=location.hash||"#/";let a=[...nav.querySelectorAll("a")].find(x=>{const r=x.getAttribute("href");return r==="#/"?(h==="#/"||h==="#"||h===""):h.startsWith(r)});nav.querySelectorAll("a").forEach(x=>x.classList.toggle("cur",x===a));
    if(a){ind.style.opacity=1;ind.style.width=a.offsetWidth+"px";ind.style.transform=`translateX(${a.offsetLeft}px)`}else ind.style.opacity=0};
  addEventListener("hashchange",()=>setTimeout(sync,30));addEventListener("resize",sync);setTimeout(sync,300);
  nav.addEventListener("mousemove",e=>{const a=e.target.closest("a");if(a){ind.style.opacity=1;ind.style.width=a.offsetWidth+"px";ind.style.transform=`translateX(${a.offsetLeft}px)`}});
  nav.addEventListener("mouseleave",sync);
  const top=document.querySelector(".top");addEventListener("scroll",()=>top.classList.toggle("scrolled",scrollY>12),{passive:true});
})();

/* Sliding selection indicator for every segmented control (.seg) */
(() => {
  const place = (seg, instant) => {
    let ind = seg.querySelector(":scope > .seg-ind");
    if (!ind) { ind = document.createElement("span"); ind.className = "seg-ind"; seg.prepend(ind); seg.classList.add("seg-glide"); instant = true; }
    const on = seg.querySelector(":scope > button.on, :scope > a.on");
    if (!on || !on.offsetWidth) { ind.style.opacity = 0; return; }
    if (instant) ind.style.transition = "none";
    ind.style.opacity = 1;
    ind.style.width = on.offsetWidth + "px"; ind.style.height = on.offsetHeight + "px";
    ind.style.transform = `translate(${on.offsetLeft}px,${on.offsetTop}px)`;
    if (instant) { ind.offsetWidth; ind.style.transition = ""; }
  };
  const all = (instant) => document.querySelectorAll(".seg").forEach((s) => place(s, instant));
  let t; new MutationObserver((ms) => {
    const fresh = ms.some((m) => m.type === "childList");
    clearTimeout(t); t = setTimeout(() => all(false), fresh ? 30 : 0);
  }).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["class", "hidden"] });
  addEventListener("resize", () => all(true));
  document.fonts && document.fonts.ready.then(() => all(true));
})();
