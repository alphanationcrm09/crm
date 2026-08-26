# Alpha Nation Call Center telephony

This directory contains the development Asterisk container and safe configuration examples.

Provider-neutral design:

VoIP/SIP provider -> SIP trunk -> Asterisk -> Call Center server -> Agent browser

Before production:

1. Choose a SIP provider and purchase DIDs.
2. Create a SIP trunk with the provider.
3. Replace example Asterisk configuration with provider-specific PJSIP transport, endpoint, authentication, and dialplan configuration.
4. Configure ARI credentials using server-side secrets. Do not commit real credentials.
5. Restrict ARI and SIP management ports with firewall rules. Do not expose ARI publicly without authentication and network controls.
6. Configure recording storage and retention.
7. Run inbound, outbound, transfer, recording, and failure tests with test numbers before production use.

The repository does not contain real carrier credentials or real customer numbers.
