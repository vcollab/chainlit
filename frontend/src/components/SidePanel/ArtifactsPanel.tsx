import {
  ArrowLeft,
  Braces,
  CodeXml,
  ExternalLink,
  File,
  FileSpreadsheet,
  FileText,
  Film,
  Folder,
  FolderArchive,
  FolderOpen,
  Image,
  RefreshCw
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { currentThreadIdState } from '@chainlit/react-client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ResizableHandle, ResizablePanel } from '@/components/ui/resizable';

import PreviewRawSwitch from './PreviewRawSwitch';
import Viewer from './Viewers/Viewer';

const API_BASE = '/api';

interface FileInfo {
  name: string;
  path: string;
  size: number;
  type: string;
  modified: number;
}

type ArtifactTree = {
  [key: string]: ArtifactTree | FileInfo;
};

function isFileInfo(node: ArtifactTree | FileInfo): node is FileInfo {
  return 'size' in node && 'name' in node;
}

export function fileIcon(type: string) {
  if (COMPRESSED_TYPES.includes(type)) {
    return <FolderArchive className="size-4 text-muted-foreground" />;
  }
  if (XML_TYPES.includes(type)) {
    return <CodeXml className="size-4 text-red-500" />;
  }
  if (CODE_TYPES.includes(type)) {
    return <Braces className="size-4 text-yellow-500" />;
  }
  if (EXCEL_TYPES.includes(type)) {
    return <FileSpreadsheet className="size-4 text-green-500" />;
  }
  if (VIDEO_TYPES.includes(type)) {
    return <Film className="size-4 text-purple-500" />;
  }
  if (IMAGE_TYPES.includes(type)) {
    return <Image className="size-4 text-blue-500" />;
  }
  if (['pdf', ...TEXT_TYPES].includes(type)) {
    return <FileText className="size-4 text-muted-foreground" />;
  }
  return <File className="size-4 text-muted-foreground" />;
}

const VIDEO_TYPES = ['mp4', 'webm', 'mov', 'avi', 'aac', 'm4a', 'ogg', 'wav'];
const IMAGE_TYPES = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'bmp', 'webp'];
const TEXT_TYPES = ['txt', 'md', 'csv', 'log'];
const XML_TYPES = ['html', 'xml'];
const EXCEL_TYPES = ['xlsx', 'csv', 'xls'];
const CODE_TYPES = ['json', 'py', 'js', 'ts', 'jsx', 'tsx', 'yaml', 'yml'];
const COMPRESSED_TYPES = ['zip', '7z'];

// ── Tree node ───────────────────────────────────────────────────────────

function TreeNode({
  name,
  node,
  depth,
  onFileClick
}: {
  name: string;
  node: ArtifactTree | FileInfo;
  depth: number;
  onFileClick: (file: FileInfo) => void;
}) {
  const [expanded, setExpanded] = useState(true);

  if (isFileInfo(node)) {
    return (
      <button
        className="flex items-center gap-1.5 py-1 px-1 rounded text-sm hover:bg-accent w-full text-left"
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => onFileClick(node)}
      >
        {fileIcon(node.type)}
        <span className="truncate">{name}</span>
      </button>
    );
  }

  const entries = Object.entries(node);
  return (
    <div>
      <button
        className="flex items-center gap-1.5 py-1 px-1 rounded text-sm hover:bg-accent w-full text-left font-medium"
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? (
          <FolderOpen className="size-4 text-yellow-600" />
        ) : (
          <Folder className="size-4 text-yellow-600" />
        )}
        <span>{name}</span>
      </button>
      {expanded &&
        entries.map(([childName, childNode]) => (
          <TreeNode
            key={childName}
            name={childName}
            node={childNode}
            depth={depth + 1}
            onFileClick={onFileClick}
          />
        ))}
    </div>
  );
}

// ── File preview ────────────────────────────────────────────────────────

function FilePreview({ file, onBack }: { file: FileInfo; onBack: () => void }) {
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');
  const [showViewModeSwitch, setShowViewModeSwitch] = useState<boolean>(false);
  const url = `${API_BASE}/artifacts/preview/${encodeURIComponent(file.path)}`;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b flex items-center gap-1 shrink-0">
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
          fileName={file.name}
          url={url}
          viewMode={viewMode}
          setViewMode={setViewMode}
          setShowViewModeSwitch={setShowViewModeSwitch}
        />
      </div>
    </div>
  );
}

// ── Main panel ──────────────────────────────────────────────────────────

export default function ArtifactsPanel() {
  const threadId = useRecoilValue(currentThreadIdState);
  const [tree, setTree] = useState<ArtifactTree>({});
  const [preview, setPreview] = useState<FileInfo | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/artifacts/tree`);
      if (res.ok) setTree(await res.json());
    } catch (e) {
      console.error('Failed to fetch artifacts:', e);
    }
  }, []);

  // Re-fetch when thread changes
  useEffect(() => {
    setPreview(null);
    refresh();
  }, [threadId, refresh]);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, [refresh]);

  const entries = Object.entries(tree);

  const panelContent = preview ? (
    <FilePreview file={preview} onBack={() => setPreview(null)} />
  ) : (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b flex items-center justify-between shrink-0">
        <h2 className="text-sm font-semibold">Artifacts</h2>
        <Button variant="ghost" size="icon" onClick={refresh}>
          <RefreshCw className="size-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-2">
        {entries.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-8">
            <Folder className="size-8 mx-auto mb-2 opacity-50" />
            <p>No artifacts yet.</p>
            <p className="text-xs mt-1">Claude will generate files here</p>
          </div>
        ) : (
          entries.map(([name, node]) => (
            <TreeNode
              key={name}
              name={name}
              node={node}
              depth={0}
              onFileClick={setPreview}
            />
          ))
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
