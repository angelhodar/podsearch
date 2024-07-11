export default function PodcastEpisode() {
    return <div className="p-4 bg-card rounded-lg shadow-sm flex flex-col items-start gap-4">
        <div className="flex items-start space-x-4 w-full">
            <img
                src="https://img-static.ivoox.com/index.php?w=145&h=145&url=https://static-2.ivoox.com/canales/3/6/5/8/3451583598563_XXL.jpg"
                alt="Podcast Thumbnail"
                width={80}
                height={80}
                className="rounded-lg object-cover"
            />
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-medium">The Productivity Podcast</h3>
                        <p className="text-sm text-muted-foreground">Episode 42 - Overcoming Procrastination</p>
                    </div>
                    <div className="text-sm text-muted-foreground">10:24 - 11:02</div>
                </div>
            </div>
        </div>

        <p className="text-muted-foreground">
            In this episode, we discuss practical tips for overcoming procrastination and boosting your productivity.
            The keyword "procrastination" was found in this time range.
        </p>
        <audio controls>
            <source src="podcast-episode-1.mp3" type="audio/mpeg" />
            Your browser does not support the audio element.
        </audio>
    </div>
}