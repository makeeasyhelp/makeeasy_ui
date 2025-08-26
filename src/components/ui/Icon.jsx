import React from 'react';
import * as LucideIcons from 'lucide-react';

const iconMap = {
  // Navigation and common icons
  'home': 'Home',
  'search': 'Search',
  'user': 'User',
  'settings': 'Settings',
  'menu': 'Menu',
  
  // Category icons
  'tv': 'Tv',
  'sofa': 'Armchair',
  'car': 'Car',
  'building': 'Building2',
  'briefcase': 'Briefcase',
  
  // Action icons
  'plus': 'Plus',
  'minus': 'Minus',
  'edit': 'Edit',
  'delete': 'Trash2',
  'close': 'X',
  
  // Location and contact
  'map-pin': 'MapPin',
  'phone': 'Phone',
  'mail': 'Mail',
  
  // Status and feedback
  'check': 'Check',
  'alert': 'AlertTriangle',
  'info': 'Info',
  'loading': 'Loader2',
};

/**
 * A dynamic icon component that renders an icon from the lucide-react library.
 * @param {string} name - The name of the icon (case-insensitive).
 * @param {string} className - Additional CSS classes for styling.
 * @param {number} size - The size of the icon in pixels.
 */
const Icon = ({ name, className, size = 24 }) => {
  // Convert name to lowercase for case-insensitive mapping
  const normalizedName = name.toLowerCase();
  const iconName = iconMap[normalizedName] || name;
  const LucideIcon = LucideIcons[iconName];

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found, using fallback`);
    return <LucideIcons.HelpCircle size={size} className={className} />;
  }

  return <LucideIcon size={size} className={className} />;
};

export default Icon;
