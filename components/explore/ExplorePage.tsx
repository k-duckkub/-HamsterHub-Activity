'use client'

import { useState } from 'react'
import { spaces } from '@/data/spaces'
import Sidebar from './Sidebar'
import ExploreHero from './ExploreHero'
import SpaceCarousel from './SpaceCarousel'

export default function ExplorePage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = spaces[activeIndex] ?? spaces[0]!

  return (
    <div className="flex min-h-screen flex-col-reverse lg:flex-row">
      <Sidebar active="explore" />

      <main className="relative min-h-[620px] flex-1 overflow-hidden lg:min-h-screen">
        <ExploreHero space={active} />

        <div className="absolute inset-x-0 bottom-0 z-10 pb-3 lg:pb-6">
          <SpaceCarousel
            spaces={spaces}
            activeIndex={activeIndex}
            onChange={setActiveIndex}
          />
        </div>

        <p aria-live="polite" className="sr-only">
          กำลังเลือกพื้นที่ {active.title}
        </p>
      </main>
    </div>
  )
}
