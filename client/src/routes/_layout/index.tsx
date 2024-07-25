import { createFileRoute, Link } from "@tanstack/react-router";
import { Podcast } from "../../components/Podcast";
import { fetchPodcasts } from "../../lib/api";

export const Route = createFileRoute("/_layout/")({
  component: Index,
  loader: () => fetchPodcasts(),
});

function Index() {
  const podcasts = Route.useLoaderData();

  return (
    <div className="mx-auto mt-12 max-w-3xl grid gap-6">
      {podcasts.map((p) => (
        <Link key={p.id} to="/podcasts/$id" params={{ id: p.id }}>
          <Podcast
            key={p.id}
            title={p.title}
            thumbnail={p.thumbnailUrl}
            link={p.link}
            description={p.description}
            author={p.author}
          />
        </Link>
      ))}
    </div>
  );
}
