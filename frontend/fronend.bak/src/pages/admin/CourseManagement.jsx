import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { courseAPI, adminAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingScreen from '../../components/LoadingScreen';
import { Card, Button, Badge, Input, EmptyState } from '../../components/ui';
import {
  BookOpen, Plus, Edit2, Trash2, Search, Filter, ArrowLeft,
  Eye, EyeOff, Layers, Clock, Shield, ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function CourseManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all, published, draft
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await courseAPI.getAll();
      setCourses(data.data || []);
    } catch (err) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);
    try {
      await adminAPI.deleteCourse(deleteModal.id);
      toast.success('Course deleted');
      setCourses(courses.filter(c => c.id !== deleteModal.id));
      setDeleteModal(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete course');
    } finally {
      setDeleting(false);
    }
  };

  const togglePublish = async (course) => {
    try {
      await adminAPI.updateCourse(course.id, { isPublished: !course.isPublished });
      toast.success(course.isPublished ? 'Course unpublished' : 'Course published');
      fetchCourses();
    } catch (err) {
      toast.error('Failed to update course');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <Shield size={48} className="mb-4 text-[#e74c3c]" />
        <h1 className="text-xl font-bold text-[#b8b8d1]">Access Denied</h1>
        <p className="mt-2 text-sm text-[#a0a0b8]">Admin privileges required.</p>
      </div>
    );
  }

  if (loading) return <LoadingScreen main="Loading Courses" secondary="Fetching course data" />;

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || 
      (filter === 'published' && course.isPublished) ||
      (filter === 'draft' && !course.isPublished);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link 
            to="/admin" 
            className="mb-2 flex items-center gap-1 text-sm text-[#5b5f97] transition-colors hover:text-[#b8b8d1]"
          >
            <ArrowLeft size={14} /> Back to Admin
          </Link>
          <h1 className="text-2xl font-bold text-[#b8b8d1]">Course Management</h1>
          <p className="mt-1 text-sm text-[#a0a0b8]">{courses.length} total courses</p>
        </div>
        <Link to="/admin/courses/new">
          <Button icon={Plus}>New Course</Button>
        </Link>
      </div>

      {/* Filters */}
      <Card padding="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <Input
              placeholder="Search courses..."
              icon={Search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {['all', 'published', 'draft'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-3 py-2 text-xs font-medium capitalize transition-colors ${
                  filter === f
                    ? 'bg-[#5b5f97] text-white'
                    : 'bg-[#1a1a2e] text-[#a0a0b8] hover:text-[#b8b8d1]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Course List */}
      {filteredCourses.length > 0 ? (
        <div className="space-y-3">
          {filteredCourses.map((course) => (
            <Card key={course.id} hover padding="p-0">
              <div className="flex items-center gap-4 p-4">
                {/* Icon */}
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${
                  course.category === 'frontend' 
                    ? 'bg-[#5b5f97]/10' 
                    : 'bg-[#2ecc71]/10'
                }`}>
                  <BookOpen size={22} className={
                    course.category === 'frontend' ? 'text-[#5b5f97]' : 'text-[#2ecc71]'
                  } />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="truncate font-semibold text-[#b8b8d1]">{course.title}</h3>
                    <Badge 
                      variant={course.isPublished ? 'success' : 'default'}
                      className="shrink-0"
                    >
                      {course.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                  <p className="mb-2 truncate text-sm text-[#a0a0b8]">
                    {course.description?.slice(0, 100)}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#5b5f97]">
                    <span className="flex items-center gap-1">
                      <Layers size={12} /> {course.lessons?.length || 0} lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {course.estimatedHours || 0}h
                    </span>
                    <Badge variant="outline" className="text-[10px]">{course.category}</Badge>
                    <Badge 
                      color={
                        course.difficulty === 'beginner' ? '#2ecc71' :
                        course.difficulty === 'intermediate' ? '#f39c12' : '#e74c3c'
                      }
                      dot
                    >
                      {course.difficulty}
                    </Badge>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => togglePublish(course)}
                    className="rounded-lg p-2 text-[#a0a0b8] transition-colors hover:bg-[#5b5f97]/10 hover:text-[#b8b8d1]"
                    title={course.isPublished ? 'Unpublish' : 'Publish'}
                  >
                    {course.isPublished ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <Link
                    to={`/admin/courses/${course.id}`}
                    className="rounded-lg p-2 text-[#a0a0b8] transition-colors hover:bg-[#5b5f97]/10 hover:text-[#b8b8d1]"
                  >
                    <Edit2 size={16} />
                  </Link>
                  <Link
                    to={`/admin/courses/${course.id}/lessons`}
                    className="rounded-lg p-2 text-[#a0a0b8] transition-colors hover:bg-[#2ecc71]/10 hover:text-[#2ecc71]"
                    title="Manage Lessons"
                  >
                    <Layers size={16} />
                  </Link>
                  <button
                    onClick={() => setDeleteModal(course)}
                    className="rounded-lg p-2 text-[#a0a0b8] transition-colors hover:bg-[#e74c3c]/10 hover:text-[#e74c3c]"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="No courses found"
          description={search ? "Try adjusting your search" : "Create your first course"}
          action={
            <Link to="/admin/courses/new">
              <Button icon={Plus}>Create Course</Button>
            </Link>
          }
        />
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <Card className="w-full max-w-md animate-page">
            <h2 className="text-lg font-bold text-[#b8b8d1]">Delete Course</h2>
            <p className="mt-2 text-sm text-[#a0a0b8]">
              Are you sure you want to delete "{deleteModal.title}"? This will also delete all lessons and cannot be undone.
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
