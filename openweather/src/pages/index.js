/* eslint-disable react/no-unescaped-entities */

import React, { useState } from 'react';
import Head from 'next/head';
import SearchBar from '../components/SearchBar';
import WeatherCard from '../components/WeatherCard';
import Background from '../components/Background';
import { motion } from 'framer-motion';
import WeatherEffects from '../components/WeatherEffects';

export default function Home() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async (city) => {
    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=metric`
      );

      if (!res.ok) throw new Error('City not found');

      const data = await res.json();
      setWeather(data);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden transition-colors duration-700 ease-in-out">
      <Head>
        <title>Weather App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Background visual effects */}
      {weather && <WeatherEffects weather={weather} />}
      {weather && <Background weather={weather} />}

      <main className="relative z-10 flex flex-col items-center justify-start px-4 py-8 sm:px-6 md:px-8 lg:px-12">
        {/* Overlay wrapper to ensure text readability */}
        <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 w-full max-w-2xl sm:max-w-xl xs:max-w-full text-white shadow-xl">
          {/* Animated Title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-3"
          >
            Weather App
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-base sm:text-lg md:text-xl text-center mb-6 text-white/90"
          >
            Check any city&apos;s forecast instantly
          </motion.p>

          <SearchBar onSearch={fetchWeather} theme="dark" />

          {error && (
            <p className="mt-6 text-red-300 text-base sm:text-lg font-medium bg-red-900/40 px-4 py-2 rounded shadow">
              {error}
            </p>
          )}

          {loading && (
            <div className="mt-8 text-blue-300 text-base sm:text-xl font-semibold animate-pulse">
              Fetching weather...
            </div>
          )}

          {!loading && weather && <WeatherCard weather={weather} />}
        </div>
      </main>
    </div>
  );
}
