'use client';

import { useFavorites } from '@/hooks/useFavorites';

interface FavoritesToggleProps {
  characterId: number;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const FavoritesToggle = ({ 
  characterId, 
  size = 'md', 
  showText = false 
}: FavoritesToggleProps) => {
  const { isFavorite, toggleFavorite, isLoadingFavorites } = useFavorites();
  
  const favorite = isFavorite(characterId);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    toggleFavorite(characterId);
  };

  if (isLoadingFavorites) {
    return (
      <div className="flex flex-row items-center">
        <div className={`rounded border-gray-300 bg-gray-200 animate-pulse ${sizeClasses[size]}`}></div>
        {showText && (
          <span className={`${textSizeClasses[size]} text-gray-400 ml-2`}>Loading...</span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center">
      <input
        type="checkbox"
        checked={favorite}
        onChange={handleChange}
        className={`rounded border-gray-300 text-red-500 focus:ring-red-500 transition-colors ${
          sizeClasses[size]
        } ${favorite ? 'border-red-500 bg-red-100' : 'hover:border-red-400'}`}
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
      />

      {showText && (
        <span className={`${textSizeClasses[size]} text-gray-600 ml-2`}>
          {favorite ? 'Favorited' : 'Add to favorites'}
        </span>
      )}
    </div>
  );
};