import { Files } from 'lucide-react';
import { useRecoilState } from 'recoil';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';

import { activeSidePanelState } from '@/state/project';

export default function SourcesButton() {
  const [activePanel, setActivePanel] = useRecoilState(activeSidePanelState);

  const isActive = activePanel === 'sources';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          id="sources-button"
          onClick={() => setActivePanel(isActive ? null : 'sources')}
          variant={isActive ? 'default' : 'ghost'}
          size="icon"
          className="text-muted-foreground hover:text-muted-foreground"
        >
          <Files className="!size-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Sources</TooltipContent>
    </Tooltip>
  );
}
