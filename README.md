# nexus-assets-mcp

> Let your AI manage your investment portfolio via natural language.

Connect your [Nexus Assets](https://nexusassets.top) portfolio to any AI. Check balances, log new assets, connect exchanges, and get visual charts — all from a conversation.

[English](#english) | [中文](#中文)

---

## English

### Step 1 — Get your token

1. Log in to [nexusassets.top](https://nexusassets.top)
2. **Settings → AI Agent Token → Generate Token**
3. Copy the `nxa_...` value (shown only once)

### Step 2 — Install with one message

Just send your AI this message (replace the token):

> Please install the nexus-assets-mcp MCP server.
> Token: `nxa_your_token_here`
> API URL: `https://nexusassets.top/api`

Most AI coding assistants (Claude Code, Cursor, Windsurf, etc.) will handle the configuration automatically.

### Step 3 — Start using

```
"How is my portfolio today?"
"Add 50 shares of NVDA as a manual asset"
"Connect my Binance account — key: xxx, secret: yyy"
"Show me this week's performance chart"
```

---

### What your AI can do

**Read** — portfolio overview, account balances, asset prices, historical trends, daily snapshots, dashboard screenshot  
**Write** — add/edit/delete manual assets, create exchange accounts, save API credentials

### Supported Exchanges

Binance · OKX · Bybit · Bitget · Backpack · Longbridge

### Screenshot workflow

Send a screenshot of your brokerage app to your AI:

```
You: [screenshot of Futu/Tiger/Schwab]
     Add these positions to my portfolio.

AI:  I see NVDA × 50, AAPL × 20, TSLA × 10. Add them?

You: Yes

AI:  Done. Total is now ¥921,450.
```

---

### Manual configuration (if needed)

**Claude Desktop / Cursor / Windsurf** — add to your MCP config:

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

Config file locations:
- Claude Desktop (Mac): `~/Library/Application Support/Claude/claude_desktop_config.json`
- Claude Desktop (Win): `%APPDATA%\Claude\claude_desktop_config.json`
- Cursor: `.cursor/mcp.json` in your project

**ChatGPT Custom GPT** (web + mobile):
1. [chat.openai.com](https://chat.openai.com) → **Explore GPTs** → **+ Create** → **Configure** → **Actions** → **Create new action**
2. Schema URL: `https://nexusassets.top/api/openapi.json`
3. Authentication: **Bearer Token** → paste your `nxa_...` token

**Environment variables** (Claude Code CLI):

```bash
export NEXUS_TOKEN="nxa_your_token"
export NEXUS_API_URL="https://nexusassets.top/api"
```

---

### Security

- Exchange API keys are read-only — cannot trade, withdraw, or transfer
- Token gives access only to your own data
- Token plaintext shown once at generation; server stores only SHA-256 hash
- Revoke anytime: Settings → AI Agent Token → Revoke All

---

## 中文

### 第一步 — 获取 Token

1. 登录 [nexusassets.top](https://nexusassets.top)
2. **设置 → AI Agent Token → 生成 Token**
3. 复制 `nxa_...`（仅显示一次）

### 第二步 — 一句话安装

直接把下面这句话发给你的 AI（替换 token）：

> 请帮我安装 nexus-assets-mcp 这个 MCP 服务。
> Token: `nxa_你的token`
> API 地址: `https://nexusassets.top/api`

大多数 AI 编程助手（Claude Code、Cursor、Windsurf 等）都能自动完成配置。

### 第三步 — 开始使用

```
"今天资产怎么样？"
"帮我加 50 股 NVDA 作为手动资产"
"连接我的 Binance，key: xxx，secret: yyy"
"给我看一下这周的走势图"
```

---

### AI 能做什么

**查询** — 资产总览、各账户余额、资产价格、历史走势、每日快照、仪表盘截图  
**写入** — 新增/编辑/删除手动资产、创建交易所账户、保存 API 密钥

### 支持的交易所

币安 · OKX · Bybit · Bitget · Backpack · 长桥证券

### 截图录入资产

把券商 App 的截图发给 AI：

```
你：[发送 Futu/老虎/Schwab 截图]
    把这些持仓加进我的资产组合。

AI：我看到 NVDA × 50，AAPL × 20，TSLA × 10，确认添加？

你：确认

AI：已添加。你的资产总额现在是 ¥921,450。
```

---

### 手动配置（如有需要）

**Claude Desktop / Cursor / Windsurf** — 加入 MCP 配置文件：

```json
{
  "mcpServers": {
    "nexus-assets": {
      "command": "npx",
      "args": ["-y", "nexus-assets-mcp"],
      "env": {
        "NEXUS_TOKEN": "nxa_你的token",
        "NEXUS_API_URL": "https://nexusassets.top/api"
      }
    }
  }
}
```

配置文件位置：
- Claude Desktop（Mac）：`~/Library/Application Support/Claude/claude_desktop_config.json`
- Claude Desktop（Win）：`%APPDATA%\Claude\claude_desktop_config.json`
- Cursor：项目目录下 `.cursor/mcp.json`

**ChatGPT 自定义 GPT**（网页 + 手机通用）：
1. [chat.openai.com](https://chat.openai.com) → **Explore GPTs** → **+ Create** → **Configure** → **Actions** → **Create new action**
2. Schema URL：`https://nexusassets.top/api/openapi.json`
3. Authentication 选 **Bearer Token** → 填入 `nxa_...` token

---

### 安全性

- 交易所 API Key 仅读取余额，无法交易、提现或划转
- Token 只能访问你自己的数据
- Token 明文仅在生成时显示一次，服务端只存 SHA-256 哈希
- 随时可在设置页面一键吊销

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXUS_TOKEN` | Personal API Token (`nxa_...`). Required. |
| `NEXUS_API_URL` | Backend URL. Default: `https://nexusassets.top/api` |

## Source

Part of the [Nexus Assets monorepo](https://github.com/COINsciencer/assetsmanger).

## Changelog

- **v0.2.0** — Write tools, snapshots, screenshot, Personal Token auth
- **v0.1.0** — Read-only: portfolio, accounts, pricing, trend
