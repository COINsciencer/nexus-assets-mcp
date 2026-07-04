# Nexus Assets MCP：你的 AI 资产管理助手

> English version: [README.en.md](README.en.md)

`nexus-assets-mcp` 是一个公开的 MCP 服务，用来把 [Nexus Assets](https://nexusassets.top) 里的个人资产数据接入 Codex、Claude Code、Cursor Agent、Claude Desktop 等支持 MCP 的 AI 工具。

装好以后，你的 AI 就可以读取你的资产数据，帮你做资产管理、资产统计、每日收益总结、账户检查、趋势复盘、截图录入和日报自动化。

> 本项目只用于资产展示、统计、整理和数据分析，不构成投资、税务或法律建议。

## 它可以帮你做什么

你可以每天直接问 AI：

```text
我今天资产收益怎么样？
今天哪个账户变化最大？
帮我统计一下美股、加密货币、黄金、人民币现金、美元短债和欧元资产分别是多少。
总结最近 30 天资产变化，并告诉我主要变化来自哪里。
帮我生成一份每日资产日报。
识别这张券商截图里的持仓，先列出来给我确认。
```

典型场景：

- **资产管理**：把交易所、券商、现金、手动资产集中到一个 AI 对话里查看。
- **资产统计**：查看总资产、今日变化、账户分布、资产类别占比、最大持仓和历史趋势。
- **每日资产日报**：让 Codex / Claude Code 每天读取最新数据，自动生成资产日报。
- **多资产配置复盘**：统计美股、BTC/ETH、黄金、人民币、美元、欧元、港股等资产比例。
- **币种敞口分析**：查看 USD、RMB、EUR、HKD、Crypto 原生资产的暴露情况。
- **风险集中度检查**：发现是否过度集中在科技股、半导体、BTC/ETH、单一账户或单一币种。
- **截图录入资产**：把券商 App 截图发给 AI，识别持仓，确认后写入 Nexus Assets。

## 快速使用

你不用手动研究 MCP 配置文件。最简单的方式是：先生成 token，然后把提示词复制给 Codex 或 Claude Code，让它帮你配置。

### 1. 生成 Token

打开 [https://nexusassets.top](https://nexusassets.top)，登录后进入：

```text
Settings / 设置 -> AI Agent Token -> Generate Token / 生成 Token
```

复制生成的 `nxa_...` token。这个 token 通常只显示一次，请先保存好。

### 2. 把这段话发给 Codex / Claude Code

把 `nxa_your_token_here` 换成你的真实 token，然后整段复制给 Codex、Claude Code、Cursor Agent 或其他能帮你改 MCP 配置的 AI 编程助手：

```text
请帮我安装并配置 Nexus Assets MCP 服务。

MCP package:
nexus-assets-mcp

启动命令:
npx -y nexus-assets-mcp

环境变量:
NEXUS_TOKEN=nxa_your_token_here
NEXUS_API_URL=https://nexusassets.top/api

配置完成后，请验证 MCP 服务可用，并调用 Nexus Assets 获取我的资产总览做一次测试。
```

如果你的 AI 工具要求你手动粘贴 MCP 配置，可以使用：

```json
{
  "mcpServers": {
    "nexus-assets": {
      "command": "npx",
      "args": ["-y", "nexus-assets-mcp"],
      "env": {
        "NEXUS_TOKEN": "nxa_your_token_here",
        "NEXUS_API_URL": "https://nexusassets.top/api"
      }
    }
  }
}
```

## 示例案例

下面这些图是静态示例，演示一个约 **3086 万人民币** 的多资产组合。组合包含美股、BTC/ETH、黄金、人民币现金/货基、美元现金/短债、欧元资产、港股/亚洲权益和手动资产。数据不是真实用户资产，只用于展示安装 MCP 后可以实现什么效果。

### 1. 每日资产日报定时任务

把下面提示词给 Codex / Claude Code，它可以帮你创建每天运行的资产日报任务。

![每日资产日报定时任务](docs/images/scheduled-daily-report-task.png)

```text
请帮我创建一个每日 Nexus Assets 资产日报定时任务。
每天北京时间早上 8:30 运行。
使用 Nexus Assets MCP 获取总资产、账户列表、7 日趋势、快照和 dashboard 截图。
输出总资产、今日变化、资产配置、账户分布、主要涨跌来源、风险提示、
以及需要我人工确认的数据。
不要替我做投资决策，只整理数据并解释发生了什么变化。
```

### 2. 日报提示词配置详情

如果你希望日报更详细，可以让 AI 同时检查账户是否过期、7 日趋势、币种敞口和异常数据。

![日报提示词配置详情](docs/images/daily-report-automation.png)

```text
请每天生成一份更详细的 Nexus Assets 资产日报。
除了总资产和涨跌，也要包含分类占比、币种敞口、账户数据是否过期、
7 日趋势、主要资产变化、需要我人工确认的异常数据。
```

### 3. 询问今日资产表现

![今日资产表现问答](docs/images/portfolio-summary-chat.png)

```text
用 Nexus Assets MCP 总结我今天的资产表现。
告诉我总资产、今日变化、主要收益来源、账户变化、
以及有没有需要我关注的异常情况。
```

### 4. 多资产配置报告

![多资产配置报告](docs/images/asset-allocation-report.png)

```text
用 Nexus Assets MCP 帮我生成一份资产配置报告。
把资产分成美股、BTC/ETH、黄金、人民币现金、美元现金/短债、
欧元资产、港股/亚洲权益和手动资产。
显示每类资产的占比、金额、代表性持仓和集中度提示。
```

### 5. 币种敞口分析

![币种敞口分析](docs/images/currency-exposure-review.png)

```text
用 Nexus Assets MCP 分析我的币种敞口。
区分 USD、RMB、EUR、HKD 和 Crypto 原生资产。
说明哪些部分会受到美元利率、人民币汇率、美股、黄金和加密市场波动影响。
```

### 6. 风险集中度复盘

![风险集中度复盘](docs/images/risk-review-chat.png)

```text
用 Nexus Assets MCP 检查我的组合集中度风险。
看看我是否过度集中在科技股、半导体、BTC/ETH、单一账户、
单一币种或单一资产类别。
只总结风险和数据问题，不要替我做投资决策。
```

### 7. 截图识别持仓

把券商截图发给 AI，让它先识别持仓，等你确认后再写入 Nexus Assets。

![截图识别持仓](docs/images/screenshot-import-flow.png)

```text
请识别这张券商截图里的持仓。
先列出股票代码、数量和估算市值给我确认。
我确认以后，再用 Nexus Assets MCP 添加为手动资产。
```

## 可用工具

| 工具 | 作用 |
| --- | --- |
| `get_portfolio` | 获取资产总览、总资产、分类、主要资产和来源分布 |
| `get_dashboard_screenshot` | 获取最新 dashboard 截图链接 |
| `list_accounts` | 列出交易所、券商、钱包和手动资产账户 |
| `get_account_assets` | 查看单个账户的资产明细 |
| `refresh_account` | 拉取某个账户的实时数据 |
| `get_asset_price` | 查询某个资产的 USD / CNY 价格 |
| `get_portfolio_trend` | 查看资产组合历史趋势 |
| `get_snapshots` | 查看每日资产快照 |
| `list_manual_assets` | 列出手动录入资产 |
| `add_manual_asset` | 确认后新增手动资产 |
| `update_manual_asset` | 确认后更新手动资产 |
| `delete_manual_asset` | 确认后删除手动资产 |
| `add_account` | 新建交易所或券商账户连接 |
| `save_account_credentials` | 保存加密后的交易所或券商 API 凭证 |

## 安全说明

- MCP 服务默认运行在你的本地 AI 客户端里。
- 请求使用你的个人 `nxa_...` token。
- token 只能访问生成它的 Nexus Assets 账户。
- token 明文通常只显示一次，服务端只保存哈希。
- 交易所 API 凭证建议使用只读权限。
- 你可以随时在 Nexus Assets 设置里撤销 token。

## 链接

- Website: [https://nexusassets.top](https://nexusassets.top)
- GitHub: [https://github.com/COINsciencer/nexus-assets-mcp](https://github.com/COINsciencer/nexus-assets-mcp)
- npm: [https://www.npmjs.com/package/nexus-assets-mcp](https://www.npmjs.com/package/nexus-assets-mcp)

## License

MIT
