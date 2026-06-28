# nexus-assets-mcp

> Let your AI manage your investment portfolio via natural language.

**Nexus Assets MCP** exposes your [Nexus Assets](https://nexusassets.top) portfolio as a set of tools that any MCP-compatible AI (Claude, GPT-4o, Cursor, etc.) can call. Your AI can check balances, log new assets, connect exchange APIs, and generate portfolio charts — all from a single conversation, no browser required.

---

## Quick Start (2 minutes)

### Step 1 — Get your Personal Token

1. Log in to your Nexus Assets instance
2. Go to **Settings → AI Agent Token (MCP)**
3. Click **Generate Token** — copy the `nxa_...` value immediately (shown only once)

### Step 2 — Add to your AI client

Paste this command into your AI agent's MCP configuration:

**Claude Desktop** (`~/Library/Application Support/Claude/claude_desktop_config.json`):

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

**Self-hosted instance** — replace `NEXUS_API_URL` with your own backend, e.g. `https://my-nexus.example.com/api`.

### Step 3 — Tell your AI about it

```
I've connected Nexus Assets as an MCP tool.
Please check my current portfolio overview.
```

That's it. Your AI now has full read + write access to your portfolio.

---

## What your AI can do

### Read portfolio data

| Tool | What it does |
|------|-------------|
| `get_portfolio` | Full overview: total value (CNY + USD), 24h change, by-category + by-asset breakdown |
| `get_dashboard_screenshot` | Returns URL of today's auto-generated dashboard chart (PNG) — great for visual reports |
| `list_accounts` | All connected exchanges/wallets and their cached totals |
| `get_account_assets` | Per-token breakdown for one account |
| `refresh_account` | Pull live data from an exchange API right now |
| `get_asset_price` | Current price of any symbol (BTC, ETH, NVDA, USDT…) in USD & CNY |
| `get_portfolio_trend` | Historical value sampled every 4 hours, 1–365 days |
| `get_snapshots` | Daily end-of-day snapshots for day-over-day performance |

### Manage manual assets

| Tool | What it does |
|------|-------------|
| `list_manual_assets` | List all manually entered assets |
| `add_manual_asset` | Add a new asset entry (token, stock, cash, real estate…) |
| `update_manual_asset` | Update amount, note, or custom USD value |
| `delete_manual_asset` | Remove an asset entry |

### Connect exchanges

| Tool | What it does |
|------|-------------|
| `add_account` | Create a new exchange account (Binance, OKX, Bybit, Bitget, Backpack, Longbridge) |
| `save_account_credentials` | Save API key + secret (encrypted server-side) |

---

## Usage Scenarios

### "Just tell me how I'm doing"

```
User: How is my portfolio today?

AI: [calls get_portfolio]
    Total: ¥842,310 (+2.3% vs yesterday)
    Breakdown: BTC 45% · ETH 18% · NVDA 12% · USDT 10% · other 15%
```

### "Show me a chart"

```
User: Send me a screenshot of the dashboard

AI: [calls get_dashboard_screenshot]
    Here's today's chart:
    https://nexusassets.top/screenshots/dashboard_2026-06-29.png
```

### "I bought some stocks — add them for me"

Take a screenshot of your brokerage app (Futu, Tiger, Schwab, etc.) and send it to your AI:

```
User: [attaches screenshot of brokerage app]
      Please recognize these positions and add them to my portfolio.

AI: I can see:
    - NVDA: 50 shares
    - AAPL: 20 shares
    - TSLA: 10 shares
    Should I add these as manual assets?

User: Yes.

AI: [calls add_manual_asset × 3]
    Done! Added NVDA × 50, AAPL × 20, TSLA × 10.
    Your portfolio total is now ¥921,450.
```

### "Connect my Binance account"

```
User: I want to connect my Binance API.
      Key: xxxx  Secret: yyyy

AI: [calls add_account → save_account_credentials → refresh_account]
    Connected! Binance shows ¥320,000 — 12 tokens loaded.
```

### "What happened this week?"

```
User: How did my portfolio perform this week?

AI: [calls get_portfolio_trend with days=7]
    This week: ¥820k → ¥842k (+2.7%)
    Best day: Wednesday +1.9% (BTC rally)
    Worst day: Tuesday -0.8%
```

### Morning briefing (no hands)

Set up a recurring prompt in your AI:

```
Every morning at 8 AM:
1. Check my Nexus Assets portfolio (call get_portfolio)
2. Tell me the biggest mover (up and down)
3. Flag any accounts not refreshed in 24+ hours (call list_accounts)
4. Show me the dashboard screenshot
```

---

## Supported Exchanges

| Type value | Exchange |
|------------|----------|
| `exchange_binance` | Binance |
| `exchange_okx` | OKX (requires passphrase) |
| `exchange_bybit` | Bybit |
| `exchange_bitget` | Bitget (requires passphrase) |
| `exchange_backpack` | Backpack |
| `broker_longbridge` | Longbridge / 长桥证券 |

On-chain wallet addresses and manual assets are managed separately (see the web app Sources page or use `add_manual_asset`).

---

## AI-Readable Tool Reference

> This section is written for AI models learning to use this MCP server.

**Authentication**: All calls require `NEXUS_TOKEN` (format `nxa_<64hex>`) set as environment variable. This is a Personal API Token generated from the Nexus Assets Settings page. Do not ask the user for passwords, cookies, or JWT tokens.

**Base URL**: Set via `NEXUS_API_URL`. Default: `https://nexusassets.top/api`. All HTTP calls go to this endpoint.

**Recommended first-time workflow**:
1. `list_accounts` — see what's already connected
2. `get_portfolio` — get current totals and breakdown
3. If accounts are missing: `add_account` → `save_account_credentials` → `refresh_account`

**When the user sends a screenshot of a brokerage/exchange**:
1. Use your vision to recognize asset symbols and amounts from the image
2. Call `list_manual_assets` to check for existing entries (avoid duplicates)
3. Show the user the list you're about to add, wait for confirmation
4. Call `add_manual_asset` for each position
5. Call `get_portfolio` after to show updated totals

**Before any write operation**: Always tell the user what you are about to add/update/delete and ask for confirmation. Write operations change real data.

**On 401 errors**: The user's token may be revoked. Direct them to Settings → AI Agent Token → Generate Token.

**On exchange refresh errors**: Credentials may be expired or permissions insufficient. Ask the user to regenerate their exchange API key with read-only balance access, then call `save_account_credentials` again.

**Screenshot availability**: `get_dashboard_screenshot` returns a daily PNG URL. It is generated at 6 AM CST. If today's chart isn't ready yet, the previous day's will serve. Always return the URL to the user directly so they can view it.

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXUS_TOKEN` | Personal API Token (`nxa_...`) generated in Settings. Required. |
| `NEXUS_API_URL` | Backend URL, default `https://nexusassets.top/api` |

---

## Security

- **Exchange keys are read-only**: API keys in Nexus Assets are for balance reading only — they cannot trade, withdraw, or transfer funds.
- **Token scope**: Your `nxa_` token gives access only to your own data. Server enforces isolation — no cross-user access possible.
- **Token storage**: Plaintext shown only once at generation. Server stores only the SHA-256 hash.
- **Revocation**: Settings → AI Agent Token → Revoke All to instantly invalidate all tokens.
- **Max 3 tokens per user**: Oldest is auto-revoked when a 4th is generated.

---

## Source Code

This MCP server is open source, part of the [Nexus Assets monorepo](https://github.com/COINsciencer/assetsmanger).

```bash
# Build from source
cd mcp-server
npm install
npm run build
NEXUS_TOKEN=nxa_... NEXUS_API_URL=https://... node dist/index.js
```

## Changelog

- **v0.2.0** — Write tools (manual asset CRUD, exchange setup), `get_snapshots`, `get_dashboard_screenshot`, Personal Token auth
- **v0.1.0** — Read-only: portfolio, accounts, pricing, trend
