import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-2">MyDailyAgency Health</h1>
      <p className="text-lg text-text-muted mb-8">Your personalized health & wellness planner</p>
      <Link to="/questionnaire" className="btn">
        Start Assessment
      </Link>
    </div>
  );
}
