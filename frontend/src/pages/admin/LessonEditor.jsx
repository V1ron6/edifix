import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courseAPI, lessonAPI, adminAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingScreen from '../../components/LoadingScreen';
import { Card, Button, Input, Badge } from '../../components/ui';
import { TextArea, Select } from '../../components/ui/Input';
import {
  ArrowLeft, Save, FileText, Shield, Video, Clock, Code2,
  Lightbulb, BookOpen,
} from 'lucide-react';
import toast from 'react-hot-toast';

const LESSON_TYPES = [
  { value: 'theory', label: 'Theory' },
  { value: 'practice', label: 'Practice' },
  { value: 'video', label: 'Video' },
  { value: 'quiz', label: 'Quiz' },
];

export default function LessonEditor() {
  const { courseId, lessonId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isEdit = lessonId && lessonId !== 'new';

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    content: '',
    type: 'theory',
    order: 1,
    estimatedMinutes: 15,
    videoUrl: '',
    codeTemplate: '',
    expectedOutput: '',
    hints: '',
    isPublished: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
  }, [courseId, lessonId]);

  const fetchData = async () => {
    try {
      const { data: courseRes } = await courseAPI.getById(courseId);
      setCourse(courseRes.data);

      if (isEdit) {
        const { data: lessonRes } = await lessonAPI.getById(lessonId);
        const lesson = lessonRes.data;
        setForm({
          title: lesson.title || '',
          content: lesson.content || '',
          type: lesson.type || 'theory',
          order: lesson.order || 1,
          estimatedMinutes: lesson.estimatedMinutes || 15,
          videoUrl: lesson.videoUrl || '',
          codeTemplate: lesson.codeTemplate || '',
          expectedOutput: lesson.expectedOutput || '',
          hints: lesson.hints?.join('\n') || '',
          isPublished: lesson.isPublished || false,
        });
      } else {
        // Set order to next available
        const maxOrder = Math.max(0, ...(courseRes.data.lessons?.map(l => l.order || 0) || []));
        setForm(f => ({ ...f, order: maxOrder + 1 }));
      }
    } catch (err) {
      toast.error('Failed to load data');
      navigate(`/admin/courses/${courseId}/lessons`);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.content.trim()) newErrors.content = 'Content is required';
    if (form.estimatedMinutes < 1) newErrors.estimatedMinutes = 'Must be at least 1 minute';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = {
        ...form,
        courseId,
        order: Number(form.order),
        estimatedMinutes: Number(form.estimatedMinutes),
        hints: form.hints 
          ? form.hints.split('\n').map(h => h.trim()).filter(Boolean)
          : [],
      };

      if (isEdit) {
        await adminAPI.updateLesson(lessonId, payload);
        toast.success('Lesson updated');
      } else {
        await adminAPI.createLesson(payload);
        toast.success('Lesson created');
      }
      navigate(`/admin/courses/${courseId}/lessons`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save lesson');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: null });
  };

  if (user?.role !== 'admin') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <Shield size={48} className="mb-4 text-[#e74c3c]" />
        <h1 className="text-xl font-bold text-[#b8b8d1]">Access Denied</h1>
      </div>
    );
  }

  if (loading) return <LoadingScreen main="Loading Lesson" secondary="Fetching lesson data" />;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <Link 
          to={`/admin/courses/${courseId}/lessons`}
          className="mb-2 flex items-center gap-1 text-sm text-[#5b5f97] transition-colors hover:text-[#b8b8d1]"
        >
          <ArrowLeft size={14} /> Back to Lessons
        </Link>
        <h1 className="text-2xl font-bold text-[#b8b8d1]">
          {isEdit ? 'Edit Lesson' : 'Create New Lesson'}
        </h1>
        <div className="mt-2 flex items-center gap-2">
          <Badge variant="outline">{course?.title}</Badge>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#b8b8d1]">
              <FileText size={16} className="text-[#5b5f97]" />
              Basic Information
            </h3>
            
            <div className="space-y-4">
              <Input
                label="Lesson Title"
                placeholder="e.g., Introduction to HTML Tags"
                value={form.title}
                onChange={handleChange('title')}
                error={errors.title}
              />

              <div className="grid gap-4 sm:grid-cols-3">
                <Select
                  label="Lesson Type"
                  options={LESSON_TYPES}
                  value={form.type}
                  onChange={handleChange('type')}
                  className="w-full"
                />
                <Input
                  label="Order"
                  type="number"
                  min={1}
                  value={form.order}
                  onChange={handleChange('order')}
                />
                <Input
                  label="Duration (minutes)"
                  type="number"
                  min={1}
                  icon={Clock}
                  value={form.estimatedMinutes}
                  onChange={handleChange('estimatedMinutes')}
                  error={errors.estimatedMinutes}
                />
              </div>
            </div>
          </Card>

          {/* Content */}
          <Card>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#b8b8d1]">
              <BookOpen size={16} className="text-[#5b5f97]" />
              Lesson Content
            </h3>
            
            <TextArea
              label="Content (Markdown supported)"
              placeholder="Write your lesson content here using Markdown..."
              rows={12}
              value={form.content}
              onChange={handleChange('content')}
              error={errors.content}
              className="font-mono text-sm"
            />
          </Card>

          {/* Video */}
          {(form.type === 'video' || form.type === 'theory') && (
            <Card>
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#b8b8d1]">
                <Video size={16} className="text-[#e74c3c]" />
                Video (Optional)
              </h3>
              <Input
                label="Video URL"
                placeholder="https://youtube.com/watch?v=..."
                icon={Video}
                value={form.videoUrl}
                onChange={handleChange('videoUrl')}
              />
            </Card>
          )}

          {/* Practice Fields */}
          {form.type === 'practice' && (
            <Card>
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#b8b8d1]">
                <Code2 size={16} className="text-[#2ecc71]" />
                Practice Configuration
              </h3>
              
              <div className="space-y-4">
                <TextArea
                  label="Code Template (Starter Code)"
                  placeholder="// Write starter code here..."
                  rows={6}
                  value={form.codeTemplate}
                  onChange={handleChange('codeTemplate')}
                  className="font-mono text-sm"
                />

                <TextArea
                  label="Expected Output"
                  placeholder="What should the output be?"
                  rows={3}
                  value={form.expectedOutput}
                  onChange={handleChange('expectedOutput')}
                  className="font-mono text-sm"
                />

                <TextArea
                  label="Hints (one per line)"
                  placeholder="Hint 1&#10;Hint 2&#10;Hint 3"
                  rows={4}
                  value={form.hints}
                  onChange={handleChange('hints')}
                />
              </div>
            </Card>
          )}

          {/* Publish Toggle */}
          <Card>
            <label className="flex cursor-pointer items-center justify-between">
              <div>
                <p className="font-medium text-[#b8b8d1]">Publish Lesson</p>
                <p className="text-sm text-[#a0a0b8]">Make this lesson visible in the course</p>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={handleChange('isPublished')}
                  className="peer sr-only"
                />
                <div className="h-6 w-11 rounded-full bg-[#2a2a4a] transition-colors peer-checked:bg-[#2ecc71]" />
                <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
              </div>
            </label>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Link to={`/admin/courses/${courseId}/lessons`}>
              <Button type="button" variant="secondary">Cancel</Button>
            </Link>
            <Button type="submit" icon={Save} loading={saving}>
              {isEdit ? 'Update Lesson' : 'Create Lesson'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
