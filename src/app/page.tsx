"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useCharacters } from "@/hooks/useCharacters";
import { useFavorites } from "@/hooks/useFavorites";
import { SearchFilters } from "@/components/SearchFilters";
import { CharacterList } from "@/components/CharacterList";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ErrorDisplay } from "@/components/ErrorDisplay";

export default function HomePage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const { favorites, favoriteCharacters, isLoadingFavorites } = useFavorites();

    const name = searchParams.get("name") || undefined;
    const status = searchParams.get("status") || undefined;
    const species = searchParams.get("species") || undefined;
    const gender = searchParams.get("gender") || undefined;
    const showFavorites = searchParams.get("favorites") === "true";
    const page = parseInt(searchParams.get("page") || "1");

    const { characters, info, isLoading, isFetching, error } = useCharacters({
        page: showFavorites ? 1 : page,
        name: showFavorites ? undefined : name,
        status: showFavorites ? undefined : status,
        species: showFavorites ? undefined : species,
        gender: showFavorites ? undefined : gender,
    });

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`/?${params.toString()}`);
    };

    const filteredCharacters = showFavorites ? favoriteCharacters : characters;

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <LoadingSkeleton />;
    }

    if (showFavorites && isLoadingFavorites) {
        return <LoadingSkeleton />;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto px-4 py-8">
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Resource Explorer</h1>
                    <p className="text-gray-600">Discover characters from the Rick and Morty universe</p>
                </header>

                <div className="mb-8">
                    <SearchFilters favorites={favorites} />
                </div>

                {error ? (
                    <ErrorDisplay error={error as Error} retry={() => window.location.reload()} />
                ) : isLoading ? (
                    <LoadingSkeleton />
                ) : (
                    <>
                        {showFavorites && favoriteCharacters.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 text-lg">No favorite characters yet.</p>
                            </div>
                        ) : (
                            <CharacterList characters={filteredCharacters} />
                        )}

                        {info && info.pages > 1 && !showFavorites && (
                            <div className="flex justify-center mt-8">
                                <nav className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={page === 1}
                                        className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-100 transition-colors">
                                        Previous
                                    </button>

                                    {Array.from({ length: Math.min(5, info.pages) }, (_, i) => {
                                        const pageNum = Math.max(1, page - 2) + i;
                                        if (pageNum > info.pages) return null;

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`px-3 py-1 rounded ${
                                                    pageNum === page ? "bg-blue-500 text-white" : "border border-gray-300 hover:bg-gray-100"
                                                } transition-colors`}>
                                                {pageNum}
                                            </button>
                                        );
                                    })}

                                    <button
                                        onClick={() => handlePageChange(page + 1)}
                                        disabled={!info.next}
                                        className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-100 transition-colors">
                                        Next
                                    </button>
                                </nav>
                            </div>
                        )}
                    </>
                )}

                {isFetching && !isLoading && (
                    <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg">Loading...</div>
                )}
            </div>
        </div>
    );
}
