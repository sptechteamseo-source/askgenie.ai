import type { FC, ReactNode, SVGProps } from 'react'

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'stroke'> {
  size?: number
  /** Maps to strokeWidth on the underlying <svg> */
  stroke?: number
  children?: ReactNode
}

const Svg: FC<IconProps> = ({ size = 18, stroke = 1.75, className = '', children, ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...rest}
  >
    {children}
  </svg>
)

export const ArrowRight:   FC<IconProps> = (p) => <Svg {...p}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></Svg>
export const ArrowUpRight: FC<IconProps> = (p) => <Svg {...p}><path d="M7 17 17 7"/><path d="M8 7h9v9"/></Svg>
export const Spark:        FC<IconProps> = (p) => <Svg {...p}><path d="M12 2v6"/><path d="M12 16v6"/><path d="M2 12h6"/><path d="M16 12h6"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m4.93 19.07 4.24-4.24"/><path d="m14.83 9.17 4.24-4.24"/></Svg>
export const Shield:       FC<IconProps> = (p) => <Svg {...p}><path d="M12 2 3 6v6c0 5 3.8 9.4 9 10 5.2-.6 9-5 9-10V6Z"/></Svg>
export const Bolt:         FC<IconProps> = (p) => <Svg {...p}><path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z"/></Svg>
export const Link:         FC<IconProps> = (p) => <Svg {...p}><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 1 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 1 0 7 7l1-1"/></Svg>
export const Cite:         FC<IconProps> = (p) => <Svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6"/><path d="M9 17h6"/></Svg>
export const Layers:       FC<IconProps> = (p) => <Svg {...p}><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/></Svg>
export const Lock:         FC<IconProps> = (p) => <Svg {...p}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 1 1 8 0v4"/></Svg>
export const Search:       FC<IconProps> = (p) => <Svg {...p}><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></Svg>
export const Send:         FC<IconProps> = (p) => <Svg {...p}><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4 20-7Z"/></Svg>
export const Check:        FC<IconProps> = (p) => <Svg {...p}><path d="M20 6 9 17l-5-5"/></Svg>
export const Plus:         FC<IconProps> = (p) => <Svg {...p}><path d="M12 5v14"/><path d="M5 12h14"/></Svg>
export const Minus:        FC<IconProps> = (p) => <Svg {...p}><path d="M5 12h14"/></Svg>
export const Sun:          FC<IconProps> = (p) => <Svg {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></Svg>
export const Moon:         FC<IconProps> = (p) => <Svg {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></Svg>
export const Globe:        FC<IconProps> = (p) => <Svg {...p}><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 0 20"/><path d="M12 2a15 15 0 0 0 0 20"/></Svg>
export const Building:     FC<IconProps> = (p) => <Svg {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h.01M15 9h.01M9 13h.01M15 13h.01M9 17h.01M15 17h.01"/></Svg>
export const Users:        FC<IconProps> = (p) => <Svg {...p}><circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0"/><circle cx="17" cy="6" r="3"/><path d="M22 19a5 5 0 0 0-6-4.9"/></Svg>
export const Message:      FC<IconProps> = (p) => <Svg {...p}><path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/></Svg>
export const Doc:          FC<IconProps> = (p) => <Svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></Svg>
export const Zap:          FC<IconProps> = (p) => <Svg {...p}><path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z"/></Svg>
export const Filter:       FC<IconProps> = (p) => <Svg {...p}><path d="M22 3H2l8 9.5V21l4-2v-6.5z"/></Svg>
export const Twitter:      FC<IconProps> = (p) => <Svg {...p}><path d="M18 4h3l-7 8 8 10h-6l-5-6.5L5 22H2l7.5-8.5L2 4h6l4.5 6Z"/></Svg>
export const Github:       FC<IconProps> = (p) => <Svg {...p}><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5a3 3 0 0 0-.9-2.3c3-.4 6.1-1.5 6.1-7a5.5 5.5 0 0 0-1.5-3.8 5 5 0 0 0-.1-3.8s-1.2-.4-4 1.5a13.4 13.4 0 0 0-7 0c-2.8-1.9-4-1.5-4-1.5A5 5 0 0 0 4 5.6a5.5 5.5 0 0 0-1.5 3.8c0 5.5 3 6.6 6 7-.6.6-.9 1.5-.9 2.3V22"/></Svg>
export const Linkedin:     FC<IconProps> = (p) => <Svg {...p}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></Svg>
export const Play:         FC<IconProps> = (p) => <Svg {...p}><path d="m6 4 14 8-14 8z" fill="currentColor"/></Svg>
export const Star:         FC<IconProps> = (p) => <Svg {...p}><path d="m12 2 3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z" fill="currentColor"/></Svg>

/** Named map for data-driven icon lookups */
export const Icons: Record<string, FC<IconProps>> = {
  arrowRight:   ArrowRight,
  arrowUpRight: ArrowUpRight,
  spark:        Spark,
  shield:       Shield,
  bolt:         Bolt,
  link:         Link,
  cite:         Cite,
  layers:       Layers,
  lock:         Lock,
  search:       Search,
  send:         Send,
  check:        Check,
  plus:         Plus,
  minus:        Minus,
  sun:          Sun,
  moon:         Moon,
  globe:        Globe,
  building:     Building,
  users:        Users,
  message:      Message,
  doc:          Doc,
  zap:          Zap,
  filter:       Filter,
  twitter:      Twitter,
  github:       Github,
  linkedin:     Linkedin,
  play:         Play,
  star:         Star,
}

export type IconName = keyof typeof Icons
