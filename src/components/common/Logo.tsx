import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  variant?: 'dark' | 'light' | 'badge' | 'auto';
  showSubtitle?: boolean;
  lang?: 'ar' | 'en';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'auto',
  lang
}) => {
  const { isArabic } = useLanguage();
  const currentLang = lang || (isArabic ? 'ar' : 'en');
  const isAr = currentLang === 'ar';

  // Responsive sizing tailored for specific layout areas
  // Artwork aspect ratio is ~2.15:1
  const sizeClasses = {
    sm: 'h-9 sm:h-11 w-auto max-w-[145px] sm:max-w-[175px]',
    md: 'h-11 sm:h-13 w-auto max-w-[180px] sm:max-w-[210px]',
    lg: 'h-16 sm:h-20 w-auto max-w-[250px] sm:max-w-[310px]',
    hero: 'h-24 sm:h-32 w-auto max-w-[340px] sm:max-w-[440px]'
  };

  // Determine the exact logo asset based on language and color context
  let src = '';
  if (variant === 'light') {
    // Apricot gold (#F1C17F) for dark backgrounds (e.g. footer)
    src = isAr ? '/brand/logo-ar-light.png' : '/brand/logo-en-light.png';
  } else if (variant === 'badge') {
    // Original artwork with authentic warm apricot/sand background
    src = isAr ? '/brand/logo-ar-badge.png' : '/brand/logo-en-badge.png';
  } else {
    // 'dark' or 'auto': Deep teal (#075B60) on transparent for cream/light backgrounds
    src = isAr ? '/brand/logo-ar-transparent.png' : '/brand/logo-en-transparent.png';
  }

  const alt = isAr
    ? 'فنة | مركز تجميل مغربي'
    : 'FINAH BEAUTY | Moroccan Beauty Center';

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`${sizeClasses[size]} object-contain select-none transition-opacity duration-200`}
        loading="eager"
      />
    </div>
  );
};
