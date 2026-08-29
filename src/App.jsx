import React from 'react'
import Sidebar from './components/Sidebar'
import Hero from './components/Hero'
import Carousel from './components/Carousel'
import { spaces } from './data/spaces.jsx'

export default function App() {
  const [activeIndex, setActiveIndex] = React.useState(2)
  const active = spaces[activeIndex]

  return (
    <div className="flex h-full min-h-screen flex-col-reverse lg:flex-row">
      <Sidebar active="explore" />

      <main className="relative min-h-[560px] flex-1 overflow-hidden lg:min-h-0">
        <Hero space={active} />

        <div className="absolute inset-x-0 bottom-0 z-10 pb-4 lg:pb-8">
          <Carousel
            spaces={spaces}
            activeIndex={activeIndex}
            onChange={setActiveIndex}
          />
        </div>

        {/* บอกสถานะให้ screen reader โดยไม่รบกวนสายตา */}
        <p aria-live="polite" className="sr-only">
          กำลังเลือกพื้นที่ {active.title}
        </p>
      </main>
    </div>
  )
}
