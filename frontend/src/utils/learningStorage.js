const SAVED_COURSES_KEY = 'edifix_saved_courses';
const RECENT_LESSONS_KEY = 'edifix_recent_lessons';

function readArray(key) {
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeArray(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getSavedCourses() {
  return readArray(SAVED_COURSES_KEY);
}

export function isCourseSaved(courseId) {
  return getSavedCourses().some((course) => course.id === courseId);
}

export function toggleSavedCourse(course) {
  const list = getSavedCourses();
  const exists = list.some((item) => item.id === course.id);

  const next = exists
    ? list.filter((item) => item.id !== course.id)
    : [
        {
          id: course.id,
          slug: course.slug,
          title: course.title,
          description: course.description,
          difficulty: course.difficulty,
          estimatedHours: course.estimatedHours,
          thumbnail: course.thumbnail,
        },
        ...list,
      ];

  writeArray(SAVED_COURSES_KEY, next);
  return !exists;
}

export function getRecentLessons() {
  return readArray(RECENT_LESSONS_KEY);
}

export function addRecentLesson(lesson) {
  const list = getRecentLessons().filter((item) => item.lessonSlug !== lesson.lessonSlug || item.courseSlug !== lesson.courseSlug);
  const next = [lesson, ...list].slice(0, 8);
  writeArray(RECENT_LESSONS_KEY, next);
}
