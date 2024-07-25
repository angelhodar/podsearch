export interface SearchItemResponse {
  episodeTitle: string;
  startTime: number;
  endTime: number;
  position: number;
  duration: number;
  podcastTitle: string;
  thumbnailUrl: string;
  releaseDate: string;
  transcription: string;
  audioFileUrl: string;
}

export interface PodcastItemResponse {
  id: string;
  title: string;
  author: string;
  thumbnailUrl: string;
  link: string;
  description: string;
}

export interface EpisodeItemResponse {
  id: string;
  title: string;
  podcastTitle: string;
  thumbnailUrl: string;
  processed: string;
  releaseDate: string;
  audioFileUrl: string;
  description: string;
}

export interface PodcastResponse {
  title: string;
  episodes: EpisodeItemResponse[];
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string;

export const searchKeyword = async (q: string): Promise<SearchItemResponse[]> => {
  const res = await fetch(`${apiBaseUrl}/search?q=${q}`);
  if (!res.ok) throw new Error("Failed to fetch keyword");
  return await res.json();
};

export const fetchPodcasts = async (): Promise<PodcastItemResponse[]> => {
  const res = await fetch(`${apiBaseUrl}/podcasts`);
  if (!res.ok) throw new Error("Failed to fetch posts");
  return await res.json();
};

export const getPodcast = async (id: string): Promise<PodcastResponse> => {
  const res = await fetch(`${apiBaseUrl}/podcasts/${id}`);
  if (!res.ok) throw new Error("Failed to fetch podcast episodes");
  return await res.json();
};
