import React from 'react';
import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  CloudLightning,
  CloudFog,
} from 'lucide-react';
import { WeatherCondition } from '../types';

interface WeatherIconProps {
  condition: WeatherCondition;
  isNight?: boolean;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  condition,
  isNight = false,
  className = 'w-6 h-6',
  size,
}) => {
  const iconProps = { className, size };

  switch (condition) {
    case 'clear':
      return isNight ? (
        <CloudMoon {...iconProps} className={`${className} text-amber-200`} />
      ) : (
        <Sun {...iconProps} className={`${className} text-amber-500`} />
      );

    case 'mostly_clear':
    case 'partly_cloudy':
      return isNight ? (
        <CloudMoon {...iconProps} className={`${className} text-blue-200`} />
      ) : (
        <CloudSun {...iconProps} className={`${className} text-amber-400`} />
      );

    case 'cloudy':
    case 'overcast':
      return <Cloud {...iconProps} className={`${className} text-slate-400`} />;

    case 'light_rain':
      return <CloudDrizzle {...iconProps} className={`${className} text-sky-400`} />;

    case 'rain':
    case 'heavy_rain':
    case 'shower':
      return <CloudRain {...iconProps} className={`${className} text-blue-500`} />;

    case 'sleet':
    case 'snow':
    case 'heavy_snow':
      return <CloudSnow {...iconProps} className={`${className} text-indigo-300`} />;

    case 'thunderstorm':
      return <CloudLightning {...iconProps} className={`${className} text-yellow-500`} />;

    case 'fog':
      return <CloudFog {...iconProps} className={`${className} text-teal-400`} />;

    default:
      return <Sun {...iconProps} className={`${className} text-amber-500`} />;
  }
};
