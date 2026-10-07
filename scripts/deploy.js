// Deploys TestUSDC and Landed. The deployer is also the demo arbiter.
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
const { NETWORK, net, deployFile, artifact } = require("./config");

async function main() {
  const provider = new ethers.JsonRpcProvider(net.rpc);
  const wallet = new ethers.NonceManager(new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider));
  const me = await wallet.getAddress();
  console.log(`Deploying to ${NETWORK} from ${me}, balance ${ethers.formatEther(await provider.getBalance(me))} AVAX`);
  const U = artifact("TestUSDC"), L = artifact("Landed");
  const usdc = await (await new ethers.ContractFactory(U.abi, U.bytecode, wallet).deploy()).waitForDeployment();
  const arbiter = process.env.ARBITER_ADDRESS || me;
  const landed = await (await new ethers.ContractFactory(L.abi, L.bytecode, wallet).deploy(arbiter)).waitForDeployment();
  const out = { network: NETWORK, chainId: net.chainId, landed: await landed.getAddress(), usdc: await usdc.getAddress(), arbiter, deployer: me };
  fs.mkdirSync(path.dirname(deployFile), { recursive: true });
  fs.writeFileSync(deployFile, JSON.stringify(out, null, 2));
  console.log(out);
}
main().catch((e) => { console.error(e); process.exit(1); });
