import { createFileRoute } from "@tanstack/react-router";
import Episode from "../../components/Episode";

const fetchEpisodes = async (id: string) => {
	const res = await fetch(`http://localhost:3000/podcasts/${id}`);
	if (!res.ok) throw new Error("Failed to fetch podcast episodes");
	return res.json();
};

export const Route = createFileRoute("/_layout/podcasts/$id")({
	loader: async ({ params: { id } }) => fetchEpisodes(id),
	component: Podcast,
});

function Podcast() {
	const podcast = Route.useLoaderData();

	return (
		<div className="mx-auto mt-12 max-w-3xl grid gap-6">
			{podcast.episodes.map((e: any) => (
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
