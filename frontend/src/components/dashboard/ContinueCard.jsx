import { Link } from 'react-router-dom';
import Button from '../shared/Button';

export default function ContinueCard({ lesson }) {
  return (
    <section className="card continue-card">
      <h3>Continue Learning</h3>
      {lesson ? (
        <>
          <p>{lesson.title}</p>
          <small>{lesson.courseName}</small>
          <Link to={`/courses/${lesson.courseSlug}/${lesson.lessonSlug}`}>
            <Button>Continue</Button>
          </Link>
        </>
      ) : (
        <p>You are all caught up.</p>
      )}
    </section>
  );
}
