const { test, before } = require("node:test");
const assert = require("node:assert");
const ganache = require("ganache");
const { ethers } = require("ethers");
const V2 = require("../build/LandedV2.json");
const U = require("../build/TestUSDC.json");

let provider, arbiter, client, alice, bob, carol, landed, usdc;
const usd = (n) => ethers.parseUnits(String(n), 6);
const DAY = 86400;
const addr = (s) => s.getAddress();
const bal = async (s) => usdc.balanceOf(await addr(s));
const send = async (p) => { const r = await p; return r && r.wait ? r.wait() : r; };
// Every landed write gets a fixed gas limit and is awaited until mined: ganache's gas estimation
// is unreliable here, so reverts are detected from the mined receipt instead.
const L = (signer) => new Proxy({}, { get: (_, fn) => async (...a) => (await landed.connect(signer)[fn](...a, { gasLimit: 2_000_000 })).wait() });

async function post(signer, amounts, opts = {}) {
  const c = landed.connect(signer);
  const args = ["Logo design", "Need a logo", "design", await usdc.getAddress(), amounts.map((_, i) => `M${i + 1}`), amounts.map(usd), opts.window || DAY];
  const tx = opts.direct ? await c.postDirect(opts.direct, ...args) : await c.postJob(...args);
  const r = await tx.wait();
  return Number(landed.interface.parseLog(r.logs.find((l) => l.address.toLowerCase() === (landed.target || "").toLowerCase() && landed.interface.parseLog(l)?.name === "JobPosted")).args.jobId);
}
const direct = async (amounts, who = alice, opts = {}) => post(client, amounts, { ...opts, direct: await addr(who) });
const propose = (signer, id, amounts, window = DAY) => send(L(signer).proposeChange(id, amounts.map((_, i) => `N${i + 1}`), amounts.map(usd), window));
const hasEvent = (r, name) => r.logs.some((l) => { try { return landed.interface.parseLog(l)?.name === name; } catch { return false; } });

before(async () => {
  const g = ganache.provider({ logging: { quiet: true }, chain: { hardfork: "shanghai" } });
  provider = new ethers.BrowserProvider(g);
  [arbiter, client, alice, bob, carol] = await Promise.all([0, 1, 2, 3, 4].map((i) => provider.getSigner(i)));
  usdc = await (await new ethers.ContractFactory(U.abi, U.bytecode, arbiter).deploy()).waitForDeployment();
  landed = await (await new ethers.ContractFactory(V2.abi, V2.bytecode, arbiter).deploy(await arbiter.getAddress())).waitForDeployment();
  for (const s of [client, alice, bob]) {
    await (await usdc.connect(s).faucet()).wait();
    await (await usdc.connect(s).approve(await landed.getAddress(), ethers.MaxUint256)).wait();
  }
});

// ---------------------------------------------------------------- V1 behaviour still works

test("V1 flow: post, apply, hire, deliver, approve; open-job cancel", async () => {
  const id = await post(client, [100, 50]);
  await send(L(alice).applyTo(id, "me"));
  await send(L(client).hire(id, await addr(alice)));
  const a0 = await bal(alice);
  for (const d of ["d1", "d2"]) {
    await send(L(alice).deliver(id, d));
    await send(L(client).approve(id));
  }
  assert.equal((await bal(alice)) - a0, usd(150));
  assert.equal((await landed.getJob(id)).status, 3n);

  const id3 = await post(client, [40]);
  const c0 = await bal(client);
  await send(L(client).cancel(id3));
  assert.equal((await bal(client)) - c0, usd(40));
});

test("V1 dispute resolved by arbiter", async () => {
  const id = await direct([60, 40], bob);
  await send(L(bob).deliver(id, "v1"));
  await send(L(client).approve(id));
  await send(L(client).dispute(id));
  await assert.rejects(L(client).resolve(id, usd(10)));
  const b0 = await bal(bob);
  await send(L(arbiter).resolve(id, usd(25)));
  assert.equal((await bal(bob)) - b0, usd(25));
});

// ---------------------------------------------------------------- change requests

test("client proposes a bigger scope, freelancer accepts, client tops up", async () => {
  const id = await direct([100, 100]);
  await send(L(alice).deliver(id, "d1"));
  await send(L(client).approve(id));
  await propose(client, id, [150, 80], 2 * DAY);
  const p = await landed.getProposal(id);
  assert.equal(p.proposer, await addr(client));
  const c0 = await bal(client);
  const r = await send(L(alice).acceptChange(id));
  assert.ok(hasEvent(r, "ChangeAccepted"));
  assert.equal(c0 - (await bal(client)), usd(130));
  const j = await landed.getJob(id);
  assert.equal(j.budget, usd(330));
  assert.equal(j.reviewWindow, BigInt(2 * DAY));
  const ms = await landed.getMilestones(id);
  assert.equal(ms.length, 3);
  assert.equal(ms[0].state, 2n); // paid milestone untouched
  assert.equal(ms[1].name, "N1");
  assert.equal(ms[2].amount, usd(80));
  assert.equal((await landed.getProposal(id)).proposer, ethers.ZeroAddress);
  // finish the job on the new terms
  const a0 = await bal(alice);
  for (const d of ["d2", "d3"]) {
    await send(L(alice).deliver(id, d));
    await send(L(client).approve(id));
  }
  assert.equal((await bal(alice)) - a0, usd(230));
  assert.equal((await landed.getJob(id)).status, 3n);
});

test("freelancer proposes a smaller scope, client accepts, difference refunded", async () => {
  const id = await direct([100, 100]);
  await propose(alice, id, [50]);
  const c0 = await bal(client);
  await send(L(client).acceptChange(id));
  assert.equal((await bal(client)) - c0, usd(150));
  assert.equal((await landed.getJob(id)).budget, usd(50));
  assert.equal((await landed.getMilestones(id)).length, 1);
});

test("freelancer proposes more; client without allowance cannot accept until approving", async () => {
  const id = await direct([10]);
  await propose(alice, id, [20]);
  await send(usdc.connect(client).approve(await landed.getAddress(), 0));
  await assert.rejects(L(client).acceptChange(id));
  await send(usdc.connect(client).approve(await landed.getAddress(), ethers.MaxUint256));
  await send(L(client).acceptChange(id));
  assert.equal((await landed.getJob(id)).budget, usd(20));
});

test("change request permission and state reverts", async () => {
  const open = await post(client, [10]);
  await assert.rejects(propose(client, open, [5]), "not active");
  const id = await direct([10, 10]);
  await assert.rejects(propose(bob, id, [5]), "outsider");
  await assert.rejects(propose(client, id, []), "empty");
  await assert.rejects(propose(client, id, [0]), "zero amount");
  await assert.rejects(propose(client, id, [5], 10), "window too short");
  await assert.rejects(propose(client, id, Array(11).fill(1)), "too many");
  await assert.rejects(L(alice).acceptChange(id), "nothing pending");
  await assert.rejects(L(alice).cancelChange(id), "nothing pending");
  await propose(client, id, [5]);
  await assert.rejects(propose(alice, id, [6]), "one pending at a time");
  await assert.rejects(L(client).acceptChange(id), "proposer cannot accept");
  await assert.rejects(L(bob).acceptChange(id), "outsider cannot accept");
  await assert.rejects(L(bob).cancelChange(id), "outsider cannot cancel");
  const r = await send(L(alice).cancelChange(id)); // other party can cancel
  assert.ok(hasEvent(r, "ChangeCancelled"));
  await propose(alice, id, [7]);
  await send(L(alice).cancelChange(id)); // proposer can cancel
  assert.equal((await landed.getJob(id)).budget, usd(20));
  // cannot rewrite a milestone that is under review
  await send(L(alice).deliver(id, "d"));
  await assert.rejects(propose(client, id, [5]), "submitted milestone");
});

test("a release or dispute drops a stale proposal", async () => {
  const id = await direct([10, 10, 10]);
  await propose(client, id, [5]);
  await send(L(alice).deliver(id, "d"));
  await send(L(client).approve(id));
  assert.equal((await landed.getProposal(id)).proposer, ethers.ZeroAddress);
  await assert.rejects(L(alice).acceptChange(id));
  await propose(client, id, [5]);
  await send(L(alice).dispute(id));
  await assert.rejects(L(alice).acceptChange(id));
});

// ---------------------------------------------------------------- arbiter + ownership

test("owner rotates the arbiter; the current arbiter resolves disputes", async () => {
  assert.equal(await landed.owner(), await addr(arbiter));
  const id = await direct([50], bob);
  await send(L(bob).dispute(id));
  await assert.rejects(L(client).setArbiter(await addr(carol)), "not owner");
  await assert.rejects(L(arbiter).setArbiter(ethers.ZeroAddress), "zero");
  const r = await send(L(arbiter).setArbiter(await addr(carol)));
  assert.ok(hasEvent(r, "ArbiterChanged"));
  assert.equal(await landed.arbiter(), await addr(carol));
  await assert.rejects(L(arbiter).resolve(id, usd(10)), "old arbiter");
  const b0 = await bal(bob);
  await send(L(carol).resolve(id, usd(50)));
  assert.equal((await bal(bob)) - b0, usd(50));
  await send(L(arbiter).setArbiter(await addr(arbiter)));
});

test("two-step ownership transfer", async () => {
  await assert.rejects(L(client).transferOwnership(await addr(bob)), "not owner");
  await send(L(arbiter).transferOwnership(await addr(bob)));
  assert.equal(await landed.pendingOwner(), await addr(bob));
  assert.equal(await landed.owner(), await addr(arbiter)); // not yet
  await assert.rejects(L(client).acceptOwnership(), "not nominee");
  const r = await send(L(bob).acceptOwnership());
  assert.ok(hasEvent(r, "OwnershipTransferred"));
  assert.equal(await landed.owner(), await addr(bob));
  assert.equal(await landed.pendingOwner(), ethers.ZeroAddress);
  await assert.rejects(L(arbiter).setArbiter(await addr(carol)), "old owner lost rights");
  await assert.rejects(L(bob).acceptOwnership(), "cannot accept twice");
  await send(L(bob).transferOwnership(await addr(arbiter)));
  await send(L(arbiter).acceptOwnership());
  assert.equal(await landed.owner(), await addr(arbiter));
});

// ---------------------------------------------------------------- mutual cancel

test("mutual cancel refunds the remaining escrow to the client", async () => {
  const id = await direct([30, 70]);
  await send(L(alice).deliver(id, "d1"));
  await send(L(client).approve(id));
  await send(L(alice).requestMutualCancel(id));
  assert.equal(await landed.cancelRequestedBy(id), await addr(alice));
  const c0 = await bal(client);
  const r = await send(L(client).confirmMutualCancel(id));
  assert.ok(hasEvent(r, "MutuallyCancelled"));
  assert.equal((await bal(client)) - c0, usd(70));
  assert.equal((await landed.getJob(id)).status, 4n);
  await assert.rejects(L(alice).deliver(id, "d2"));
});

test("mutual cancel permission and state reverts", async () => {
  const open = await post(client, [10]);
  await assert.rejects(L(client).requestMutualCancel(open), "not active");
  const id = await direct([10]);
  await assert.rejects(L(bob).requestMutualCancel(id), "outsider");
  await assert.rejects(L(alice).confirmMutualCancel(id), "nothing requested");
  await send(L(client).requestMutualCancel(id));
  await assert.rejects(L(alice).requestMutualCancel(id), "already requested");
  await assert.rejects(L(client).confirmMutualCancel(id), "requester cannot confirm");
  await assert.rejects(L(bob).confirmMutualCancel(id), "outsider cannot confirm");
  await assert.rejects(L(alice).withdrawMutualCancel(id), "only requester withdraws");
  await send(L(client).withdrawMutualCancel(id));
  await assert.rejects(L(alice).confirmMutualCancel(id), "withdrawn");
  // a dispute clears a pending request
  await send(L(alice).requestMutualCancel(id));
  await send(L(client).dispute(id));
  await assert.rejects(L(client).confirmMutualCancel(id));
  assert.equal(await landed.cancelRequestedBy(id), ethers.ZeroAddress);
});

test("V1 timeout claim still works", async () => {
  const id = await direct([30], alice, { window: 2 * DAY });
  await send(L(alice).deliver(id, "x"));
  await assert.rejects(L(alice).claimAfterTimeout(id));
  await provider.send("evm_increaseTime", [2 * DAY + 1]);
  await provider.send("evm_mine", []);
  const a0 = await bal(alice);
  await send(L(alice).claimAfterTimeout(id));
  assert.equal((await bal(alice)) - a0, usd(30));
});
