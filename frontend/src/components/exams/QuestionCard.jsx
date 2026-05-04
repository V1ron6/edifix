export default function QuestionCard({ question, selectedOption, onSelect }) {
  return (
    <article className="card">
      <h3>{question.question}</h3>
      <div className="question-options">
        {(question.options || []).map((option) => (
          <label key={option} className="option-row">
            <input
              type="radio"
              name={`q-${question.id || question._id}`}
              value={option}
              checked={selectedOption === option}
              onChange={() => onSelect(option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </article>
  );
}
