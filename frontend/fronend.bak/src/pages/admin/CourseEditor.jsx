import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courseAPI, adminAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingScreen from '../../components/LoadingScreen';
import { Card, Button, Input, Badge } from '../../components/ui';
import { TextArea, Select } from '../../components/ui/Input';
import {
  ArrowLeft, Save, BookOpen, Shield, Image, Clock, Layers,
} from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
];

const DIFFICULTIES = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export default function CourseEditor() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isEdit = id && id !== 'new';

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'frontend',
    difficulty: 'beginner',
    estimatedHours: 1,
    order: 1,
    thumbnail: '',
    prerequisites: '',
    isPublished: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    try {
      const { data } = await courseAPI.getById(id);
      const course = data.data;
      setForm({
        title: course.title || '',
        description: course.description || '',
        category: course.category || 'frontend',
        difficulty: course.difficulty || 'beginner',
        estimatedHours: course.estimatedHours || 1,
        order: course.order || 1,
        thumbnail: course.thumbnail || '',
        prerequisites: course.prerequisites?.join(', ') || '',
        isPublished: course.isPublished || false,
      });
    } catch (err) {
      toast.error('Failed to load course');
      navigate('/admin/courses');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (form.title.length > 100) newErrors.title = 'Title must be under 100 characters';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (form.estimatedHours < 1) newErrors.estimatedHours = 'Must be at least 1 hour';
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
        estimatedHours: Number(form.estimatedHours),
        order: Number(form.order),
        prerequisites: form.prerequisites 
          ? form.prerequisites.split(',').map(p => p.trim()).filter(Boolean)
          : [],
      };

      if (isEdit) {
        await adminAPI.updateCourse(id, payload);
        toast.success('Course updated');
      } else {
        await adminAPI.createCourse(payload);
        toast.success('Course created');
      }
      navigate('/admin/courses');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save course');
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

  if (loading) return <LoadingScreen main="Loading Course" secondary="Fetching course data" />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <Link 
          to="/admin/courses" 
          className="mb-2 flex items-center gap-1 text-sm text-[#5b5f97] transition-colors hover:text-[#b8b8d1]"
        >
          <ArrowLeft size={14} /> Back to Courses
        </Link>
        <h1 className="text-2xl font-bold text-[#b8b8d1]">
          {isEdit ? 'Edit Course' : 'Create New Course'}
        </h1>
        <p className="mt-1 text-sm text-[#a0a0b8]">
          {isEdit ? 'Update course details' : 'Fill in the details to create a new course'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-[#b8b8d1]">
              <BookOpen size={16} className="text-[#5b5f97]" />
              Basic Information
            </h3>
            
            <Input
              label="Course Title"
              placeholder="e.g., Introduction to HTML"
              value={form.title}
              onChange={handleChange('title')}
              error={errors.title}
            />

            <TextArea
              label="Description"
              placeholder="Describe what students will learn..."
              rows={4}
              value={form.description}
              onChange={handleChange('description')}
              error={errors.description}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Category"
                options={CATEGORIES}
                value={form.category}
                onChange={handleChange('category')}
                className="w-full"
              />
              <Select
                label="Difficulty"
                options={DIFFICULTIES}
                value={form.difficulty}
                onChange={handleChange('difficulty')}
                className="w-full"
              />
            </div>
          </div>

          {/* Details */}
          <div className="border-t border-[#2a2a4a] pt-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#b8b8d1]">
              <Clock size={16} className="text-[#5b5f97]" />
              Course Details
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Estimated Hours"
                type="number"
                min={1}
                value={form.estimatedHours}
                onChange={handleChange('estimatedHours')}
                error={errors.estimatedHours}
              />
              <Input
                label="Display Order"
                type="number"
                min={1}
                value={form.order}
                onChange={handleChange('order')}
              />
            </div>

            <Input
              label="Thumbnail URL"
              placeholder="https://example.com/image.jpg"
              icon={Image}
              value={form.thumbnail}
              onChange={handleChange('thumbnail')}
              wrapperClass="mt-4"
            />

            <Input
              label="Prerequisites (comma-separated)"
              placeholder="e.g., html-basics, css-fundamentals"
              icon={Layers}
              value={form.prerequisites}
              onChange={handleChange('prerequisites')}
              wrapperClass="mt-4"
            />
          </div>

          {/* Publish Toggle */}
          <div className="border-t border-[#2a2a4a] pt-6">
            <label className="flex cursor-pointer items-center justify-between rounded-lg border border-[#2a2a4a] bg-[#1a1a2e] p-4 transition-colors hover:border-[#5b5f97]/30">
              <div>
                <p className="font-medium text-[#b8b8d1]">Publish Course</p>
                <p className="text-sm text-[#a0a0b8]">Make this course visible to all users</p>
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
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-[#2a2a4a] pt-6">
            <Link to="/admin/courses">
              <Button type="button" variant="secondary">Cancel</Button>
            </Link>
            <Button type="submit" icon={Save} loading={saving}>
              {isEdit ? 'Update Course' : 'Create Course'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
