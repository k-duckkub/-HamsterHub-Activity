'use client'

import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { coinBurstMotion, coinBurstMotionReduced } from '@/lib/motion'

type Particle = {
  x: number
  peakY: number
  endY: number
  rotate: number
}

export default function CoinBurst({ forceFullMotion }: { forceFullMotion: boolean }) {
  const reduced = (useReducedMotion() ?? false) && !forceFullMotion
  const motionConfig = reduced ? coinBurstMotionReduced : coinBurstMotion
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: motionConfig.particleCount }, (_, index) => {
        const angle =
          (index / motionConfig.particleCount) * Math.PI * 2 + ((index * 17) % 11) * 0.015
        const distance = (62 + (index % 4) * 13) * motionConfig.distanceScale

        return {
          x: Math.cos(angle) * distance,
          peakY: (-58 - (index % 3) * 17) * motionConfig.distanceScale,
          endY: (Math.sin(angle) * (62 + (index % 4) * 13) + 72) * motionConfig.distanceScale,
          rotate: (140 + ((index * 83) % 260)) * motionConfig.rotationScale,
        }
      }),
    [motionConfig],
  )

  return (
    <span
      aria-hidden="true"
      data-coin-burst={reduced ? 'reduced' : 'full'}
      className="pointer-events-none absolute inset-0 z-30 overflow-visible"
    >
      {motionConfig.showFlash && (
        <motion.span
          className="absolute inset-0 rounded-[18px] bg-white"
          initial={{ opacity: motionConfig.flashOpacity }}
          animate={{ opacity: 0 }}
          transition={{ duration: motionConfig.flashDuration, ease: motionConfig.ease }}
        />
      )}

      {particles.map((particle, index) => (
        <motion.span
          key={index}
          className="absolute left-1/2 top-1/2 h-3 w-3 rounded-full bg-[linear-gradient(135deg,#FFC24A,#FF6B00)] shadow-[0_2px_5px_rgba(0,0,0,0.32)] sm:h-3.5 sm:w-3.5"
          initial={{
            x: '-50%',
            y: '-50%',
            scale: motionConfig.scale[0],
            rotate: 0,
            opacity: motionConfig.opacity[0],
          }}
          animate={{
            x: [`-50%`, particle.x * motionConfig.distanceMidpoint, particle.x],
            y: [`-50%`, particle.peakY, particle.endY],
            scale: [...motionConfig.scale],
            rotate: [0, particle.rotate * motionConfig.rotationMidpoint, particle.rotate],
            opacity: [...motionConfig.opacity],
          }}
          transition={{
            duration: motionConfig.duration,
            delay: index * motionConfig.delayStep,
            ease: motionConfig.ease,
            times: [...motionConfig.times],
          }}
        />
      ))}

      {/* ชุดที่สอง: เหรียญตกจากขอบบนด้วยจังหวะเร่งเหมือนแรงโน้มถ่วง */}
      {Array.from({ length: motionConfig.rainCount }, (_, index) => {
        const left = 5 + ((index * 29) % 91)
        const drift = ((index * 19) % 35) - 17
        const rotate = 120 + ((index * 97) % 320)

        return (
          <motion.span
            key={`rain-${index}`}
            data-coin-rain="true"
            className="absolute h-2.5 w-2.5 rounded-full bg-[linear-gradient(135deg,#FFC24A,#FF6B00)] shadow-[0_2px_5px_rgba(0,0,0,0.32)] sm:h-3 sm:w-3"
            style={{ left: `${left}%` }}
            initial={{
              top: motionConfig.rainTop[0],
              x: 0,
              rotate: 0,
              scale: motionConfig.rainScale[0],
              opacity: motionConfig.rainOpacity[0],
            }}
            animate={{
              top: [...motionConfig.rainTop],
              x: [0, drift, drift * 1.45],
              rotate: [0, rotate * 0.45, rotate],
              scale: [...motionConfig.rainScale],
              opacity: [...motionConfig.rainOpacity],
            }}
            transition={{
              duration:
                motionConfig.rainDuration +
                (index % 4) * motionConfig.rainDurationStep,
              delay: index * motionConfig.rainDelayStep,
              ease: motionConfig.rainEase,
              times: [...motionConfig.rainTimes],
            }}
          />
        )
      })}

      {/* ประกายแซมระหว่างเหรียญ ใช้กากบาทเล็กจากสีทองชุดเดิม */}
      {Array.from({ length: motionConfig.sparkleCount }, (_, index) => (
        <motion.span
          key={`sparkle-${index}`}
          data-sparkle="true"
          className="absolute h-3 w-3"
          style={{
            left: `${10 + ((index * 37) % 82)}%`,
            top: `${12 + ((index * 23) % 70)}%`,
          }}
          initial={{
            scale: motionConfig.sparkleScale[0],
            opacity: motionConfig.sparkleOpacity[0],
            rotate: motionConfig.sparkleRotate[0],
          }}
          animate={{
            scale: [...motionConfig.sparkleScale],
            opacity: [...motionConfig.sparkleOpacity],
            rotate: [...motionConfig.sparkleRotate],
          }}
          transition={{
            duration: motionConfig.sparkleDuration,
            delay: index * motionConfig.sparkleDelayStep,
            ease: motionConfig.ease,
            times: [...motionConfig.sparkleTimes],
          }}
        >
          <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#FFC24A]" />
          <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[#FFC24A]" />
        </motion.span>
      ))}
    </span>
  )
}
