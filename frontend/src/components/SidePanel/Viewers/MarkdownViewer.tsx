import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownViewer({
  textContent,
  viewMode
}: {
  textContent: string | null;
  viewMode: 'preview' | 'raw';
}) {
  if (!textContent) return null;

  return (
    <div className="flex flex-col h-full gap-2">
      {viewMode === 'preview' ? (
        <div className="text-sm leading-relaxed p-2 overflow-auto [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mb-2 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_code]:bg-muted [&_code]:px-1 [&_code]:rounded [&_pre]:bg-muted [&_pre]:p-2 [&_pre]:rounded [&_blockquote]:border-l-4 [&_blockquote]:pl-3 [&_blockquote]:opacity-70">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {textContent}
          </ReactMarkdown>
        </div>
      ) : (
        <pre className="text-xs bg-muted p-3 rounded overflow-auto whitespace-pre-wrap font-mono flex-1">
          {textContent}
        </pre>
      )}
    </div>
  );
}
