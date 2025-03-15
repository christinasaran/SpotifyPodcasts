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

//am i using Episode?
export interface Episode {
  id: string;
  name: string;
  description: string;
}

export interface EpisodeList {
  podcastId: string;
  podcastName: string;
  episodes: Episode[];
}
