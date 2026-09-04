import { NextResponse } from 'next/server'
import { getDb, COLLECTIONS, isMongoConfigured } from '@/lib/relay/db'

// Safe outbound redirect.
// The destination was validated & stored server-side at resolve time.
// The public request supplies ONLY an opaque click_id — never a URL — so an
// open redirect is impossible here.
export async function GET(request, context) {
  const params = context?.params ? await context.params : {}
  const clickId = params?.clickId
  if (!clickId || !isMongoConfigured()) {
    return NextResponse.redirect(new URL('/?relay=error', request.url), 302)
  }
  try {
    const db = await getDb()
    const click = await db.collection(COLLECTIONS.clickEvents).findOne({ id: clickId })

    if (!click || !click.destination_url) {
      return NextResponse.redirect(new URL('/?relay=expired', request.url), 302)
    }

    // Record the outbound click exactly once (attribution).
    if (!click.clicked_at) {
      await db.collection(COLLECTIONS.clickEvents).updateOne(
        { id: clickId },
        { $set: { clicked_at: new Date(), status: 'clicked' } }
      )
      if (click.offer_id) {
        await db.collection(COLLECTIONS.offers).updateOne(
          { id: click.offer_id },
          { $inc: { 'stats.clicks': 1 } }
        )
      }
    }

    return NextResponse.redirect(click.destination_url, 302)
  } catch (e) {
    console.error('go redirect error', e)
    return NextResponse.redirect(new URL('/?relay=error', request.url), 302)
  }
}
