const { test, before } = require("node:test");
const assert = require("node:assert");
const ganache = require("ganache");
const { ethers } = require("ethers");
const L = require("../build/Landed.json");
const U = require("../build/TestUSDC.json");

let provider, arbiter, client, alice, bob, landed, usdc;
const usd = (n) => ethers.parseUnits(String(n), 6);
const DAY = 86400;

async function post(signer, amounts, opts = {}) {
  const c = landed.connect(signer);
  const args = ["Logo design", "Need a logo", "design", await usdc.getAddress(), amounts.map((_, i) => `M${i + 1}`), amounts.map(usd), opts.window || DAY];
  const tx = opts.direct ? await c.postDirect(opts.direct, ...args) : await c.postJob(...args);
  const r = await tx.wait();
  return Number(landed.interface.parseLog(r.logs.find((l) => l.address.toLowerCase() === (landed.target || "").toLowerCase() && landed.interface.parseLog(l)?.name === "JobPosted")).args.jobId);
}

before(async () => {
  const g = ganache.provider({ logging: { quiet: true }, chain: { hardfork: "shanghai" } });
  provider = new ethers.BrowserProvider(g);
  [arbiter, client, alice, bob] = await Promise.all([0, 1, 2, 3].map((i) => provider.getSigner(i)));
  usdc = await (await new ethers.ContractFactory(U.abi, U.bytecode, arbiter).deploy()).waitForDeployment();
  landed = await (await new ethers.ContractFactory(L.abi, L.bytecode, arbiter).deploy(await arbiter.getAddress())).waitForDeployment();
  for (const s of [client, alice, bob]) {
    await (await usdc.connect(s).faucet()).wait();
    await (await usdc.connect(s).approve(await landed.getAddress(), ethers.MaxUint256)).wait();
  }
  provider.g = g;
});

const warp = async (s) => { await provider.send("evm_increaseTime", [s]); await provider.send("evm_mine", []); };

test("posting a job locks the whole budget in escrow", async () => {
  const before = await usdc.balanceOf(await client.getAddress());
  const id = await post(client, [100, 200]);
  assert.equal(await usdc.balanceOf(await landed.getAddress()), usd(300));
  assert.equal(before - (await usdc.balanceOf(await client.getAddress())), usd(300));
  const j = await landed.getJob(id);
  assert.equal(j.status, 0n);
  assert.equal(j.budget, usd(300));
});

test("apply, hire, deliver, approve each milestone; record updates", async () => {
  const id = await post(client, [100, 50]);
  await (await landed.connect(alice).applyTo(id, "I can do it")).wait();
  await assert.rejects(landed.connect(client).hire(id, await bob.getAddress()));
  await (await landed.connect(client).hire(id, await alice.getAddress())).wait();
  const a0 = await usdc.balanceOf(await alice.getAddress());
  await (await landed.connect(alice).deliver(id, "https://figma.com/1")).wait();
  await (await landed.connect(client).approve(id)).wait();
  await (await landed.connect(alice).deliver(id, "https://figma.com/2")).wait();
  await (await landed.connect(client).approve(id)).wait();
  assert.equal((await usdc.balanceOf(await alice.getAddress())) - a0, usd(150));
  assert.equal((await landed.getJob(id)).status, 3n);
  const r = await landed.records(await alice.getAddress());
  assert.equal(r.jobsCompleted, 1n);
  assert.equal(r.earned, usd(150));
});

test("client cannot approve before delivery, freelancer cannot self-approve", async () => {
  const id = await post(client, [10], { direct: await alice.getAddress() });
  await assert.rejects(landed.connect(client).approve(id));
  await (await landed.connect(alice).deliver(id, "x")).wait();
  await assert.rejects(landed.connect(alice).approve(id));
});

test("silent client: freelancer claims after the review window", async () => {
  const id = await post(client, [80], { direct: await alice.getAddress(), window: 3 * DAY });
  await (await landed.connect(alice).deliver(id, "done")).wait();
  await assert.rejects(landed.connect(alice).claimAfterTimeout(id));
  await warp(3 * DAY + 1);
  const a0 = await usdc.balanceOf(await alice.getAddress());
  // ganache estimates gas against wall-clock time, so skip estimation after a time warp
  await (await landed.connect(alice).claimAfterTimeout(id, { gasLimit: 300000 })).wait();
  assert.equal((await usdc.balanceOf(await alice.getAddress())) - a0, usd(80));
});

test("open job can be cancelled for a full refund, hired job cannot", async () => {
  const id = await post(client, [40]);
  const c0 = await usdc.balanceOf(await client.getAddress());
  await (await landed.connect(client).cancel(id)).wait();
  assert.equal((await usdc.balanceOf(await client.getAddress())) - c0, usd(40));
  const id2 = await post(client, [40], { direct: await alice.getAddress() });
  await assert.rejects(landed.connect(client).cancel(id2));
});

test("dispute freezes the job and the arbiter splits the remainder", async () => {
  const id = await post(client, [60, 40], { direct: await bob.getAddress() });
  await (await landed.connect(bob).deliver(id, "v1")).wait();
  await (await landed.connect(client).approve(id)).wait();
  await (await landed.connect(client).dispute(id)).wait();
  await assert.rejects(landed.connect(bob).deliver(id, "v2"));
  await assert.rejects(landed.connect(client).resolve(id, usd(10)));
  const b0 = await usdc.balanceOf(await bob.getAddress());
  const c0 = await usdc.balanceOf(await client.getAddress());
  await (await landed.connect(arbiter).resolve(id, usd(25))).wait();
  assert.equal((await usdc.balanceOf(await bob.getAddress())) - b0, usd(25));
  assert.equal((await usdc.balanceOf(await client.getAddress())) - c0, usd(15));
  assert.equal((await landed.records(await bob.getAddress())).disputes, 1n);
});

test("rejects bad input", async () => {
  await assert.rejects(post(client, []));
  await assert.rejects(post(client, [0]));
  await assert.rejects(post(client, [10], { window: 10 }));
  await assert.rejects(post(client, [10], { direct: await client.getAddress() }));
});
