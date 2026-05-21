import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@radix-ui/react-tooltip';
import { Code, FileText } from 'lucide-react';

import { Button } from '../ui/button';

export default function PreviewRawSwitch({
  viewMode,
  setViewMode
}: {
  viewMode: 'preview' | 'raw';
  setViewMode: (val: 'preview' | 'raw') => void;
}) {
  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            id="preview-button"
            onClick={() => setViewMode('preview')}
            variant={viewMode === 'preview' ? 'default' : 'ghost'}
            size="icon"
          >
            <FileText className="size-3" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Preview</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            id="raw-button"
            onClick={() => setViewMode('raw')}
            variant={viewMode === 'raw' ? 'default' : 'ghost'}
            size="icon"
          >
            <Code className="size-3" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Raw</TooltipContent>
      </Tooltip>
    </>
  );
}
