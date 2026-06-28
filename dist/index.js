#!/usr/bin/env node
/**
 * nexus-assets-mcp — Model Context Protocol server for Nexus Assets
 * Exposes full portfolio management: read + write + screenshot
 *
 * Config (env vars):
 *   NEXUS_API_URL    — e.g. https://nexusassets.top/api
 *   NEXUS_TOKEN      — Personal API token from Settings → MCP Token (nxa_...)
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
const API_URL = (process.env.NEXUS_API_URL || 'https://nexusassets.top/api').replace(/\/$/, '');
const TOKEN = process.env.NEXUS_TOKEN || process.env.NEXUS_API_TOKEN || '';
if (!TOKEN) {
    process.stderr.write('[nexus-assets-mcp] ⚠️  NEXUS_TOKEN not set.\n' +
        '  1. Log in at your Nexus Assets instance\n' +
        '  2. Go to Settings → MCP Token → Generate Token\n' +
        '  3. Set NEXUS_TOKEN=nxa_... in your MCP config\n');
}
async function api(path, options = {}) {
    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json', ...(options.headers ?? {}) },
    });
    if (!res.ok) {
        const text = await res.text().catch(() => res.statusText);
        throw new Error(`Nexus API ${res.status}: ${text}`);
    }
    return res.json();
}
// ─── Tool definitions ────────────────────────────────────────────────────────
const TOOLS = [
    // ── READ ──
    {
        name: 'get_portfolio',
        description: 'Get full portfolio overview: total value (CNY & USD), 24h change, breakdown by category (crypto/stablecoin/stock/gold/cash) and by individual asset. Call this first to understand the user\'s overall financial picture.',
        inputSchema: {
            type: 'object',
            properties: {
                refresh: { type: 'boolean', description: 'Force live data from all exchanges (default: use cache)' },
            },
        },
    },
    {
        name: 'get_dashboard_screenshot',
        description: 'Get the URL of the latest auto-generated dashboard screenshot (PNG). Return this URL to the user so they can see a visual overview. Screenshots are generated daily at 6 AM CST.',
        inputSchema: { type: 'object', properties: {} },
    },
    {
        name: 'list_accounts',
        description: 'List all connected exchange/broker accounts (Binance, OKX, Bybit, Bitget, Backpack, Longbridge, on-chain wallets, manual assets) with their cached total values.',
        inputSchema: { type: 'object', properties: {} },
    },
    {
        name: 'get_account_assets',
        description: 'Get individual asset breakdown for one account — each token with amount and CNY value.',
        inputSchema: {
            type: 'object',
            required: ['account_id'],
            properties: {
                account_id: { type: 'string', description: 'Account id from list_accounts' },
            },
        },
    },
    {
        name: 'refresh_account',
        description: 'Pull live data from an exchange API and refresh the cached balance for that account.',
        inputSchema: {
            type: 'object',
            required: ['account_id'],
            properties: {
                account_id: { type: 'string', description: 'Account id to refresh' },
            },
        },
    },
    {
        name: 'get_asset_price',
        description: 'Get current price of any asset in USD and CNY (e.g. BTC, ETH, NVDA, SOL, USDT).',
        inputSchema: {
            type: 'object',
            required: ['asset_id'],
            properties: {
                asset_id: { type: 'string', description: 'Asset symbol, e.g. BTC, ETH, NVDA' },
            },
        },
    },
    {
        name: 'get_portfolio_trend',
        description: 'Get historical portfolio value sampled every 4 hours. Good for trend analysis and return calculations.',
        inputSchema: {
            type: 'object',
            properties: {
                days: { type: 'number', description: 'Days to look back, 1–365 (default 30)' },
            },
        },
    },
    {
        name: 'get_snapshots',
        description: 'Get daily end-of-day portfolio snapshots. Useful for day-over-day performance tracking.',
        inputSchema: {
            type: 'object',
            properties: {
                limit: { type: 'number', description: 'Number of snapshots to return (default 30, max 90)' },
            },
        },
    },
    {
        name: 'list_manual_assets',
        description: 'List all manually entered assets (stocks not on supported brokers, real estate, cash, etc.).',
        inputSchema: { type: 'object', properties: {} },
    },
    // ── WRITE ──
    {
        name: 'add_manual_asset',
        description: 'Add a manual asset entry. Use this after recognizing assets from a screenshot or when the user describes assets not covered by exchange APIs. Always confirm with the user before calling.',
        inputSchema: {
            type: 'object',
            required: ['asset_id', 'amount'],
            properties: {
                asset_id: { type: 'string', description: 'Asset symbol or name, e.g. BTC, NVDA, 现金, 黄金' },
                amount: { type: 'number', description: 'Quantity held' },
                note: { type: 'string', description: 'Optional note or description' },
                value_usd: { type: 'number', description: 'Optional USD value (use for non-standard assets whose price the system cannot auto-fetch)' },
            },
        },
    },
    {
        name: 'update_manual_asset',
        description: 'Update an existing manual asset (amount, note, or value). Get the id from list_manual_assets first.',
        inputSchema: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'string', description: 'Asset id from list_manual_assets' },
                asset_id: { type: 'string', description: 'New symbol/name (optional)' },
                amount: { type: 'number', description: 'New amount (optional)' },
                note: { type: 'string', description: 'New note (optional)' },
                value_usd: { type: 'number', description: 'New USD value (optional)' },
            },
        },
    },
    {
        name: 'delete_manual_asset',
        description: 'Delete a manual asset entry. Always confirm with the user before calling.',
        inputSchema: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'string', description: 'Asset id from list_manual_assets' },
            },
        },
    },
    {
        name: 'add_account',
        description: 'Create a new exchange or broker account connection. After creation, use save_account_credentials to add the API key/secret. Supported types: exchange_binance, exchange_okx, exchange_bybit, exchange_bitget, exchange_backpack, broker_longbridge.',
        inputSchema: {
            type: 'object',
            required: ['source_type', 'name'],
            properties: {
                source_type: {
                    type: 'string',
                    enum: ['exchange_binance', 'exchange_okx', 'exchange_bybit', 'exchange_bitget', 'exchange_backpack', 'broker_longbridge'],
                    description: 'Exchange/broker type',
                },
                name: { type: 'string', description: 'Display name, e.g. "Binance 主账户"' },
            },
        },
    },
    {
        name: 'save_account_credentials',
        description: 'Save API key/secret for an exchange account. Credentials are encrypted server-side. For OKX/Bitget also provide passphrase. Always confirm with user before calling.',
        inputSchema: {
            type: 'object',
            required: ['account_id', 'api_key', 'secret'],
            properties: {
                account_id: { type: 'string', description: 'Account id from list_accounts or add_account' },
                api_key: { type: 'string', description: 'Exchange API key' },
                secret: { type: 'string', description: 'Exchange API secret' },
                passphrase: { type: 'string', description: 'Passphrase — required for OKX and Bitget' },
            },
        },
    },
];
// ─── Handlers ────────────────────────────────────────────────────────────────
async function handleGetPortfolio(args) {
    const data = await api(`/aggregate${args.refresh ? '?refresh=1' : ''}`);
    const lines = [
        '## Portfolio Summary',
        `**Total CNY:** ¥${fmtCny(data.totalCny)}   **Total USD:** $${fmtUsd(data.totalUsd)}`,
        `**24h Change:** ${data.changePct >= 0 ? '+' : ''}${data.changePct?.toFixed(2)}%`,
        '',
        '### By Category',
        ...(data.categories ?? []).map((c) => `- **${c.label}**: ¥${fmtCny(c.value)} (${c.pct?.toFixed(1)}%)`),
        '',
        '### Top Assets',
        ...(data.assetBreakdown ?? []).slice(0, 15).map((a) => `- **${a.label}**: ${a.amount}  |  ¥${fmtCny(a.valueCny)}`),
    ];
    if (data.sourceBreakdown?.length) {
        lines.push('', '### By Source');
        for (const s of data.sourceBreakdown) {
            lines.push(`- ${s.label}: ¥${fmtCny(s.value)} (${s.pct?.toFixed(1)}%)`);
        }
    }
    if (data.cache?.cached)
        lines.push('', `*Cached data, ${data.cache.ageSec}s old — pass refresh=true for live data*`);
    return lines.join('\n');
}
async function handleGetDashboardScreenshot() {
    const base = API_URL.replace('/api', '');
    const today = new Date().toISOString().slice(0, 10);
    const url = `${base}/screenshots/dashboard_${today}.png`;
    return `Today's dashboard screenshot:\n${url}\n\nShare this URL with the user for a visual portfolio overview.`;
}
async function handleListAccounts() {
    const [accounts, summary] = await Promise.all([api('/accounts'), api('/accounts/summary')]);
    const sumMap = new Map((summary ?? []).map((s) => [s.account_id, s]));
    const lines = ['## Connected Accounts'];
    for (const acc of accounts ?? []) {
        const s = sumMap.get(acc.id);
        const value = s ? `  ¥${fmtCny(s.total_cny)}` : '';
        const flags = [acc.enabled ? '✅' : '⏸', acc.configured ? '🔑' : '⚠️ no credentials'].join(' ');
        lines.push(`- **${acc.name}** \`${acc.id}\`  ${flags}${value}  \`${acc.type}\``);
    }
    return lines.join('\n');
}
async function handleGetAccountAssets(args) {
    const data = await api(`/accounts/${args.account_id}/assets`);
    const lines = [
        `## ${args.account_id} Assets`,
        `Total: ¥${fmtCny(data.total_cny)}  Updated: ${data.updated_at?.slice(0, 16) ?? '—'}`,
        '',
        '| Asset | Amount | CNY |',
        '|-------|--------|-----|',
        ...(data.assets ?? []).map((a) => `| ${a.asset_id} | ${a.amount} | ¥${fmtCny(a.value_cny ?? 0)} |`),
    ];
    return lines.join('\n');
}
async function handleRefreshAccount(args) {
    const data = await api(`/accounts/${args.account_id}/refresh`, { method: 'POST' });
    return `✅ Refreshed \`${args.account_id}\`\nTotal: ¥${fmtCny(data.total_cny)}  Updated: ${data.updated_at}`;
}
async function handleGetAssetPrice(args) {
    const id = String(args.asset_id).toUpperCase();
    const d = await api(`/pricing/${id}`);
    return `**${id}** — $${d.price_usd?.toLocaleString('en-US', { maximumFractionDigits: 6 })} / ¥${d.price_cny?.toLocaleString('zh-CN', { maximumFractionDigits: 4 })}`;
}
async function handleGetPortfolioTrend(args) {
    const days = Math.max(1, Math.min(365, Number(args.days ?? 30)));
    const data = await api(`/trend/portfolio?days=${days}`);
    const pts = data.points ?? [];
    if (!pts.length)
        return 'No trend data yet.';
    const first = pts[0], last = pts[pts.length - 1];
    const pct = first.total_cny > 0 ? ((last.total_cny - first.total_cny) / first.total_cny * 100).toFixed(2) : 'N/A';
    const lines = [
        `## Portfolio Trend (${days}d, ${pts.length} points)`,
        `Start: ¥${fmtCny(first.total_cny)} (${first.ts.slice(0, 10)})  →  Latest: ¥${fmtCny(last.total_cny)} (${last.ts.slice(0, 10)})`,
        `Change: ${pct}%`,
        '',
        '| Time | CNY | USD |',
        '|------|-----|-----|',
        ...pts.slice(-10).map((p) => `| ${p.ts.slice(0, 16).replace('T', ' ')} | ¥${fmtCny(p.total_cny)} | $${fmtUsd(p.total_usd)} |`),
    ];
    return lines.join('\n');
}
async function handleGetSnapshots(args) {
    const limit = Math.min(90, Math.max(1, Number(args.limit ?? 30)));
    const data = await api(`/snapshots?limit=${limit}`);
    if (!data?.length)
        return 'No snapshots yet.';
    const lines = [
        `## Daily Snapshots (${data.length})`,
        '| Date | Total CNY | Change |',
        '|------|-----------|--------|',
        ...data.map((s) => `| ${s.date ?? s.snapshot_at?.slice(0, 10)} | ¥${fmtCny(s.total_cny ?? s.total ?? 0)} | ${(s.change_pct ?? s.change ?? 0) >= 0 ? '+' : ''}${(s.change_pct ?? s.change ?? 0).toFixed(2)}% |`),
    ];
    return lines.join('\n');
}
async function handleListManualAssets() {
    const data = await api('/manual-assets');
    if (!data?.length)
        return 'No manual assets.';
    const lines = [
        '## Manual Assets',
        '| ID | Asset | Amount | Note |',
        '|----|-------|--------|------|',
        ...data.map((a) => `| \`${a.id}\` | ${a.asset_id} | ${a.amount} | ${a.note ?? ''} |`),
    ];
    return lines.join('\n');
}
async function handleAddManualAsset(args) {
    const accounts = await api('/accounts');
    const manual = accounts?.find((a) => a.type === 'manual');
    if (!manual)
        return '❌ No manual assets account found. Please create one in the app first.';
    const body = {
        account_id: manual.id,
        asset_id: String(args.asset_id).toUpperCase(),
        amount: Number(args.amount),
        note: String(args.note ?? ''),
    };
    if (args.value_usd != null)
        body.value_usd = Number(args.value_usd);
    const result = await api('/manual-assets', { method: 'POST', body: JSON.stringify(body) });
    return `✅ Added manual asset \`${body.asset_id}\` × ${body.amount}  (id: \`${result.id}\`)`;
}
async function handleUpdateManualAsset(args) {
    const updates = {};
    if (args.asset_id != null)
        updates.asset_id = String(args.asset_id).toUpperCase();
    if (args.amount != null)
        updates.amount = Number(args.amount);
    if (args.note != null)
        updates.note = String(args.note);
    if (args.value_usd != null)
        updates.value_usd = Number(args.value_usd);
    await api(`/manual-assets/${args.id}`, { method: 'PATCH', body: JSON.stringify(updates) });
    return `✅ Updated asset \`${args.id}\``;
}
async function handleDeleteManualAsset(args) {
    await api(`/manual-assets/${args.id}`, { method: 'DELETE' });
    return `✅ Deleted asset \`${args.id}\``;
}
async function handleAddAccount(args) {
    const result = await api('/accounts', {
        method: 'POST',
        body: JSON.stringify({ source_type: args.source_type, name: args.name, config: {} }),
    });
    return `✅ Account created: **${args.name}** (id: \`${result.id}\`)\nNext: call \`save_account_credentials\` with this id to add your API key.`;
}
async function handleSaveCredentials(args) {
    const body = {
        api_key: String(args.api_key),
        secret: String(args.secret),
    };
    if (args.passphrase)
        body.passphrase = String(args.passphrase);
    await api(`/accounts/${args.account_id}/credentials`, { method: 'POST', body: JSON.stringify(body) });
    return `✅ Credentials saved for account \`${args.account_id}\`\nCall \`refresh_account\` to verify and load live balances.`;
}
// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmtCny(v) { return Number(v ?? 0).toLocaleString('zh-CN', { maximumFractionDigits: 2 }); }
function fmtUsd(v) { return Number(v ?? 0).toLocaleString('en-US', { maximumFractionDigits: 2 }); }
// ─── Server ───────────────────────────────────────────────────────────────────
const server = new Server({ name: 'nexus-assets-mcp', version: '0.2.0' }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));
server.setRequestHandler(CallToolRequestSchema, async (req) => {
    const { name, arguments: args = {} } = req.params;
    try {
        let text;
        switch (name) {
            case 'get_portfolio':
                text = await handleGetPortfolio(args);
                break;
            case 'get_dashboard_screenshot':
                text = await handleGetDashboardScreenshot();
                break;
            case 'list_accounts':
                text = await handleListAccounts();
                break;
            case 'get_account_assets':
                text = await handleGetAccountAssets(args);
                break;
            case 'refresh_account':
                text = await handleRefreshAccount(args);
                break;
            case 'get_asset_price':
                text = await handleGetAssetPrice(args);
                break;
            case 'get_portfolio_trend':
                text = await handleGetPortfolioTrend(args);
                break;
            case 'get_snapshots':
                text = await handleGetSnapshots(args);
                break;
            case 'list_manual_assets':
                text = await handleListManualAssets();
                break;
            case 'add_manual_asset':
                text = await handleAddManualAsset(args);
                break;
            case 'update_manual_asset':
                text = await handleUpdateManualAsset(args);
                break;
            case 'delete_manual_asset':
                text = await handleDeleteManualAsset(args);
                break;
            case 'add_account':
                text = await handleAddAccount(args);
                break;
            case 'save_account_credentials':
                text = await handleSaveCredentials(args);
                break;
            default:
                return { content: [{ type: 'text', text: `Unknown tool: ${name}` }], isError: true };
        }
        return { content: [{ type: 'text', text }] };
    }
    catch (e) {
        return { content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
    }
});
await server.connect(new StdioServerTransport());
process.stderr.write(`[nexus-assets-mcp] v0.2.0 started — ${API_URL}\n`);
