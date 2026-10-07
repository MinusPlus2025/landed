require("dotenv").config({ quiet: true });
const fs = require("fs");
const path = require("path");

const NETWORK = process.env.NETWORK || "fuji";
const NETWORKS = {
  fuji: { rpc: process.env.RPC_URL || "https://api.avax-test.network/ext/bc/C/rpc", chainId: 43113, name: "Avalanche Fuji", explorer: "https://testnet.snowtrace.io" },
  local: { rpc: process.env.RPC_URL || "http://127.0.0.1:8545", chainId: 1337, name: "Local", explorer: "" },
};
const net = NETWORKS[NETWORK];
const deployFile = path.join(__dirname, `../deployments/${NETWORK}.json`);
const deployment = () => (fs.existsSync(deployFile) ? JSON.parse(fs.readFileSync(deployFile, "utf8")) : null);
const artifact = (name) => require(`../build/${name}.json`);

module.exports = { NETWORK, net, deployFile, deployment, artifact };
