import TextViewer from './TextViewer';

export default function HtmlViewer({
  textContent,
  fileName,
  viewMode
}: {
  textContent: string | null;
  fileName: string;
  viewMode: 'preview' | 'raw';
}) {
  if (!textContent) return null;

  return (
    <div className="flex flex-col h-full gap-2">
      {viewMode === 'preview' ? (
        <iframe
          srcDoc={textContent || 'Failed to load file.'}
          sandbox="allow-scripts"
          className="w-full flex-1 border-0 rounded"
          title={fileName}
        />
      ) : (
        <TextViewer textContent={textContent || 'Failed to load file.'} />
      )}
    </div>
  );
}
