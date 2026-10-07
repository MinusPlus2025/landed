// Writes site/ : the public/ app plus a static config.json, for GitHub Pages.
const fs = require("fs"), path = require("path");
process.env.NETWORK = process.env.NETWORK || "fuji";
const { NETWORK, net, deployment, artifact } = require("./config");
const out = path.join(__dirname, "..", "site");
fs.rmSync(out, { recursive: true, force: true });
fs.cpSync(path.join(__dirname, "..", "public"), out, { recursive: true });
const d = deployment();
fs.writeFileSync(path.join(out, "config.json"), JSON.stringify({ ...net, network: NETWORK, landed: d.landed, usdc: d.usdc, arbiter: d.arbiter, landedAbi: artifact("Landed").abi, usdcAbi: artifact("TestUSDC").abi }));
fs.writeFileSync(path.join(out, ".nojekyll"), "");
console.log("static site in", out);
