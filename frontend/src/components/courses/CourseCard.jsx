import { Link } from 'react-router-dom';
import DifficultyBadge from './DifficultyBadge';
import ProgressBar from '../shared/ProgressBar';
import Button from '../shared/Button';

export default function CourseCard({ course, progress = 0, isAuthed = false }) {
  return (
    <article className="card course-card">
      {course.thumbnail ? <img src={course.thumbnail} alt={course.title} className="course-thumb" /> : null}
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <DifficultyBadge level={course.difficulty || 'Beginner'} />
      <p>{course.estimatedHours || 0} hours</p>
      {isAuthed ? <ProgressBar value={progress} /> : null}
      <Link to={`/courses/${course.slug}`}>
        <Button>{progress > 0 ? 'Continue' : 'Start'}</Button>
      </Link>
    </article>
  );
}
