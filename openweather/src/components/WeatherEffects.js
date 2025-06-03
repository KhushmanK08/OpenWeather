import React from 'react';

export default function WeatherEffects({ weather }) {
  if (!weather) return null;

  const main = weather.weather[0].main.toLowerCase();
  const description = weather.weather[0].description.toLowerCase();

  let showRain = false,
    showSnow = false,
    showWind = false,
    showThunder = false;

  if (main.includes('rain')) showRain = true;
  if (main.includes('snow')) showSnow = true;
  if (main.includes('wind')) showWind = true;
  if (main.includes('thunderstorm')) {
    showRain = true;
    showThunder = true;
  }
  if (description.includes('wind') && !main.includes('snow')) showWind = true;
  if (main.includes('cloud') && description.includes('wind')) showWind = true;

  const particles = Array.from({ length: 120 });

  return (
    <div className="weather-effects-container">
      {showRain && (
        <div className="rain">
          {particles.map((_, i) => (
            <span
              key={`r${i}`}
              className="raindrop"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}
      {showSnow && (
        <div className="snow">
          {particles.map((_, i) => (
            <span
              key={`s${i}`}
              className="snowflake"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
              }}
            >
              ❄
            </span>
          ))}
        </div>
      )}
      {showWind && <div className="wind" />}
      {showThunder && <div className="thunderstorm" />}
    </div>
  );
}
