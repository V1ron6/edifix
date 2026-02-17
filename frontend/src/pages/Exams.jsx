import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { examAPI } from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import { PageHeader, Card, CardHeader, CardTitle, Button, Badge, EmptyState, Select } from '../components/ui';
import { FileText, Clock, CheckCircle2, XCircle, ArrowRight, Zap, Trophy, BarChart3, Target } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'git', label: 'Git' },
  { value: 'nodejs', label: 'Node.js' },
  { value: 'expressjs', label: 'Express.js' },
  { value: 'databases', label: 'Databases' },
];

const DIFFICULTIES = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const COUNTS = [
  { value: '5', label: '5 questions' },
  { value: '10', label: '10 questions' },
  { value: '15', label: '15 questions' },
  { value: '20', label: '20 questions' },
];

export default function Exams() {
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
      toast.success('Exam generated');
      if (data.data?.id) {
        window.location.href = `/exams/${data.data.id}`;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate exam');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <LoadingScreen main="Loading exams" secondary="Fetching exam results" />;

  const passedCount = results.filter((r) => r.passed).length;
  const avgScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + (r.score / r.totalPoints) * 100, 0) / results.length)
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader title="Exams" description="Test your knowledge with generated exams" />

      {/* Stats row */}
      {results.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-3">
          <Card className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#5b5f97]/10">
              <Trophy size={20} className="text-[#5b5f97]" />
            </div>
            <div>
              <p className="text-lg font-bold text-[#b8b8d1]">{results.length}</p>
              <p className="text-xs text-[#a0a0b8]">Exams taken</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2ecc71]/10">
              <CheckCircle2 size={20} className="text-[#2ecc71]" />
            </div>
            <div>
              <p className="text-lg font-bold text-[#b8b8d1]">{passedCount}</p>
              <p className="text-xs text-[#a0a0b8]">Passed</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f39c12]/10">
              <Target size={20} className="text-[#f39c12]" />
            </div>
            <div>
              <p className="text-lg font-bold text-[#b8b8d1]">{avgScore}%</p>
              <p className="text-xs text-[#a0a0b8]">Avg. score</p>
            </div>
          </Card>
        </div>
      )}

      {/* Generate Exam */}
      <Card highlight>
        <CardHeader>
          <CardTitle icon={Zap} iconColor="text-[#f39c12]">Generate an Exam</CardTitle>
        </CardHeader>
        <div className="flex flex-wrap items-end gap-3">
          <Select
            label="Category"
            value={genForm.category}
            onChange={(e) => setGenForm({ ...genForm, category: e.target.value })}
            options={CATEGORIES}
          />
          <Select
            label="Difficulty"
            value={genForm.difficulty}
            onChange={(e) => setGenForm({ ...genForm, difficulty: e.target.value })}
            options={DIFFICULTIES}
          />
          <Select
            label="Questions"
            value={String(genForm.questionCount)}
            onChange={(e) => setGenForm({ ...genForm, questionCount: Number(e.target.value) })}
            options={COUNTS}
          />
          <Button
            onClick={handleGenerate}
            loading={generating}
            icon={Zap}
            size="lg"
          >
            {generating ? 'Generating...' : 'Start Exam'}
          </Button>
        </div>
      </Card>

      {/* Past results */}
      <div>
        <h2 className="mb-3 font-semibold text-[#b8b8d1]">Past Results</h2>
        {results.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No exam results yet"
            description="Generate your first exam above to get started."
          />
        ) : (
          <div className="space-y-2">
            {results.map((result) => {
              const scorePercent = result.totalPoints > 0
                ? Math.round((result.score / result.totalPoints) * 100)
                : 0;
              return (
                <Card key={result.id} hover className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      result.passed ? 'bg-[#2ecc71]/10' : 'bg-[#e74c3c]/10'
                    }`}>
                      {result.passed
                        ? <CheckCircle2 size={18} className="text-[#2ecc71]" />
                        : <XCircle size={18} className="text-[#e74c3c]" />
                      }
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#b8b8d1]">{result.examTitle || 'Exam'}</p>
                      <div className="flex items-center gap-2 text-xs text-[#a0a0b8]">
                        <span>Score: {result.score}/{result.totalPoints} ({scorePercent}%)</span>
                        <Badge variant={result.passed ? 'success' : 'danger'} className="text-[10px]">
                          {result.passed ? 'Passed' : 'Failed'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#5b5f97]">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {Math.round((result.timeTaken || 0) / 60)} min
                    </span>
                    <span className="hidden text-[#a0a0b8] sm:block">
                      {new Date(result.createdAt || result.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
