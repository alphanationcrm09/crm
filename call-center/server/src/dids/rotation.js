export class DidSelector {
  constructor(manager) {
    this.manager = manager;
    this.cursor = new Map();
  }

  next(campaignId) {
    const dids = this.manager.availableForCampaign(campaignId);
    if (!dids.length) return null;
    const index = this.cursor.get(campaignId) ?? 0;
    const selected = dids[index % dids.length];
    this.cursor.set(campaignId, (index + 1) % dids.length);
    return selected;
  }
}
