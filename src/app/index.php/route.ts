import config from '@payload-config'
import { getPayload } from 'payload'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const categoryId = url.searchParams.get('alkat')
  if (!categoryId) { const search=url.searchParams.get('ksz'); return new Response(null,{status:301,headers:{Location:search ? `/kereses?q=${encodeURIComponent(search)}` : '/'}}) }
  const payload = await getPayload({ config })
  const result = await payload.find({ collection: 'legacy-mappings', where: { legacyKey: { equals: categoryId } }, limit: 1, depth: 0, overrideAccess: true })
  const target = result.docs[0]?.targetPath
  if (!target) return new Response('Not found', { status: 404 })
  return new Response(null,{status:301,headers:{Location:target}})
}
