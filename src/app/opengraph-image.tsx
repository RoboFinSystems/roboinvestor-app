import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og'
import { SITE_TITLE } from '@/lib/site'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = SITE_TITLE

export default function Image() {
  return renderOgImage({
    eyebrow: 'RoboInvestor',
    title: 'Know your portfolio from their books',
    subtitle:
      'Early, and we say so. Private positions and the reports your companies share.',
  })
}
