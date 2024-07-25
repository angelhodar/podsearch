import { useEffect, useRef, type ElementRef } from "react";

interface AudioPlayerProps {
  audioUrl: string;
  initialOffset?: number;
}

export default function AudioPlayer(props: AudioPlayerProps) {
  const { audioUrl, initialOffset = 0 } = props;

  const audioRef = useRef<ElementRef<"audio">>(null);

  useEffect(() => {
    const audioElement = audioRef.current;

    if (!audioElement) return;

    const handleLoadedMetadata = () => {
      audioElement.currentTime = initialOffset;
    };

    // Ensure we set the start time when metadata is loaded
    audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);

    // Clean up the event listener when the component unmounts
    return () => {
      audioElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [initialOffset]);

  const transformedAudioUrl = audioUrl.startsWith("https")
    ? audioUrl
    : `https://podsearch.s3.eu-west-1.amazonaws.com/${audioUrl}`;

  return (
    <audio controls ref={audioRef}>
      <source src={transformedAudioUrl} />
    </audio>
  );
}
