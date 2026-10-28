import React from 'react';
import { RosetteEmblem } from './RosetteEmblem';
import { Sparkles, Crown, Scissors, Smile, Heart, Image as ImageIcon } from 'lucide-react';

interface EditorialMediaPlaceholderProps {
  title?: string;
  category?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '3:4';
  archShape?: boolean;
  className?: string;
  imageSrc?: string;
  altText?: string;
}

export const EditorialMediaPlaceholder: React.FC<EditorialMediaPlaceholderProps> = ({
  title,
  category,
  aspectRatio = '4:3',
  archShape = false,
  className = '',
  imageSrc,
  altText
}) => {
  const [imgError, setImgError] = React.useState(false);

  const aspectClasses = {
    '16:9': 'aspect-[16/9]',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
    '3:4': 'aspect-[3/4]'
  };

  const archClass = archShape ? 'moroccan-arch-subtle' : 'rounded-lg';

  const getCategoryIcon = () => {
    switch (category) {
      case 'hammam':
        return <Sparkles className="w-6 h-6 text-[#075B60]/70" />;
      case 'bridal':
        return <Crown className="w-6 h-6 text-[#075B60]/70" />;
      case 'hair':
        return <Scissors className="w-6 h-6 text-[#075B60]/70" />;
      case 'facial':
        return <Smile className="w-6 h-6 text-[#075B60]/70" />;
      case 'body':
        return <Heart className="w-6 h-6 text-[#075B60]/70" />;
      default:
        return <ImageIcon className="w-6 h-6 text-[#075B60]/70" />;
    }
  };

  if (imageSrc && !imgError) {
    return (
      <div className={`relative overflow-hidden ${aspectClasses[aspectRatio]} ${archClass} ${className} bg-[#F7E5C8]`}>
        <img
          src={imageSrc}
          alt={altText || title || 'Finah Beauty Moroccan Sanctuary'}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  // Refined architectural editorial fallback with brand geometry
  return (
    <div
      className={`relative overflow-hidden flex flex-col items-center justify-center p-6 text-center select-none ${aspectClasses[aspectRatio]} ${archClass} ${className} bg-gradient-to-br from-[#F7E5C8] via-[#FFF7EA] to-[#F1C17F]/40 border border-[#DBC7A6]/60 shadow-[0_2px_12px_rgba(7,91,96,0.04)]`}
    >
      {/* Background Moroccan Arch & Geometry watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <RosetteEmblem size={180} color="#075B60" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-3 max-w-[85%]">
        <div className="w-12 h-12 rounded-full bg-[#FFF7EA] border border-[#DBC7A6] flex items-center justify-center shadow-sm">
          {getCategoryIcon()}
        </div>
        {title && (
          <h4 className="font-serif text-lg font-medium text-[#075B60] leading-snug line-clamp-2">
            {title}
          </h4>
        )}
        <div className="flex items-center gap-2 text-xs text-[#075B60]/75 tracking-wider">
          <span className="font-medium">FINAH BEAUTY</span>
          <span aria-hidden="true">·</span>
          <span>فنة</span>
        </div>
      </div>
    </div>
  );
};
