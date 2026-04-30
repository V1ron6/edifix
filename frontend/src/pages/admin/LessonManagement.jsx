import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { courseAPI, lessonAPI, adminAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingScreen from '../../components/LoadingScreen';
import { Card, Button, Badge, Input, EmptyState } from '../../components/ui';
import {
  FileText, Plus, Edit2, Trash2, ArrowLeft, Eye, EyeOff,
  GripVertical, Clock, Code2, BookOpen, Video, Shield,
} from 'lucide-react';
import toast from 'react-hot-toast';

const LESSON_TYPE_ICONS = {
  theory: BookOpen,
  practice: Code2,
  video: Video,
  quiz: FileText,
};

export default function LessonManagement() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const fetchData = async () => {
    try {
      const { data: courseRes } = await courseAPI.getById(courseId);
      setCourse(courseRes.data);
      setLessons(courseRes.data.lessons || []);
    } catch (err) {
      toast.error('Failed to load course');
      navigate('/admin/courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);
    try {
      await adminAPI.deleteLesson(deleteModal.id);
      toast.success('Lesson deleted');
      setLessons(lessons.filter(l => l.id !== deleteModal.id));
      setDeleteModal(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete lesson');
    } finally {
      setDeleting(false);
    }
  };

  const togglePublish = async (lesson) => {
    try {
      await adminAPI.updateLesson(lesson.id, { isPublished: !lesson.isPublished });
      toast.success(lesson.isPublished ? 'Lesson unpublished' : 'Lesson published');
      fetchData();
    } catch (err) {
      toast.error('Failed to update lesson');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <Shield size={48} className="mb-4 text-[#e74c3c]" />
        <h1 className="text-xl font-bold text-[#b8b8d1]">Access Denied</h1>
      </div>
    );
  }

  if (loading) return <LoadingScreen main="Loading Lessons" secondary="Fetching lesson data" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link 
            to="/admin/courses" 
            className="mb-2 flex items-center gap-1 text-sm text-[#5b5f97] transition-colors hover:text-[#b8b8d1]"
          >
            <ArrowLeft size={14} /> Back to Courses
          </Link>
          <h1 className="text-2xl font-bold text-[#b8b8d1]">Manage Lessons</h1>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="outline">{course?.title}</Badge>
            <span className="text-sm text-[#a0a0b8]">{lessons.length} lessons</span>
          </div>
        </div>
        <Link to={`/admin/courses/${courseId}/lessons/new`}>
          <Button icon={Plus}>Add Lesson</Button>
        </Link>
      </div>

      {/* Lesson List */}
      {lessons.length > 0 ? (
        <div className="space-y-2">
          {lessons
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((lesson, index) => {
              const Icon = LESSON_TYPE_ICONS[lesson.type] || FileText;
              return (
                <Card key={lesson.id} hover padding="p-0">
                  <div className="flex items-center gap-4 p-4">
                    {/* Order indicator */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1a1a2e] text-sm font-bold text-[#5b5f97]">
                      {lesson.order || index + 1}
                    </div>

                    {/* Type Icon */}
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                      lesson.type === 'theory' ? 'bg-[#5b5f97]/10' :
                      lesson.type === 'practice' ? 'bg-[#2ecc71]/10' :
                      lesson.type === 'video' ? 'bg-[#e74c3c]/10' :
                      'bg-[#f39c12]/10'
                    }`}>
                      <Icon size={18} className={
                        lesson.type === 'theory' ? 'text-[#5b5f97]' :
                        lesson.type === 'practice' ? 'text-[#2ecc71]' :
                        lesson.type === 'video' ? 'text-[#e74c3c]' :
                        'text-[#f39c12]'
                      } />
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="truncate font-medium text-[#b8b8d1]">{lesson.title}</h3>
                        <Badge 
                          variant={lesson.isPublished ? 'success' : 'default'}
                          className="shrink-0 text-[10px]"
                        >
                          {lesson.isPublished ? 'Published' : 'Draft'}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#5b5f97]">
                        <Badge variant="outline" className="text-[10px] capitalize">{lesson.type}</Badge>
                        {lesson.estimatedMinutes && (
                          <span className="flex items-center gap-1">
                            <Clock size={10} /> {lesson.estimatedMinutes} min
                          </span>
                        )}
                        {lesson.videoUrl && (
                          <span className="flex items-center gap-1">
                            <Video size={10} /> Has video
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        onClick={() => togglePublish(lesson)}
                        className="rounded-lg p-2 text-[#a0a0b8] transition-colors hover:bg-[#5b5f97]/10 hover:text-[#b8b8d1]"
                        title={lesson.isPublished ? 'Unpublish' : 'Publish'}
                      >
                        {lesson.isPublished ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <Link
                        to={`/admin/courses/${courseId}/lessons/${lesson.id}`}
                        className="rounded-lg p-2 text-[#a0a0b8] transition-colors hover:bg-[#5b5f97]/10 hover:text-[#b8b8d1]"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button
                        onClick={() => setDeleteModal(lesson)}
                        className="rounded-lg p-2 text-[#a0a0b8] transition-colors hover:bg-[#e74c3c]/10 hover:text-[#e74c3c]"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No lessons yet"
          description="Create your first lesson for this course"
          action={
            <Link to={`/admin/courses/${courseId}/lessons/new`}>
              <Button icon={Plus}>Add Lesson</Button>
            </Link>
          }
        />
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <Card className="w-full max-w-md animate-page">
            <h2 className="text-lg font-bold text-[#b8b8d1]">Delete Lesson</h2>
            <p className="mt-2 text-sm text-[#a0a0b8]">
              Are you sure you want to delete "{deleteModal.title}"? This cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setDeleteModal(null)}>Cancel</Button>
              <Button variant="danger" onClick={handleDelete} loading={deleting}>Delete</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
