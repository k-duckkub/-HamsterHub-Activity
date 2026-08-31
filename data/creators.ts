import { projects, type Project } from './projects'
import { activities, type Activity } from './activities'

export type Creator = {
  /** slug ใน URL สร้างจากชื่อที่มีอยู่จริงในข้อมูลผลงาน */
  slug: string
  name: string
  initial: string
}

/** ชื่อผู้สร้างเป็นข้อมูลเดียวที่มีอยู่จริง จึงไม่มีช่องอื่นให้แสดง */
export const creatorSlug = (name: string): string =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9ก-๙]+/g, '-')
    .replace(/^-|-$/g, '')

export const creators: Creator[] = Array.from(
  projects.reduce((map, project) => {
    if (!map.has(project.creator)) {
      map.set(project.creator, {
        slug: creatorSlug(project.creator),
        name: project.creator,
        initial: project.initial,
      })
    }
    return map
  }, new Map<string, Creator>()),
  ([, creator]) => creator
)

export const creatorBySlug = (slug: string): Creator | undefined =>
  creators.find((creator) => creator.slug === slug)

export const projectsByCreator = (name: string): Project[] =>
  projects.filter((project) => project.creator === name).sort((a, b) => a.daysAgo - b.daysAgo)

/** กิจกรรมที่ผู้สร้างคนนี้เคยส่งผลงาน */
export const activitiesOfCreator = (name: string): Activity[] => {
  const spaceIds = new Set(projectsByCreator(name).map((project) => project.spaceId))
  return activities.filter((activity) => spaceIds.has(activity.space.id))
}
