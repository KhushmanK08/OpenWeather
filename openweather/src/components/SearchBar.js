// components/SearchBar.js
import { useState, useEffect } from 'react';

export default function SearchBar({ onSearch, theme }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
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
        setShowSuggestions(true);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (city) => {
    setQuery(city);
    setSuggestions([]);
    setShowSuggestions(false);
    onSearch(city);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md sm:max-w-full relative flex"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length > 1 && setShowSuggestions(true)}
        placeholder="Enter city name"
        className={`flex-grow px-4 py-2 rounded-l-lg shadow focus:outline-none focus:ring-2 text-base sm:text-sm xs:text-sm ${theme === 'dark'
            ? 'bg-gray-800 text-white placeholder-gray-400 ring-white/30'
            : 'bg-white text-gray-800 placeholder-gray-500 ring-gray-300'
          }`}
        autoComplete="off"
      />
      <button
        type="submit"
        className={`px-5 py-2 font-semibold rounded-r-lg transition-all duration-300 shadow-md text-base sm:text-sm xs:text-sm ${theme === 'dark'
            ? 'bg-white/30 text-white hover:bg-white/40'
            : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
      >
        Search
      </button>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-50 top-full left-0 right-0 bg-white text-gray-800 shadow-lg mt-1 rounded-b-lg overflow-hidden max-h-40 overflow-y-auto">
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
