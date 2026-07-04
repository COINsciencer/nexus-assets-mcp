# Nexus Assets MCP Server

**An open-source MCP server that connects your Nexus Assets portfolio to AI assistants.**

`nexus-assets-mcp` lets Claude Desktop, Cursor, Windsurf, Claude Code, Codex-style tools, and other MCP-compatible clients read and organize your private portfolio data through natural language. It works with [Nexus Assets](https://nexusassets.top), a personal asset dashboard for crypto, stocks, exchange accounts, brokers, manual assets, snapshots, and visual portfolio reports.

[中文教程](#中文教程) | [English Guide](#english-guide) | [MCP Tools](#available-mcp-tools) | [Security](#security-and-privacy)

> Nexus Assets MCP is for asset tracking, portfolio reporting, and data organization only. It does not provide financial, investment, tax, or legal advice.

## What You Can Ask Your AI

```text
How is my portfolio today?
List all connected accounts and balances.
Which assets are my largest positions?
Show my portfolio trend for the last 30 days.
Add 50 shares of NVDA as a manual asset.
Read this brokerage screenshot and prepare manual asset entries.
Refresh my Binance account balance.
```

## Why Use Nexus Assets MCP

- **AI portfolio assistant**: ask about your portfolio in plain English or Chinese.
- **Private user data**: every request uses your own `nxa_...` token.
- **Multi-asset tracking**: crypto, stocks, cash, gold, manual assets, exchanges, brokers, and wallets.
- **Screenshot-friendly workflow**: send brokerage screenshots to your AI, confirm parsed positions, then save them.
- **MCP-native**: built for clients that support the Model Context Protocol.
- **Open source**: small TypeScript stdio MCP server using the official MCP SDK.

## 中文教程

下面是一套从 0 到 1 的手把手配置流程。你只需要准备一个 Nexus Assets 账号、Node.js 18+，以及一个 AI Agent Token。

### 第 1 步：登录 Nexus Assets

打开：

[https://nexusassets.top](https://nexusassets.top)

登录后，先确认资产页面能正常打开。如果你还没有任何资产，可以先添加一个手动资产用于测试。

### 第 2 步：生成 AI Agent Token

在 Nexus Assets 页面里进入：

```text
Settings / 设置 -> AI Agent Token -> Generate Token / 生成 Token
```

生成后会看到一个类似这样的 token：

```text
nxa_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

请立刻复制保存。这个 token 通常只显示一次。

### 第 3 步：确认本机 Node.js 版本

这个 MCP server 通过 `npx` 启动，需要 Node.js 18 或更高版本：

```bash
node -v
```

如果没有安装 Node.js，建议先安装 LTS 版本。

### 第 4 步：选择你的 AI 客户端

| 客户端 | 推荐方式 |
| --- | --- |
| Claude Desktop | 修改 `claude_desktop_config.json` |
| Cursor | 在项目里创建 `.cursor/mcp.json` |
| Windsurf | 添加 MCP server 配置 |
| Claude Code / Codex 类 CLI | 设置环境变量后运行 `npx` |
| 其他 MCP 客户端 | 使用 stdio server 配置 |

### 第 5 步：配置 Claude Desktop

Mac 上打开或新建：

```text
~/Library/Application Support/Claude/claude_desktop_config.json
```

写入：

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

把 `nxa_your_token_here` 换成你刚刚生成的 token。

Windows 上 Claude Desktop 配置文件通常在：

```text
%APPDATA%\Claude\claude_desktop_config.json
```

配置完成后，完全退出并重新打开 Claude Desktop。

### 第 6 步：配置 Cursor

如果你用 Cursor，在项目根目录创建：

```text
.cursor/mcp.json
```

内容如下：

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

保存后重启 Cursor，或者在 Cursor 的 MCP 面板里刷新 server。

### 第 7 步：命令行测试

你也可以先在终端里确认包能启动：

```bash
export NEXUS_TOKEN="nxa_your_token_here"
export NEXUS_API_URL="https://nexusassets.top/api"
npx -y nexus-assets-mcp
```

这是一个 stdio MCP server，启动后不会像普通网站一样打开端口。只要没有 token 错误或安装错误，说明服务可以被 MCP 客户端调用。

### 第 8 步：第一次对话测试

在你的 AI 客户端里试这些问题：

```text
请调用 Nexus Assets，查看我的资产总览。
列出我的所有账户。
查看最近 30 天的资产走势。
帮我查看仪表盘截图链接。
```

如果一切正常，AI 会调用 `get_portfolio`、`list_accounts`、`get_portfolio_trend` 等工具，并返回你的个人资产数据。

### 第 9 步：添加手动资产

你可以这样说：

```text
帮我添加一个手动资产：NVDA，数量 50 股，备注是 Schwab account。
```

AI 应该先向你确认，然后调用 `add_manual_asset`。

如果你发的是券商截图，可以这样说：

```text
请识别这张持仓截图里的股票代码和数量，先列出来给我确认，确认后再添加到 Nexus Assets。
```

建议始终让 AI 在写入前先确认，避免把识别错误的数据写进账户。

### 第 10 步：常见问题排查

**AI 看不到 Nexus Assets 工具**

确认 MCP 配置文件保存位置正确，并完全重启客户端。

**提示缺少 `NEXUS_TOKEN`**

检查配置里的 `env.NEXUS_TOKEN` 是否真的填了 `nxa_...`，不要保留示例值。

**提示 401 或 unauthorized**

token 可能复制错了、已经被撤销，或者不是当前账号生成的。请重新生成 token 并更新配置。

**`npx` 很慢或安装失败**

确认本机 Node.js 版本是 18 或更高，并检查网络是否能访问 npm registry。

**手动资产添加失败**

请先在 Nexus Assets 网页端创建或确认存在 manual/manual assets 类型账户。

## English Guide

### 1. Get Your Nexus Token

1. Log in to [nexusassets.top](https://nexusassets.top).
2. Open **Settings -> AI Agent Token**.
3. Click **Generate Token**.
4. Copy the `nxa_...` token immediately. It is usually shown only once.

### 2. Add the MCP Server to Your Client

Use this configuration in Claude Desktop, Cursor, Windsurf, or another MCP-compatible client:

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

Restart your AI client after saving the config.

### 3. Test It

Ask your AI:

```text
Show my Nexus Assets portfolio.
List my connected accounts.
Get my portfolio trend for the last 30 days.
Add 10 shares of AAPL as a manual asset.
```

## Available MCP Tools

| Tool | What it does |
| --- | --- |
| `get_portfolio` | Full portfolio overview, total value, categories, top assets, and source breakdown |
| `get_dashboard_screenshot` | Latest generated dashboard screenshot URL |
| `list_accounts` | Connected exchanges, brokers, wallets, and manual asset accounts |
| `get_account_assets` | Asset breakdown for one account |
| `refresh_account` | Pull live data for a connected account |
| `get_asset_price` | Current USD and CNY price for a symbol |
| `get_portfolio_trend` | Historical portfolio trend points |
| `get_snapshots` | Daily portfolio snapshots |
| `list_manual_assets` | Existing manually entered assets |
| `add_manual_asset` | Add a manual asset after user confirmation |
| `update_manual_asset` | Update a manual asset after user confirmation |
| `delete_manual_asset` | Delete a manual asset after user confirmation |
| `add_account` | Create a new exchange or broker account connection |
| `save_account_credentials` | Save encrypted exchange/broker API credentials |

## Supported Account Types

- Binance
- OKX
- Bybit
- Bitget
- Backpack
- Longbridge
- Manual assets
- On-chain wallets, depending on your Nexus Assets backend configuration

## Security and Privacy

- The MCP server runs locally inside your AI client by default.
- API requests are authenticated with your personal `nxa_...` token.
- A token can only access the Nexus Assets user account that generated it.
- Token plaintext is shown once; the server stores only a hash.
- Exchange API credentials should be read-only.
- Nexus Assets is designed for viewing, organizing, and summarizing asset data, not for trading or withdrawals.
- You can revoke tokens from the Nexus Assets settings page.

## Environment Variables

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `NEXUS_TOKEN` | Yes | None | Personal Nexus Assets API token, usually starting with `nxa_` |
| `NEXUS_API_TOKEN` | No | None | Backward-compatible alias for `NEXUS_TOKEN` |
| `NEXUS_API_URL` | No | `https://nexusassets.top/api` | Nexus Assets backend API URL |

## Local Development

```bash
git clone https://github.com/COINsciencer/nexus-assets-mcp.git
cd nexus-assets-mcp
npm install
npm run build
NEXUS_TOKEN="nxa_your_token_here" npm start
```

For development watch mode:

```bash
npm run dev
```

## ChatGPT Notes

ChatGPT web and mobile cannot install a local stdio MCP server directly. This package is mainly for MCP clients such as Claude Desktop, Cursor, Windsurf, Claude Code, Codex-style tools, and compatible developer environments.

For ChatGPT web/mobile, use a hosted HTTPS MCP or Custom GPT Actions integration instead of this local stdio package.

## Links

- Website: [https://nexusassets.top](https://nexusassets.top)
- GitHub: [https://github.com/COINsciencer/nexus-assets-mcp](https://github.com/COINsciencer/nexus-assets-mcp)
- npm: [https://www.npmjs.com/package/nexus-assets-mcp](https://www.npmjs.com/package/nexus-assets-mcp)

## Changelog

- **v0.2.1** - README, setup guide, and package discovery improvements
- **v0.2.0** - Write tools, snapshots, screenshot, personal token auth
- **v0.1.0** - Read-only portfolio, accounts, pricing, and trend tools

## License

MIT
