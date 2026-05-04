import { useEffect, useMemo, useState } from 'react';
import CourseCard from '../../components/courses/CourseCard';
import Badge from '../../components/shared/Badge';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { notifyError } from '../../components/shared/Toast';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { isCourseSaved, toggleSavedCourse } from '../../utils/learningStorage';
import { unwrap } from '../../utils/response';

const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function CourseList() {
  const { isAuthenticated } = useAuth();
  const [track, setTrack] = useState('frontend');
  const [difficulty, setDifficulty] = useState('All');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      setLoading(true);
      try {
        const response = await api.get(`/api/courses/learning-path/${track}`, { auth: false });
        setCourses(unwrap(response, []));
      } catch (error) {
        notifyError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, [track]);

  const filtered = useMemo(() => {
    if (difficulty === 'All') return courses;
    return courses.filter((course) => course.difficulty?.toLowerCase() === difficulty.toLowerCase());
  }, [courses, difficulty]);

  const handleToggleSaved = (course) => {
    toggleSavedCourse(course);
    setCourses((prev) => [...prev]);
  };

  if (loading) return <LoadingSpinner text="Loading courses..." />;

  return (
    <main className="page-main">
      <section className="track-row">
        <button className={`track-btn ${track === 'frontend' ? 'active' : ''}`} onClick={() => setTrack('frontend')}>Frontend Track</button>
        <button className={`track-btn ${track === 'backend' ? 'active' : ''}`} onClick={() => setTrack('backend')}>Backend Track</button>
      </section>
      <section className="filter-row">
        {difficulties.map((item) => (
          <button key={item} onClick={() => setDifficulty(item)}>
            <Badge kind={difficulty === item ? 'info' : 'neutral'}>{item}</Badge>
          </button>
        ))}
      </section>
      <section className="card-grid">
        {filtered.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            progress={course.percentage || 0}
            isAuthed={isAuthenticated}
            isSaved={isCourseSaved(course.id)}
            onToggleSave={handleToggleSaved}
          />
        ))}
      </section>
    </main>
  );
}
