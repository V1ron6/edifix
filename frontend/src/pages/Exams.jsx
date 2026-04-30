import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { examAPI } from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import { Card, CardHeader, CardTitle, Button, Badge, EmptyState, Select } from '../components/ui';
import { FileText, Clock, CheckCircle2, XCircle, ArrowRight, Zap, Trophy, BarChart3, Target, Sparkles, TrendingUp, Award, BookOpen, Play, History, Brain } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value: 'html', label: 'HTML', color: '#e34c26', icon: '📝' },
  { value: 'css', label: 'CSS', color: '#264de4', icon: '🎨' },
  { value: 'javascript', label: 'JavaScript', color: '#f7df1e', icon: '⚡' },
  { value: 'git', label: 'Git', color: '#f05032', icon: '🔀' },
  { value: 'nodejs', label: 'Node.js', color: '#68a063', icon: '💚' },
  { value: 'expressjs', label: 'Express.js', color: '#5b5f97', icon: '🚀' },
  { value: 'databases', label: 'Databases', color: '#336791', icon: '🗄️' },
];

const DIFFICULTIES = [
  { value: 'beginner', label: 'Beginner', color: '#2ecc71', desc: 'Basic concepts' },
  { value: 'intermediate', label: 'Intermediate', color: '#f39c12', desc: 'Applied knowledge' },
  { value: 'advanced', label: 'Advanced', color: '#e74c3c', desc: 'Expert level' },
];

const COUNTS = [
  { value: '5', label: '5', time: '~5 min' },
  { value: '10', label: '10', time: '~10 min' },
  { value: '15', label: '15', time: '~15 min' },
  { value: '20', label: '20', time: '~20 min' },
];

export default function Exams() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [genForm, setGenForm] = useState({ category: 'javascript', difficulty: 'beginner', questionCount: 10 });

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data } = await examAPI.getResults();
        setResults(data.data || []);
      } catch {
        /* no results yet */
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const { data } = await examAPI.generate(genForm);
      toast.success('Exam generated!');
      if (data.data?.id) {
        navigate(`/exams/${data.data.id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate exam');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <LoadingScreen main="Loading exams" secondary="Fetching exam results" />;

  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;
  const avgScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + (r.score / r.totalPoints) * 100, 0) / results.length)
    : 0;
  const selectedCategory = CATEGORIES.find(c => c.value === genForm.category);
  const selectedDifficulty = DIFFICULTIES.find(d => d.value === genForm.difficulty);
  const selectedCount = COUNTS.find(c => c.value === String(genForm.questionCount));

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl border border-[#2a2a4a] bg-gradient-to-br from-[#16213e] via-[#1a1a2e] to-[#16213e] p-6 sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(243,156,18,0.1)_0%,transparent_50%)]" />
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#f39c12]/10 blur-3xl" />
        
        <div className="relative">
          <div className="mb-2 flex items-center gap-2">
            <Brain size={16} className="text-[#f39c12]" />
            <span className="text-xs font-medium text-[#f39c12]">Test Your Skills</span>
          </div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Exams & Quizzes</h1>
          <p className="mt-2 text-[#a0a0b8] max-w-lg">
            Challenge yourself with auto-generated exams. Track your progress and improve your knowledge.
          </p>
        </div>

        {/* Stats Row */}
        {results.length > 0 && (
          <div className="relative mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl bg-[#1a1a2e]/50 p-4 text-center transition-all hover:bg-[#1a1a2e]">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#5b5f97]/15">
                <Trophy size={18} className="text-[#5b5f97]" />
              </div>
              <p className="text-2xl font-bold text-white">{results.length}</p>
              <p className="text-xs text-[#a0a0b8]">Exams Taken</p>
            </div>
            <div className="rounded-xl bg-[#1a1a2e]/50 p-4 text-center transition-all hover:bg-[#1a1a2e]">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#2ecc71]/15">
                <CheckCircle2 size={18} className="text-[#2ecc71]" />
              </div>
              <p className="text-2xl font-bold text-[#2ecc71]">{passedCount}</p>
              <p className="text-xs text-[#a0a0b8]">Passed</p>
            </div>
            <div className="rounded-xl bg-[#1a1a2e]/50 p-4 text-center transition-all hover:bg-[#1a1a2e]">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#e74c3c]/15">
                <XCircle size={18} className="text-[#e74c3c]" />
              </div>
              <p className="text-2xl font-bold text-[#e74c3c]">{failedCount}</p>
              <p className="text-xs text-[#a0a0b8]">Failed</p>
            </div>
            <div className="rounded-xl bg-[#1a1a2e]/50 p-4 text-center transition-all hover:bg-[#1a1a2e]">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#f39c12]/15">
                <TrendingUp size={18} className="text-[#f39c12]" />
              </div>
              <p className="text-2xl font-bold text-[#f39c12]">{avgScore}%</p>
              <p className="text-xs text-[#a0a0b8]">Avg Score</p>
            </div>
          </div>
        )}
      </div>

      {/* Generate Exam Section */}
      <div className="relative overflow-hidden rounded-2xl border border-[#5b5f97]/30 bg-gradient-to-br from-[#5b5f97]/10 via-[#16213e] to-[#16213e] p-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(91,95,151,0.1)_0%,transparent_50%)]" />
        
        <div className="relative">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f39c12]/15">
              <Zap size={24} className="text-[#f39c12]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Generate an Exam</h2>
              <p className="text-sm text-[#a0a0b8]">Select your preferences and start testing</p>
            </div>
          </div>

          {/* Category Selection */}
          <div className="mb-6">
            <label className="mb-3 block text-sm font-medium text-[#b8b8d1]">Category</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setGenForm({ ...genForm, category: cat.value })}
                  className={`group flex flex-col items-center gap-2 rounded-xl border p-3 transition-all duration-200 ${
                    genForm.category === cat.value
                      ? 'border-[#5b5f97] bg-[#5b5f97]/15 shadow-[0_0_20px_rgba(91,95,151,0.2)]'
                      : 'border-[#2a2a4a] bg-[#1a1a2e]/50 hover:border-[#5b5f97]/50'
                  }`}
                >
                  <div 
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-lg transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${cat.color}20` }}
                  >
                    <span style={{ color: cat.color }}>{cat.icon}</span>
                  </div>
                  <span className={`text-xs font-medium ${genForm.category === cat.value ? 'text-white' : 'text-[#a0a0b8]'}`}>
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="mb-6">
            <label className="mb-3 block text-sm font-medium text-[#b8b8d1]">Difficulty</label>
            <div className="grid grid-cols-3 gap-3">
              {DIFFICULTIES.map((diff) => (
                <button
                  key={diff.value}
                  onClick={() => setGenForm({ ...genForm, difficulty: diff.value })}
                  className={`group flex items-center gap-3 rounded-xl border p-4 transition-all duration-200 ${
                    genForm.difficulty === diff.value
                      ? 'border-[#5b5f97] bg-[#5b5f97]/15'
                      : 'border-[#2a2a4a] bg-[#1a1a2e]/50 hover:border-[#5b5f97]/50'
                  }`}
                >
                  <div 
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: diff.color }}
                  />
                  <div className="text-left">
                    <p className={`text-sm font-medium ${genForm.difficulty === diff.value ? 'text-white' : 'text-[#b8b8d1]'}`}>
                      {diff.label}
                    </p>
                    <p className="text-xs text-[#5b5f97]">{diff.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Question Count Selection */}
          <div className="mb-6">
            <label className="mb-3 block text-sm font-medium text-[#b8b8d1]">Number of Questions</label>
            <div className="grid grid-cols-4 gap-3">
              {COUNTS.map((cnt) => (
                <button
                  key={cnt.value}
                  onClick={() => setGenForm({ ...genForm, questionCount: Number(cnt.value) })}
                  className={`rounded-xl border p-3 text-center transition-all duration-200 ${
                    String(genForm.questionCount) === cnt.value
                      ? 'border-[#5b5f97] bg-[#5b5f97]/15'
                      : 'border-[#2a2a4a] bg-[#1a1a2e]/50 hover:border-[#5b5f97]/50'
                  }`}
                >
                  <p className={`text-lg font-bold ${String(genForm.questionCount) === cnt.value ? 'text-white' : 'text-[#b8b8d1]'}`}>
                    {cnt.label}
                  </p>
                  <p className="text-xs text-[#5b5f97]">{cnt.time}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Summary and Start */}
          <div className="flex flex-col gap-4 rounded-xl border border-[#2a2a4a] bg-[#1a1a2e] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <Badge color={selectedCategory?.color} className="capitalize">
                {selectedCategory?.label}
              </Badge>
              <Badge color={selectedDifficulty?.color} dot>
                {selectedDifficulty?.label}
              </Badge>
              <span className="text-sm text-[#a0a0b8]">
                {genForm.questionCount} questions • {selectedCount?.time}
              </span>
            </div>
            <Button
              onClick={handleGenerate}
              loading={generating}
              icon={Play}
              size="lg"
              className="shadow-[0_4px_20px_rgba(91,95,151,0.3)]"
            >
              {generating ? 'Generating...' : 'Start Exam'}
            </Button>
          </div>
        </div>
      </div>

      {/* Past Results */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5b5f97]/15">
              <History size={18} className="text-[#5b5f97]" />
            </div>
            <div>
              <h2 className="font-bold text-white">Past Results</h2>
              <p className="text-xs text-[#a0a0b8]">{results.length} exams completed</p>
            </div>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#2a2a4a] bg-[#16213e]/50 p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#5b5f97]/10">
              <FileText size={28} className="text-[#5b5f97]" />
            </div>
            <h3 className="text-lg font-semibold text-[#b8b8d1]">No exam results yet</h3>
            <p className="mt-2 text-sm text-[#a0a0b8]">Generate your first exam above to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((result, idx) => {
              const scorePercent = result.totalPoints > 0
                ? Math.round((result.score / result.totalPoints) * 100)
                : 0;
              const category = CATEGORIES.find(c => result.examTitle?.toLowerCase().includes(c.value));
              
              return (
                <div 
                  key={result.id}
                  className="group flex items-center gap-4 rounded-xl border border-[#2a2a4a] bg-[#16213e] p-4 transition-all duration-300 hover:border-[#5b5f97]/50 hover:shadow-[0_4px_20px_rgba(91,95,151,0.1)]"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {/* Status Icon */}
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                    result.passed 
                      ? 'bg-gradient-to-br from-[#2ecc71]/20 to-[#2ecc71]/5' 
                      : 'bg-gradient-to-br from-[#e74c3c]/20 to-[#e74c3c]/5'
                  }`}>
                    {result.passed
                      ? <CheckCircle2 size={22} className="text-[#2ecc71]" />
                      : <XCircle size={22} className="text-[#e74c3c]" />
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-white truncate">{result.examTitle || 'Exam'}</p>
                      <Badge 
                        variant={result.passed ? 'success' : 'danger'} 
                        className="shrink-0"
                      >
                        {result.passed ? 'Passed' : 'Failed'}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#a0a0b8]">
                      <span>Score: <span className="font-medium text-[#b8b8d1]">{result.score}/{result.totalPoints}</span></span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {Math.round((result.timeTaken || 0) / 60)} min
                      </span>
                      <span>{new Date(result.createdAt || result.completedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Score Circle */}
                  <div className="hidden sm:flex flex-col items-center">
                    <div 
                      className="relative flex h-14 w-14 items-center justify-center rounded-full border-4"
                      style={{ 
                        borderColor: result.passed ? '#2ecc71' : '#e74c3c',
                        background: `conic-gradient(${result.passed ? '#2ecc71' : '#e74c3c'} ${scorePercent * 3.6}deg, #1a1a2e 0deg)`
                      }}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#16213e]">
                        <span className="text-sm font-bold text-white">{scorePercent}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
