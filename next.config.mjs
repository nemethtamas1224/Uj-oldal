import { withPayload } from '@payloadcms/next/withPayload'

export default withPayload({
  images: { remotePatterns: [{ protocol: 'https', hostname: 'www.rmhungary.hu' }] },
  async redirects() {
    return [
      { source: '/rolunk.php', destination: '/rolunk', permanent: true },
      { source: '/szolgaltatasok.php', destination: '/szolgaltatasok', permanent: true },
      { source: '/referenciak.php', destination: '/referenciak', permanent: true },
      { source: '/hirek.php', destination: '/hirek', permanent: true },
      { source: '/palyazat.php', destination: '/palyazat', permanent: true },
      { source: '/kapcsolat.php', destination: '/kapcsolat', permanent: true },
    ]
  },
})
