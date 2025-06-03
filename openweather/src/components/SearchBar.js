// components/SearchBar.js
import { useState, useEffect } from 'react';

export default function SearchBar({ onSearch, theme }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await fetch(
          `https://secure.geonames.org/searchJSON?name_startsWith=${query}&maxRows=6&featureClass=P&orderby=population&username=${process.env.NEXT_PUBLIC_GEONAMES_USERNAME}`
        );
        const data = await res.json();
        const cityNames = data.geonames.map(
          (place) => `${place.name}, ${place.countryCode}`
        );
        setSuggestions(cityNames);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        setSuggestions([]);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (city) => {
    setQuery(city);
    setSuggestions([]);
    onSearch(city);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setSuggestions([]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter city name"
        className={`w-full px-5 py-3 rounded-lg shadow focus:outline-none focus:ring-2 ${theme === 'dark'
            ? 'bg-gray-800 text-white placeholder-gray-400 ring-white/30'
            : 'bg-white text-gray-800 placeholder-gray-500 ring-gray-300'
          }`}
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-50 w-full bg-white text-gray-800 shadow-lg mt-1 rounded-lg overflow-hidden max-h-60 overflow-y-auto">
          {suggestions.map((city, i) => (
            <li
              key={i}
              onClick={() => handleSelect(city)}
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
