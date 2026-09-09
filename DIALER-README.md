# Alpha Nation Dialer

The Dialer is a separate web application from the Alpha Nation CRM and uses the same Supabase project.

## Current architecture

- Frontend: static HTML/CSS/JavaScript, deployable on GitHub Pages
- Authentication: Supabase Auth
- Operations backend: existing Alpha Nation Dialer Edge Functions
- Data: shared Alpha Nation Supabase database
- Browser calling: WebRTC/SIP integration seam is prepared for a telephony provider
- Initial rollout: 2 agents
- Designed capacity: 100 agents

## Entry points

- `dialer-login.html` = standalone authentication screen
- `dialer.html` = agent Dialer application
- `dialer/index.html` = clean `/dialer/` entry route

## Telephony status

The current backend explicitly reports whether PSTN/SIP telephony is connected. Do not treat a created call record as a real phone call. A provider must be connected before production calling.

## Recommended integration direction

Use a browser WebRTC/SIP client with a provider that supports secure WebSocket SIP. The existing Dialer backend remains the source of truth for leads, calls, events, qualification, callbacks, transfers and dispositions.

## Rollout

1. Deploy the Dialer frontend.
2. Create/assign two test agent accounts.
3. Verify login, campaign access, lead locking, call records, events, qualification, callback, transfer records and dispositions.
4. Purchase the telephony provider and US numbers.
5. Connect SIP/WebRTC credentials and caller IDs.
6. Test real calls with two agents.
7. Expand to five agents, then scale toward 100.
