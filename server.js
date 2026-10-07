// Static host for the Landed web app plus a tiny config endpoint (network, contract addresses, ABIs).
const express = require("express");
const path = require("path");
const { NETWORK, net, deployment, artifact } = require("./scripts/config");

const app = express();
app.get("/config.json", (req, res) => {
  const d = deployment();
  if (!d) return res.status(500).json({ error: `No deployment for ${NETWORK}. Run npm run deploy` });
  res.json({ ...net, network: NETWORK, landed: d.landed, usdc: d.usdc, arbiter: d.arbiter, landedAbi: artifact("Landed").abi, usdcAbi: artifact("TestUSDC").abi });
});
app.use(express.static(path.join(__dirname, "public")));
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "public/index.html")));
const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`Landed on http://localhost:${port} (${NETWORK})`));
