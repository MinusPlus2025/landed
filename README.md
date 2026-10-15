<img src="docs/logo.png" width="72" alt="Landed logo">

# Landed

面向独立创意工作的阶段托管与交付演示。客户先把测试预算锁进 Avalanche 合约，接单人按阶段提交作品链接，客户验收后合约释放该阶段测试 USDC。

**Avalanche Buildathon 赛道：消费应用与支付。** 当前仅为测试网演示，不支持真实资产收付款。初期境外市场是产品假设，跨境不等于监管豁免。

- [在线测试演示](https://minusplus2025.github.io/landed/)
- [本次需求与实施任务书](docs/PRODUCT-TASKS-2026-10-15.md)
- [验证记录](docs/VERIFICATION-2026-10-15.md)
- [既有演示视频](docs/demo.mp4)（历史版本，不能代表本次 UI 和当前链状态）

## 本次改进

- 当前阶段内直接提交/验收，右侧保留资金与参与者；争议放在次要入口。
- 交付链接、公开说明与可选 SHA-256 通过既有合约提交；历史通过 Delivered/Released 事件查询。选择本地文件只计算指纹，不上传。
- 失败保留交付输入；钱包账户/网络变动、零 Gas、交易确认状态有明确反馈。
- 测试 USDC 由用户签名领取。移除旧的浏览器端补助密钥及自动代付路径。
- 分享链接使用公开站点并携带 network，避免 localhost 与跨链同编号订单混淆。

## 评委体验流程

无需钱包可先浏览需求与订单。完整操作需要两个不同钱包地址及该网络的测试 Gas。

1. 选择 Fuji 或 Landed L1。Fuji 使用测试 AVAX，L1 使用测试 LUSD；合约、订单与余额互不通用。
2. Fuji 测试 Gas 可通过 [Avalanche 官方水龙头](https://build.avax.network/console/primary-network/faucet) 申请；L1 自动补助尚未启用，需要事先取得少量测试 LUSD。不要给任何人私钥或助记词。
3. 在个人页领取 10000 测试 USDC。该交易由你的钱包支付 Gas，USDC 不能支付 Gas。看到安全警告或交易模拟失败时停止并核实，不要绕过安全检查。
4. 需求方发布“做一首电子乐”，小样 20、成品 30 测试 USDC，锁定总额 50。
5. 接单人申请，需求方选定。接单人在对应阶段填可访问的下载链接与说明，可选择文件计算指纹。
6. 需求方先实际打开/下载作品，再正式验收并放款。第一阶段完成后再交付第二阶段。
7. 查看阶段历史及交易 Hash。指纹相符只说明字节匹配，不认证质量、版权或下载权限。

已有合约支持验收期到期后由接单人主动调用 `claimAfterTimeout`，不代表后台自动打款。争议会冻结剩余阶段款，由配置的仲裁地址裁决。当前验收与阶段付款属于同一笔合约调用。

## 网络与合约

2026-10-15 只读核对：以下 RPC 的 chain ID 与合约代码均可读取。该检查不是安全审计，也不是完整真实钱包验收。

| 网络 | Chain ID | Gas | Landed | TestUSDC |
|---|---:|---|---|---|
| Fuji C-Chain | 43113 | 测试 AVAX | `0x05d5A6b00eC5eFcE7bAE65504543c75f3795Dfa8` | `0x1Df84cC053e61AA5AF7B674e79BA2854388378f6` |
| Landed L1 | 11230 | 测试 LUSD | `0x8F716e4cEc7e336af78b44e738c013e4ff1b908a` | `0x493d63523A852836D081E876553C63330E5aB306` |

RPC 与完整配置见 `scripts/config.js`、导出的 `config.json` / `config-l1.json`。旧版本曾记录 111230，当前使用 11230。不要为了本次前端修改重新部署合约。

## 技术与边界

| 模块 | 源码 | 当前作用 |
|---|---|---|
| 托管合约 | `contracts/Landed.sol` | 发单、锁款、申请、选人、阶段交付、验收/超时领取、争议裁决 |
| 测试代币 | `contracts/TestUSDC.sol` | 6 位小数，每次 faucet 铸造 10000 给调用者；合约没有限流 |
| 界面 | `public/` | 原生 JS/CSS + ethers，直接读取所选网络 |
| 本地服务 | `server.js` | 静态服务与配置，不是交付文件或私密聊天后端 |
| 静态发布 | `scripts/export-static.js` | 生成 GitHub Pages 站点和双网络配置 |
| x402 探索 | `x402/worker.js` | 既有接口实现，本次未复验在线支付流程，不属于本次主 Demo 承诺 |

资料、技能等部分信息存于浏览器 localStorage；它们不具备跨设备私密同步。订单与交付记录来自链上；链接和说明是公开信息，不应写入隐私内容。上传存储、私密订单沟通、后台自动文件校验与受控 Gas 补助均为后续任务。

ICM 曾有测试消息实验及历史截图 `docs/icm-delivered.jpg`。消息传递不等于 USDC 已跨链；两链余额仍独立。本次无需把 ICM/x402 作为必须成功的现场步骤。

## 本地运行与验证

Node.js 环境下：

```bash
npm install
npm test
node scripts/export-static.js
python3 -m http.server 8080 --directory site
```

打开 `http://localhost:8080`。静态导出读取已有部署记录，不发送交易、不需要私钥。也可用 `npm start` 启动 Express 版本；`NETWORK=fuji` 为默认配置。

浏览器回归在独立 Ganache 内存链运行，使用临时测试账户，绝不操作真实钱包：

```bash
PLAYWRIGHT_MODULE=/absolute/path/to/playwright node test/product-browser.cjs
```

该脚本需要本机 Chrome；本地合约测试与浏览器回归不能证明真实 Core/MetaMask 在 Fuji/L1 的签名、域名安全判断与现场网络表现。具体已完成与未完成验证见验证记录。

`npm run deploy` 和 `npm run seed` 会发送链上交易，仅用于另行授权的部署或数据准备，不是本次前端运行的必要步骤。

## 后续计划

受控测试 Gas 服务、私有文件存储与钱包鉴权、交付版本反馈、双方订单沟通。真实商业上线前需独立完成司法辖区、支付许可、AML/KYC、资金托管与争议处理审查。本项目没有接入或承诺任何银行卡/法币出入金服务。

## License

MIT

## 2026-10-15 路演材料

- [7 页可编辑 PPT](docs/Landed-DemoDay-2026-10-15-可编辑.pptx)（文字可编辑，含讲者备注；产品截图仍为图片）
- [3 分钟逐字稿与演示检查单](docs/Landed-DemoDay-2026-10-15-逐字稿.md)
- [产品改进任务书](docs/PRODUCT-TASKS-2026-10-15.md)
- [验证记录与未验证项](docs/VERIFICATION-2026-10-15.md)
