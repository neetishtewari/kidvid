
export type Playlist = {
    id: string;
    created_at: string;
    title: string;
    description: string | null;
    parent_id: string;
};

export type Video = {
    id: string;
    created_at: string;
    playlist_id: string;
    youtube_id: string;
    title: string | null;
    duration_seconds: number | null;
};
