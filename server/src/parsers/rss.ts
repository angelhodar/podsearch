import Parser from 'rss-parser';
import { CreatePodcast, CreatePodcastEpisode } from "../db/schema"

const parser = new Parser()

type ParsedPodcastEpisode = Omit<CreatePodcastEpisode, "podcastId">

interface ParsedPodcast {
    podcast: CreatePodcast
    episodes: Array<ParsedPodcastEpisode>
}

export async function parseFromRssFeed(url: string): Promise<ParsedPodcast> {
    const feed = await parser.parseURL(url);

    const podcast: CreatePodcast = {
        title: feed.title as string,
        description: feed.title,
        link: feed.link,
        language: feed.language,
        author: feed.itunes?.author as string,
        categories: feed.itunes?.categories,
        thumbnailUrl: feed.image?.url as string
    }

    const episodes: Array<ParsedPodcastEpisode> = feed.items.map((item) => {
        return {
            title: item.title as string,
            releaseDate: item.releaseDate,
            audioFileUrl: item.enclosure?.url as string,
            description: item.summary,
            thumbnailUrl: item.itunes.image
        }
    })

    return { podcast, episodes }
}