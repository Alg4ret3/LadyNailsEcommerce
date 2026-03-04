// Central icon mapping: re-export selected lucide icons with aliases
export {
  ShoppingCart as ShoppingBag,
  ShoppingCart as ShoppingCartIcon,
  User as UserIcon,
  Search as SearchIcon,
  Menu as MenuIcon,
  X as XIcon,
  ArrowLeftRight,
  Store,
  Store as StoreIcon,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Tag,
  Building2,
  Sun,
  Moon,
  Lock,
  Instagram,
  Facebook,
  Twitter,
  Mail,
  MapPin,
  Phone,
  MessageCircle as WhatsApp,
  Trash2,
  Minus,
  Plus,
  Star,
  Heart,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Filter,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Percent,
  Check,
  CreditCard,
  MessageSquare,
  Trophy,
  Target,
  TrendingUp,
  Globe,
  Briefcase,
  Package,
} from 'lucide-react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TikTok = ({ size = 18, ...props }: IconProps) => (
  <svg height={size} width={size} {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.617a8.171 8.171 0 0 0 3.77 1.348V6.686z" />
  </svg>
);

const Icons = {
  ShoppingBag: (props: IconProps) => null,
};

export default Icons;
