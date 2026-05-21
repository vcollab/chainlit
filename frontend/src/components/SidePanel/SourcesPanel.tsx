import { ArrowLeft, ExternalLink, Plus, Trash2, Upload } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { currentThreadIdState } from '@chainlit/react-client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ResizableHandle, ResizablePanel } from '@/components/ui/resizable';

import { fileIcon } from './ArtifactsPanel';
import PreviewRawSwitch from './PreviewRawSwitch';
import Viewer from './Viewers/Viewer';

interface FileInfo {
  name: string;
  path: string;
  size: number;
  type: string;
  modified: number;
}

const API_BASE = '/api';

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FilePreview({ file, onBack }: { file: FileInfo; onBack: () => void }) {
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');
  const [showViewModeSwitch, setShowViewModeSwitch] = useState<boolean>(false);
  const url = `${API_BASE}/sources/preview/${encodeURIComponent(file.name)}`;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b flex items-center gap-2 shrink-0">
        <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2">
          <ArrowLeft className="size-4" />
        </Button>
        <span className="text-sm font-medium truncate flex-1">{file.name}</span>
        {showViewModeSwitch && (
          <PreviewRawSwitch viewMode={viewMode} setViewMode={setViewMode} />
        )}
        <a href={url} target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" size="icon">
            <ExternalLink className="size-3" />
          </Button>
        </a>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <Viewer
          url={url}
          fileName={file.name}
          viewMode={viewMode}
          setViewMode={setViewMode}
          setShowViewModeSwitch={setShowViewModeSwitch}
        />
      </div>
    </div>
  );
}

export default function SourcesPanel() {
  const threadId = useRecoilValue(currentThreadIdState);
  const [sources, setSources] = useState<FileInfo[]>([]);
  const [preview, setPreview] = useState<FileInfo | null>(null);
  const [dragging, setDragging] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/sources`);
      if (res.ok) setSources(await res.json());
    } catch (e) {
      console.error('Failed to fetch sources:', e);
    }
  }, []);

  // Re-fetch when thread changes
  useEffect(() => {
    setPreview(null);
    refresh();
  }, [threadId, refresh]);

  const handleUpload = async (files: FileList | File[]) => {
    for (const file of Array.from(files)) {
      const form = new FormData();
      form.append('file', file);
      await fetch(`${API_BASE}/sources/upload`, {
        method: 'POST',
        body: form
      });
    }
    await refresh();
  };

  const handleDelete = async (filename: string) => {
    await fetch(`${API_BASE}/sources/${encodeURIComponent(filename)}`, {
      method: 'DELETE'
    });
    if (preview?.name === filename) setPreview(null);
    await refresh();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) handleUpload(e.dataTransfer.files);
  };

  const handleFileInput = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = () => {
      if (input.files?.length) handleUpload(input.files);
    };
    input.click();
  };

  const panelContent = preview ? (
    <FilePreview file={preview} onBack={() => setPreview(null)} />
  ) : (
    <div
      ref={dropRef}
      className="flex flex-col h-full relative"
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center justify-between shrink-0">
        <h2 className="text-sm font-semibold">Sources ({sources.length})</h2>
        <Button variant="ghost" size="icon" onClick={handleFileInput}>
          <Plus className="size-4" />
        </Button>
      </div>

      {/* File cards */}
      <div className="flex-1 overflow-auto p-3">
        {sources.length === 0 && !dragging && (
          <div className="text-center text-muted-foreground text-sm py-8">
            <Upload className="size-8 mx-auto mb-2 opacity-50" />
            <p>No source files yet.</p>
            <p className="text-xs mt-1">Drop files here or click +</p>
          </div>
        )}

        <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2">
          {sources.map((file) => (
            <div
              key={file.name}
              className="border rounded-lg p-2 flex flex-col items-center gap-1 cursor-pointer hover:bg-accent transition-colors group relative"
              onClick={() => setPreview(file)}
            >
              {fileIcon(file.type)}
              <span className="text-xs font-medium truncate w-full text-center">
                {file.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatSize(file.size)}
              </span>
              <button
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-destructive hover:text-destructive-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(file.name);
                }}
              >
                <Trash2 className="size-3" />
              </button>
            </div>
          ))}
        </div>

        {dragging && (
          <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-lg flex items-center justify-center z-10">
            <p className="text-sm font-medium text-primary">
              Drop files to add
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <ResizableHandle className="sm:hidden md:block bg-transparent" />
      <ResizablePanel
        minSize={10}
        defaultSize={30}
        className="md:flex flex-col flex-grow sm:hidden"
      >
        <aside className="relative flex-grow overflow-auto mr-4 mb-4">
          <Card className="overflow-auto h-full relative flex flex-col">
            <CardContent className="flex flex-col flex-grow p-0">
              {panelContent}
            </CardContent>
          </Card>
        </aside>
      </ResizablePanel>
    </>
  );
}
