import Link from "next/link";
import { Character } from "@/types";
import { FavoritesToggle } from "./FavoritesToggle";

interface CharacterCardProps {
    character: Character;
}

export const CharacterCard = ({ character }: CharacterCardProps) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
            <Link href={`/characters/${character.id}`}>
                <div className="cursor-pointer flex flex-col items-center flex-grow">
                    <div className="w-48 h-48 mx-auto my-4 flex items-center justify-center">
                        <img src={character.image} alt={character.name} className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <div className="p-4 w-full">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1 text-center">{character.name}</h3>
                        <div className="flex items-center gap-2 mb-2 justify-center">
                            <div
                                className={`w-3 h-3 rounded-full ${
                                    character.status === "Alive"
                                        ? "bg-green-500"
                                        : character.status === "Dead"
                                        ? "bg-red-500"
                                        : "bg-gray-500"
                                }`}
                            />
                            <span className="text-sm text-gray-600">
                                {character.status} - {character.species}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 text-center">
                            <span className="font-medium">Last known location:</span>
                            <br />
                            {character.location.name}
                        </p>
                    </div>
                </div>
            </Link>
            <div className="p-4 border-t border-gray-100 mt-auto flex flex-col items-center">
                <FavoritesToggle characterId={character.id} size="md" showText={true} />
            </div>
        </div>
    );
};
