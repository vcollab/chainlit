import { useEffect, useState } from 'react';

import ChartViewer from './ChartViewer';
import CsvViewer from './CsvViewer';
import HtmlViewer from './HtmlViewer';
import ImageViewer from './ImageViewer';
import MarkdownViewer from './MarkdownViewer';
import NoViewer from './NoViewer';
import PdfViewer from './PdfViewer';
import TextContentViewer from './TextContentViewer';
import VideoViewer from './VideoViewer';

type ContentTypes =
  | 'text/plain'
  | 'text/markdown'
  | 'application/x-zip-compressed'
  | 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  | 'application/vnd.ms-powerpoint'
  | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  | 'application/vnd.ms-excel'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  | 'application/msword'
  | 'application/vnd.vcollab.chart+json'
  | 'application/json'
  | 'application/pdf'
  | 'text/csv'
  | 'application/xml'
  | 'text/html'
  | 'image/png'
  | 'image/jpg'
  | 'image/jpeg'
  | 'image/gif'
  | 'image/svg'
  | 'image/svg+xml'
  | 'image/bmp'
  | 'image/webp'
  | 'video/mp4'
  | 'video/webm'
  | 'video/mov'
  | 'video/avi'
  | 'text/x-python'
  | 'text/javascript'
  | 'text/css'
  | 'application/yaml'
  | 'application/zip';

export default function Viewer({
  fileName,
  url,
  viewMode,
  setViewMode,
  setShowViewModeSwitch
}: {
  fileName: string;
  url: string;
  viewMode: 'preview' | 'raw';
  setViewMode: (val: 'preview' | 'raw') => void;
  setShowViewModeSwitch: (val: boolean) => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [ViewerType, setViewerType] = useState<React.ElementType | null>(null);
  const [textContent, setTextContent] = useState<string | null>(null);

  useEffect(() => {
    fetchFileData();
  }, [url]);

  const findFileType = (contentType: ContentTypes | null) => {
    if (!contentType) {
      setViewerType(null);
    } else if (contentType === 'application/vnd.vcollab.chart+json') {
      setViewerType(() => ChartViewer);
      setShowViewModeSwitch(true);
      setViewMode('preview');
    } else if (contentType === 'application/pdf') {
      setViewerType(() => PdfViewer);
      setShowViewModeSwitch(false);
      setViewMode('preview');
    } else if (contentType === 'text/csv') {
      setViewerType(() => CsvViewer);
      setShowViewModeSwitch(true);
      setViewMode('preview');
    } else if (contentType.startsWith('image/')) {
      setViewerType(() => ImageViewer);
      setShowViewModeSwitch(false);
      setViewMode('preview');
    } else if (contentType.startsWith('video/')) {
      setViewerType(() => VideoViewer);
      setShowViewModeSwitch(false);
      setViewMode('preview');
    } else if (contentType === 'text/markdown') {
      setViewerType(() => MarkdownViewer);
      setShowViewModeSwitch(true);
      setViewMode('preview');
    } else if (contentType === 'text/html') {
      setViewerType(() => HtmlViewer);
      setShowViewModeSwitch(true);
      setViewMode('preview');
    } else if (
      contentType === 'application/zip' ||
      contentType === 'application/x-zip-compressed'
    ) {
      setViewerType(() => NoViewer);
      setShowViewModeSwitch(false);
    } else if (
      contentType === 'application/msword' ||
      contentType ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      setViewerType(() => NoViewer);
      setShowViewModeSwitch(false);
    } else if (
      contentType === 'application/vnd.ms-excel' ||
      contentType ===
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ) {
      setViewerType(() => NoViewer);
      setShowViewModeSwitch(false);
    } else if (
      contentType === 'application/vnd.ms-powerpoint' ||
      contentType ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      setViewerType(() => NoViewer);
      setShowViewModeSwitch(false);
    } else {
      setViewerType(() => TextContentViewer);
      setViewMode('raw');
    }
  };

  const fetchFileData = async () => {
    try {
      setLoading(true);
      const response = await fetch(url);
      const headers = response.headers;
      const textResponse = await response.text();
      const contentType = headers.get('content-type')?.split(';')[0];

      setTextContent(textResponse);
      findFileType(contentType as ContentTypes | null);
    } catch (error) {
      console.error(String(error));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  return ViewerType && textContent ? (
    <ViewerType
      url={url}
      textContent={textContent}
      fileName={fileName}
      viewMode={viewMode}
    />
  ) : (
    <NoViewer />
  );
}
