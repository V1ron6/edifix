import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { examAPI } from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import { Card, Button, Badge } from '../components/ui';
import { Clock, ChevronLeft, ChevronRight, Send, AlertTriangle, CheckCircle2, XCircle, FileQuestion, Target, Timer, ArrowLeft } from 'lucide-react';
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
  const progressPercent = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/exams"
          className="flex items-center gap-1.5 text-sm text-[#5b5f97] hover:text-[#b8b8d1] transition group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Exit Exam
        </Link>
        
        {/* Timer */}
        <div className={`flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-lg ${
          isLowTime
            ? 'animate-pulse bg-[#e74c3c]/15 text-[#e74c3c] border border-[#e74c3c]/30'
            : 'bg-[#1a1a2e] text-[#b8b8d1] border border-[#2a2a4a]'
        }`}>
          <Timer size={16} className={isLowTime ? 'text-[#e74c3c]' : 'text-[#5b5f97]'} />
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
      </div>

      {/* Exam Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] border border-[#2a2a4a]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#5b5f97]/10 rounded-full blur-3xl"></div>
        
        <div className="relative p-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="primary">{exam.category}</Badge>
            <Badge variant="outline" className="capitalize">{exam.difficulty}</Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-4">{exam.title}</h1>
          
          {/* Stats Row */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#5b5f97]/20 rounded-lg">
                <FileQuestion size={14} className="text-[#b8b8d1]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#b8b8d1]">{questions.length}</p>
                <p className="text-xs text-[#5b5f97]">Questions</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#2ecc71]/20 rounded-lg">
                <CheckCircle2 size={14} className="text-[#2ecc71]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#2ecc71]">{answeredCount}</p>
                <p className="text-xs text-[#5b5f97]">Answered</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#f39c12]/20 rounded-lg">
                <Target size={14} className="text-[#f39c12]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#f39c12]">{progressPercent}%</p>
                <p className="text-xs text-[#5b5f97]">Progress</p>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="h-2 bg-[#1a1a2e] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#5b5f97] to-[#b8b8d1] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Question Navigator Sidebar */}
        <div className="lg:col-span-1">
          <Card padding="p-4" className="sticky top-4">
            <h3 className="text-xs font-medium text-[#5b5f97] mb-3">Question Navigator</h3>
            <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentQ(i)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold transition-all duration-200 ${
                    i === currentQ
                      ? 'bg-[#5b5f97] text-white shadow-[0_0_12px_rgba(91,95,151,0.4)] ring-2 ring-[#5b5f97]/30'
                      : answers[i] !== undefined
                      ? 'bg-[#2ecc71]/15 text-[#2ecc71] ring-1 ring-[#2ecc71]/40'
                      : 'bg-[#1a1a2e] text-[#a0a0b8] hover:bg-[#2a2a4a] hover:text-[#b8b8d1]'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-[#2a2a4a] space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-[#5b5f97]"></span>
                <span className="text-[#a0a0b8]">Current</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-[#2ecc71]/15 ring-1 ring-[#2ecc71]/40"></span>
                <span className="text-[#a0a0b8]">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-[#1a1a2e]"></span>
                <span className="text-[#a0a0b8]">Unanswered</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Question Card */}
        <div className="lg:col-span-3 space-y-4">
          {question && (
            <Card padding="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5b5f97] text-white font-bold">
                  {currentQ + 1}
                </span>
                <div>
                  <p className="text-xs text-[#5b5f97]">Question {currentQ + 1} of {questions.length}</p>
                  <p className="text-lg font-semibold text-[#b8b8d1]">{question.question}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {question.options?.map((opt, i) => {
                  const isSelected = answers[currentQ] === String(i);
                  return (
                    <button
                      key={i}
                      onClick={() => setAnswers({ ...answers, [currentQ]: String(i) })}
                      className={`group flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all duration-200 ${
                        isSelected
                          ? 'border-[#5b5f97] bg-[#5b5f97]/10 shadow-[0_0_15px_rgba(91,95,151,0.15)]'
                          : 'border-[#2a2a4a] hover:border-[#5b5f97]/50 hover:bg-[#5b5f97]/5'
                      }`}
                    >
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-all ${
                        isSelected
                          ? 'bg-[#5b5f97] text-white'
                          : 'bg-[#1a1a2e] text-[#5b5f97] group-hover:bg-[#5b5f97]/20 group-hover:text-[#b8b8d1]'
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className={`pt-2 text-sm ${isSelected ? 'text-[#b8b8d1]' : 'text-[#a0a0b8] group-hover:text-[#e0e0e0]'}`}>
                        {opt}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="ml-auto shrink-0 text-[#5b5f97]\" size={20} />
                      )}
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
                loading={submitting}
                onClick={() => {
                  if (answeredCount < questions.length) {
                    setShowConfirm(true);
                  } else {
                    handleSubmit();
                  }
                }}
                className="!px-6"
              >
                {submitting ? 'Submitting...' : 'Submit Exam'}
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => setCurrentQ(Math.min(questions.length - 1, currentQ + 1))}
              >
                Next Question
                <ChevronRight size={16} className="ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <Card className="max-w-md w-full p-6 text-center animate-in fade-in zoom-in duration-200">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f39c12]/15">
              <AlertTriangle size={28} className="text-[#f39c12]" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-[#b8b8d1]">Submit with unanswered questions?</h3>
            <p className="mb-6 text-sm text-[#a0a0b8]">
              You've answered <span className="text-[#2ecc71] font-semibold">{answeredCount}</span> of <span className="text-[#b8b8d1] font-semibold">{questions.length}</span> questions.
              Unanswered questions will be marked as incorrect.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="ghost" onClick={() => setShowConfirm(false)}>
                Review Answers
              </Button>
              <Button onClick={handleSubmit} loading={submitting} className="bg-[#f39c12] hover:bg-[#e67e22] border-[#f39c12]">
                Submit Anyway
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
