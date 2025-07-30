function generateReport(user, level = 1) {
  const sections = [];
  sections.push(`# Level ${level} Wellness Report`);

  // Level 1 core sections
  sections.push('## Personal Summary');
  sections.push(`You are a ${user.age}-year-old ${user.sex}. Your primary goal is ${user.goal}.`);
  sections.push('## Lifestyle Assessment');
  sections.push(`Activity Level: ${user.activity}`);
  sections.push(`Sleep: ${user.sleep}`);
  sections.push(`Diet: ${user.diet}`);
  sections.push('## One Major Opportunity');
  sections.push('Identify a single area for improvement with 2-3 evidence-backed tips.');
  sections.push('## Motivational Reflection');
  sections.push('Focus on small daily habits for long-term results.');

  if (level >= 2) {
    sections.push('## Expanded Personal Profile');
    sections.push('Detailed health metrics, comparison with normative data, and medical background.');
    sections.push('## Lifestyle & Behavioral Insights');
    sections.push('Suggested activity routines, sleep hygiene practices, and personalized macronutrient ranges.');
    sections.push('## Mental Wellness & Psychology');
    sections.push('Stress management strategies and motivational frameworks.');
    sections.push('## Philosophical Perspective');
    sections.push('Discussion on well-being from a philosophical lens to align health goals with life purpose.');
    sections.push('## Action Plan');
    sections.push('Create two or three SMART goals with both short- and long-term strategies.');
  }

  if (level >= 3) {
    sections.push('## In-Depth Data Review');
    sections.push('Comprehensive metrics with periodic benchmarks and risk projections.');
    sections.push('## Optimized Training & Activity Plan');
    sections.push('Weekly schedule outlining cardio, strength, mobility, and recovery days.');
    sections.push('## Advanced Nutrition Strategy');
    sections.push('Macronutrient timing, supplementation guidance, and meal planning tips.');
    sections.push('## Psychological & Philosophical Mastery');
    sections.push('Mindset training, behavioral change science, and daily journaling advice.');
    sections.push('## Lifestyle Synchronization');
    sections.push('Sleep optimization, stress management techniques, and community involvement.');
    sections.push('## Continuous Feedback & Re-Evaluation');
    sections.push('Recommendations for regular check-ins and adapting the plan over time.');
  }

  return sections.join('\n\n');
}

module.exports = { generateReport };
