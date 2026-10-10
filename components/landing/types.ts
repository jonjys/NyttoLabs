// Shape returned by usePublicProducts() / publicProductShape() in lib/relay/catalog.js.
// Declared here because that module is plain JS.
export interface PublicProduct {
  name: string
  slug: string
  description: string
  url: string
  category: string
  status: string
  section: string
  primaryMarket: string
  icon: string
  actions: string[]
}

export interface NavSection {
  num: string
  label: string
  /** In-page anchor (starts with #). */
  href: `#${string}`
}

export type CommandGroup = 'Jump to' | 'Copy' | 'Open'

export interface Command {
  id: string
  group: CommandGroup
  label: string
  hint?: string
  keywords?: string
  run: () => void
}
