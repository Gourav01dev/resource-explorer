// hooks/useFavorites.ts
import { useState, useEffect } from "react";
import { Character } from "@/types";

// Create a simple event emitter
const favoritesUpdatedEvent = new EventTarget();

export const useFavorites = () => {
    const [favorites, setFavorites] = useState<number[]>([]);
    const [favoriteCharacters, setFavoriteCharacters] = useState<Character[]>([]);
    const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load favorites from localStorage and fetch character data
    useEffect(() => {
        const initializeFavorites = async () => {
            setIsLoadingFavorites(true);

            try {
                // Load from localStorage
                const stored = localStorage.getItem("favoriteCharacters");
                const initialFavorites = stored ? JSON.parse(stored) : [];
                setFavorites(initialFavorites);

                // Fetch character data if there are favorites
                if (initialFavorites.length > 0) {
                    const response = await fetch(`https://rickandmortyapi.com/api/character/${initialFavorites.join(",")}`);

                    if (response.ok) {
                        const data = await response.json();
                        setFavoriteCharacters(Array.isArray(data) ? data : [data]);
                    }
                }
            } catch (error) {
                console.error("Failed to initialize favorites:", error);
            } finally {
                setIsLoadingFavorites(false);
                setIsInitialized(true);
            }
        };

        if (!isInitialized) {
            initializeFavorites();
        }
    }, [isInitialized]);

    // Update favoriteCharacters when favorites change (after initialization)
    useEffect(() => {
        const updateFavoriteCharacters = async () => {
            if (!isInitialized || favorites.length === 0) {
                if (favorites.length === 0) {
                    setFavoriteCharacters([]);
                }
                return;
            }

            setIsLoadingFavorites(true);
            try {
                const response = await fetch(`https://rickandmortyapi.com/api/character/${favorites.join(",")}`);

                if (response.ok) {
                    const data = await response.json();
                    setFavoriteCharacters(Array.isArray(data) ? data : [data]);
                }
            } catch (error) {
                console.error("Failed to fetch favorite characters:", error);
            } finally {
                setIsLoadingFavorites(false);
            }
        };

        updateFavoriteCharacters();
    }, [favorites, isInitialized]);

    // Listen for favorites updates from other components
    useEffect(() => {
        const handleFavoritesUpdate = () => {
            const stored = localStorage.getItem("favoriteCharacters");
            if (stored) {
                const updatedFavorites = JSON.parse(stored);
                setFavorites(updatedFavorites);
            }
        };

        favoritesUpdatedEvent.addEventListener("favoritesUpdated", handleFavoritesUpdate as EventListener);
        
        return () => {
            favoritesUpdatedEvent.removeEventListener("favoritesUpdated", handleFavoritesUpdate as EventListener);
        };
    }, []);

    const saveFavorites = (newFavorites: number[]) => {
        setFavorites(newFavorites);
        localStorage.setItem("favoriteCharacters", JSON.stringify(newFavorites));
        // Notify other components that favorites have been updated
        favoritesUpdatedEvent.dispatchEvent(new Event("favoritesUpdated"));
    };

    const addFavorite = (id: number) => {
        const newFavorites = [...favorites, id];
        saveFavorites(newFavorites);
    };

    const removeFavorite = (id: number) => {
        const newFavorites = favorites.filter(favId => favId !== id);
        saveFavorites(newFavorites);
    };

    const toggleFavorite = (id: number) => {
        if (favorites.includes(id)) {
            removeFavorite(id);
        } else {
            addFavorite(id);
        }
    };

    const isFavorite = (id: number) => favorites.includes(id);

    return {
        favorites,
        favoriteCharacters,
        isLoadingFavorites,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
    };
};