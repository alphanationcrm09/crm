# Alpha Nation Dialer

Standalone dialer application foundation.

## Architecture

- GitHub Pages hosts the frontend.
- Supabase Auth handles identity and sessions.
- Alpha Nation Supabase Edge Functions handle protected dialer operations.
- Telephony is an external SIP/WebRTC provider and is intentionally not hard-coded.

## Current rollout

The application is designed for up to 100 agents while allowing only 2-5 active agents during the pilot.

## Telephony seam

The browser phone must receive short-lived SIP/WebRTC credentials from a trusted backend. Provider secrets must never be placed in GitHub Pages frontend code.

## Open-source reference

Browser Phone demonstrates a WebRTC SIP browser client for Asterisk. The Alpha Nation implementation should reuse concepts/components where licensing and architecture fit rather than copying an entire PBX application into the CRM.
