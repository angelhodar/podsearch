interface PodcastProps {
	title: string;
	author: string;
	thumbnail: string;
	link: string;
	description: string;
}

export default function Podcast(props: PodcastProps) {
	const { title, author, thumbnail, link, description } = props;

	return (
		<div className="p-6 bg-white border rounded-lg shadow-lg flex flex-col">
			<div className="flex items-start gap-4">
				<img
					src={thumbnail}
					alt="Podcast Thumbnail"
					width={80}
					height={80}
					className="rounded-lg object-cover"
				/>
				<div className="flex-1">
					<h3 className="text-lg font-medium">{title}</h3>
					<p className="text-base text-muted-foreground">{author}</p>
					<a href={link} target="_blank" rel="noreferrer" className="text-sm text-blue-500 hover:underline">
						{link}
					</a>
				</div>
			</div>
			<div className="mt-3">
				<p className="text-sm text-muted-foreground">{description}</p>
			</div>
		</div>
	);
}
