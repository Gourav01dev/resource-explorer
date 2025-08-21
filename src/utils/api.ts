import { Character, CharactersResponse, FilterParams } from '@/types';

const API_BASE_URL = 'https://rickandmortyapi.com/api/character';

export const fetchCharacters = async (params: FilterParams = {}): Promise<CharactersResponse> => {
  const { page = 1, ...filters } = params;
  const searchParams = new URLSearchParams();
  
  searchParams.set('page', page.toString());
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    }
  });
  
  const url = `${API_BASE_URL}?${searchParams.toString()}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch characters');
  }
  
  return response.json();
};

export const fetchCharacter = async (id: string): Promise<Character> => {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch character');
  }
  
  return response.json();
};