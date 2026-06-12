// Design System Tokens untuk konsistensi UI

export const COLORS = {
  // Primary - Purple (untuk aksi utama dan branding)
  primary: {
    main: '#4C1D95',      // purple-900
    light: '#8B5CF6',     // purple-600
    bg: '#F5F3FF',        // purple-50
    border: '#DDD6FE',    // purple-200
    text: '#6B21A8',      // purple-800
  },

  // Success - Green (untuk status berhasil, setujui)
  success: {
    main: '#16A34A',      // green-600
    dark: '#15803D',      // green-700
    bg: '#F0FDF4',        // green-50
    border: '#BBF7D0',    // green-200
    text: '#166534',      // green-700
  },

  // Danger - Red (untuk tolak, hapus)
  danger: {
    main: '#EF4444',      // red-500
    dark: '#DC2626',      // red-600
    bg: '#FEF2F2',        // red-50
    border: '#FECACA',    // red-200
    text: '#991B1B',      // red-700
  },

  // Info - Blue (untuk informasi, lihat detail)
  info: {
    main: '#3B82F6',      // blue-500
    dark: '#2563EB',      // blue-600
    bg: '#EFF6FF',        // blue-50
    border: '#BFDBFE',    // blue-200
    text: '#1E40AF',      // blue-700
  },

  // Warning - Orange (untuk peringatan)
  warning: {
    main: '#F97316',      // orange-500
    dark: '#EA580C',      // orange-600
    bg: '#FFF7ED',        // orange-50
    border: '#FED7AA',    // orange-200
    text: '#C2410C',      // orange-700
  },

  // Neutral - Gray (untuk background, border, text)
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};

export const BUTTON_STYLES = {
  // Primary button - untuk aksi utama
  primary: `px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[${COLORS.primary.main}] hover:bg-purple-800 transition-colors`,

  // Secondary button - untuk aksi sekunder
  secondary: 'px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors',

  // Success button - untuk setujui
  success: `px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[${COLORS.success.main}] hover:bg-green-700 transition-colors`,

  // Danger button - untuk tolak/hapus
  danger: `px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[${COLORS.danger.main}] hover:bg-red-600 transition-colors`,

  // Info button - untuk lihat/detail
  info: 'px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors',

  // Small button
  small: 'px-3 py-1.5 rounded-xl text-xs font-semibold',
};

export const CARD_STYLES = {
  base: 'bg-white rounded-2xl border border-gray-100 shadow-sm',
  header: 'px-5 py-4 border-b border-gray-100',
  body: 'p-6',
};

export const STATUS_COLORS = {
  'Belum Diproses': '#6B7280',      // gray-500
  'Dalam Proses': '#3B82F6',        // blue-500
  'Dalam Review': '#8B5CF6',        // purple-500
  'Menunggu Verifikasi': '#F59E0B', // amber-500
  'Menunggu Persetujuan': '#8B5CF6',// purple-500
  'Selesai': '#10B981',             // green-500
  'Perlu Tindak Lanjut': '#EF4444', // red-500
  'Ditolak': '#DC2626',             // red-600
};

export const BORDER_RADIUS = {
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  full: 'rounded-full',
};

export const SPACING = {
  xs: 'p-2',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
  xl: 'p-6',
};
