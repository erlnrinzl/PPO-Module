# UI Standardization Guide

## Color Palette

### Primary Colors (Purple)
- **Main**: `bg-purple-900` (#4C1D95) - untuk branding dan aksi utama
- **Hover**: `hover:bg-purple-800`
- **Light**: `bg-purple-50` - untuk background info/banner
- **Border**: `border-purple-200`
- **Text**: `text-purple-800`

### Success (Green)
- **Button**: `bg-green-600 hover:bg-green-700`
- **Background**: `bg-green-50`
- **Border**: `border-green-200`
- **Text**: `text-green-700`

### Danger (Red)
- **Button**: `bg-red-500 hover:bg-red-600`
- **Background**: `bg-red-50`
- **Border**: `border-red-200`
- **Text**: `text-red-700`

### Info (Blue)
- **Button**: `bg-blue-600 hover:bg-blue-700`
- **Background**: `bg-blue-50`
- **Border**: `border-blue-200`
- **Text**: `text-blue-700`

### Warning (Orange/Amber)
- **Background**: `bg-orange-50` or `bg-amber-50`
- **Border**: `border-orange-200`
- **Text**: `text-orange-700`

### Neutral (Gray)
- **Card BG**: `bg-white`
- **Section BG**: `bg-gray-50`
- **Border**: `border-gray-100` or `border-gray-200`
- **Text Primary**: `text-gray-800`
- **Text Secondary**: `text-gray-600` or `text-gray-500`
- **Text Muted**: `text-gray-400`

## Button Sizes

### Large (Primary Actions)
```
px-5 py-2.5 text-sm font-semibold rounded-xl
```
Contoh: "Ajukan Permohonan", "Simpan", "Submit"

### Medium (Secondary Actions)
```
px-4 py-2 text-sm font-semibold rounded-xl
```
Contoh: "Setujui", "Tolak", "Kembali"

### Small (Table Actions)
```
px-3 py-1.5 text-xs font-semibold rounded-xl
```
Contoh: "Review", "Lihat", "Edit" dalam table

## Button Variants

### Primary Button
```tsx
className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-purple-900 hover:bg-purple-800"
```

### Success Button (Setujui)
```tsx
className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700"
```

### Danger Button (Tolak/Hapus)
```tsx
className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600"
```

### Info Button (Lihat/Detail)
```tsx
className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700"
```

### Secondary Button (Batal/Kembali)
```tsx
className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50"
```

## Card & Container Styles

### Card Base
```tsx
className="bg-white rounded-2xl border border-gray-100 shadow-sm"
```

### Card Header
```tsx
className="px-5 py-4 border-b border-gray-100"
```

### Card Body
```tsx
className="p-6"
```

### Info Banner
```tsx
className="bg-purple-50 border border-purple-200 rounded-2xl p-4"
```

## Border Radius

- **Buttons**: `rounded-xl`
- **Cards**: `rounded-2xl`
- **Small Elements** (badges, chips): `rounded-full` or `rounded-lg`
- **Inputs**: `rounded-xl`

## Spacing

- **Card padding**: `p-6` or `p-5`
- **Section spacing**: `space-y-5` or `space-y-4`
- **Button gap**: `gap-2` or `gap-3`

## Status Badge

```tsx
className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
style={{ background: statusColor }}
```

## Table Styles

### Table Header
```tsx
className="bg-gray-50 border-b border-gray-100"
```

### Table Cell
```tsx
className="px-4 py-3"
```

### Table Row Hover
```tsx
className="hover:bg-purple-50/30 transition-colors"
```

## Modal/Popup Header
```tsx
className="px-6 py-4 bg-purple-900"
```

## Transitions
All interactive elements should have:
```
transition-colors
```

## Icons
- **Small icons**: `size={12}` - dalam badge/small button
- **Medium icons**: `size={14}` or `size={16}` - dalam button
- **Large icons**: `size={18}` or `size={20}` - dalam banner/header

