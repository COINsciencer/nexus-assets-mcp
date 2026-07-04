# Nexus Assets MCP Server

**Connect your Nexus Assets portfolio to Codex, Claude Code, Cursor, and other MCP-compatible AI tools.**

`nexus-assets-mcp` lets your AI assistant read and organize your private Nexus Assets portfolio through natural language: portfolio overview, accounts, balances, manual assets, snapshots, trends, prices, and dashboard screenshots.

[中文](#中文) | [English](#english) | [Tools](#available-tools)

> For asset tracking and portfolio organization only. Not financial, investment, tax, or legal advice.

## 中文

### 最简单的使用方式

你不用手动研究 MCP 配置文件。按下面两步做就可以：

### 1. 生成 Token

打开 [https://nexusassets.top](https://nexusassets.top)，登录后进入：

```text
Settings / 设置 -> AI Agent Token -> Generate Token / 生成 Token
```

复制生成的 `nxa_...` token。这个 token 通常只显示一次，请先保存好。

### 2. 把下面这段话发给 Codex 或 Claude Code

把 `nxa_your_token_here` 换成你的真实 token，然后整段复制给 Codex、Claude Code、Cursor Agent 或其他能帮你改 MCP 配置的 AI 编程助手：

```text
Please install and configure the Nexus Assets MCP server for me.

MCP package:
nexus-assets-mcp

Use this command:
npx -y nexus-assets-mcp

Environment variables:
NEXUS_TOKEN=nxa_your_token_here
NEXUS_API_URL=https://nexusassets.top/api

After installing it, please verify that the MCP server is available and then test it by asking Nexus Assets for my portfolio summary.
```

然后让 AI 帮你完成安装即可。

### 可以怎么问

```text
查看我的 Nexus Assets 资产总览。
列出我的所有账户和余额。
查看最近 30 天的资产走势。
帮我添加一个手动资产：NVDA，数量 50 股。
识别这张券商截图里的持仓，先列出来给我确认。
刷新我的 Binance 账户余额。
```

### 如果 AI 需要手动配置

如果你的 AI 工具要求直接填写 MCP 配置，可以使用这段：

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

## English

### Quick Start

You do not need to manually edit MCP config files if you are using Codex, Claude Code, Cursor Agent, or another coding assistant that can configure MCP servers for you.

### 1. Generate a Token

Open [https://nexusassets.top](https://nexusassets.top), log in, then go to:

```text
Settings -> AI Agent Token -> Generate Token
```

Copy the generated `nxa_...` token. It is usually shown only once.

### 2. Send This Prompt to Codex or Claude Code

Replace `nxa_your_token_here` with your real token, then paste the whole prompt into Codex, Claude Code, Cursor Agent, or another AI coding assistant:

```text
Please install and configure the Nexus Assets MCP server for me.

MCP package:
nexus-assets-mcp

Use this command:
npx -y nexus-assets-mcp

Environment variables:
NEXUS_TOKEN=nxa_your_token_here
NEXUS_API_URL=https://nexusassets.top/api

After installing it, please verify that the MCP server is available and then test it by asking Nexus Assets for my portfolio summary.
```

That is it. Let your AI assistant handle the MCP setup.

### Example Questions

```text
Show my Nexus Assets portfolio.
List my accounts and balances.
Get my portfolio trend for the last 30 days.
Add 50 shares of NVDA as a manual asset.
Read this brokerage screenshot and list the positions for confirmation.
Refresh my Binance account balance.
```

### Manual MCP Config

If your client asks you to paste MCP config directly, use:

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

## Available Tools

| Tool | What it does |
| --- | --- |
| `get_portfolio` | Portfolio overview, total value, categories, top assets, and source breakdown |
| `get_dashboard_screenshot` | Latest dashboard screenshot URL |
| `list_accounts` | Connected exchanges, brokers, wallets, and manual asset accounts |
| `get_account_assets` | Asset breakdown for one account |
| `refresh_account` | Pull live data for a connected account |
| `get_asset_price` | Current USD and CNY price for a symbol |
| `get_portfolio_trend` | Historical portfolio trend data |
| `get_snapshots` | Daily portfolio snapshots |
| `list_manual_assets` | Existing manually entered assets |
| `add_manual_asset` | Add a manual asset after user confirmation |
| `update_manual_asset` | Update a manual asset after user confirmation |
| `delete_manual_asset` | Delete a manual asset after user confirmation |
| `add_account` | Create a new exchange or broker account connection |
| `save_account_credentials` | Save encrypted exchange or broker API credentials |

## Security

- The MCP server runs locally inside your AI client by default.
- Requests use your personal `nxa_...` token.
- A token can only access the Nexus Assets account that generated it.
- Token plaintext is shown once; the server stores only a hash.
- Exchange API credentials should be read-only.
- You can revoke tokens from Nexus Assets settings.

## Links

- Website: [https://nexusassets.top](https://nexusassets.top)
- GitHub: [https://github.com/COINsciencer/nexus-assets-mcp](https://github.com/COINsciencer/nexus-assets-mcp)
- npm: [https://www.npmjs.com/package/nexus-assets-mcp](https://www.npmjs.com/package/nexus-assets-mcp)

## License

MIT
