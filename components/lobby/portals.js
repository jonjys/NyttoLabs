export const PORTAL_Z = -7
export const ROOM_Z = -52

// Rooms sit far wider apart than their portals so that, once you are inside
// one, the neighbouring rooms fall outside the frustum entirely.
export const ROOM_SPREAD = 3.2

export const PORTALS = [
  {
    id: 'partners',
    x: -8,
    color: '#ff2bd1',
    label: 'PARTNERS',
    href: '/partners',
    heading: 'The Partners Room',
    blurb: 'Integrations, referrals and co-built tools. If your product touches ours, there is probably a good reason to talk.',
    cta: 'Open Partners',
  },
  {
    id: 'products',
    x: 0,
    color: '#00ff9d',
    label: 'PRODUCTS',
    href: '/buy',
    heading: 'The Product Showcase',
    blurb: 'Two things you can pay for today — CycleTag and VIESproof. The rest of the lab is one click further in.',
    cta: 'What you can buy',
  },
  {
    id: 'contact',
    x: 8,
    color: '#ff8a1e',
    label: 'CONTACT',
    href: '/contact',
    heading: 'The Contact Room',
    blurb: 'A real inbox, read by the people who write the code. No ticket queue, no sales funnel.',
    cta: 'Open Contact',
  },
]
