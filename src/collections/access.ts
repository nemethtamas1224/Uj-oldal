import type { PayloadRequest } from 'payload'

export const adminOnly = ({ req }: { req: PayloadRequest }) => Boolean(req.user && (req.user as { role?: string }).role === 'admin')
export const contentEditor = ({ req }: { req: PayloadRequest }) => Boolean(req.user && ['admin', 'editor'].includes((req.user as { role?: string }).role || ''))
export const publishedOrAdmin = ({ req }: { req: PayloadRequest }) =>
  req.user ? true : { status: { equals: 'published' } }
export const publicRead = () => true
