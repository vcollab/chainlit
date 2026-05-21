import ReactPlayer from 'react-player';

export default function VideoViewer({ url }: { url: string }) {
  return <ReactPlayer url={url} controls width="100%" height="100%" />;
}
