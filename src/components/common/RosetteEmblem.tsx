import React from 'react';

interface RosetteEmblemProps {
  className?: string;
  size?: number;
  color?: string;
}

export const RosetteEmblem: React.FC<RosetteEmblemProps> = ({
  className = '',
  size = 40,
  color = '#075B60'
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      {/* Outer circle */}
      <circle cx="50" cy="50" r="46" stroke={color} strokeWidth="2.5" />
      <circle cx="50" cy="50" r="41" stroke={color} strokeWidth="1" strokeOpacity="0.6" />

      {/* Moroccan 8-fold geometric rosette arcs */}
      {/* Central square rotated 45 deg */}
      <rect
        x="32"
        y="32"
        width="36"
        height="36"
        transform="rotate(45 50 50)"
        stroke={color}
        strokeWidth="1.8"
      />
      {/* Straight square */}
      <rect
        x="33"
        y="33"
        width="34"
        height="34"
        stroke={color}
        strokeWidth="1.2"
        strokeOpacity="0.7"
      />

      {/* Interlocking Petals / Arcs */}
      <circle cx="50" cy="24" r="23" stroke={color} strokeWidth="1.5" />
      <circle cx="50" cy="76" r="23" stroke={color} strokeWidth="1.5" />
      <circle cx="24" cy="50" r="23" stroke={color} strokeWidth="1.5" />
      <circle cx="76" cy="50" r="23" stroke={color} strokeWidth="1.5" />

      {/* Central focal node */}
      <circle cx="50" cy="50" r="5" stroke={color} strokeWidth="1.5" />
      <circle cx="50" cy="50" r="2" fill={color} />
    </svg>
  );
};
