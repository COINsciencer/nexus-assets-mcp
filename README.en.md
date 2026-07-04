# Nexus Assets MCP Server

> 中文版: [README.md](README.md)

`nexus-assets-mcp` connects [Nexus Assets](https://nexusassets.top) to Codex, Claude Code, Cursor Agent, Claude Desktop, and other MCP-compatible AI tools.

After installation, your AI can read your private portfolio data and help with asset management, portfolio statistics, daily performance summaries, account checks, trend reviews, screenshot imports, and scheduled portfolio reports.

> For asset tracking, portfolio organization, and data analysis only. Not financial, investment, tax, or legal advice.

## What It Can Do

You can ask:

```text
How much did my portfolio change today?
Which account contributed most to today's profit or loss?
Summarize my US stocks, crypto, gold, RMB cash, USD T-bills, and EUR assets.
Create a daily portfolio report every morning.
Read this brokerage screenshot and prepare the positions for confirmation.
Show my 30-day asset trend and explain the main changes.
```

Common workflows:

- Asset management across exchanges, brokers, cash, and manual assets
- Portfolio statistics, allocation, account breakdown, largest positions, and historical trends
- Daily portfolio reports with Codex or Claude Code
- Multi-asset allocation review across stocks, BTC/ETH, gold, RMB, USD, EUR, and HK/Asia assets
- Currency exposure analysis across USD, RMB, EUR, HKD, and crypto-native assets
- Risk concentration checks for tech stocks, semiconductors, BTC/ETH, single accounts, and currencies
- Screenshot-based position extraction before saving manual assets

## Quick Start

### 1. Generate a Token

Open [https://nexusassets.top](https://nexusassets.top), log in, then go to:

```text
Settings -> AI Agent Token -> Generate Token
```

Copy the generated `nxa_...` token. It is usually shown only once.

### 2. Send This Prompt to Codex or Claude Code

Replace `nxa_your_token_here` with your real token, then paste the full prompt into Codex, Claude Code, Cursor Agent, or another coding assistant that can configure MCP servers:

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

Manual MCP config:

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

## Example Workflows

The screenshots below use a static demo portfolio of about **¥30.86M CNY**. The data is not real user data.

### 1. Daily Portfolio Report Automation

![Scheduled daily portfolio report task](docs/images/scheduled-daily-report-task.png)

```text
Please create a daily Nexus Assets portfolio report automation.
Run it every morning at 8:30 Beijing time.
Use Nexus Assets MCP to fetch portfolio, accounts, 7-day trend,
snapshots, and dashboard screenshot.
Output total value, daily change, allocation, account breakdown,
main changes, risk notes, and anything I should manually review.
Do not make investment decisions for me.
```

### 2. Daily Report Prompt Detail

![Daily report automation](docs/images/daily-report-automation.png)

### 3. Today's Portfolio Performance

![Portfolio summary chat](docs/images/portfolio-summary-chat.png)

### 4. Multi-Asset Allocation Report

![Asset allocation report](docs/images/asset-allocation-report.png)

### 5. Currency Exposure Review

![Currency exposure review](docs/images/currency-exposure-review.png)

### 6. Risk Concentration Review

![Risk review chat](docs/images/risk-review-chat.png)

### 7. Screenshot Import Workflow

![Screenshot import flow](docs/images/screenshot-import-flow.png)

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
- Token plaintext is usually shown once; the server stores only a hash.
- Exchange API credentials should be read-only.
- You can revoke tokens from Nexus Assets settings.

## Links

- Website: [https://nexusassets.top](https://nexusassets.top)
- GitHub: [https://github.com/COINsciencer/nexus-assets-mcp](https://github.com/COINsciencer/nexus-assets-mcp)
- npm: [https://www.npmjs.com/package/nexus-assets-mcp](https://www.npmjs.com/package/nexus-assets-mcp)

## License

MIT
