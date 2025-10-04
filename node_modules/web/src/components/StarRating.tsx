type Props = {
  value: number;
  onChange?: (n: number) => void;
};

export default function StarRating({ value, onChange }: Props) {
  return (
    <div className="stars" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          role="radio"
          aria-checked={n === value}
          className={"star " + (n <= value ? 'active' : '')}
          onClick={() => onChange?.(n)}
          onKeyDown={(e) => (e.key === 'Enter' ? onChange?.(n) : undefined)}
          tabIndex={0}
        >
          ★
        </span>
      ))}
    </div>
  );
}

