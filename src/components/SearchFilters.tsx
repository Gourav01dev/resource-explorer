// SearchFilters.tsx
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

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search Input */}
                <div>
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                        Search
                    </label>
                    <input
                        id="search"
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search characters..."
                        defaultValue={searchParams.get("name") || ""}
                        onChange={e => debouncedSearch(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Status Filter */}
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                    </label>
                    <select
                        id="status"
                        defaultValue={searchParams.get("status") || ""}
                        onChange={e => updateQuery("status", e.target.value, true)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {statusOptions.map(option => (
                            <option key={option} value={option}>
                                {option || "All Status"}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Species Filter */}
                <div>
                    <label htmlFor="species" className="block text-sm font-medium text-gray-700 mb-1">
                        Species
                    </label>
                    <select
                        id="species"
                        defaultValue={searchParams.get("species") || ""}
                        onChange={e => updateQuery("species", e.target.value, true)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {speciesOptions.map(option => (
                            <option key={option} value={option}>
                                {option || "All Species"}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Gender Filter */}
                <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                    </label>
                    <select
                        id="gender"
                        defaultValue={searchParams.get("gender") || ""}
                        onChange={e => updateQuery("gender", e.target.value, true)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {genderOptions.map(option => (
                            <option key={option} value={option}>
                                {option || "All Genders"}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Favorites Filter */}
            <div className="mt-4">
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={searchParams.get("favorites") === "true"}
                        onChange={e => updateQuery("favorites", e.target.checked ? "true" : "", true)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Show Favorites ({favorites.length})</span>
                </label>
            </div>

            {/* Clear All Filters Button */}
            <div className="mt-4 flex justify-end">
                <button
                    onClick={() => {
                        router.push("/");

                        setSearchValue("");
                        if (searchInputRef.current) {
                            searchInputRef.current.value = "";
                        }
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                    Clear All Filters
                </button>
            </div>
        </div>
    );
};