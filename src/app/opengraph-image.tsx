import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og'
import { SITE_TITLE } from '@/lib/site'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = SITE_TITLE

export default function Image() {
  return renderOgImage({
    eyebrow: 'RoboInvestor',
    title: 'AI Portfolio Management Agent',
    subtitle:
      'Analyze holdings, track performance, surface investment insights.',
  })
}
