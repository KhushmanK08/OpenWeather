// components/WeatherCard.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const getWeatherIcon = (main, isNight) => {
  const icons = {
    Clear: isNight ? '🌙' : '☀️',
    Rain: '🌧️',
    Clouds: isNight ? '☁️🌙' : '☁️',
    Snow: '❄️',
    Thunderstorm: '⛈️',
    Drizzle: '🌦️',
    Mist: '🌫️',
    Haze: '🌁',
    Smoke: '🚬',
    Dust: '🌪️',
    Fog: '🌫️',
    Sand: '🏜️',
    Ash: '🌋',
    Squall: '🌬️',
    Tornado: '🌪️',
  };
  return icons[main] || '🌈';
};

const WeatherCard = ({ weather }) => {
  if (!weather) return null;

  const {
    name,
    main: { temp, humidity },
    weather: weatherDetails,
    wind: { speed },
    dt,
    sys: { sunrise, sunset },
    timezone,
  } = weather;

  const description = weatherDetails[0]?.description;
  const mainCondition = weatherDetails[0]?.main;

  // Calculate local time
  const localTime = new Date((dt + timezone) * 1000);
  const localHour = localTime.getUTCHours();
  const isNight = localHour < 6 || localHour >= 20;

  const icon = getWeatherIcon(mainCondition, isNight);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={name + temp}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full px-6 py-10 rounded-2xl backdrop-blur-md bg-white/10 shadow-xl border border-white/20 text-white text-center mt-8"
      >
        <div className="text-5xl mb-4">{icon}</div>
        <h2 className="text-3xl font-bold mb-2">{name}</h2>
        <p className="text-xl capitalize mb-4">{description}</p>
        <div className="grid grid-cols-2 gap-6 text-lg">
          <div>
            <p className="font-medium">Temperature</p>
            <p>{Math.round(temp)}°C</p>
          </div>
          <div>
            <p className="font-medium">Humidity</p>
            <p>{humidity}%</p>
          </div>
          <div>
            <p className="font-medium">Wind Speed</p>
            <p>{speed} m/s</p>
          </div>
          <div>
            <p className="font-medium">Condition</p>
            <p>{mainCondition}</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WeatherCard;
