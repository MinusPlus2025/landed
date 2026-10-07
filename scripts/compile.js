const solc = require("solc");
const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "../contracts");
const sources = {};
for (const f of fs.readdirSync(dir)) sources[f] = { content: fs.readFileSync(path.join(dir, f), "utf8") };
const input = {
  language: "Solidity",
  sources,
  settings: { optimizer: { enabled: true, runs: 200 }, viaIR: true, evmVersion: "shanghai", outputSelection: { "*": { "*": ["abi", "evm.bytecode.object"] } } },
};
const out = JSON.parse(solc.compile(JSON.stringify(input)));
const errs = (out.errors || []).filter((e) => e.severity === "error");
if (errs.length) { console.error(errs.map((e) => e.formattedMessage).join("\n")); process.exit(1); }
for (const [file, contracts] of Object.entries(out.contracts)) {
  for (const [name, c] of Object.entries(contracts)) {
    fs.writeFileSync(path.join(__dirname, `../build/${name}.json`), JSON.stringify({ abi: c.abi, bytecode: "0x" + c.evm.bytecode.object }));
    console.log(`compiled ${name}: ${c.evm.bytecode.object.length / 2} bytes`);
  }
}
