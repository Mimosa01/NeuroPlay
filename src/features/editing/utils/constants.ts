export const TRANSMITTER_CONFIG = {
  // Возбуждающие
  glutamate: { 
    label: 'Глутамат', 
    color: 'text-green-600', 
    bg: 'bg-green-50', 
    iconColor: 'text-green-600',
    symbol: '+'
  },
  acetylcholine: { 
    label: 'Ацетилхолин', 
    color: 'text-emerald-600', 
    bg: 'bg-emerald-50', 
    iconColor: 'text-emerald-600',
    symbol: 'A'
  },
  norepinephrine: { 
    label: 'Норадреналин', 
    color: 'text-amber-600', 
    bg: 'bg-amber-50', 
    iconColor: 'text-amber-600',
    symbol: 'N'
  },

  // Тормозные
  gaba: { 
    label: 'ГАМК', 
    color: 'text-red-600', 
    bg: 'bg-red-50', 
    iconColor: 'text-red-600',
    symbol: '–'
  },
  glycine: { 
    label: 'Глицин', 
    color: 'text-rose-600', 
    bg: 'bg-rose-50', 
    iconColor: 'text-rose-600',
    symbol: 'G'
  },

  // Модуляторы
  dopamine: { 
    label: 'Дофамин', 
    color: 'text-blue-600', 
    bg: 'bg-blue-50', 
    iconColor: 'text-blue-600',
    symbol: 'D'
  },
  serotonin: { 
    label: 'Серотонин', 
    color: 'text-purple-600', 
    bg: 'bg-purple-50', 
    iconColor: 'text-purple-600',
    symbol: 'S'
  },
} as const;
