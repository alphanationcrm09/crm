/**
 * Asterisk ARI adapter boundary.
 *
 * This module deliberately does not place real calls until ARI credentials and
 * an explicitly configured Stasis application are supplied. It provides the
 * call-center service with a small provider-neutral interface.
 */

export class AsteriskAdapter {
  constructor({ ariUrl, username, password, appName = 'alpha-nation-call-center' } = {}) {
    this.ariUrl = ariUrl;
    this.username = username;
    this.password = password;
    this.appName = appName;
  }

  get configured() {
    return Boolean(this.ariUrl && this.username && this.password);
  }

  assertConfigured() {
    if (!this.configured) throw new Error('Asterisk ARI is not configured');
  }

  async originate({ endpoint, callerId, variables = {} }) {
    this.assertConfigured();
    throw new Error('Asterisk originate transport is not enabled yet; configure and test ARI before production calling.');
  }

  async answer(channelId) {
    this.assertConfigured();
    throw new Error(`Asterisk answer not enabled for ${channelId}`);
  }

  async hangup(channelId) {
    this.assertConfigured();
    throw new Error(`Asterisk hangup not enabled for ${channelId}`);
  }

  async startRecording(channelId, name) {
    this.assertConfigured();
    throw new Error(`Asterisk recording not enabled for ${channelId}/${name}`);
  }

  async transfer(channelId, destination) {
    this.assertConfigured();
    throw new Error(`Asterisk transfer not enabled for ${channelId}/${destination}`);
  }

  async monitor(channelId, mode) {
    this.assertConfigured();
    if (!['listen', 'whisper', 'barge'].includes(mode)) throw new Error('Invalid monitoring mode');
    throw new Error(`Asterisk monitoring not enabled for ${channelId}/${mode}`);
  }
}
