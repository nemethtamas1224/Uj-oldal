import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap.js'

const normalizedParams = (params: Promise<{ segments?: string[] }>) => params.then(({segments})=>({segments:segments||[]}))
const normalizedSearch = (searchParams: Promise<Record<string, string | string[] | undefined>>) => searchParams.then((data)=>Object.fromEntries(Object.entries(data).filter((entry):entry is [string,string|string[]]=>entry[1]!==undefined)))

export const generateMetadata = ({ params, searchParams }: { params: Promise<{ segments?: string[] }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) =>
  generatePageMetadata({ config, params: normalizedParams(params), searchParams: normalizedSearch(searchParams) })

export default function Page({ params, searchParams }: { params: Promise<{ segments?: string[] }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return RootPage({ config, params: normalizedParams(params), searchParams: normalizedSearch(searchParams), importMap })
}
