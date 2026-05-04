import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ExamTimer from '../../components/exams/ExamTimer';
import QuestionCard from '../../components/exams/QuestionCard';
import Button from '../../components/shared/Button';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import Modal from '../../components/shared/Modal';
import { notifyError } from '../../components/shared/Toast';
import { api } from '../../utils/api';
import { unwrap } from '../../utils/response';

export default function ExamPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [startedAt, setStartedAt] = useState(null);
  const [exam, setExam] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    async function loadExam() {
      setLoading(true);
      try {
        const examsResponse = await api.get(`/api/exams/course/${courseId}`);
        const examList = unwrap(examsResponse, []);
        const firstExam = examList[0];
        if (!firstExam) {
          setExam(null);
          return;
        }
        const single = await api.get(`/api/exams/${firstExam.id}`);
        setExam(unwrap(single));
      } catch (error) {
        notifyError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadExam();
  }, [courseId]);

  if (loading) return <LoadingSpinner text="Loading exam..." />;
  if (!exam) return <p className="page-main">No available exam for this course yet.</p>;

  const questions = exam.questions || [];
  const currentQuestion = questions[currentIndex];

  const submitExam = async () => {
    try {
      const result = await api.post(`/api/exams/${exam.id}/submit`, {
        answers,
        startedAt,
      });
      navigate('/exams/results', { state: { result: unwrap(result) } });
    } catch (error) {
      notifyError(error.message);
    }
  };

  return (
    <main className="page-main">
      <Modal
        isOpen={showIntro}
        title="Exam Instructions"
        onClose={() => {}}
        actions={<Button onClick={() => { setShowIntro(false); setStartedAt(new Date().toISOString()); }}>Start Exam</Button>}
      >
        <p>Read each question carefully and submit before the timer ends.</p>
      </Modal>

      {!showIntro ? (
        <>
          <ExamTimer initialSeconds={(exam.timeLimit || 30) * 60} onExpire={submitExam} />
          {currentQuestion ? (
            <QuestionCard
              question={currentQuestion}
              selectedOption={answers[currentQuestion.id]}
              onSelect={(value) => setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }))}
            />
          ) : null}
          <div className="row-actions">
            <Button
              variant="secondary"
              disabled={currentIndex <= 0}
              onClick={() => setCurrentIndex((value) => value - 1)}
            >
              Previous
            </Button>
            {currentIndex < questions.length - 1 ? (
              <Button onClick={() => setCurrentIndex((value) => value + 1)}>Next</Button>
            ) : (
              <Button variant="danger" onClick={submitExam}>Submit</Button>
            )}
          </div>
        </>
      ) : null}
    </main>
  );
}
