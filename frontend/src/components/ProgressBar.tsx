import { cn } from '@/lib/utils';

interface Props {
  className?: string;
}

const ProgressBar = ({ className }: Props) => (
  <div
    className={cn(
      'relative h-0.5 w-full overflow-hidden bg-muted/40',
      className
    )}
    role="progressbar"
    aria-busy="true"
    aria-label="Loading"
  >
    <div className="absolute h-full w-1/3 bg-primary rounded-full progress-slide" />
  </div>
);

export default ProgressBar;
