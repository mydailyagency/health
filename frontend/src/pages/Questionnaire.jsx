import { useState, useMemo } from 'react';
import questions from '../../rules.json';

function shouldShow(question, answers) {
  if (!question.show_if) return true;
  return answers[question.show_if.id] === question.show_if.value;
}

export default function Questionnaire() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const visibleQuestions = useMemo(
    () => questions.filter(q => shouldShow(q, answers)),
    [answers]
  );

  const current = visibleQuestions[step];

  const handleChange = value => {
    setAnswers(prev => ({ ...prev, [current.id]: value }));
  };

  const next = () => {
    if (typeof answers[current.id] === 'undefined' || answers[current.id] === '') return;
    setStep(prev => prev + 1);
  };

  const back = () => setStep(prev => (prev > 0 ? prev - 1 : 0));

  if (!current) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-semibold mb-2">Thanks! Your answers were submitted.</h1>
      </div>
    );
  }

  let input = null;
  const value = answers[current.id] ?? '';

  if (current.type === 'yesno') {
    input = (
      <div className="space-x-4">
        <button
          onClick={() => handleChange('yes')}
          className={`btn ${value === 'yes' ? 'bg-primary text-white' : 'bg-gray-200'}`}
        >
          Yes
        </button>
        <button
          onClick={() => handleChange('no')}
          className={`btn ${value === 'no' ? 'bg-primary text-white' : 'bg-gray-200'}`}
        >
          No
        </button>
      </div>
    );
  } else if (current.type === 'choice') {
    input = (
      <select
        className="mt-4 p-2 border rounded"
        value={value}
        onChange={e => handleChange(e.target.value)}
      >
        <option value="" disabled>
          Select an option
        </option>
        {current.options.map(opt => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  } else if (current.type === 'number') {
    input = (
      <input
        type="number"
        className="mt-4 p-2 border rounded w-32 text-center"
        value={value}
        onChange={e => handleChange(e.target.value)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center space-y-6">
      <div className="text-sm text-text-muted">Question {step + 1} of {visibleQuestions.length}</div>
      <h1 className="text-xl font-semibold">{current.text}</h1>
      {input}
      <div className="space-x-4 mt-4">
        {step > 0 && (
          <button onClick={back} className="btn bg-gray-200">
            Back
          </button>
        )}
        <button onClick={next} className="btn bg-primary text-white">
          {step === visibleQuestions.length - 1 ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  );
}
