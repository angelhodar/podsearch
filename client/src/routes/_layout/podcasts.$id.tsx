import { createFileRoute } from "@tanstack/react-router";
import { Episode } from "../../components/Episode";
import { getPodcast } from "../../lib/api";

export const Route = createFileRoute("/_layout/podcasts/$id")({
  loader: async ({ params: { id } }) => getPodcast(id),
  component: Podcast,
});

function Podcast() {
  const podcast = Route.useLoaderData();

  return (
    <div className="mx-auto mt-12 max-w-3xl grid gap-6">
      {podcast.episodes.map((e) => (
        <Episode
          key={e.id}
          title={e.title}
          processed={e.processed}
          podcastTitle={podcast.title}
          thumbnail={e.thumbnailUrl}
          releaseDate={e.releaseDate}
          description={e.description}
          audio={e.audioFileUrl}
        />
      ))}
    </div>
  );
}
