import { useQuery } from "@tanstack/react-query";
import { FilterParams, CharactersResponse } from "@/types";
import { fetchCharacters } from "@/utils/api";

export const useCharacters = (params: FilterParams = {}) => {
    const { page = 1, name = undefined, status = undefined, species = undefined, gender = undefined } = params;

    const { data, isLoading, error, isFetching } = useQuery<CharactersResponse, Error>({
        queryKey: [
            "characters",
            {
                page,
                name,
                status,
                species,
                gender,
            },
        ],
        queryFn: () =>
            fetchCharacters({
                page,
                name,
                status,
                species,
                gender,
            }),
        placeholderData: previousData => previousData,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    return {
        characters: data?.results || [],
        info: data?.info,
        isLoading,
        isFetching,
        error,
    };
};
