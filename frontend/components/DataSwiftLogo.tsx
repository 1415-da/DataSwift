import React from 'react';

export const DataSwiftLogo = ({ width = 80, height = 80, className = "" }: { width?: number, height?: number, className?: string }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Background circle with gradient */}
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#3B82F6', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#1D4ED8', stopOpacity:1}} />
        </linearGradient>
        <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#60A5FA', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#3B82F6', stopOpacity:1}} />
        </linearGradient>
      </defs>
      
      {/* Background circle */}
      <circle cx="40" cy="40" r="38" fill="url(#bgGradient)" stroke="#1E40AF" strokeWidth="2"/>
      
      {/* Data visualization elements */}
      {/* Bar chart bars */}
      <rect x="20" y="50" width="6" height="20" rx="3" fill="url(#iconGradient)"/>
      <rect x="30" y="40" width="6" height="30" rx="3" fill="url(#iconGradient)"/>
      <rect x="40" y="30" width="6" height="40" rx="3" fill="url(#iconGradient)"/>
      <rect x="50" y="35" width="6" height="35" rx="3" fill="url(#iconGradient)"/>
      
      {/* Data points/connections */}
      <circle cx="23" cy="45" r="2" fill="#FFFFFF"/>
      <circle cx="33" cy="35" r="2" fill="#FFFFFF"/>
      <circle cx="43" cy="25" r="2" fill="#FFFFFF"/>
      <circle cx="53" cy="30" r="2" fill="#FFFFFF"/>
      
      {/* Connection lines */}
      <path d="M23 45 L33 35 L43 25 L53 30" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none"/>
      
      {/* Swift arrow indicator */}
      <path d="M55 20 L65 15 L60 25" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
};
