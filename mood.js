const moodHistory = [];

function logMood(moodValue, date = new Date()) {
  const mood = parseInt(moodValue, 10);
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const existingIndex = moodHistory.findIndex(h => h.date === dateStr);
  if (existingIndex !== -1) {
    moodHistory[existingIndex].value = mood;
  } else {
    moodHistory.push({ date: dateStr, value: mood });
  }

  if (moodHistory.length > 7) {
    moodHistory.shift();
  }
}

module.exports = { logMood, moodHistory };
