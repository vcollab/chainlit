import { cn } from '@/lib/utils';

interface Props {
  size?: number;
  className?: string;
}

const SpinnerSpokes = ({ size = 20, className }: Props) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={cn('animate-spin', className)}
    aria-label="Loading"
    role="status"
  >
    {Array.from({ length: 12 }).map((_, i) => (
      <rect
        key={i}
        x="11"
        y="2"
        width="2"
        height="6"
        rx="1"
        fill="currentColor"
        opacity={0.1 + (i / 11) * 0.9}
        transform={`rotate(${i * 30} 12 12)`}
      />
    ))}
  </svg>
);

export default SpinnerSpokes;
