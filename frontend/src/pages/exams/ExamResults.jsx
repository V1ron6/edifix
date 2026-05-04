import { useLocation } from 'react-router-dom';

export default function ExamResults() {
  const location = useLocation();
  const result = location.state?.result || null;

  if (!result) {
    return <p className="page-main">No exam results available.</p>;
  }

  return (
    <main className="page-main">
      <section className="card">
        <h1>Exam Results</h1>
        <p>Score: {result.score}/{result.totalPoints}</p>
        <p>Status: {result.passed ? 'Pass' : 'Fail'}</p>
        <p>Time Taken: {result.result?.timeTaken || result.timeTaken || 0}s</p>
        <p>Correct Answers: {result.gradedAnswers?.filter((item) => item.isCorrect).length || 0}</p>
        <p>Incorrect Answers: {result.gradedAnswers?.filter((item) => !item.isCorrect).length || 0}</p>
      </section>
    </main>
  );
}
