interface VideoPlayerProps {
  videoUrl: string;
}

const VideoPlayer = ({ videoUrl }: VideoPlayerProps) => {
  return (
    <div className="mb-6 w-full max-w-3xl aspect-video">
      <iframe
        src={videoUrl}
        title="Course Video"
        width="100%"
        height="100%"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="rounded"
      ></iframe>
    </div>
  );
};

export default VideoPlayer;
