import { client } from "./db"
import { processEpisode } from "./cron";

(async () => {
    console.log("Start")

    await client.connect()

    console.log("Process audio")
    
	await processEpisode();
})();
