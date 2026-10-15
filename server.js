// Static host for the Landed web app plus a tiny config endpoint (network, contract addresses, ABIs).
const express = require("express");
const path = require("path");
const fs = require("fs");
const { NETWORK, NETWORKS, artifact } = require("./scripts/config");

const app = express();
const collaborationEnabled = process.env.COLLAB_ENABLED === "true";
if (collaborationEnabled) {
  const { ethers } = require("ethers");
  const { createCollaboration } = require("./collaboration-api");
  if (!process.env.PUBLIC_ORIGIN || !process.env.COLLAB_DATA_DIR) throw new Error("Set PUBLIC_ORIGIN and persistent COLLAB_DATA_DIR");
  const dataDir = path.resolve(process.env.COLLAB_DATA_DIR);
  for (const exposed of ["public", "site"]) {
    const relative = path.relative(path.join(__dirname, exposed), dataDir);
    if (!relative || (!relative.startsWith("..") && !path.isAbsolute(relative))) throw new Error("Message database must be outside public/site");
  }
  const networks = {};
  for (const name of ["fuji", "l1"]) {
    const deployment = JSON.parse(fs.readFileSync(path.join(__dirname, "deployments", `${name}.json`)));
    const request = new ethers.FetchRequest(NETWORKS[name].rpc); request.timeout = 10000;
    const provider = new ethers.JsonRpcProvider(request);
    networks[NETWORKS[name].chainId] = new ethers.Contract(deployment.landed, artifact("Landed").abi, provider);
  }
  app.use("/api/orders", createCollaboration({ filename: path.join(process.env.COLLAB_DATA_DIR,"orders.sqlite"), origin: process.env.PUBLIC_ORIGIN, networks }).router);
}

const configFor = (network) => (req, res) => {
  const file = path.join(__dirname, "deployments", `${network}.json`);
  if (!fs.existsSync(file)) return res.status(503).json({ error: `Deployment configuration unavailable for ${network}` });
  const d = JSON.parse(fs.readFileSync(file, "utf8"));
  res.json({ collaboration: collaborationEnabled, ...NETWORKS[network], network, landed: d.landed, usdc: d.usdc, arbiter: d.arbiter, landedAbi: artifact("Landed").abi, usdcAbi: artifact("TestUSDC").abi });
};
app.get("/config.json", configFor(NETWORK === "local" ? "local" : "fuji"));
app.get("/config-l1.json", configFor("l1"));
app.use(express.static(path.join(__dirname, "public")));
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "public/index.html")));
const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`Landed on http://localhost:${port} (${NETWORK})`));
