import { sidebarCookie, type SidebarCookie } from '@robosystems/core/lib'
import type { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  let body: SidebarCookie
  try {
    body = (await req.json()) as SidebarCookie
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  // Awaited: the cookie is written through `cookies()`, and a handler that
  // returns first sends its response without the Set-Cookie header.
  await sidebarCookie.set({ isCollapsed: Boolean(body?.isCollapsed) })

  return Response.json({})
}
