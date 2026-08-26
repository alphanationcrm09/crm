import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'node:http';
import { AsteriskAdapter } from './telephony/asterisk-adapter.js';
import { DialerService } from './dialer/dialer.js';
import { DidManager } from './dids/did-manager.js';
import { DidSelector } from './dids/rotation.js';
import { createCampaignRouter } from './api/campaigns.js';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/events' });
app.use(express.json());

const agents = new Map();
const calls = new Map();
const didManager = new DidManager();
const didSelector = new DidSelector(didManager);
const telephony = new AsteriskAdapter({
  ariUrl: process.env.ASTERISK_ARI_URL,
  username: process.env.ASTERISK_ARI_USERNAME,
  password: process.env.ASTERISK_ARI_PASSWORD
});

function broadcast(event) {
  const message = JSON.stringify(event);
  for (const socket of wss.clients) if (socket.readyState === 1) socket.send(message);
}

const dialer = new DialerService({ telephony, onEvent: broadcast });

app.get('/health', (_req, res) => res.json({ ok: true, service: 'alpha-nation-call-center', telephonyConfigured: telephony.configured, agents: agents.size, calls: calls.size }));
app.get('/api/agents', (_req, res) => res.json([...agents.values()]));
app.get('/api/calls', (_req, res) => res.json([...calls.values()]));
app.get('/api/dids', (_req, res) => res.json(didManager.list()));

app.post('/api/dids', (req, res) => {
  try { res.status(201).json(didManager.upsert(req.body)); }
  catch (error) { res.status(400).json({ error: error.message }); }
});

app.post('/api/agents/:id/status', (req, res) => {
  const id = req.params.id;
  const previous = agents.get(id) ?? { id, displayName: id, role: 'agent' };
  const allowed = ['offline', 'available', 'paused', 'ringing', 'on_call', 'hold', 'wrap_up'];
  if (!allowed.includes(req.body?.status)) return res.status(400).json({ error: 'Invalid agent status' });
  const agent = { ...previous, status: req.body.status, statusStartedAt: new Date().toISOString(), pauseCode: req.body?.pauseCode ?? null };
  agents.set(id, agent);
  broadcast({ type: 'agent.status', data: agent });
  res.json(agent);
});

app.post('/api/calls', (req, res) => {
  const id = req.body?.id ?? crypto.randomUUID();
  const call = { id, direction: req.body?.direction ?? 'outbound', state: 'initiated', agentId: req.body?.agentId ?? null, campaignId: req.body?.campaignId ?? null, didId: req.body?.didId ?? null, leadId: req.body?.leadId ?? null, startedAt: new Date().toISOString() };
  calls.set(id, call);
  broadcast({ type: 'call.created', data: call });
  res.status(201).json(call);
});

app.post('/api/calls/:id/events', (req, res) => {
  const call = calls.get(req.params.id);
  if (!call) return res.status(404).json({ error: 'Call not found' });
  const allowed = ['initiated', 'ringing', 'answered', 'hold', 'transferring', 'completed', 'failed', 'abandoned'];
  if (!allowed.includes(req.body?.state)) return res.status(400).json({ error: 'Invalid call state' });
  const updated = { ...call, state: req.body.state, updatedAt: new Date().toISOString() };
  if (req.body.state === 'answered') updated.answeredAt = updated.updatedAt;
  if (['completed', 'failed', 'abandoned'].includes(req.body.state)) updated.endedAt = updated.updatedAt;
  calls.set(call.id, updated);
  broadcast({ type: 'call.state', data: updated });
  res.json(updated);
});

app.use('/api/campaigns', createCampaignRouter({ dialer, didManager, didSelector }));

wss.on('connection', socket => socket.send(JSON.stringify({ type: 'snapshot', data: { agents: [...agents.values()], calls: [...calls.values()], dids: didManager.list() } })));

const port = Number(process.env.PORT || 8080);
server.listen(port, () => console.log(`Alpha Nation Call Center API listening on :${port}`));
