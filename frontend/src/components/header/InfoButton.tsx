import { Info } from 'lucide-react';
import { forwardRef } from 'react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';

const InfoButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        ref={ref}
        id="readme-button"
        variant={'ghost'}
        size="icon"
        className="text-muted-foreground hover:text-muted-foreground"
        {...props}
      >
        <Info className="!size-5" />
      </Button>
    </TooltipTrigger>
    <TooltipContent>Info</TooltipContent>
  </Tooltip>
));
InfoButton.displayName = 'InfoButton';

export default InfoButton;
