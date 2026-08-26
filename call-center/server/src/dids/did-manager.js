export const DID_STATUSES = Object.freeze(['active', 'paused', 'retired']);

export class DidManager {
  constructor() {
    this.dids = new Map();
  }

  upsert(did) {
    if (!did?.id || !did?.phoneNumber) throw new Error('DID id and phoneNumber are required');
    const current = this.dids.get(did.id) ?? {};
    const next = { ...current, ...did, status: did.status ?? current.status ?? 'active' };
    if (!DID_STATUSES.includes(next.status)) throw new Error('Invalid DID status');
    this.dids.set(next.id, next);
    return next;
  }

  assign(id, campaignId) {
    const did = this.dids.get(id);
    if (!did) throw new Error('DID not found');
    did.campaignId = campaignId;
    return did;
  }

  availableForCampaign(campaignId) {
    return [...this.dids.values()].filter(d => d.status === 'active' && (!d.campaignId || d.campaignId === campaignId));
  }

  list() {
    return [...this.dids.values()];
  }
}
