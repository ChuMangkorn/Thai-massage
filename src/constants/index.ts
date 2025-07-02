// Contact Information
export const CONTACT_INFO = {
  phone: '028-611-3638',
  address: {
    ja: '〒321-0945 栃木県宇都宮市宿郷1丁目16-9',
    en: '1-16-9 Shukugo, Utsunomiya, Tochigi 321-0945',
    th: '1-16-9 ชูคุโกะ, อุสึโนะมิยะ, โทะชิงิ 321-0945'
  }
} as const;

// Supported Languages
export const SUPPORTED_LANGUAGES = ['en', 'ja', 'th'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

// Font Classes
export const FONT_CLASSES = {
  ja: 'font-noto-jp',
  th: 'font-noto-thai',
  en: 'font-montserrat'
} as const;

// Animation Classes
export const ANIMATION_CLASSES = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  float: 'animate-float',
  hover: 'transform hover:scale-105 transition-all duration-300',
  hoverShadow: 'hover:shadow-2xl'
} as const;

// Common Styling
export const COMMON_STYLES = {
  section: 'py-20',
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  sectionTitle: 'text-4xl md:text-5xl font-bold text-text mb-4',
  sectionSubtitle: 'text-xl text-gray-600 max-w-3xl mx-auto',
  divider: 'w-24 h-1 bg-primary mx-auto mt-6',
  button: {
    primary: 'bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full transition-colors font-medium',
    secondary: 'bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-accent transition-colors'
  },
  card: 'bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-2xl'
} as const;

// Business Hours
export const BUSINESS_HOURS = {
  weekdays: '13:00 - 23:00',
  weekends: '13:00 - 23:00'
} as const;

// Service Pricing - แยกราคาตามประเภทบริการ
export const SERVICE_PRICING = {
  traditional: {
    '30min': '¥2,500',
    '60min': '¥4,500', 
    '90min': '¥6,500',
    '120min': '¥8,500'
  },
  oil: {
    '60min': '¥6,500',
    '90min': '¥9,500', 
    '120min': '¥13,000'
  },
  face: {
    '60min': '¥5,000'
  },
  foot: {
    '30min': '¥2,500',
    '60min': '¥4,500'
  }
} as const;