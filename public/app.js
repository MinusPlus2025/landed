/* Landed — single-page app. Reads everything from the Landed contract; no backend database. */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const app = $("#app");

  // ------------------------------------------------------------------ i18n
  const T = {
    zh: {
      "nav.jobs": "需求广场", "nav.post": "发布需求", "nav.skills": "技能广场", "nav.home": "首页", "nav.me": "我的",
      "wallet.connect": "登录 / 注册",
      "foot.line": "资金由 Avalanche 上的智能合约托管，任何人都无法冻结或挪用。",
      "hero.eyebrow": "跨境找人 · 跨境接单 · 链上托管",
      "hero.title": "活干完，<br><span class='accent'>钱到手。</span>",
      "hero.lead": "找人的怕付了钱拿不到活，接单的怕干完活拿不到钱。在这里，客户可以发需求，接单的人可以挂技能，价格和需求都能先谈；谈妥后预算锁进 Avalanche 合约，按里程碑验收放款，客户失联也会到期自动结算。0 平台抽成，几秒到账。",
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
      "nav.jobs": "Jobs", "nav.post": "Post a job", "nav.skills": "Skills", "nav.home": "Home", "nav.me": "Me",
      "wallet.connect": "Log in / Sign up",
      "foot.line": "Funds are held by a smart contract on Avalanche. Nobody can freeze or move them.",
      "hero.eyebrow": "Hire or freelance across borders · On-chain escrow",
      "hero.title": "Work done.<br><span class='accent'>Money landed.</span>",
      "hero.lead": "Clients worry about paying and getting nothing. Freelancers worry about working and not getting paid. Here clients post jobs, freelancers list skills, and both can negotiate price and scope. Once agreed, the budget locks in an Avalanche contract and releases milestone by milestone, and pays out automatically if the client goes silent. Zero platform fee, settled in seconds.",
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
  // ---- Login / sign-up: the wallet is the account; first login prompts for a profile ----
  const loginModal = () => new Promise((resolve) => {
    const L = (o) => X(o), has = !!window.ethereum;
    const isCore = !!(window.avalanche || window.ethereum?.isAvalanche), isMM = !!window.ethereum?.isMetaMask;
    const el = document.createElement("div"); el.className = "lg-back";
    el.innerHTML = `<div class="lg glass" role="dialog" aria-modal="true">
      <button class="lg-x" aria-label="close">×</button>
      <div class="lg-tabs"><button class="on" data-t="in">${L({ zh: "登录", en: "Log in", es: "Entrar", ja: "ログイン" })}</button><button data-t="up">${L({ zh: "注册", en: "Sign up", es: "Registrarse", ja: "登録" })}</button></div>
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
      el.querySelector("#lg-h").textContent = up ? L({ zh: "创建账号", en: "Create your account", es: "Crea tu cuenta", ja: "アカウント作成" }) : L({ zh: "欢迎回来", en: "Welcome back", es: "Bienvenido de nuevo", ja: "おかえりなさい" });
      el.querySelector("#lg-steps").hidden = !up && has;
    }));
    if (!has) el.querySelector("#lg-steps").hidden = false;
    el.querySelectorAll(".lg-opt").forEach((b) => (b.onclick = async () => {
      if (!window.ethereum) { window.open(b.dataset.w === "core" ? "https://core.app/" : "https://metamask.io/download/", "_blank", "noopener"); return; }
      b.classList.add("busy");
      try {
        const ok = await connect(false);
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
      else if (page === "skills") await skills(arg);
      else if (page === "skill") skillView(arg);
      else if (page === "newskill") await newSkill();
      else if (page === "offer") offerView(arg);
      else if (page === "job") await detail(Number(arg));
      else if (page === "u") await profile(arg);
      else if (page === "me") { if (S.me) location.hash = `#/u/${S.me}`; else await profile(DEMO_SKILLS[0].addr, null, true); }
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
  const clientOf = (j) => { const d = /^0xbd66afc8701f4c2f961a873ecc8e74614d2c985e$/i.test(j.client) && DEMO_CLIENTS[Number(j.id) % DEMO_CLIENTS.length]; return d ? { name: d[0], org: d[1], av: `https://images.unsplash.com/${d[2]}?w=120&h=120&q=70&auto=format&fit=crop&crop=faces` } : { name: short(j.client), org: "", av: avatar(j.client) }; };
  const clientRow = (j, big) => { const c = clientOf(j); return `<div class="jc-client${big ? " big" : ""}"><img src="${esc(c.av)}" alt=""><div><b>${esc(c.name)}</b>${c.org ? `<span>${esc(c.org)}</span>` : ""}</div></div>`; };
  const jcard = (j, self) => `
    <a class="jcard" href="#/job/${j.id}">
      ${cover(j)}
      <div class="jc-body">
        <div class="row small muted"><span>${esc(catLabel(j.category))}</span><span class="spacer"></span><span>${j.apps.length} ${t("job.apps")}</span></div>
        <div class="jc-t">${esc(j.title)}</div>
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
          <h1 style="margin-top:20px" class="hero-h">${t("hero.title")}</h1><svg class="hero-story" viewBox="0 0 260 320" aria-hidden="true"><defs><radialGradient id="hs" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#FFC27A"/><stop offset=".55" stop-color="#FF7A1A"/><stop offset="1" stop-color="#E5480C"/></radialGradient></defs>
<g class="hs-card"><rect x="40" y="16" width="150" height="110" rx="16" fill="#fff" stroke="#E6E6E3"/><rect x="58" y="36" width="60" height="8" rx="4" fill="#111"/><rect class="hs-l1" x="58" y="58" width="110" height="6" rx="3" fill="#D8D8D4"/><rect class="hs-l2" x="58" y="74" width="90" height="6" rx="3" fill="#D8D8D4"/><rect class="hs-l3" x="58" y="90" width="70" height="6" rx="3" fill="#D8D8D4"/>
<g class="hs-chk"><circle cx="186" cy="24" r="16" fill="#111"/><path d="M179 24l5 5 9-10" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g></g>
<text class="hs-t1" x="115" y="150" text-anchor="middle" font-size="13" fill="#8A8A86" font-family="Lexend,sans-serif">${X({zh:"活干完 · 已交付",en:"Work done · delivered",es:"Trabajo entregado",ja:"納品完了"})}</text>
<circle class="hs-coin" cx="115" cy="70" r="15" fill="url(#hs)"/>
<path class="hs-cup" d="M60 220h30v26a25 25 0 0 0 50 0v-26h30v26a55 55 0 0 1-110 0z" fill="#111"/>
<text class="hs-amt" x="115" y="200" text-anchor="middle" font-size="22" font-weight="500" fill="#FF6A00" font-family="Lexend,sans-serif">+300 USDC</text>
<text class="hs-t2" x="115" y="316" text-anchor="middle" font-size="13" fill="#8A8A86" font-family="Lexend,sans-serif">${X({zh:"钱到手 · 已到账",en:"Money landed",es:"Dinero recibido",ja:"着金しました"})}</text></svg>
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
          <div class="cards">${open.map(jcard).join("") || `<div class="empty">${t("p.none")}</div>`}</div>
        </section>
        <section class="block">
          <div class="row" style="align-items:flex-end;margin-bottom:28px"><div><div class="label">${L_SK()}</div><h2 style="margin-top:10px;font-size:30px">${X({ zh: "也可以反过来：挑一个人，谈好价再锁钱", en: "Or the other way: pick a freelancer, agree a price, then lock funds", es: "O al revés: elige un freelancer, acuerda el precio y bloquea el pago", ja: "逆も可能：人を選び、価格を合意してから資金をロック" })}</h2></div><span class="spacer"></span><a class="btn ghost sm" href="#/skills">${X({ zh: "浏览技能", en: "Browse skills", es: "Ver talentos", ja: "スキルを見る" })} →</a></div>
          <div class="skgrid">${[...mySkills(), ...DEMO_SKILLS].slice(0, 3).map(skillCard).join("")}</div>
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
        <div class="page-head"><div><h1>${t("board.title")}</h1><p>${t("board.sub")}</p></div><span class="spacer"></span><a class="btn ink pill" href="#/new">${t("nav.post")}<span class="arr">→</span></a></div>
        <div class="filters">${chips}</div>
        <div class="cards">${list.map(jcard).join("") || `<div class="empty">${t("p.none")}</div>`}</div>
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
  const skImg = (k, w) => `<div class="sk-img" style="--c:${(PAL[k.cat] || PAL.Other)[1]};--b:${(PAL[k.cat] || PAL.Other)[0]}">${skCover(k) ? `<img src="${esc(skCover(k))}" alt="" onerror="this.remove()">` : `<span class="sk-ic">${CATIC[k.cat] || CATIC.Other}</span>`}${(k.pf || []).length ? `<span class="sk-pfn">${(k.pf || []).length} ${X({ zh: "件作品", en: "works", es: "obras", ja: "件" })}</span>` : ""}<span class="sk-cat">${catLabel(k.cat)}</span></div>`;
  const skAv = (k, cls = "") => k.av ? `<img class="sk-av ${cls}" src="${esc(k.av)}" alt="">` : `<i>${esc((k.name || "?")[0])}</i>`;
  const skillCard = (k) => `
    <a class="skcard" href="#/skill/${enc(k)}">${skImg(k, 600)}
      <div class="sk-body"><h3>${esc(tx(k.title))}</h3><p>${esc(tx(k.desc))}</p>
      <div class="sk-foot"><span class="sk-who">${skAv(k)}${esc(k.name || short(k.addr))}</span><span class="spacer"></span><b>${Number(k.price).toLocaleString("en-US")}</b><small>USDC · ${durL(k)}</small></div></div>
    </a>`;
  async function skills(sel) {
    const list = [...mySkills(), ...DEMO_SKILLS].filter((k) => !sel || k.cat === sel);
    const chips = ["", ...CATS].map((c) => `<a class="chip ${c === (sel || "") ? "on" : ""}" href="#/skills${c ? "/" + c : ""}">${c ? catLabel(c) : t("cat.all")}</a>`).join("");
    app.innerHTML = `<div class="wrap fade-in">
      <div class="page-head"><div><h1>${L_SK()}</h1><p>${X({ zh: "接单的人挂出服务和报价。看中了直接雇佣，钱先锁进合约，交付验收后放款。", en: "Freelancers list services with a price. Hire directly: the budget locks in the contract and releases on approval.", es: "Los freelancers publican servicios con precio. Contrata directo: el pago se bloquea en el contrato y se libera al aprobar.", ja: "フリーランサーがサービスと価格を掲載。依頼すると予算がコントラクトにロックされ、承認後に支払われます。" })}</p></div><span class="spacer"></span><a class="btn ink pill" href="#/newskill">${L_LIST()}<span class="arr">→</span></a></div>
      <div class="filters">${chips}</div>
      <div class="skgrid">${list.map(skillCard).join("") || `<div class="empty">—</div>`}</div></div>`;
  }
  function skillView(code) {
    let k; try { k = dec(code); } catch { location.hash = "#/skills"; return; }
    app.innerHTML = `<div class="wrap fade-in"><div class="crumb"><a href="#/skills">${L_SK()}</a> / ${esc(catLabel(k.cat))}</div>
      <div class="skview glass">${skImg(k, 1000)}
        <div class="sk-info"><h1>${esc(tx(k.title))}</h1>
          <div class="sk-seller">${skAv(k, "sk-av-lg")}<div><b>${esc(k.name || short(k.addr))}</b><span>${k.done ? `✓ ${X({ zh: `已完成 ${k.done} 单`, en: `${k.done} jobs done`, es: `${k.done} trabajos`, ja: `${k.done}件完了` })} · ` : ""}${k.city ? esc(k.city) + " · " : ""}${who(k.addr)}</span></div></div>
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
          <label class="f">${L({ zh: "你的名字", en: "Your name", es: "Tu nombre", ja: "お名前" })}<input id="s-name" maxlength="24" value="${esc((S.me && getProf(S.me).name) || "")}"></label>
        </div>
        <aside class="summary panel sk-preview">
          <div class="label">${t("new.preview")}</div>
          <div id="sk-pv"></div>
          <button class="btn ink pill block" id="s-go" style="margin-top:16px">${L({ zh: "发布技能", en: "Publish", es: "Publicar", ja: "掲載する" })}<span class="arr">→</span></button>
          <p class="hint" style="margin-top:10px">${L({ zh: "发布不收费，也不锁钱。客户雇佣或谈妥后，钱才会锁进合约。", en: "Listing is free and locks nothing. Funds lock only when a client hires you.", es: "Publicar es gratis y no bloquea nada. Los fondos se bloquean al contratar.", ja: "掲載は無料。依頼が決まった時点で資金がロックされます。" })}</p>
        </aside>
      </div></div>`;
    const cur = () => ({ addr: S.me || "0x0000000000000000000000000000000000000000", name: $("#s-name").value.trim() || L({ zh: "你", en: "You", es: "Tú", ja: "あなた" }), cat: $("#s-cat").value, price: Number($("#s-price").value) || 0, days: Number($("#s-days").value) || 1, unit: $("#days-custom").hidden ? "d" : $("#s-unit-v").value, title: $("#s-title").value.trim() || L({ zh: "你的服务标题", en: "Your service title", es: "Título del servicio", ja: "サービス名" }), desc: $("#s-desc").value.trim() || L({ zh: "这里会显示你的服务内容", en: "Your service details appear here", es: "Aquí aparecerán los detalles", ja: "ここにサービス内容が表示されます" }), pf: [...pf] });
    const preview = () => { $("#sk-pv").innerHTML = skillCard(cur()).replace(/^\s*<a /, "<div ").replace(/<\/a>\s*$/, "</div>"); };
    $$("#cat-pick button").forEach((b) => (b.onclick = () => { $$("#cat-pick button").forEach((x) => x.classList.toggle("on", x === b)); $("#s-cat").value = b.dataset.v; preview(); }));
    $$("#price-pick button").forEach((b) => (b.onclick = () => { $$("#price-pick button").forEach((x) => x.classList.toggle("on", x === b)); const c = b.dataset.v === "custom"; $("#price-custom").hidden = !c; $("#s-price").value = c ? $("#s-price-n").value : b.dataset.v; if (c) $("#s-price-n").focus(); preview(); }));
    $("#s-price-n").oninput = () => { $("#s-price").value = Math.max(1, Number($("#s-price-n").value) || 1); preview(); };
    $$("#days-pick button").forEach((b) => (b.onclick = () => { $$("#days-pick button").forEach((x) => x.classList.toggle("on", x === b)); const c = b.dataset.v === "custom"; $("#days-custom").hidden = !c; $("#s-days").value = c ? $("#s-days-n").value : b.dataset.v; if (c) $("#s-days-n").focus(); preview(); }));
    $("#s-days-n").oninput = () => { $("#s-days").value = Math.min(720, Math.max(1, Math.round(Number($("#s-days-n").value) || 1))); preview(); };
    ["#s-title", "#s-desc", "#s-name"].forEach((id) => ($(id).oninput = preview));
    const pf = [];
    const drawPf = () => { $("#s-pf-list").innerHTML = pf.map((u, i) => { const p = pfType(u); return `<span class="pf-chip k-${p.kind}">${p.kind === "i" ? `<img src="${esc(safeUrl(u))}" alt="">` : `<i>${esc(p.name[0])}</i>`}<b>${esc(p.name)}</b><button type="button" data-rm="${i}">×</button></span>`; }).join(""); $$("#s-pf-list [data-rm]").forEach((b) => (b.onclick = () => { pf.splice(Number(b.dataset.rm), 1); drawPf(); })); preview(); };
    const addPf = () => { $("#s-pf").value.split(/[\s,]+/).map((x) => x.trim()).filter(Boolean).forEach((u) => pf.length < 12 && pf.push(u)); $("#s-pf").value = ""; drawPf(); };
    $("#s-pf-add").onclick = addPf; preview(); $("#s-pf").onkeydown = (e) => { if (e.key === "Enter") { e.preventDefault(); addPf(); } };
    $("#s-go").onclick = async () => {
      if (!(await needWallet())) return;
      const k = { addr: S.me, name: $("#s-name").value.trim(), cat: $("#s-cat").value, price: Number($("#s-price").value) || 0, days: Number($("#s-days").value) || 1, unit: $("#days-custom").hidden ? "d" : $("#s-unit-v").value, title: $("#s-title").value.trim(), desc: $("#s-desc").value.trim(), pf: [...pf] };
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
      const sub = m.delivery ? `<a href="${esc(m.delivery)}" target="_blank" rel="noopener">${esc(m.delivery)}</a> · ${date(m.submittedAt)}` : j.status === 1 && i === j.current ? t("d.waitFree") : "";
      return `<div class="ms ${m.state === 2 ? "paid" : m.state === 1 ? "wait" : ""}"><span class="i node">${m.state === 2 ? "✓" : String(i + 1).padStart(2, "0")}</span><div><h4>${esc(m.name)}</h4>${sub ? `<div class="sub">${sub}</div>` : ""}</div><span class="st"><span class="tag ${cls}"><span class="d"></span>${label}</span></span><span class="amt">${fmt(m.amount)}</span></div>`;
    }).join("");

    let act = "";
    if (!S.me) act = `<button class="btn ink block" id="a-connect">${t("wallet.connect")}</button><p class="note">${t("d.connect")}</p>`;
    else if (j.status === 0 && isClient) {
      act = `<h3>${t("d.applicants")} · ${j.apps.length}</h3>${j.apps.map((a) => `<div class="app-item"><div class="row"><img class="avatar" style="width:24px;height:24px" src="${avatar(a.freelancer)}">${who(a.freelancer)}<span class="spacer"></span><button class="btn ink sm" data-hire="${a.freelancer}">${t("d.hire")}</button></div>${(() => { const m = /^\[Q:(\d+(?:\.\d+)?)(?:\/(\d+))?\] ?/.exec(a.pitch || ""); const body = m ? a.pitch.slice(m[0].length) : a.pitch; const b = Number(ethers.formatUnits(j.budget, 6)); const q = m ? Number(m[1]) : 0; return (m ? `<div class="quote-chip ${q !== b ? "diff" : ""}">${X({zh:"报价",en:"Quote",es:"Oferta",ja:"見積"})} <b>${q.toLocaleString("en-US")} USDC</b>${m[2] ? ` · ${m[2]} ${t("day")}` : ""}${q !== b ? ` <span>${q > b ? "+" : ""}${(q - b).toLocaleString("en-US")}</span>` : ""}</div>` : "") + `<p>${esc(body)}</p>` + (m && q !== b ? `<button class="btn ghost pill cta2 sm" data-reissue="${a.freelancer}|${q}">${X({zh:"同意报价，按此价改单",en:"Accept quote & re-issue",es:"Aceptar oferta y rehacer",ja:"見積もりで発注し直す"})}</button>` : ""); })()}</div>`).join("") || `<p class="note">${t("d.noApps")}</p>`}
        <button class="btn quiet sm" id="a-cancel" style="margin-top:14px">${t("d.cancel")}</button>`;
    } else if (j.status === 0) {
      act = j.apps.some((a) => same(a.freelancer, S.me)) ? `<span class="tag ok"><span class="d"></span>${t("_applied")}</span>`
        : `<h3>${t("d.apply")}</h3><div class="quote-row"><label class="f">${X({zh:"我的报价 (USDC)",en:"My quote (USDC)",es:"Mi oferta (USDC)",ja:"見積もり (USDC)"})}<input id="q-price" type="number" min="1" value="${Number(ethers.formatUnits(j.budget,6))}"></label><label class="f">${X({zh:"交付天数",en:"Days",es:"Días",ja:"日数"})}<input id="q-days" type="number" min="1" placeholder="7"></label></div><p class="hint" style="margin:0 0 8px">${X({zh:"预算可以商量：报价和客户预算不同，客户可以按你的报价改单。",en:"Budgets are negotiable: if your quote differs, the client can re-issue the job at your price.",es:"El presupuesto es negociable: si tu oferta difiere, el cliente puede rehacer el trabajo a tu precio.",ja:"予算は交渉可能。見積もりが異なる場合、クライアントはその金額で発注し直せます。"})}</p><textarea id="pitch" placeholder="${t("d.pitch")}"></textarea><button class="btn ink block" id="a-apply" style="margin-top:12px">${t("d.applySend")}</button>`;
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
                <div class="kv"><span>${t("d.client")}</span><span>${clientRow(j, 1)}</span></div><div class="kv"><span></span><span>${who(j.client)}</span></div>
                <div class="kv"><span>${t("d.freelancer")}</span><span>${j.freelancer === ZERO ? "—" : who(j.freelancer)}</span></div>
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
      o.value = String(sec); o.textContent = sec % 86400 ? `${sec / 3600} ${X({zh:"小时",en:"hours",es:"horas",ja:"時間"})}` : `${sec / 86400} ${t("day")}`;
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
      f: () => asF.length ? `<div class="cards">${asF.map((j) => jcard(j)).join("")}</div>` : `<div class="empty">${t("p.none")}${me ? ` · <a href="#/jobs">${t("nav.jobs")} →</a>` : ""}</div>`,
      s: () => `<div class="skgrid">${sk.map((k, i) => `<div class="sk-wrap">${skillCard(k)}${me && !DEMO_SKILLS.includes(k) ? `<button class="btn quiet sm sk-del" data-del="${i}">${X({ zh: "下架", en: "Remove", es: "Retirar", ja: "掲載終了" })}</button>` : ""}</div>`).join("") || `<div class="empty">${t("p.none")}</div>`}${me ? `<a class="skcard sk-add" href="#/newskill"><span>＋</span>${L_LIST()}</a>` : ""}</div>`,
      o: () => `<div class="list">${offers.map((o) => `<a class="item" href="#/offer/${o.code}"><div><b>${esc(o.title)}</b><div class="small muted">${o.ok ? X({ zh: "已谈妥", en: "Agreed", es: "Acordado", ja: "合意済み" }) : X({ zh: "谈判中", en: "In progress", es: "En curso", ja: "交渉中" })} · ${new Date(o.at).toLocaleString()}</div></div><span class="spacer"></span><b>${Number(o.price).toLocaleString("en-US")} USDC</b></a>`).join("") || `<div class="empty">${t("p.none")}</div>`}</div>`,
    };
    app.innerHTML = `
      <div class="wrap fade-in">
        <div class="profile-head glass prof">
          <img class="avatar" src="${P.avatar ? esc(P.avatar) : avatar(addr)}" alt="" onerror="this.src='${avatar(addr)}'">
          <div class="prof-main"><div class="row" style="gap:10px;flex-wrap:wrap"><h1 style="font-size:32px;margin:0">${P.name ? esc(P.name) : `<span class="mono">${short(addr)}</span>`}</h1><span class="verified">✓ ${t("p.verified")}</span>${roles.map((x) => `<span class="role-tag">${x}</span>`).join("")}</div>
            ${P.bio ? `<p class="prof-bio">${esc(P.bio)}</p>` : me ? `<p class="prof-bio muted">${X({ zh: "还没有介绍。写一句话，让对方知道你是谁。", en: "No intro yet. Add one line about who you are.", es: "Sin presentación. Añade una línea sobre ti.", ja: "自己紹介はまだありません。" })}</p>` : ""}
            <div class="prof-meta">${P.tz ? `<span>🕒 ${esc(P.tz)}</span>` : ""}${P.langs ? `<span>💬 ${esc(P.langs)}</span>` : ""}${P.link ? `<a target="_blank" rel="noopener" href="${esc(/^https?:/.test(P.link) ? P.link : "https://" + P.link)}">↗ ${X({ zh: "作品集", en: "Portfolio", es: "Portafolio", ja: "ポートフォリオ" })}</a>` : ""}<a class="addr mono" target="_blank" href="${explorer("address", addr)}">${short(addr)}</a></div>
          </div>
          ${me ? `<button class="btn ghost pill cta2" id="p-edit">${X({ zh: "编辑资料", en: "Edit profile", es: "Editar perfil", ja: "プロフィール編集" })}<span class="arr">→</span></button>` : ""}
        </div>
        ${me ? `<div class="form glass prof-form" id="p-form" hidden>
          <div class="quote-row"><label class="f">${X({ zh: "昵称", en: "Name", es: "Nombre", ja: "名前" })}<input id="pf-name" maxlength="30" value="${esc(P.name || "")}"></label><label class="f">${X({ zh: "头像图片链接", en: "Avatar URL", es: "URL del avatar", ja: "アバターURL" })}<input id="pf-avatar" value="${esc(P.avatar || "")}" placeholder="https://"></label></div>
          <label class="f">${X({ zh: "一句话介绍", en: "One-line intro", es: "Presentación breve", ja: "ひとこと紹介" })}<input id="pf-bio" maxlength="120" value="${esc(P.bio || "")}"></label>
          <div class="quote-row"><label class="f">${X({ zh: "作品集链接", en: "Portfolio link", es: "Enlace al portafolio", ja: "ポートフォリオ" })}<input id="pf-link" value="${esc(P.link || "")}"></label><label class="f">${X({ zh: "时区", en: "Time zone", es: "Zona horaria", ja: "タイムゾーン" })}<input id="pf-tz" value="${esc(P.tz || Intl.DateTimeFormat().resolvedOptions().timeZone)}"></label><label class="f">${X({ zh: "语言", en: "Languages", es: "Idiomas", ja: "言語" })}<input id="pf-langs" value="${esc(P.langs || "")}" placeholder="中文 / English"></label></div>
          <div class="pf-actions"><button class="btn ink pill" id="pf-save">${X({ zh: "保存", en: "Save", es: "Guardar", ja: "保存" })}<span class="arr">→</span></button><button class="btn quiet" id="pf-cancel">${X({ zh: "取消", en: "Cancel", es: "Cancelar", ja: "キャンセル" })}</button></div>
        </div>` : ""}
        <section class="facts viz">
          <div class="fact">${vzIc("done")}<div class="v" data-n="${r.jobsCompleted}">${r.jobsCompleted}</div><div class="k">${t("p.done")}</div>${vzBars(Number(r.jobsCompleted))}</div>
          <div class="fact">${vzIc("earned")}<div class="v" data-n="${fmt(r.earned)}">${fmt(r.earned)}</div><div class="k">USDC · ${t("p.earned")}</div>${vzLine(Number(r.earned) / 1e6)}</div>
          <div class="fact">${vzIc("posted")}<div class="v" data-n="${r.jobsPosted}">${r.jobsPosted}</div><div class="k">${t("p.posted")}${rate !== null ? ` · ${rate}% ${t("p.paidout")}` : ""}</div>${vzRing(rate === null ? 0 : rate)}</div>
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
      $("#pf-save").onclick = () => { const v = (id) => $(id).value.trim(); try { localStorage.setItem("landed.profile." + addr.toLowerCase(), JSON.stringify({ name: v("#pf-name"), avatar: v("#pf-avatar"), bio: v("#pf-bio"), link: v("#pf-link"), tz: v("#pf-tz"), langs: v("#pf-langs") })); } catch {} profile(addr, tab, demo); };
    }
  }


  // ------------------------------------------------------------------ chrome
  $$("#tabbar [data-ic]").forEach((el) => (el.innerHTML = NAVIC[el.dataset.ic]));
  $("#lang").innerHTML = LANGS.map(([k, v]) => `<option value="${k}">${v}</option>`).join("");
  $("#lang").onchange = () => { lang = $("#lang").value; try { localStorage.setItem("landed.lang", lang); } catch {} applyStatic(); route(); };
  $("#wallet").onclick = async () => { if (S.me) location.hash = `#/u/${S.me}`; else if (await loginModal()) route(); };
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
