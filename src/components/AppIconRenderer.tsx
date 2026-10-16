import React from 'react';
import {
  Wrench,
  Sparkles,
  Trees,
  TreePine,
  Car,
  Truck,
  HeartHandshake,
  Cpu,
  Utensils,
  UtensilsCrossed,
  GraduationCap,
  Paintbrush,
  Hammer,
  Zap,
  Flame,
  Scissors,
  Home,
  Key,
  Smartphone,
  Camera,
  Droplet,
  Droplets,
  Settings,
  Briefcase,
  Users,
  ShieldCheck,
  Star,
  BrickWall,
  Cake,
  Soup,
  Radio,
  Tv,
  Disc,
  BatteryCharging,
  Stethoscope,
  Layers,
  Search,
  Smile,
  FileText,
  Check,
  Plus,
  PhoneCall,
  MessageSquare,
  Compass,
  HelpCircle,
  Info,
  Lock,
  ShieldAlert,
  Lightbulb,
  Boxes,
  Package,
  Clock,
  Sliders,
  MapPin,
  Eye,
  Trash2,
  Award,
  Heart,
  Gamepad2,
  Gamepad,
  Film,
  CreditCard,
  MonitorPlay,
  LucideIcon
} from 'lucide-react';

export const ICON_MAP: Record<string, LucideIcon> = {
  Gamepad2,
  Gamepad,
  Film,
  CreditCard,
  MonitorPlay,
  Wrench,
  Sparkles,
  Trees,
  TreePine,
  Car,
  Truck,
  HeartHandshake,
  Cpu,
  Utensils,
  UtensilsCrossed,
  GraduationCap,
  Paintbrush,
  Hammer,
  Zap,
  Flame,
  Scissors,
  Home,
  Key,
  Smartphone,
  Camera,
  Droplet,
  Droplets,
  Settings,
  Briefcase,
  Users,
  ShieldCheck,
  Star,
  BrickWall,
  Cake,
  Soup,
  Radio,
  Tv,
  Disc,
  BatteryCharging,
  Stethoscope,
  Layers,
  Search,
  Smile,
  FileText,
  Check,
  Plus,
  PhoneCall,
  MessageSquare,
  Compass,
  HelpCircle,
  Info,
  Lock,
  ShieldAlert,
  Lightbulb,
  Boxes,
  Package,
  Clock,
  Sliders,
  MapPin,
  Eye,
  Trash2,
  Award,
  Heart
};

interface AppIconRendererProps {
  icon?: string | null;
  className?: string;
  size?: number | string;
  fallbackIcon?: string;
}

export const AppIconRenderer: React.FC<AppIconRendererProps> = ({
  icon,
  className = 'w-5 h-5',
  size,
  fallbackIcon = 'ShieldCheck'
}) => {
  const [hasImageError, setHasImageError] = React.useState(false);

  React.useEffect(() => {
    setHasImageError(false);
  }, [icon]);

  if (!icon || hasImageError) {
    const FallbackComponent = ICON_MAP[fallbackIcon] || ShieldCheck;
    return <FallbackComponent className={className} />;
  }

  const trimmed = icon.trim();

  // 1. Check if it's an uploaded Data URL (image/svg, image/png, image/webp, image/jpeg, etc.)
  if (trimmed.startsWith('data:image/')) {
    return (
      <img
        src={trimmed}
        alt="custom icon"
        onError={() => setHasImageError(true)}
        className={`object-contain inline-block select-none ${className}`}
        style={size ? { width: size, height: size } : undefined}
      />
    );
  }

  // 2. Check if it's an image URL (http, https, /src/, /assets/)
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('./')
  ) {
    return (
      <img
        src={trimmed}
        alt="custom icon"
        onError={() => setHasImageError(true)}
        className={`object-contain inline-block select-none ${className}`}
        style={size ? { width: size, height: size } : undefined}
      />
    );
  }

  // 3. Check if it's raw inline SVG code
  if (trimmed.startsWith('<svg') || trimmed.includes('xmlns="http://www.w3.org/2000/svg"')) {
    return (
      <span
        className={`inline-flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full ${className}`}
        style={size ? { width: size, height: size } : undefined}
        dangerouslySetInnerHTML={{ __html: trimmed }}
      />
    );
  }

  // 4. Check if it's an Emoji (e.g. 🛠️, ⚡, 🪚, 🎨, 🚗, etc.)
  // Emoji typically have length <= 4 characters and don't match ASCII word
  const isEmoji =
    /\p{Extended_Pictographic}/u.test(trimmed) ||
    (!/^[a-zA-Z0-9_]+$/.test(trimmed) && trimmed.length <= 6);

  if (isEmoji) {
    return (
      <span
        className={`inline-flex items-center justify-center leading-none select-none text-center ${className}`}
        style={{ fontSize: size ? size : '1.25rem', ...(!size ? { width: '1.25rem', height: '1.25rem' } : {}) }}
      >
        {trimmed}
      </span>
    );
  }

  // 5. Look up in Lucide icons map
  const IconComponent = ICON_MAP[trimmed] || ICON_MAP[fallbackIcon] || Wrench;
  return <IconComponent className={className} />;
};
