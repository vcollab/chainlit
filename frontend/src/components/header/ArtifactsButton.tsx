import { FolderOutput } from 'lucide-react';
import { useRecoilState } from 'recoil';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';

import { activeSidePanelState } from '@/state/project';

export default function ArtifactsButton() {
  const [activePanel, setActivePanel] = useRecoilState(activeSidePanelState);

  const isActive = activePanel === 'artifacts';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          id="artifacts-button"
          onClick={() => setActivePanel(isActive ? null : 'artifacts')}
          variant={isActive ? 'default' : 'ghost'}
          size="icon"
          className="text-muted-foreground hover:text-muted-foreground"
        >
          <FolderOutput className="!size-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Artifacts</TooltipContent>
    </Tooltip>
  );
}
