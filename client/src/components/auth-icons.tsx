import React from "react";

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
  badge?: boolean;
}

/** Cadenas gras avec trou de serrure — fidèle à la maquette */
export function LockBoldIcon({ size = 22, color = "currentColor", className, badge = true }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {badge && <rect x="1" y="1" width="46" height="46" rx="14" fill="#E7F8EC" />}
      {/* Shackle (arc du dessus) */}
      <path
        d="M15 22V16.5C15 10.8 18.9 7 24 7C29.1 7 33 10.8 33 16.5V22"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Corps du cadenas */}
      <rect
        x="10"
        y="21"
        width="28"
        height="21"
        rx="5"
        stroke={color}
        strokeWidth="3.5"
        fill="none"
      />
      {/* Trou de serrure — cercle */}
      <circle cx="24" cy="31" r="3" fill={color} />
      {/* Trou de serrure — encoche vers le bas */}
      <rect x="22.5" y="33" width="3" height="5" rx="1.5" fill={color} />
    </svg>
  );
}

/** Icône téléphone/smartphone — sera remplacée par le vrai asset */
export function PhoneBoldIcon({ size = 22, color = "currentColor", className, badge = true }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {badge && <rect x="1" y="1" width="46" height="46" rx="14" fill="#E7F8EC" />}
      {/* Corps du téléphone */}
      <rect
        x="14"
        y="7"
        width="20"
        height="34"
        rx="5"
        stroke={color}
        strokeWidth="3.5"
        fill="none"
      />
      {/* Bouton home / encoche bas */}
      <circle cx="24" cy="36.5" r="1.8" fill={color} />
      {/* Haut-parleur */}
      <rect x="20" y="11" width="8" height="2.2" rx="1.1" fill={color} />
    </svg>
  );
}
