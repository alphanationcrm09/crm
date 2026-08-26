export const DISPOSITIONS = Object.freeze([
  'sale',
  'transfer',
  'callback',
  'not_interested',
  'no_answer',
  'busy',
  'voicemail',
  'wrong_number',
  'dnc',
  'failed'
]);

export function isValidDisposition(value) {
  return DISPOSITIONS.includes(value);
}
