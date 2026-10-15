// Static host for the Landed web app plus a tiny config endpoint (network, contract addresses, ABIs).
const express = require("express");
const path = require("path");
const fs = require("fs");
const { NETWORK, NETWORKS, artifact } = require("./scripts/config");

const app = express();
const configFor = (network) => (req, res) => {
  const file = path.join(__dirname, "deployments", `${network}.json`);
  if (!fs.existsSync(file)) return res.status(503).json({ error: `Deployment configuration unavailable for ${network}` });
  const d = JSON.parse(fs.readFileSync(file, "utf8"));
  res.json({ ...NETWORKS[network], network, landed: d.landed, usdc: d.usdc, arbiter: d.arbiter, landedAbi: artifact("Landed").abi, usdcAbi: artifact("TestUSDC").abi });
};
app.get("/config.json", configFor(NETWORK === "local" ? "local" : "fuji"));
app.get("/config-l1.json", configFor("l1"));
app.use(express.static(path.join(__dirname, "public")));
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "public/index.html")));
const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`Landed on http://localhost:${port} (${NETWORK})`));
