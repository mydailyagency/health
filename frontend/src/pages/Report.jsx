import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Report() {
  const [context, setContext] = useState({ top_actions: [] });
  const location = useLocation();
  const level = new URLSearchParams(location.search).get('level');

  useEffect(() => {
    const saved = localStorage.getItem('reportContext');
    if (saved) {
      setContext(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="min-h-screen p-6 flex flex-col items-center gap-6">
      <h1 className="text-3xl font-bold">Thank you!</h1>
      {level && (
        <p className="text-text-muted">Your recommended level: {level}</p>
      )}
      <p className="text-text-muted">Here are your top actions:</p>
      <div className="grid gap-4 w-full max-w-xl">
        {context.top_actions.slice(0, 5).map((a, idx) => (
          <div key={idx} className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold text-lg mb-1">{a.title}</h3>
            <p className="text-text-muted text-sm">{a.description}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-6">
        <button className="btn" onClick={() => window.print()}>
          Download PDF
        </button>
        <Link to="/questionnaire" className="btn bg-accent hover:bg-emerald-600">
          Go back to Questionnaire
        </Link>
      </div>
    </div>
  );
}
