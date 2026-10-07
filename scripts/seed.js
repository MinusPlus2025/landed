// Fills a fresh deployment with realistic demo data: open funded jobs, one job in progress,
// one finished job (so the freelancer has a track record) and an application.
const { ethers } = require("ethers");
const { net, deployment, artifact } = require("./config");

const usd = (n) => ethers.parseUnits(String(n), 6);
const DAY = 86400;

async function main() {
  const d = deployment();
  const provider = new ethers.JsonRpcProvider(net.rpc);
  const client = new ethers.NonceManager(new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider));
  const freelancer = new ethers.NonceManager(new ethers.Wallet(process.env.FREELANCER_PRIVATE_KEY, provider));
  const fAddr = await freelancer.getAddress();
  const L = artifact("Landed"), U = artifact("TestUSDC");
  const landed = new ethers.Contract(d.landed, L.abi, client);
  const usdc = new ethers.Contract(d.usdc, U.abi, client);
  const send = async (p) => (await p).wait();

  if ((await provider.getBalance(fAddr)) < ethers.parseEther("0.05")) {
    await send(client.sendTransaction({ to: fAddr, value: ethers.parseEther("0.1") }));
  }
  await send(usdc.faucet());
  await send(usdc.approve(d.landed, ethers.MaxUint256));
  await send(usdc.connect(freelancer).faucet());

  const post = async (direct, title, details, category, ms, window = 3 * DAY) => {
    const args = [title, details, category, d.usdc, ms.map((m) => m[0]), ms.map((m) => usd(m[1])), window];
    const r = await send(direct ? landed.postDirect(direct, ...args) : landed.postJob(...args));
    const log = r.logs.map((l) => { try { return landed.interface.parseLog(l); } catch { return null; } }).find((l) => l?.name === "JobPosted");
    console.log("job", Number(log.args.jobId), title);
    return Number(log.args.jobId);
  };

  const j1 = await post(null, "Brand identity for a Berlin coffee roastery", "We are opening our second shop and need a full identity: logo, colour palette, cup and bag packaging. Warm, hand-made feel. Please share 2-3 past identity projects.", "Design",
    [["Moodboard & 3 logo directions", 300], ["Final logo + palette", 500], ["Packaging (cup, bag, sticker)", 400]]);
  await post(null, "Marketing site for an AI note-taking app", "Next.js + Tailwind landing page with pricing, blog and waitlist. Figma is ready. Must be fast and responsive.", "Development",
    [["Home + pricing pages", 800], ["Blog, waitlist, launch", 700]]);
  await post(null, "30-second podcast intro music", "Upbeat lo-fi intro and outro for a weekly tech podcast. Need stems and full commercial rights.", "Music",
    [["Two demo directions", 150], ["Final mix + stems", 150]]);
  await post(null, "Localise a fitness app UI into Simplified Chinese", "About 2,400 strings, natural tone for mainland users. Glossary provided.", "Translation",
    [["Full translation", 200]]);
  await post(null, "Product explainer video, 60s, motion graphics", "Explain our invoicing product in 60 seconds. Script is done, need storyboard and animation.", "Video",
    [["Storyboard", 250], ["Animation v1", 450], ["Final with voiceover", 300]]);

  const live = await post(fAddr, "YouTube channel editing · 4 episodes", "Edit four 15-minute episodes: cuts, captions in EN/ZH, thumbnail.", "Video",
    [["Episode 1", 120], ["Episode 2", 120], ["Episode 3", 120], ["Episode 4", 120]]);
  await send(landed.connect(freelancer).deliver(live, "https://drive.example.com/ep1"));
  await send(landed.approve(live));
  await send(landed.connect(freelancer).deliver(live, "https://drive.example.com/ep2"));

  const done = await post(fAddr, "Illustration set for a children's book cover", "Cover plus 6 spot illustrations.", "Design",
    [["Sketches", 250], ["Final artwork", 350]]);
  for (let i = 0; i < 2; i++) {
    await send(landed.connect(freelancer).deliver(done, `https://dribbble.example.com/shot-${i + 1}`));
    await send(landed.approve(done));
  }
  await send(landed.connect(freelancer).applyTo(j1, "Hi! I'm a Shanghai-based brand designer, 6 years in F&B identities. Portfolio: behance.net/example"));
  console.log("seeded. freelancer:", fAddr);
}
main().catch((e) => { console.error(e); process.exit(1); });
