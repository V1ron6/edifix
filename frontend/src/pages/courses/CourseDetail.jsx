import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LessonCard from '../../components/courses/LessonCard';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { notifyError } from '../../components/shared/Toast';
import { api } from '../../utils/api';
import { unwrap } from '../../utils/response';

export default function CourseDetail() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourse() {
      setLoading(true);
      try {
        const response = await api.get(`/api/courses/slug/${slug}`, { auth: false });
        setCourse(unwrap(response));
      } catch (error) {
        notifyError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadCourse();
  }, [slug]);

  if (loading) return <LoadingSpinner text="Loading course..." />;
  if (!course) return <p className="page-main">Course not found.</p>;

  return (
    <main className="page-main">
      <section className="card">
        <h1>{course.title}</h1>
        <p>{course.description}</p>
        <p>{course.category} • {course.difficulty} • {course.estimatedHours} hours</p>
      </section>
      <section className="stack-list">
        {(course.lessons || []).map((lesson, index) => {
          const previousLesson = course.lessons[index - 1];
          const locked = index > 0 && !previousLesson?.completed;
          return (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              index={index}
              courseSlug={course.slug}
              locked={locked}
            />
          );
        })}
      </section>
    </main>
  );
}
