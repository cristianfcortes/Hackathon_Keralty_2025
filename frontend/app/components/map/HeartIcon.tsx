'use client';

// Map category to heart icon color
const CATEGORY_COLORS = {
  medical: 'red',
  organizacion: 'purple',
  servicios: 'blue',
  education: 'green',
} as const;

export type LandmarkCategory = keyof typeof CATEGORY_COLORS;

interface HeartIconProps {
  category?: string;
  size?: number;
}

export function getHeartColor(category?: string): string {
  if (!category) return 'red';
  const normalizedCategory = category.toLowerCase();
  return CATEGORY_COLORS[normalizedCategory as LandmarkCategory] || 'red';
}

export function getHeartIconHTML(category?: string, size: number = 32): string {
  const color = getHeartColor(category);
  const colors = {
    red: { fill: '#EF4444', stroke: '#DC2626' },
    purple: { fill: '#A855F7', stroke: '#9333EA' },
    blue: { fill: '#3B82F6', stroke: '#2563EB' },
    green: { fill: '#10B981', stroke: '#059669' },
  };
  
  const colorData = colors[color as keyof typeof colors];
  
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="${colorData.fill}" stroke="${colorData.stroke}" stroke-width="1">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  `;
}

export default function HeartIcon({ category, size = 32 }: HeartIconProps) {
  const color = getHeartColor(category);
  
  const colors = {
    red: '#EF4444',
    purple: '#A855F7',
    blue: '#3B82F6',
    green: '#10B981',
  };
  
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      width={size} 
      height={size} 
      fill={colors[color as keyof typeof colors]}
      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  );
}

