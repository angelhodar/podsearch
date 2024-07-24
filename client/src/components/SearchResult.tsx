import AudioPlayer from "./AudioPlayer";

interface SearchResultProps {
	query: string;
	title: string;
	podcastTitle: string;
	releaseDate: string;
	offset: number;
	audio: string;
	thumbnail: string;
	start: number;
	end: number;
	transcription: string;
}

function secondsToMinutesFormat(seconds: number) {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = (seconds % 60).toFixed(0); // You might want a whole number for seconds

	// Padding with leading zeros for single digits
	const paddedMinutes = String(minutes).padStart(2, "0");
	const paddedSeconds = String(remainingSeconds).padStart(2, "0");

	return `${paddedMinutes}:${paddedSeconds}`;
}

export default function SearchResult(props: SearchResultProps) {
	const {
		query,
		title,
		podcastTitle,
		thumbnail,
		releaseDate,
		audio,
		offset,
		start,
		end,
		transcription,
	} = props;

	const parts = transcription.split(new RegExp(`(${query})`, "gi"));

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

			<p className="text-muted-foreground">
				{parts.map((part, index) =>
					part.toLowerCase() === query.toLowerCase() ? (
						<strong className="text-black" key={index}>{part}</strong>
					) : (
						part
					),
				)}
			</p>

			<div className="flex w-full items-center justify-between">
				<AudioPlayer audioUrl={audio} initialOffset={start - offset} />
				<div className="text-sm font-bold text-muted-foreground rounded-xl border p-2">
					{secondsToMinutesFormat(start)} - {secondsToMinutesFormat(end)}
				</div>
			</div>
		</div>
	);
}
