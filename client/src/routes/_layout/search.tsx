import { createFileRoute } from '@tanstack/react-router'
import SearchResultItem from '../../components/SearchResult';

const searchKeyword = async (q: string) => {
	const res = await fetch(`http://localhost:3000/search?q=${q}`);
	if (!res.ok) throw new Error("Failed to fetch keyword");
	return res.json();
};

export const Route = createFileRoute('/_layout/search')({
  validateSearch: (search) => search as { q: string },
  loaderDeps: ({ search: { q } }) => ({ q }),
  loader: async ({ deps: { q } }) => searchKeyword(q),
  component: SearchResult
})

function SearchResult() {
  const { q } = Route.useSearch();
	const results = Route.useLoaderData();

	return (
		<div className="mx-auto mt-12 max-w-3xl grid gap-6">
			{results.map((r: any, i: number) => (
				<SearchResultItem
					key={i}
          query={q}
					title={r.episodeTitle}
          start={r.startTime}
          end={r.endTime}
          offset={r.position * r.duration}
					podcastTitle={r.podcastTitle}
					thumbnail={r.thumbnailUrl}
					releaseDate={r.releaseDate}
					transcription={r.transcription}
					audio={r.audioFileUrl}
				/>
			))}
		</div>
	);
}