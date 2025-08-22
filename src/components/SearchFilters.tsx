"use client";

import { useDebounce } from "@/hooks/useDebounce";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef } from "react";

interface SearchFiltersProps {
    favorites: number[];
}

export const SearchFilters = ({ favorites }: SearchFiltersProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchValue, setSearchValue] = useState(searchParams.get("name") || "");
    const searchInputRef = useRef<HTMLInputElement>(null);

    const statusOptions = ["", "Alive", "Dead", "unknown"];
    const genderOptions = ["", "Female", "Male", "Genderless", "unknown"];
    const speciesOptions = ["", "Human", "Alien", "Humanoid", "Robot", "Animal", "Mythological", "Disease", "Unknown"];

    const updateQuery = (key: string, value: string, clearSearch: boolean = false) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        if (clearSearch) {
            params.delete("name");
            setSearchValue("");
            if (searchInputRef.current) {
                searchInputRef.current.value = "";
            }
        }

        params.delete("page");
        router.push(`/?${params.toString()}`);
    };

    const handleSearchChange = (value: string) => {
        setSearchValue(value);

        const params = new URLSearchParams(searchParams.toString());
        if (value.trim()) {
            params.set("name", value.trim());
        } else {
            params.delete("name");
        }

        params.delete("page");
        router.push(`/?${params.toString()}`);
    };

    const debouncedSearch = useDebounce(handleSearchChange, 500);

    const currentSort = searchParams.get("sort") || "asc";
    const toggleSort = () => {
        const newSort = currentSort === "asc" ? "desc" : "asc";
        updateQuery("sort", newSort, false);
    };

    return (
        <div className="bg-white p-[6px] rounded-2xl shadow-lg border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search Input */}
                <div className="w-[calc(100%-8px)] mx-auto">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                        Search
                    </label>
                    <input
                        id="search"
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search characters..."
                        defaultValue={searchParams.get("name") || ""}
                        onChange={e => debouncedSearch(e.target.value)}
                        className="w-[calc(100%-8px)] mx-auto h-[36px] px-3 border border-gray-200 rounded-xl text-sm shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
              transition-colors duration-200"
                    />
                </div>

                {/* Status Filter */}
                <div className="w-[calc(100%-8px)] mx-auto">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                    </label>
                    <select
                        id="status"
                        defaultValue={searchParams.get("status") || ""}
                        onChange={e => updateQuery("status", e.target.value, true)}
                        className="w-full h-[40px] pl-3 pr-8 border border-gray-200 rounded-xl text-sm shadow-sm bg-white
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
              transition-colors duration-200 cursor-pointer">
                        {statusOptions.map(option => (
                            <option key={option} value={option} className="h-[32px] pl-3 text-sm">
                                {option || "All Status"}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Species Filter */}
                <div className="w-[calc(100%-8px)] mx-auto">
                    <label htmlFor="species" className="block text-sm font-medium text-gray-700 mb-2">
                        Species
                    </label>
                    <select
                        id="species"
                        defaultValue={searchParams.get("species") || ""}
                        onChange={e => updateQuery("species", e.target.value, true)}
                        className="w-full h-[40px] pl-3 pr-8 border border-gray-200 rounded-xl text-sm shadow-sm bg-white
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
              transition-colors duration-200 cursor-pointer">
                        {speciesOptions.map(option => (
                            <option key={option} value={option} className="h-[32px] pl-3 text-sm">
                                {option || "All Species"}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Gender Filter */}
                <div className="w-[calc(100%-8px)] mx-auto">
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                    </label>
                    <select
                        id="gender"
                        defaultValue={searchParams.get("gender") || ""}
                        onChange={e => updateQuery("gender", e.target.value, true)}
                        className="w-full h-[40px] pl-3 pr-8 border border-gray-200 rounded-xl text-sm shadow-sm bg-white
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
              transition-colors duration-200 cursor-pointer">
                        {genderOptions.map(option => (
                            <option key={option} value={option} className="h-[32px] pl-3 text-sm">
                                {option || "All Genders"}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Clear All Filters Button */}
            <div className="mt-[6px] flex justify-center w-[calc(100%-8px)] mx-auto gap-4">
                <button
                    onClick={() => {
                        router.push("/");
                        setSearchValue("");
                        if (searchInputRef.current) {
                            searchInputRef.current.value = "";
                        }
                    }}
                    className="px-5 h-[40px] bg-gray-100 text-gray-700 text-sm font-medium rounded-xl 
        hover:bg-gray-200 active:bg-gray-300 
        focus:outline-none focus:ring-2 focus:ring-gray-400 transition">
                    Clear All Filters
                </button>

                {/* Sort Toggle Button */}
                <button
                    onClick={toggleSort}
                    className="px-5 h-[40px] bg-blue-500 text-white text-sm font-medium rounded-xl 
        hover:bg-blue-600 active:bg-blue-700 
        focus:outline-none focus:ring-2 focus:ring-blue-400 transition">
                    Sort: {currentSort === "asc" ? "Ascending ↑" : "Descending ↓"}
                </button>
            </div>

            {/* Favorites Filter */}
            <div className="mt-[6px] flex justify-center w-[calc(100%-8px)] mx-auto">
                <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={searchParams.get("favorites") === "true"}
                        onChange={e => updateQuery("favorites", e.target.checked ? "true" : "", true)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Show Favorites ({favorites.length})</span>
                </label>
            </div>
        </div>
    );
};
