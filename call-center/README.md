# Alpha Nation Call Center

Separate call-center application layer for Alpha Nation. It is intentionally isolated from the existing CRM while designed to integrate with it through APIs.

## Architecture

- Frontend: web agent and supervisor console
- Backend: Node.js service
- Realtime: WebSocket events
- Telephony: Asterisk
- Voice: external SIP/VoIP provider
- Data: Supabase/PostgreSQL
- CRM: existing Alpha Nation CRM

## Initial scope

- Agent login and presence
- Campaigns and lead queues
- DID management
- Auto-dialer control plane
- Call sessions and timers
- Recording metadata
- Blind/warm transfer workflow
- Supervisor listen/whisper/barge controls
- Pause codes
- Call dispositions
- Real-time wallboard
- CRM synchronization

## Important

The browser dashboard in this first foundation is a control-plane prototype. It does not place real calls by itself. Real calling requires a configured Asterisk server and SIP/VoIP provider.

Never put SIP passwords, API keys, Supabase service-role keys, or provider secrets in frontend code.
