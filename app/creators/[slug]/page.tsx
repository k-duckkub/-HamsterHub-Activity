import { notFound } from 'next/navigation'
import { creatorBySlug, creators } from '@/data/creators'
import TopBar from '@/components/activity/TopBar'
import CreatorProfile from '@/components/creators/CreatorProfile'

export function generateStaticParams() {
  return creators.map((creator) => ({ slug: creator.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const creator = creatorBySlug(params.slug)
  return {
    title: creator ? `${creator.name} — HamsterHub` : 'HamsterHub',
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
