import { Character } from "@/types";
import { CharacterCard } from "./CharacterCard";

interface CharacterListProps {
    characters: Character[];
}

export const CharacterList = ({ characters }: CharacterListProps) => {
    if (characters.length === 0) {
        return (
            <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900">No characters found</h3>
                <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map(character => (
                <CharacterCard key={character.id} character={character} />
            ))}
        </div>
    );
};
