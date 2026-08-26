import { LeadQueue } from './queue.js';
import { isValidDisposition } from './dispositions.js';

export class DialerService {
  constructor({ telephony, onEvent = () => {} } = {}) {
    this.telephony = telephony;
    this.onEvent = onEvent;
    this.queue = new LeadQueue();
  }

  configureCampaign(campaignId, config) {
    return this.queue.configureCampaign(campaignId, config);
  }

  addLeads(campaignId, leads) {
    return this.queue.addLeads(campaignId, leads);
  }

  async dialNext(campaignId, { agentId, callerId } = {}) {
    const lead = this.queue.next(campaignId);
    if (!lead) return { status: 'no_lead' };

    if (!this.telephony?.originate) {
      this.queue.release(campaignId, lead.id);
      return { status: 'telephony_unavailable', lead };
    }

    try {
      const call = await this.telephony.originate({ endpoint: lead.phone, callerId, variables: { leadId: lead.id, campaignId, agentId } });
      this.onEvent({ type: 'dialer.originated', data: { lead, agentId, campaignId, call } });
      return { status: 'originated', lead, call };
    } catch (error) {
      this.queue.release(campaignId, lead.id);
      this.onEvent({ type: 'dialer.error', data: { lead, campaignId, error: error.message } });
      throw error;
    }
  }

  completeLead(campaignId, leadId, disposition) {
    if (!isValidDisposition(disposition)) throw new Error('Invalid disposition');
    return this.queue.complete(campaignId, leadId, disposition);
  }
}
