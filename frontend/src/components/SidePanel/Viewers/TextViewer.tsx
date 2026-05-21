export default function TextViewer({ textContent }: { textContent: string }) {
  return (
    <pre className="text-xs bg-muted p-3 rounded overflow-auto whitespace-pre-wrap font-mono">
      {textContent}
    </pre>
  );
}
