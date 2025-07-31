import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { evaluateRules } from '../../lib/ruleEngine';

const questions = [
  {
    key: 'exercise',
    question: 'How often do you exercise?',
    options: ['regularly', 'sometimes', 'none'],
  },
  {
    key: 'sleep',
    question: 'How do you rate your sleep?',
    options: ['good', 'ok', 'poor'],
  },
  {
    key: 'condition',
    question: 'Do you have any chronic conditions?',
    options: ['yes', 'no'],
  },
];

export default function Questionnaire() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  const current = questions[step];
  const progress = `${step + 1} / ${questions.length}`;

  const handleAnswer = (option) => {
    const newData = { ...answers, [current.key]: option };
    setAnswers(newData);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      const context = evaluateRules(newData);
      localStorage.setItem('reportContext', JSON.stringify(context));
      navigate(`/report?level=${context.level || 'L1'}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center gap-6">
      <h2 className="text-2xl font-semibold mb-1">{current.question}</h2>
      <div className="text-sm text-text-muted">Question {progress}</div>
      <div className="flex flex-col gap-4">
        {current.options.map((opt) => (
          <button key={opt} className="btn" onClick={() => handleAnswer(opt)}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
