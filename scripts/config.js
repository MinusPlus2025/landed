require("dotenv").config({ quiet: true });
const fs = require("fs");
const path = require("path");

const NETWORK = process.env.NETWORK || "fuji";
const NETWORKS = {
  fuji: { rpc: process.env.RPC_URL || "https://api.avax-test.network/ext/bc/C/rpc", chainId: 43113, name: "Avalanche Fuji", explorer: "https://testnet.snowtrace.io", symbol: "AVAX" },
  l1: { rpc: "https://nodes-prod.43.207.73.245.sslip.io/ext/bc/2qfQ4qWMPmnUQgKx6zaUupAcmrnAHTeLocH9NsoxfU5oaygT5H/rpc", chainId: 111230, name: "Landed L1", explorer: "", symbol: "LUSD" },
  local: { rpc: process.env.RPC_URL || "http://127.0.0.1:8545", chainId: 1337, name: "Local", explorer: "" },
};
const net = NETWORKS[NETWORK];
const deployFile = path.join(__dirname, `../deployments/${NETWORK}.json`);
const deployment = () => (fs.existsSync(deployFile) ? JSON.parse(fs.readFileSync(deployFile, "utf8")) : null);
const artifact = (name) => require(`../build/${name}.json`);

module.exports = { NETWORK, net, deployFile, deployment, artifact };
