
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

export type Question = {
    id: string;
    created_at: string;
    question_text: string;
    options: string[];
    correct_answer_index: number;
    category: string | null;
    difficulty: string | null;
    video_id?: string | null; // Optional link to a specific video
};
