const test = require('node:test');
const assert = require('assert');
const { logMood, moodHistory } = require('../mood');

test('keeps only the last seven mood entries', () => {
  moodHistory.length = 0; // reset
  for (let i = 0; i < 8; i++) {
    const date = new Date(2024, 0, i + 1); // Jan 1..8
    logMood(i, date);
  }
  assert.strictEqual(moodHistory.length, 7);
});
