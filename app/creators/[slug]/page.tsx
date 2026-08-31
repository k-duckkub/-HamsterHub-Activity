import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { creatorBySlug, creators, projectsByCreator } from '@/data/creators'
import TopBar from '@/components/activity/TopBar'
import CreatorProfile from '@/components/creators/CreatorProfile'

export function generateStaticParams() {
  return creators.map((creator) => ({ slug: creator.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const creator = creatorBySlug(params.slug)
  if (!creator) return { title: 'HamsterHub' }

  const works = projectsByCreator(creator.name)
  const title = `${creator.name} — HamsterHub`
  const description = `ผลงานทั้งหมด ${works.length} ชิ้นของ ${creator.name} บน HamsterHub`
  const path = `/creators/${creator.slug}`

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: 'profile' },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default function Page({ params }: { params: { slug: string } }) {
  const creator = creatorBySlug(params.slug)
  if (!creator) notFound()

  return (
    <>
      <TopBar />
      <CreatorProfile creator={creator} />
    </>
  )
}
