import React, { createContext, useContext, useState, ReactNode } from 'react';

type PlaylistContextType = {
    playlist: string[];
    addToPlaylist: (videoId: string) => void;
    removeFromPlaylist: (videoId: string) => void;
};

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export function PlaylistProvider({ children }: { children: ReactNode }) {
    // Mock initial data for easy testing
    const [playlist, setPlaylist] = useState<string[]>(['d6iQrh2TK98', '5npJ3YnL9nE']); // Default videos: "Learn Colors", "ABC Song"

    const addToPlaylist = (videoId: string) => {
        setPlaylist((prev) => [...prev, videoId]);
    };

    const removeFromPlaylist = (videoId: string) => {
        setPlaylist((prev) => prev.filter((id) => id !== videoId));
    };

    return (
        <PlaylistContext.Provider value={{ playlist, addToPlaylist, removeFromPlaylist }}>
            {children}
        </PlaylistContext.Provider>
    );
}

export function usePlaylist() {
    const context = useContext(PlaylistContext);
    if (context === undefined) {
        throw new Error('usePlaylist must be used within a PlaylistProvider');
    }
    return context;
}
