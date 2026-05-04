import { CheckCircle2, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LessonCard({ courseSlug, lesson, index, locked }) {
  return (
    <div className={`card lesson-card ${locked ? 'locked' : ''}`}>
      <div>
        <h4>{index + 1}. {lesson.title}</h4>
        <p>{lesson.type} • {lesson.estimatedMinutes || 0} min</p>
      </div>
      <div className="lesson-state">
        {lesson.completed ? <CheckCircle2 size={18} /> : null}
        {locked ? <Lock size={18} /> : null}
        {!locked ? <Link to={`/courses/${courseSlug}/${lesson.slug}`}>Open</Link> : null}
      </div>
    </div>
  );
}
