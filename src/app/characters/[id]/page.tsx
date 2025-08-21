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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 py-8">
                <div className="container mx-auto px-4">
                    <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">
                        ← Back to Characters
                    </Link>
                    <LoadingSkeleton />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 py-8">
                <div className="container mx-auto px-4">
                    <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">
                        ← Back to Characters
                    </Link>
                    <ErrorDisplay error={error as Error} retry={() => window.location.reload()} />
                </div>
            </div>
        );
    }

    if (!character) {
        return (
            <div className="min-h-screen bg-gray-100 py-8">
                <div className="container mx-auto px-4">
                    <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">
                        ← Back to Characters
                    </Link>
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-bold text-gray-900">Character not found</h2>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">
                    ← Back to Characters
                </Link>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="md:flex">
                        <div className="md:w-1/3">
                            <img src={character.image} alt={character.name} className="w-full h-full object-cover" />
                        </div>

                        <div className="p-6 md:w-2/3">
                            <div className="flex justify-between items-start mb-4">
                                <h1 className="text-3xl font-bold text-gray-900">{character.name}</h1>
                                <FavoritesToggle characterId={character.id} size="lg" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Details</h2>
                                    <div className="space-y-2">
                                        <p>
                                            <span className="font-medium">Status:</span>{" "}
                                            <span
                                                className={`inline-flex items-center ${
                                                    character.status === "Alive"
                                                        ? "text-green-600"
                                                        : character.status === "Dead"
                                                        ? "text-red-600"
                                                        : "text-gray-600"
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
                                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Location</h2>
                                    <div className="space-y-2">
                                        <p>
                                            <span className="font-medium">Origin:</span> {character.origin.name}
                                        </p>
                                        <p>
                                            <span className="font-medium">Last known location:</span> {character.location.name}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-2">Episodes</h2>
                                <p className="text-gray-600">
                                    Appeared in {character.episode.length} episode
                                    {character.episode.length !== 1 ? "s" : ""}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
