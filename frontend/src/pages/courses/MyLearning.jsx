import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../../components/courses/CourseCard';
import Badge from '../../components/shared/Badge';
import { getRecentLessons, getSavedCourses, toggleSavedCourse } from '../../utils/learningStorage';

export default function MyLearning() {
  const [savedCourses, setSavedCourses] = useState(getSavedCourses());
  const [recentLessons] = useState(getRecentLessons());

  const groupedRecent = useMemo(() => {
    return recentLessons.reduce((acc, item) => {
      if (!acc[item.courseTitle]) {
        acc[item.courseTitle] = [];
      }
      acc[item.courseTitle].push(item);
      return acc;
    }, {});
  }, [recentLessons]);

  const removeSavedCourse = (course) => {
    toggleSavedCourse(course);
    setSavedCourses(getSavedCourses());
  };

  return (
    <main className="page-main">
      <section className="card">
        <h1>My Learning</h1>
        <p>Keep your saved courses in one place and jump back to recently viewed lessons.</p>
      </section>

      <section>
        <h2>Saved Courses</h2>
        <div className="card-grid">
          {savedCourses.length === 0 ? <p>No saved courses yet.</p> : null}
          {savedCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isAuthed
              isSaved
              onToggleSave={() => removeSavedCourse(course)}
            />
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Recent Lessons</h2>
        {recentLessons.length === 0 ? <p>You have not opened any lessons yet.</p> : null}
        <div className="stack-list">
          {Object.entries(groupedRecent).map(([courseTitle, lessons]) => (
            <article key={courseTitle} className="card">
              <h3>{courseTitle}</h3>
              <div className="row-actions wrap-row">
                {lessons.map((lesson) => (
                  <Link key={`${lesson.courseSlug}-${lesson.lessonSlug}`} to={`/courses/${lesson.courseSlug}/${lesson.lessonSlug}`}>
                    <Badge kind="info">{lesson.lessonTitle}</Badge>
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
