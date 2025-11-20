'use client';

interface UserLocationIconProps {
  size?: number;
}

export function getUserLocationIconHTML(size: number = 48): string {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="${size}" height="${size}">
      <!-- Círculo exterior semi-transparente -->
      <circle cx="24" cy="24" r="20" fill="#3B82F6" opacity="0.15" />
      
      <!-- Círculo principal -->
      <circle cx="24" cy="24" r="10" fill="#3B82F6" stroke="#FFFFFF" stroke-width="3" />
      
      <!-- Punto central blanco -->
      <circle cx="24" cy="24" r="4" fill="#FFFFFF" />
    </svg>
  `;
}

export default function UserLocationIcon({ size = 48 }: UserLocationIconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 48 48" 
      width={size} 
      height={size}
      className="user-location-icon"
    >
      {/* Círculo exterior semi-transparente */}
      <circle 
        cx="24" 
        cy="24" 
        r="20" 
        fill="#3B82F6" 
        opacity="0.15" 
      />
      
      {/* Círculo principal */}
      <circle 
        cx="24" 
        cy="24" 
        r="10" 
        fill="#3B82F6" 
        stroke="#FFFFFF" 
        strokeWidth="3" 
      />
      
      {/* Punto central blanco */}
      <circle 
        cx="24" 
        cy="24" 
        r="4" 
        fill="#FFFFFF" 
      />
    </svg>
  );
}

