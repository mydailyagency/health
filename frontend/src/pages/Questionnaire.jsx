import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import questions from '../../rules.json';

function evaluateShowIf(exp, answers) {
  if (!exp) return true;
  // Q23 includes 'htn'
  const includeMatch = exp.match(/(Q\d+) includes '([^']+)'/);
  if (includeMatch) {
    const val = answers[includeMatch[1]];
    return Array.isArray(val) ? val.includes(includeMatch[2]) : false;
  }
  const inMatch = exp.match(/(Q\d+) in \[([^\]]+)\]/);
  if (inMatch) {
    const val = answers[inMatch[1]];
    const opts = inMatch[2].split(',').map(s => s.trim().replace(/^'|'$/g,''));
    return opts.includes(val);
  }
  const eqMatch = exp.match(/(Q\d+) == (.+)/);
  if (eqMatch) {
    const val = answers[eqMatch[1]];
    const rhs = eqMatch[2].trim();
    if (rhs === 'true') return val === true;
    if (rhs === 'false') return val === false;
    return String(val) === rhs.replace(/^'|'$/g,'');
  }
  return true;
}

function setNested(obj, path, value) {
  const parts = path.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!cur[parts[i]]) cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
}

export default function Questionnaire() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('answers')) || {};
    } catch {
      return {};
    }
  });
  const [step, setStep] = useState(0);

  useEffect(() => {
    localStorage.setItem('answers', JSON.stringify(answers));
  }, [answers]);

  const sections = useMemo(() => {
    const groups = [];
    questions.forEach(q => {
      let g = groups.find(g => g.name === q.section);
      if (!g) {
        g = { name: q.section, questions: [] };
        groups.push(g);
      }
      g.questions.push(q);
    });
    return groups;
  }, []);

  const visibleQuestions = section =>
    section.questions.filter(q => evaluateShowIf(q.show_if, answers));

  const isSectionValid = section => {
    const qs = visibleQuestions(section);
    return qs.every(q => {
      if (!q.required) return true;
      const val = answers[q.id];
      if (typeof val === 'undefined' || val === '' || (Array.isArray(val) && val.length === 0))
        return false;
      return true;
    });
  };

  const currentSection = sections[step];
  const total = sections.length;
  if (!currentSection) return null;

  const handleAnswer = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const next = () => {
    if (!isSectionValid(currentSection)) return;
    if (step === total - 1) {
      const data = {};
      questions.forEach(q => {
        const ans = answers[q.id];
        if (typeof ans === 'undefined') return;
        if (Array.isArray(q.maps_to)) {
          q.maps_to.forEach((p, idx) => setNested(data, p, ans[idx]));
        } else {
          setNested(data, q.maps_to, ans);
        }
      });
      localStorage.setItem('userData', JSON.stringify(data));
      navigate('/report?level=L1');
    } else {
      setStep(s => s + 1);
    }
  };

  const back = () => setStep(s => (s > 0 ? s - 1 : 0));

  const renderInput = (q) => {
    const val = answers[q.id];
    switch (q.input_type) {
      case 'yes_no':
        return (
          <div className="space-x-2 mt-2">
            {['yes', 'no'].map(opt => (
              <button
                key={opt}
                onClick={() => handleAnswer(q.id, opt === 'yes')}
                className={`btn ${val === (opt === 'yes') ? 'bg-accent text-white' : 'bg-gray-200'}`}
              >
                {opt === 'yes' ? 'Yes' : 'No'}
              </button>
            ))}
          </div>
        );
      case 'single_choice': {
        const opts = q.options_dynamic_from ? answers[q.options_dynamic_from] || [] : q.options;
        return (
          <div className="flex flex-wrap gap-2 mt-2">
            {opts.map(opt => (
              <button
                key={opt}
                onClick={() => handleAnswer(q.id, opt)}
                className={`btn ${val === opt ? 'bg-accent text-white' : 'bg-gray-200'}`}
              >
                {opt}
              </button>
            ))}
          </div>
        );
      }
      case 'multi_choice':
        return (
          <div className="flex flex-wrap gap-2 mt-2">
            {q.options.map(opt => {
              const selected = Array.isArray(val) && val.includes(opt);
              const disabled = q.max_choices && !selected && Array.isArray(val) && val.length >= q.max_choices;
              return (
                <button
                  key={opt}
                  disabled={disabled}
                  onClick={() => {
                    let newVal = Array.isArray(val) ? [...val] : [];
                    if (selected) newVal = newVal.filter(o => o !== opt);
                    else newVal.push(opt);
                    handleAnswer(q.id, newVal);
                  }}
                  className={`btn ${selected ? 'bg-accent text-white' : 'bg-gray-200'} ${disabled ? 'opacity-50' : ''}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        );
      case 'number_cm':
      case 'number_kg':
      case 'number_hours':
      case 'number':
        return (
          <input
            type="number"
            min={q.min}
            max={q.max}
            step={q.step || 'any'}
            placeholder={q.placeholder}
            className="mt-2 p-2 border rounded w-40 text-center"
            value={val || ''}
            onChange={e => handleAnswer(q.id, e.target.value ? Number(e.target.value) : '')}
          />
        );
      case 'number_pair': {
        const [sbp, dbp] = Array.isArray(val) ? val : ['', ''];
        return (
          <div className="flex gap-2 mt-2">
            <input
              type="number"
              className="p-2 border rounded w-20 text-center"
              placeholder="SBP"
              value={sbp}
              onChange={e => handleAnswer(q.id, [e.target.value ? Number(e.target.value) : '', dbp])}
            />
            <input
              type="number"
              className="p-2 border rounded w-20 text-center"
              placeholder="DBP"
              value={dbp}
              onChange={e => handleAnswer(q.id, [sbp, e.target.value ? Number(e.target.value) : ''])}
            />
          </div>
        );
      }
      case 'date_or_number': {
        const [dob, age] = Array.isArray(val) ? val : ['', ''];
        return (
          <div className="flex gap-2 mt-2">
            <input
              type="date"
              className="p-2 border rounded"
              value={dob}
              onChange={e => handleAnswer(q.id, [e.target.value, age])}
            />
            <input
              type="number"
              placeholder="Age"
              className="p-2 border rounded w-24"
              value={age}
              onChange={e => handleAnswer(q.id, [dob, e.target.value ? Number(e.target.value) : ''])}
            />
          </div>
        );
      }
      case 'scale_0_10':
        return (
          <div className="mt-4 flex flex-col items-center">
            <input
              type="range"
              min="0"
              max="10"
              value={val || 0}
              onChange={e => handleAnswer(q.id, Number(e.target.value))}
              className="w-64"
            />
            <div className="mt-2">{val ?? 0}</div>
          </div>
        );
      case 'phq2_scale':
      case 'gad2_scale':
        const opts4 = ['Not at all','Several days','More than half the days','Nearly every day'];
        return (
          <div className="flex flex-col mt-2 gap-2">
            {opts4.map((opt,i) => (
              <button
                key={i}
                onClick={() => handleAnswer(q.id, i)}
                className={`btn text-left ${val===i ? 'bg-accent text-white' : 'bg-gray-200'}`}
              >
                {opt}
              </button>
            ))}
          </div>
        );
      case 'text':
        return (
          <textarea
            rows="3"
            className="mt-2 p-2 border rounded w-full"
            placeholder={q.placeholder}
            value={val || ''}
            onChange={e => handleAnswer(q.id, e.target.value)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 space-y-6">
      <h1 className="text-3xl font-bold">MyDailyAgency Health</h1>
      <div className="w-full max-w-2xl">
        <div className="mb-4 text-sm text-text-muted">Section {step + 1} of {total}</div>
        <div className="w-full bg-gray-200 h-2 rounded mb-6">
          <div className="bg-primary h-2 rounded" style={{width:`${((step)/total)*100}%`}} />
        </div>
        <h2 className="text-xl font-semibold mb-4">{currentSection.name}</h2>
        {visibleQuestions(currentSection).map(q => (
          <div key={q.id} className="mb-6">
            <div className="font-medium">{q.text}</div>
            {q.help_text && <div className="text-sm text-text-muted">{q.help_text}</div>}
            {renderInput(q)}
          </div>
        ))}
        <div className="flex justify-between mt-4">
          {step > 0 ? (
            <button onClick={back} className="btn bg-gray-200">Back</button>
          ) : <span />}
          <button
            onClick={next}
            className={`btn ${isSectionValid(currentSection) ? 'bg-primary text-white' : 'bg-gray-300 cursor-not-allowed'}`}
            disabled={!isSectionValid(currentSection)}
          >
            {step === total - 1 ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
