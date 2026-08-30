import { projects, type Project } from './projects'

export type ShowcaseSlot = {
  slotIndex: number
  project: Project
}

/** ผลงานเด่นหนึ่งชิ้นจากแต่ละกิจกรรม เอามาโชว์รวมกันบนเวทีเดียว */
const FEATURED_IDS = ['rj-6', 'nc-1', 'gi-5', 'gx-3', 'dt-1'] as const

export const SHOWCASE_SLOTS: ShowcaseSlot[] = FEATURED_IDS.map((id, slotIndex) => {
  const project = projects.find((item) => item.id === id)
  if (!project) throw new Error(`Unknown showcase project: ${id}`)
  return { slotIndex, project }
})
