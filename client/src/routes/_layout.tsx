import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";

export const Route = createFileRoute("/_layout")({
	component: Layout,
});

function Layout() {
	const navigate = Route.useNavigate();

	return (
		<div className="antialiased mx-auto max-w-4xl p-4 mt-10">
			<div className="text-center">
				<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
					PodSearch
				</h1>
				<p className="mt-4 text-lg text-muted-foreground">
					Search any keyword or sentence in a set of podcast episodes
				</p>
			</div>
			<div className="mx-auto mt-8 max-w-xl">
				<div className="relative">
					<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
						<SearchIcon className="w-5 h-5 text-muted-foreground" />
					</div>
					<input
						type="search"
						onChange={(e) => {
							if (!e.target.value) navigate({ to: "/" });
							if (e.target.value.length >= 4)
								navigate({ to: "/search", search: { q: e.target.value } });
						}}
						placeholder="Search for a keyword or phrase"
						className="block w-full p-4 pl-10 text-sm rounded-lg bg-muted focus:ring-primary focus:border-primary"
					/>
				</div>
			</div>
			<Outlet />
		</div>
	);
}
