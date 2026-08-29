import React from 'react'

/**
 * ฉากพื้นหลังของแต่ละพื้นที่ วาดด้วย SVG ทั้งหมด
 * (ไม่พึ่งไฟล์ภาพภายนอก จึงโหลดไว และคมทุกความละเอียด)
 */
function Scene({ from, via, to, glow, motif }) {
  const id = React.useId()
  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="55%" stopColor={via} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={glow} stopOpacity="0.85" />
          <stop offset="55%" stopColor={glow} stopOpacity="0.22" />
          <stop offset="100%" stopColor={glow} stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-soft`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="26" />
        </filter>
      </defs>

      <rect width="1200" height="800" fill={`url(#${id}-bg)`} />
      <circle cx="820" cy="330" r="420" fill={`url(#${id}-glow)`} />

      {motif === 'orbit' && (
        <g filter={`url(#${id}-soft)`} opacity="0.55">
          {[0, 1, 2, 3].map((i) => (
            <ellipse
              key={i}
              cx="820"
              cy="340"
              rx={180 + i * 90}
              ry={70 + i * 46}
              fill="none"
              stroke={glow}
              strokeWidth="3"
              opacity={0.7 - i * 0.14}
              transform={`rotate(${-18 + i * 12} 820 340)`}
            />
          ))}
        </g>
      )}

      {motif === 'grid' && (
        <g opacity="0.4">
          {Array.from({ length: 14 }).map((_, i) => (
            <line
              key={`v${i}`}
              x1={i * 100}
              y1="0"
              x2={i * 100 - 220}
              y2="800"
              stroke={glow}
              strokeWidth="1.5"
              opacity="0.35"
            />
          ))}
          {Array.from({ length: 9 }).map((_, i) => (
            <line
              key={`h${i}`}
              x1="0"
              y1={i * 100}
              x2="1200"
              y2={i * 100}
              stroke={glow}
              strokeWidth="1.5"
              opacity="0.2"
            />
          ))}
        </g>
      )}

      {motif === 'spark' && (
        <g>
          {Array.from({ length: 42 }).map((_, i) => {
            const a = (i / 42) * Math.PI * 2
            const r = 120 + ((i * 53) % 300)
            return (
              <circle
                key={i}
                cx={820 + Math.cos(a) * r * 1.35}
                cy={340 + Math.sin(a) * r * 0.8}
                r={((i * 7) % 5) + 1.5}
                fill="#ffffff"
                opacity={0.15 + (((i * 13) % 60) / 200)}
              />
            )
          })}
        </g>
      )}

      {motif === 'stage' && (
        <g opacity="0.5" filter={`url(#${id}-soft)`}>
          <path d="M420 800 L820 180 L1220 800 Z" fill={glow} opacity="0.35" />
          <path d="M180 800 L560 300 L940 800 Z" fill={glow} opacity="0.2" />
        </g>
      )}

      {motif === 'blocks' && (
        <g opacity="0.45">
          {Array.from({ length: 16 }).map((_, i) => {
            const x = 240 + ((i * 137) % 900)
            const y = 120 + ((i * 211) % 560)
            const s = 40 + ((i * 29) % 70)
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={s}
                height={s}
                rx="10"
                fill={glow}
                opacity={0.12 + (((i * 17) % 40) / 160)}
                transform={`rotate(${(i * 23) % 40} ${x + s / 2} ${y + s / 2})`}
              />
            )
          })}
        </g>
      )}

      <g filter={`url(#${id}-soft)`} opacity="0.35">
        <ellipse cx="240" cy="700" rx="360" ry="180" fill={to} />
      </g>
    </svg>
  )
}

const Icon = ({ children }) => (
  <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
    <defs>
      <linearGradient id="hh-o" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FF9A4D" />
        <stop offset="100%" stopColor="#FF6B00" />
      </linearGradient>
      <linearGradient id="hh-n" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1E3A5C" />
        <stop offset="100%" stopColor="#0A1A2F" />
      </linearGradient>
    </defs>
    {children}
  </svg>
)

const O = 'url(#hh-o)'
const N = 'url(#hh-n)'

export const spaces = [
  {
    id: 'game-dev',
    name: 'Game Dev',
    category: 'BUILD & CODE',
    title: 'Game Dev',
    subtitle: 'เปลี่ยนไอเดียให้กลายเป็นเกมที่เล่นได้จริง',
    viewers: '4.1K',
    scene: { from: '#0A1A2F', via: '#123049', to: '#0B2233', glow: '#2C9FA2', motif: 'grid' },
    icon: (
      <Icon>
        <rect x="8" y="14" width="48" height="30" rx="6" fill={N} />
        <rect x="13" y="19" width="38" height="20" rx="3" fill="#12283F" />
        <path d="M18 30h10M23 25v10" stroke={O} strokeWidth="3" strokeLinecap="round" />
        <circle cx="41" cy="27" r="2.6" fill={O} />
        <circle cx="46" cy="33" r="2.6" fill="#2C9FA2" />
        <rect x="20" y="46" width="24" height="6" rx="3" fill={O} />
      </Icon>
    ),
  },
  {
    id: 'game-jam',
    name: 'Game Jam',
    category: 'CREATE TOGETHER',
    title: 'Game Jam',
    subtitle: 'สร้างเกมให้เสร็จภายในเวลาที่จำกัด',
    viewers: '2.8K',
    scene: { from: '#0A1A2F', via: '#1B2C4A', to: '#0E1E36', glow: '#FF8A3D', motif: 'blocks' },
    icon: (
      <Icon>
        <path d="M32 8c8.3 0 15 6.5 15 14.6 0 5.6-3 9.2-5.4 12-1.6 1.8-2.6 3.2-2.6 5.4H25c0-2.2-1-3.6-2.6-5.4-2.4-2.8-5.4-6.4-5.4-12C17 14.5 23.7 8 32 8z" fill={O} />
        <rect x="25" y="43" width="14" height="4.5" rx="2.2" fill={N} />
        <rect x="26.5" y="50" width="11" height="4.5" rx="2.2" fill={N} />
        <path d="M32 16v10" stroke="#FFE2CC" strokeWidth="2.4" strokeLinecap="round" />
      </Icon>
    ),
  },
  {
    id: 'game-vfx',
    name: 'Game VFX',
    category: 'ART & VFX',
    title: 'Game VFX',
    subtitle: 'สร้างเอฟเฟกต์ที่ทำให้เกมมีชีวิต',
    viewers: '3.6K',
    scene: { from: '#07182B', via: '#0F3A4A', to: '#0A2333', glow: '#35D2D6', motif: 'spark' },
    icon: (
      <Icon>
        <rect x="6" y="12" width="46" height="32" rx="6" fill={N} />
        <rect x="11" y="17" width="36" height="22" rx="3" fill="#0F2338" />
        <path d="M25 28l2.6-6 2.6 6 6 2.6-6 2.6-2.6 6-2.6-6-6-2.6z" fill={O} />
        <circle cx="39" cy="23" r="2" fill="#35D2D6" />
        <path d="M44 46l12-12" stroke={O} strokeWidth="5" strokeLinecap="round" />
        <path d="M55 30l3 3-2.5 2.5-3-3z" fill="#FFC79A" />
        <rect x="20" y="47" width="20" height="5" rx="2.5" fill={N} />
      </Icon>
    ),
  },
  {
    id: 'creator-cup',
    name: 'Creator Cup',
    category: 'COMPETITION',
    title: 'Creator Cup',
    subtitle: 'เวทีของครีเอเตอร์ที่พร้อมโชว์ผลงาน',
    viewers: '5.2K',
    scene: { from: '#0A1A2F', via: '#2A2038', to: '#12203A', glow: '#FFB35C', motif: 'stage' },
    icon: (
      <Icon>
        <path d="M18 12h28v13c0 7.7-6.3 14-14 14s-14-6.3-14-14z" fill={O} />
        <path d="M18 16h-6v4c0 4.4 3 8 6.6 8.6M46 16h6v4c0 4.4-3 8-6.6 8.6" stroke={N} strokeWidth="3" fill="none" strokeLinecap="round" />
        <rect x="28" y="38" width="8" height="8" fill={N} />
        <rect x="20" y="46" width="24" height="7" rx="3" fill={N} />
        <path d="M32 18l1.9 4 4.4.6-3.2 3 .8 4.3-3.9-2-3.9 2 .8-4.3-3.2-3 4.4-.6z" fill="#FFE2CC" />
      </Icon>
    ),
  },
  {
    id: 'roblox-jam',
    name: 'Roblox Jam',
    category: 'ROBLOX',
    title: 'Roblox Jam',
    subtitle: 'สร้างโลกและเกมของคุณบน Roblox',
    viewers: '6.4K',
    scene: { from: '#08182C', via: '#154055', to: '#0B2436', glow: '#5BC8D8', motif: 'orbit' },
    icon: (
      <Icon>
        <rect x="22" y="10" width="20" height="16" rx="5" fill={O} />
        <circle cx="28.5" cy="18" r="2" fill={N} />
        <circle cx="35.5" cy="18" r="2" fill={N} />
        <rect x="24" y="29" width="16" height="16" rx="4" fill={N} />
        <rect x="12" y="30" width="9" height="14" rx="4" fill={O} />
        <rect x="43" y="30" width="9" height="14" rx="4" fill={O} />
        <rect x="24" y="47" width="6.5" height="8" rx="3" fill={N} />
        <rect x="33.5" y="47" width="6.5" height="8" rx="3" fill={N} />
      </Icon>
    ),
  },
]

export { Scene }
