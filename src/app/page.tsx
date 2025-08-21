"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useCharacters } from "@/hooks/useCharacters";
import { useFavorites } from "@/hooks/useFavorites";
import { SearchFilters } from "@/components/SearchFilters";
import { CharacterList } from "@/components/CharacterList";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { DarkModeToggle } from "@/components/DarkModeToggle";

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
        router.push(`/?${params.toString()}`, { scroll: false });
    };

    const filteredCharacters = showFavorites ? favoriteCharacters : characters;
    const hasNoResults = !showFavorites && characters.length === 0 && !isLoading && !error;
    const hasActiveFilters = !showFavorites && (name || status || species || gender);

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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
            <div className="container mx-auto px-4 py-8">
                <header className="relative mb-12">
                    <div className="absolute left-0 top-0 mt-4 ml-4">
                        <DarkModeToggle />
                    </div>

                    <div className="text-center">
                        <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg mb-4">
                            <h1 className="text-4xl md:text-5xl font-bold text-white bg-clip-text bg-gradient-to-r from-blue-100 to-purple-100">
                                Resource Explorer
                            </h1>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                            Discover and explore characters from the expansive Rick and Morty universe
                        </p>
                    </div>
                </header>

                <div className="mb-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
                    <SearchFilters favorites={favorites} />
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
                    <div className="flex flex-col sm:flex-row justify-center items-center mb-6 gap-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {showFavorites ? "Favorite Characters" : "Character Results"}
                        </h2>
                        {!showFavorites && info && (
                            <span className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full mb-[6px]">
                                {info.count} character{info.count !== 1 ? "s" : ""} found
                            </span>
                        )}
                    </div>

                    {/* Content Area */}
                    {error ? (
                        <ErrorDisplay error={error as Error} retry={() => window.location.reload()} />
                    ) : isLoading ? (
                        <LoadingSkeleton />
                    ) : hasNoResults ? (
                        <div className="text-center py-12">
                            <div className="mx-auto w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                                <span className="text-4xl">🔍</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No characters found</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                {hasActiveFilters
                                    ? "Try adjusting your search criteria or remove some filters."
                                    : "No characters match your search criteria."}
                            </p>
                            {hasActiveFilters && (
                                <button
                                    onClick={() => router.push("/")}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                                    Clear All Filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            {showFavorites && favoriteCharacters.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="mx-auto w-24 h-24 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-4">
                                        <span className="text-4xl">⭐</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No favorites yet</h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Start adding characters to your favorites by clicking the star icon!
                                    </p>
                                </div>
                            ) : (
                                <CharacterList characters={filteredCharacters} />
                            )}

                            {info && info.pages > 1 && !showFavorites && filteredCharacters.length > 0 && (
                                <div className="flex justify-center p-[8px] border-t border-gray-200 dark:border-gray-700">
                                    <nav className="flex items-center gap-4">
                                        <button
                                            onClick={() => handlePageChange(page - 1)}
                                            disabled={page === 1}
                                            className="px-6 h-10 min-h-[40px] border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 shadow-sm hover:shadow-lg">
                                            ← Previous
                                        </button>
                                        <div className="flex items-center gap-4">
                                            {Array.from({ length: Math.min(5, info.pages) }, (_, i) => {
                                                const pageNum = Math.max(1, page - 2) + i;
                                                if (pageNum > info.pages) return null;

                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => handlePageChange(pageNum)}
                                                        className={`px-5 h-10 min-h-[40px] border border-gray-300 dark:border-gray-600 transition-all duration-200 ${
                                                            pageNum === page
                                                                ? "bg-blue-600 text-white shadow-lg"
                                                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md"
                                                        }`}>
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <button
                                            onClick={() => handlePageChange(page + 1)}
                                            disabled={!info.next}
                                            className="px-6 h-10 min-h-[40px] border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 shadow-sm hover:shadow-lg">
                                            Next →
                                        </button>
                                    </nav>
                                </div>
                            )}
                        </>
                    )}
                </div>
                {isFetching && !isLoading && (
                    <div className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Loading...
                    </div>
                )}
                {page > 1 && (
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="fixed bottom-6 left-6 bg-gray-800 dark:bg-gray-700 text-white p-3 rounded-full shadow-lg hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors duration-200">
                        ↑
                    </button>
                )}
            </div>
        </div>
    );
}
