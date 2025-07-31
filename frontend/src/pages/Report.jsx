import { useLocation } from 'react-router-dom';

export default function Report() {
  const { search } = useLocation();
  const level = new URLSearchParams(search).get('level');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 space-y-4">
      <h1 className="text-3xl font-bold">MyDailyAgency Health</h1>
      <p className="text-lg">Report placeholder - level {level}</p>
    </div>
  );
}
