# Telephony adapter

The call-center application owns call orchestration. Asterisk owns SIP/media primitives.

Adapter responsibilities:
- originate outbound calls
- receive inbound call events
- bridge agent and customer channels
- transfer and conference
- start/stop recording
- expose listen/whisper/barge operations to authorized supervisors
- emit normalized call events to the application

Provider credentials and SIP secrets must remain server-side.

The adapter is intentionally not enabled by default. Configure Asterisk ARI and the SIP provider before placing real calls.
