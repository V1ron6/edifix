import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI } from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import { PageHeader, Card, Badge, TabGroup, EmptyState } from '../components/ui';
import { BookOpen, Clock, ArrowRight, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

const FILTERS = [
  { label: 'All', value: '' },
  { label: 'Frontend', value: 'frontend' },
  { label: 'Backend', value: 'backend' },
];

const DIFFICULTY_COLORS = {
  beginner: '#2ecc71',
  intermediate: '#f39c12',
  advanced: '#e74c3c',
};

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const params = {};
        if (category) params.category = category;
        const { data } = await courseAPI.getAll(params);
        setCourses(data.data || []);
      } catch {
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [category]);

  if (loading) return <LoadingScreen main="Loading courses" secondary="Fetching course catalog" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Courses"
        description="Follow the structured learning path"
        actions={
          <TabGroup
            tabs={FILTERS}
            active={category}
            onChange={setCategory}
          />
        }
      />

      {courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses available"
          description="Check back soon for new courses."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.slug}`}
              className="group"
            >
              <Card hover className="h-full">
                <div className="mb-3 flex items-center justify-between">
                  <Badge color={DIFFICULTY_COLORS[course.difficulty] || '#5b5f97'} dot>
                    {course.difficulty}
                  </Badge>
                  <Badge variant="outline">{course.category}</Badge>
                </div>
                <h3 className="mb-1.5 font-semibold text-[#b8b8d1] transition-colors group-hover:text-white">
                  {course.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-[#a0a0b8] line-clamp-2">{course.description}</p>
                <div className="mt-auto flex items-center justify-between text-xs text-[#5b5f97]">
                  <span className="flex items-center gap-1">
                    <BookOpen size={12} />
                    {course.lessons?.length || 0} lessons
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {course.estimatedHours}h
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs text-[#5b5f97] opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1">
                  View course <ArrowRight size={12} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
