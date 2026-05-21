export default function ImageViewer({
  url,
  fileName
}: {
  url: string;
  fileName: string;
}) {
  return <img src={url} alt={fileName} className="max-w-full h-auto rounded" />;
}
