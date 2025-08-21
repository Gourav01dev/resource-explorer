"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchCharacter } from "@/utils/api";
import { FavoritesToggle } from "@/components/FavoritesToggle";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ErrorDisplay } from "@/components/ErrorDisplay";

export default function CharacterDetail() {
    const params = useParams();
    const id = params.id as string;

    const {
        data: character,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["character", id],
        queryFn: () => fetchCharacter(id),
    });

    const renderContent = () => {
        if (isLoading) return <LoadingSkeleton />;
        if (error) return <ErrorDisplay error={error as Error} retry={() => window.location.reload()} />;
        if (!character)
            return (
                <div className="text-center py-16">
                    <h2 className="text-3xl font-bold text-gray-900">Character not found</h2>
                </div>
            );

        return (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:shadow-xl flex flex-col lg:flex-row items-center lg:items-stretch">
                <div className="lg:w-2/3 w-full flex justify-center items-center p-4 lg:p-0">
                    <img
                        src={character.image}
                        alt={character.name}
                        className="w-full max-w-3xl h-auto object-cover rounded-2xl transform scale-105"
                    />
                </div>
                <div className="p-8 lg:w-1/2 flex flex-col justify-between w-full">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">{character.name}</h1>
                        <FavoritesToggle characterId={character.id} size="lg" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">Details</h2>
                            <div className="space-y-2 text-gray-700">
                                <p className="flex items-center">
                                    <span className="font-medium w-24">Status:</span>
                                    <span
                                        className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${
                                            character.status === "Alive"
                                                ? "bg-green-100 text-green-700"
                                                : character.status === "Dead"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-gray-100 text-gray-700"
                                        }`}>
                                        <span
                                            className={`w-2 h-2 rounded-full mr-2 ${
                                                character.status === "Alive"
                                                    ? "bg-green-500"
                                                    : character.status === "Dead"
                                                    ? "bg-red-500"
                                                    : "bg-gray-500"
                                            }`}
                                        />
                                        {character.status}
                                    </span>
                                </p>
                                <p>
                                    <span className="font-medium">Species:</span> {character.species}
                                </p>
                                {character.type && (
                                    <p>
                                        <span className="font-medium">Type:</span> {character.type}
                                    </p>
                                )}
                                <p>
                                    <span className="font-medium">Gender:</span> {character.gender}
                                </p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">Location</h2>
                            <div className="space-y-2 text-gray-700">
                                <p>
                                    <span className="font-medium">Origin:</span> {character.origin.name}
                                </p>
                                <p>
                                    <span className="font-medium">Last known location:</span> {character.location.name}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Episodes */}
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Episodes</h2>
                        <p className="text-gray-600">
                            Appeared in {character.episode.length} episode{character.episode.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 flex justify-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                <Link href="/" className="text-white hover:text-white transition-colors duration-200 inline-block font-medium mb-[8px]">
                    ← Back to Characters
                </Link>
                {renderContent()}
            </div>
        </div>
    );
}
