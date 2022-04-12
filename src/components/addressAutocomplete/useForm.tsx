import { useCallback } from 'react';
import { Point, Suggestions } from '../../types';
import useSuggestions from './useSuggestions';
import { findPointFromAddressAndSuggestions } from './utils';
type onAddressSelectedProps = (address: string, coordinates: Point) => void;

export const useFormAutocomplete = (
  onAddressSelected: onAddressSelectedProps,
  debounceTime: number
) => {
  const { suggestions, fetchSuggestions, status } = useSuggestions({
    debounceTime,
    limit: 5,
    autocomplete: false,
  });
  const handleSelect = useCallback(
    (address: string, suggestions: Suggestions | []) => {
      const coords = findPointFromAddressAndSuggestions(address, suggestions);
      onAddressSelected(address, coords);
    },
    [onAddressSelected]
  );

  return {
    handleSelect,
    suggestions,
    fetchSuggestions: (searchTerm: string, minCharactersLength: number) =>
      searchTerm.length >= minCharactersLength && fetchSuggestions(searchTerm),
    status,
  };
};
