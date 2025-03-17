export interface Podcast {
  id: string;
  name: string;
  description: string;
  images: {
    height: number;
    url: string;
    width: number;
  }[];
}
export interface SelectedPodcast {
  id: string;
  name: string;
}

export interface Episode {
  id: string;
  name: string;
  description: string;
  release_date: string;
}

export interface EpisodeList {
  podcastId: string;
  podcastName: string;
  episodes: Episode[];
}

export interface SelectedEvent {
  podcastName: string;
  name: string;
  description: string;
  release_date: string;
  external_urls?: { spotify: string };
  images?: Array<{ url: string }>;
}
