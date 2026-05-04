import Button from './Button';

export default function Pagination({ page = 1, hasNext = false, onPrev, onNext }) {
  return (
    <div className="pagination">
      <Button variant="secondary" disabled={page <= 1} onClick={onPrev}>Previous</Button>
      <span>Page {page}</span>
      <Button variant="secondary" disabled={!hasNext} onClick={onNext}>Next</Button>
    </div>
  );
}
