export class LeadQueue {
  constructor() {
    this.campaigns = new Map();
  }

  configureCampaign(campaignId, config = {}) {
    const current = this.campaigns.get(campaignId) ?? {
      campaignId,
      leads: [],
      inFlight: new Set(),
      maxConcurrent: 1,
      dialingMode: 'preview'
    };
    const next = { ...current, ...config, inFlight: current.inFlight };
    this.campaigns.set(campaignId, next);
    return next;
  }

  addLeads(campaignId, leads) {
    const campaign = this.campaigns.get(campaignId) ?? this.configureCampaign(campaignId);
    for (const lead of leads) {
      if (!lead?.id || !lead?.phone) continue;
      if (!campaign.leads.some(item => item.id === lead.id)) campaign.leads.push({ ...lead, status: lead.status ?? 'ready' });
    }
    return campaign.leads.length;
  }

  next(campaignId) {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return null;
    if (campaign.inFlight.size >= campaign.maxConcurrent) return null;
    const lead = campaign.leads.find(item => item.status === 'ready');
    if (!lead) return null;
    lead.status = 'dialing';
    campaign.inFlight.add(lead.id);
    return lead;
  }

  complete(campaignId, leadId, disposition) {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return false;
    const lead = campaign.leads.find(item => item.id === leadId);
    if (!lead) return false;
    lead.status = disposition === 'callback' ? 'callback' : 'completed';
    lead.disposition = disposition;
    campaign.inFlight.delete(leadId);
    return true;
  }

  release(campaignId, leadId) {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return false;
    const lead = campaign.leads.find(item => item.id === leadId);
    if (!lead) return false;
    lead.status = 'ready';
    campaign.inFlight.delete(leadId);
    return true;
  }
}
