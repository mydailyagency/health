import rules from './rules.json';

export function evaluateRules(userData) {
  const context = { ...userData, modules: [], top_actions: [] };
  const sorted = [...rules].sort((a, b) => (b.priority || 0) - (a.priority || 0));
  for (const rule of sorted) {
    const when = rule.when || {};
    const match = Object.entries(when).every(([k, v]) => userData[k] === v);
    if (match) {
      const then = rule.then || {};
      if (then.set) {
        Object.entries(then.set).forEach(([k, v]) => {
          context[k] = v;
        });
      }
      if (then.add_modules) {
        context.modules.push(...then.add_modules);
      }
      if (then.add_top_actions) {
        context.top_actions.push(...then.add_top_actions);
      }
    }
  }
  return context;
}
