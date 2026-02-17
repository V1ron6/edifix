import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examAPI } from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import { Card, Button, ProgressBar } from '../components/ui';
import { Clock, ChevronLeft, ChevronRight, Send, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ExamTake() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [startTime] = useState(Date.now());
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const { data } = await examAPI.getById(id);
        setExam(data.data);
        setTimeLeft((data.data.timeLimit || 30) * 60);
      } catch {
        toast.error('Failed to load exam');
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [id]);

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    const formattedAnswers = Object.entries(answers).map(([questionIndex, answer]) => ({
      questionIndex: Number(questionIndex),
      answer: String(answer),
    }));
    try {
      await examAPI.submit(id, { answers: formattedAnswers, timeTaken });
      toast.success('Exam submitted');
      navigate('/exams');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit exam');
    } finally {
      setSubmitting(false);
      setShowConfirm(false);
    }
  }, [answers, id, navigate, startTime]);

  // Timer
  useEffect(() => {
    if (!exam || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [exam, handleSubmit]);

  if (loading) return <LoadingScreen main="Loading exam" secondary="Preparing questions" />;
  if (!exam) return <p className="py-12 text-center text-[#a0a0b8]">Exam not found.</p>;

  const questions = exam.questions || [];
  const question = questions[currentQ];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const answeredCount = Object.keys(answers).length;
  const isLowTime = timeLeft < 60;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* Header Bar */}
      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-semibold text-[#b8b8d1]">{exam.title}</h1>
          <p className="text-xs text-[#a0a0b8]">
            {answeredCount} of {questions.length} answered
          </p>
        </div>
        <div className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-mono ${
          isLowTime
            ? 'animate-pulse bg-[#e74c3c]/10 text-[#e74c3c]'
            : 'bg-[#1a1a2e] text-[#b8b8d1]'
        }`}>
          <Clock size={14} className={isLowTime ? 'text-[#e74c3c]' : 'text-[#5b5f97]'} />
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
      </Card>

      {/* Progress bar */}
      <ProgressBar
        value={answeredCount}
        max={questions.length}
        label={`Question ${currentQ + 1} of ${questions.length}`}
        color="#5b5f97"
        size="sm"
      />

      {/* Question navigator dots */}
      <div className="flex flex-wrap gap-1.5">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentQ(i)}
            className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-medium transition-all duration-200 ${
              i === currentQ
                ? 'bg-[#5b5f97] text-white shadow-[0_0_10px_rgba(91,95,151,0.3)]'
                : answers[i] !== undefined
                ? 'bg-[#2ecc71]/20 text-[#2ecc71] ring-1 ring-[#2ecc71]/30'
                : 'bg-[#1a1a2e] text-[#a0a0b8] hover:bg-[#2a2a4a]'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Question Card */}
      {question && (
        <Card className="p-6">
          <p className="mb-5 text-base font-medium text-[#b8b8d1]">{question.question}</p>
          <div className="space-y-2.5">
            {question.options?.map((opt, i) => {
              const isSelected = answers[currentQ] === String(i);
              return (
                <button
                  key={i}
                  onClick={() => setAnswers({ ...answers, [currentQ]: String(i) })}
                  className={`group flex w-full items-start gap-3 rounded-xl border p-4 text-left text-sm transition-all duration-200 ${
                    isSelected
                      ? 'border-[#5b5f97] bg-[#5b5f97]/10 text-[#b8b8d1] shadow-[0_0_10px_rgba(91,95,151,0.1)]'
                      : 'border-[#2a2a4a] text-[#a0a0b8] hover:border-[#5b5f97]/40 hover:bg-[#5b5f97]/5'
                  }`}
                >
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                    isSelected
                      ? 'bg-[#5b5f97] text-white'
                      : 'bg-[#1a1a2e] text-[#5b5f97] group-hover:bg-[#5b5f97]/20'
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="pt-0.5">{opt}</span>
                </button>
              );
            })}
          </div>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          icon={ChevronLeft}
          onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
          disabled={currentQ === 0}
        >
          Previous
        </Button>

        {currentQ === questions.length - 1 ? (
          <Button
            icon={Send}
            size="lg"
            loading={submitting}
            onClick={() => {
              if (answeredCount < questions.length) {
                setShowConfirm(true);
              } else {
                handleSubmit();
              }
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Exam'}
          </Button>
        ) : (
          <Button
            variant="ghost"
            iconRight={ChevronRight}
            onClick={() => setCurrentQ(Math.min(questions.length - 1, currentQ + 1))}
          >
            Next
          </Button>
        )}
      </div>

      {/* Confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Card className="mx-4 max-w-sm p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f39c12]/10">
              <AlertTriangle size={24} className="text-[#f39c12]" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-[#b8b8d1]">Submit with unanswered?</h3>
            <p className="mb-4 text-sm text-[#a0a0b8]">
              You've answered {answeredCount} of {questions.length} questions.
              Unanswered questions will be marked as incorrect.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" onClick={() => setShowConfirm(false)}>Review</Button>
              <Button onClick={handleSubmit} loading={submitting}>Submit Anyway</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
