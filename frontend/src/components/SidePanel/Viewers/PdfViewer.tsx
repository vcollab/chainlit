export default function PdfViewer({
  url,
  fileName
}: {
  url: string;
  fileName: string;
}) {
  return (
    <iframe
      src={url}
      className="w-full h-full border-0 rounded"
      title={fileName}
    />
  );
}
