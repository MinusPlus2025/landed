// Writes site/ : the public/ app plus a static config.json, for GitHub Pages.
const fs = require("fs"), path = require("path");
process.env.NETWORK = process.env.NETWORK || "fuji";
const { NETWORK, net, deployment, artifact } = require("./config");
const out = path.join(__dirname, "..", "site");
fs.rmSync(out, { recursive: true, force: true });
fs.cpSync(path.join(__dirname, "..", "public"), out, { recursive: true });
const d = deployment();
fs.writeFileSync(path.join(out, "config.json"), JSON.stringify({ ...net, network: NETWORK, landed: d.landed, usdc: d.usdc, arbiter: d.arbiter, landedAbi: artifact("Landed").abi, usdcAbi: artifact("TestUSDC").abi }));
// Second network: the Landed L1 (chain 111230), picked in the app via the network switch.
const L1 = JSON.parse(fs.readFileSync(path.join(__dirname, "../deployments/l1.json"), "utf8"));
fs.writeFileSync(path.join(out, "config-l1.json"), JSON.stringify({ rpc: "https://nodes-prod.43.207.73.245.sslip.io/ext/bc/2qfQ4qWMPmnUQgKx6zaUupAcmrnAHTeLocH9NsoxfU5oaygT5H/rpc", chainId: 111230, name: "Landed L1", explorer: "", symbol: "LUSD", network: "l1", landed: L1.landed, usdc: L1.usdc, arbiter: L1.arbiter, landedAbi: artifact("Landed").abi, usdcAbi: artifact("TestUSDC").abi }));
fs.writeFileSync(path.join(out, ".nojekyll"), "");
console.log("static site in", out);
