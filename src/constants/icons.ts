import type { LucideIcon, LucideProps } from 'lucide-react'
import {
  AlertTriangle,
  Armchair,
  Bath,
  Bed,
  BellRing,
  Coffee,
  GlassWater,
  HeartPulse,
  HelpCircle,
  MessageSquarePlus,
  Moon,
  Move,
  Pill,
  Smile,
  Sun,
  ThermometerSnowflake,
  ThermometerSun,
  ThumbsDown,
  ThumbsUp,
  Tv,
  Users,
  Utensils,
  Wind,
} from 'lucide-react'
import React from 'react'

export interface AACIconOption {
  name: string
  label: string
  icon: LucideIcon
}

export const AAC_ICON_MAP: Record<string, LucideIcon> = {
  Bath,
  Utensils,
  GlassWater,
  Wind,
  Armchair,
  BellRing,
  AlertTriangle,
  MessageSquarePlus,
  Sun,
  Moon,
  Bed,
  Pill,
  HeartPulse,
  ThermometerSnowflake,
  ThermometerSun,
  Tv,
  Users,
  Move,
  Coffee,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  Smile,
}

export const AVAILABLE_ICONS: AACIconOption[] = [
  { name: 'Bath', label: 'Baño / Higiene', icon: Bath },
  { name: 'Utensils', label: 'Comida / Almuerzo', icon: Utensils },
  { name: 'GlassWater', label: 'Agua / Sed', icon: GlassWater },
  { name: 'Wind', label: 'Ventana / Aire / Calor', icon: Wind },
  { name: 'Armchair', label: 'Sillón / Posición', icon: Armchair },
  { name: 'BellRing', label: 'Campana / Alerta', icon: BellRing },
  { name: 'AlertTriangle', label: 'Dolor / Urgencia', icon: AlertTriangle },
  { name: 'MessageSquarePlus', label: 'Mensaje / Otra cosa', icon: MessageSquarePlus },
  { name: 'Sun', label: 'Luz / Salir al sol', icon: Sun },
  { name: 'Moon', label: 'Dormir / Noche', icon: Moon },
  { name: 'Bed', label: 'Acostarse / Cama', icon: Bed },
  { name: 'Pill', label: 'Medicina / Pastilla', icon: Pill },
  { name: 'HeartPulse', label: 'Malestar / Salud', icon: HeartPulse },
  { name: 'ThermometerSnowflake', label: 'Tengo frío', icon: ThermometerSnowflake },
  { name: 'ThermometerSun', label: 'Fiebre / Mucho calor', icon: ThermometerSun },
  { name: 'Tv', label: 'Televisión / Radio', icon: Tv },
  { name: 'Users', label: 'Familia / Compañía', icon: Users },
  { name: 'Move', label: 'Moverme / Cambiar de lado', icon: Move },
  { name: 'Coffee', label: 'Café / Bebida caliente', icon: Coffee },
  { name: 'HelpCircle', label: 'Pregunta / Duda', icon: HelpCircle },
]

export function AACIcon({ name, ...props }: { name: string } & LucideProps) {
  const IconComp = AAC_ICON_MAP[name] || HelpCircle
  return React.createElement(IconComp, {
    size: props.size ?? 64,
    strokeWidth: props.strokeWidth ?? 2.5,
    ...props,
  })
}

export function getAACIcon(iconName: string): LucideIcon {
  return AAC_ICON_MAP[iconName] || HelpCircle
}
