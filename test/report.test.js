const test = require('node:test');
const assert = require('assert');
const { generateReport } = require('../report');

test('level 1 report contains basic sections', () => {
  const user = { age: 30, sex: 'male', goal: 'Build muscle', activity: 'moderate', sleep: '7-8h', diet: 'Mediterranean' };
  const r = generateReport(user, 1);
  assert.match(r, /Level 1/);
  assert.match(r, /Personal Summary/);
  assert.match(r, /One Major Opportunity/);
});

test('level 3 report includes advanced sections', () => {
  const user = { age: 40, sex: 'female', goal: 'Improve sleep', activity: 'light', sleep: '5-6h', diet: 'Standard' };
  const r = generateReport(user, 3);
  assert.match(r, /In-Depth Data Review/);
  assert.match(r, /Continuous Feedback/);
});
