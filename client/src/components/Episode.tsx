import AudioPlayer from "./AudioPlayer";

export interface EpisodeProps {
  title: string;
  podcastTitle: string;
  thumbnail: string;
  processed: string;
  releaseDate: string;
  audio: string;
  description: string;
}

export function Episode(props: EpisodeProps) {
  const { title, podcastTitle, thumbnail, processed, releaseDate, audio, description } = props;

  return (
    <div className="p-4 bg-card rounded-lg shadow-sm flex flex-col items-start gap-4">
      <div className="flex items-start space-x-4 w-full">
        <img
          src={thumbnail}
          alt="Podcast Thumbnail"
          width={80}
          height={80}
          className="rounded-lg object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg">{title}</h3>
              <p className="text-sm text-muted-foreground">
                {podcastTitle} - {new Date(releaseDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-muted-foreground">{description}</p>

      <div className="flex w-full items-center justify-between">
        <AudioPlayer audioUrl={audio} />
        <div className="text-sm font-bold text-muted-foreground rounded-xl border p-2">
          {processed ? "PROCESADO" : "SIN PROCESAR"}
        </div>
      </div>
    </div>
  );
}
