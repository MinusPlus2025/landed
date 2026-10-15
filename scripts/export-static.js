// Writes site/ : the public/ app plus a static config.json, for GitHub Pages.
const fs = require("fs"), path = require("path");
process.env.NETWORK = process.env.NETWORK || "fuji";
const { NETWORK, net, deployment, artifact } = require("./config");
const out = path.join(__dirname, "..", "site");
fs.rmSync(out, { recursive: true, force: true });
fs.cpSync(path.join(__dirname, "..", "public"), out, { recursive: true });
const d = deployment();
fs.writeFileSync(path.join(out, "config.json"), JSON.stringify({ ...net, network: NETWORK, landed: d.landed, usdc: d.usdc, arbiter: d.arbiter, landedAbi: artifact("Landed").abi, usdcAbi: artifact("TestUSDC").abi }));
// Second network: the Landed L1 (chain 11230), picked in the app via the network switch.
const L1 = JSON.parse(fs.readFileSync(path.join(__dirname, "../deployments/l1.json"), "utf8"));
fs.writeFileSync(path.join(out, "config-l1.json"), JSON.stringify({ rpc: "https://nodes-prod.43.207.73.245.sslip.io/ext/bc/5QhziTvT346pzpwrA6WiDshkMTAGgaKYJJ5mqou6hBxGPPxKM/rpc", chainId: 11230, name: "Landed L1", explorer: "", symbol: "LUSD", network: "l1", landed: L1.landed, usdc: L1.usdc, arbiter: L1.arbiter, landedAbi: artifact("Landed").abi, usdcAbi: artifact("TestUSDC").abi }));
fs.writeFileSync(path.join(out, ".nojekyll"), "");
console.log("static site in", out);
// Opt in only after deploying and checking the private collaboration backend.
if (process.env.STATIC_COLLAB === '1') {
  for (const file of ['config.json', 'config-l1.json']) {
    const target = path.join(out, file), config = JSON.parse(fs.readFileSync(target, 'utf8'));
    config.collaboration = true;
    config.collaborationApi = 'https://niovryyussrxzdwyxtks.supabase.co/functions/v1/order-chat';
    fs.writeFileSync(target, JSON.stringify(config));
  }
}
