import express from 'express';

export function createCampaignRouter({ dialer, didManager, didSelector }) {
  const router = express.Router();

  router.post('/:campaignId/config', (req, res) => {
    try {
      const config = dialer.configureCampaign(req.params.campaignId, {
        dialingMode: req.body?.dialingMode ?? 'preview',
        maxConcurrent: Math.max(1, Number(req.body?.maxConcurrent ?? 1))
      });
      res.json(config);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.post('/:campaignId/leads', (req, res) => {
    try {
      const count = dialer.addLeads(req.params.campaignId, Array.isArray(req.body?.leads) ? req.body.leads : []);
      res.status(201).json({ campaignId: req.params.campaignId, leadCount: count });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.get('/:campaignId/dids', (req, res) => {
    res.json(didManager.availableForCampaign(req.params.campaignId));
  });

  router.post('/:campaignId/dial-next', async (req, res) => {
    try {
      const did = req.body?.didId ? didManager.dids?.get(req.body.didId) : didSelector.next(req.params.campaignId);
      const result = await dialer.dialNext(req.params.campaignId, {
        agentId: req.body?.agentId,
        callerId: did?.phoneNumber ?? req.body?.callerId
      });
      res.status(result.status === 'originated' ? 201 : 200).json({ ...result, did: did ?? null });
    } catch (error) {
      res.status(502).json({ error: error.message });
    }
  });

  return router;
}
