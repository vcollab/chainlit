import TextViewer from './TextViewer';

export default function TextContentViewer({
  textContent
}: {
  textContent: string | null;
}) {
  if (!textContent) return null;

  return <TextViewer textContent={textContent || 'Failed to load file.'} />;
}
