import React from 'react';
import { Star } from 'lucide-react';

export interface RatingProps {
  rating: number;
  maxRating?: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
  showNumber?: boolean;
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  rating,
  maxRating = 5,
  reviewCount,
  size = 'md',
  showNumber = true,
  className = ''
}) => {
  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4'
  };

  const roundedRating = Math.round(rating * 10) / 10;

  return (
    <div className={`inline-flex items-center gap-1 text-[12px] text-[#5B6660] ${className}`}>
      <div className="flex items-center gap-0.5" aria-label={`التقييم: ${roundedRating} من ${maxRating}`}>
        {[...Array(maxRating)].map((_, i) => {
          const isFilled = i < Math.floor(roundedRating);
          return (
            <Star
              key={i}
              strokeWidth={1.75}
              className={`
                ${starSizes[size]}
                ${isFilled 
                  ? 'fill-[#E8A317] text-[#E8A317]' 
                  : 'text-[#DDE3DF] fill-transparent'}
              `}
            />
          );
        })}
      </div>

      {showNumber && (
        <span className="font-semibold text-[#1C2421] tabular-nums mr-0.5">
          {roundedRating.toFixed(1)}
        </span>
      )}

      {reviewCount !== undefined && (
        <span className="text-[#5B6660]">
          ({reviewCount})
        </span>
      )}
    </div>
  );
};
