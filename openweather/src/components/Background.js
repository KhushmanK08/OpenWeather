import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Background({ weather }) {
  const [bgClass, setBgClass] = useState('bg-white');

  useEffect(() => {
    if (!weather) {
      setBgClass('bg-white');
      return;
    }

    const weatherMain = weather.weather[0].main.toLowerCase();
    const timezoneOffset = weather.timezone || 0;
    const localTimestamp = (weather.dt + timezoneOffset) * 1000;
    const localDate = new Date(localTimestamp);
    const localHour = localDate.getUTCHours();

    let timeOfDay = 'night';
    if (localHour >= 5 && localHour < 8) timeOfDay = 'early';
    else if (localHour >= 8 && localHour < 12) timeOfDay = 'morning';
    else if (localHour >= 12 && localHour < 17) timeOfDay = 'afternoon';
    else if (localHour >= 17 && localHour < 20) timeOfDay = 'evening';

    let baseColor = 'bg-gradient-to-b from-gray-800 to-black';
    if (timeOfDay === 'early') baseColor = 'bg-gradient-to-b from-indigo-300 to-blue-100';
    else if (timeOfDay === 'morning') baseColor = 'bg-gradient-to-b from-yellow-200 to-blue-300';
    else if (timeOfDay === 'afternoon') baseColor = 'bg-gradient-to-b from-blue-400 to-blue-700';
    else if (timeOfDay === 'evening') baseColor = 'bg-gradient-to-b from-orange-200 to-blue-900';
    else if (timeOfDay === 'night') baseColor = 'bg-gradient-to-b from-gray-900 to-black';

    let animationClass = '';
    if (weatherMain.includes('rain')) animationClass = 'rain';
    else if (weatherMain.includes('snow')) animationClass = 'snow';
    else if (weatherMain.includes('wind')) animationClass = 'wind';
    else if (weatherMain.includes('clear')) animationClass = 'clear';
    else if (weatherMain.includes('cloud')) animationClass = 'clouds';

    setBgClass(`${baseColor} ${animationClass}`);
  }, [weather]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      className={`absolute top-0 left-0 w-full h-full z-0 transition-all duration-700 ${bgClass}`}
    />
  );
}
